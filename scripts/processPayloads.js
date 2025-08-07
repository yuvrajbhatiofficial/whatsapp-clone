require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// MongoDB Connection
const mongoURI = process.env.MONGODB_CONNECTION_STRING; // Replace with your MongoDB Atlas connection string
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'whatsapp'
}).then(() => {
  console.log('MongoDB connected for script');
  processPayloads();
}).catch(err => console.log(err));

// Message Schema
const messageSchema = new mongoose.Schema({
  from: String,
  id: { type: String, unique: true },
  timestamp: String,
  text: {
    body: String,
  },
  type: String,
  status: { type: String, default: 'sent' },
  wa_id: String,
  name: String,
});

const Message = mongoose.model('processed_messages', messageSchema);

const payloadsDir = path.join(__dirname, 'payloads'); // Assuming payloads are in a 'payloads' directory

async function processPayloads() {
  const files = fs.readdirSync(payloadsDir);

  for (const file of files) {
    const filePath = path.join(payloadsDir, file);
    const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const value = payload.metaData.entry[0].changes[0].value;

    if (value.messages) { // It's a new message
      const messageData = value.messages[0];
      const contactData = value.contacts[0];

      const newMessage = new Message({
        from: messageData.from,
        id: messageData.id,
        timestamp: messageData.timestamp,
        text: messageData.text,
        type: messageData.type,
        wa_id: contactData.wa_id,
        name: contactData.profile.name,
      });

      try {
        await Message.findOneAndUpdate({ id: messageData.id }, newMessage, { upsert: true });
        console.log(`Processed message: ${messageData.id}`);
      } catch (error) {
        if (error.code !== 11000) { // Ignore duplicate key errors
          console.error(`Error processing message ${messageData.id}:`, error);
        }
      }

    } else if (value.statuses) { // It's a status update
      const statusData = value.statuses[0];
      try {
        await Message.updateOne({ id: statusData.id }, { $set: { status: statusData.status } });
        console.log(`Updated status for message: ${statusData.id} to ${statusData.status}`);
      } catch (error) {
        console.error(`Error updating status for ${statusData.id}:`, error);
      }
    }
  }

  console.log('All payloads processed.');
  mongoose.connection.close();
}
