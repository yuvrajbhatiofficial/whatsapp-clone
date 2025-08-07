require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port =  5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'whatsapp'
}).then(() => {
  console.log('MongoDB connected');
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

// API Routes
// Get all chats grouped by user
app.get('/api/chats', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    const chats = messages.reduce((acc, msg) => {
      (acc[msg.wa_id] = acc[msg.wa_id] || []).push(msg);
      return acc;
    }, {});
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a new message
app.post('/api/messages', async (req, res) => {
    const { from, text, wa_id, name } = req.body;
    const newMessage = new Message({
        from,
        id: `wamid.${Date.now()}`, // Generate a unique ID
        timestamp: Math.floor(Date.now() / 1000).toString(),
        text: { body: text },
        type: 'text',
        status: 'sent',
        wa_id,
        name
    });

    try {
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
