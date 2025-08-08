
# WhatsApp Web Clone

This project is a simplified clone of WhatsApp Web, featuring a responsive user interface and a robust backend for managing chat messages. It simulates core chat functionalities, allowing users to view conversations and send messages in a familiar interface.

## 🌟 Features

*   **Responsive UI:** Optimized for both desktop and mobile views, mimicking the WhatsApp Web experience.
*   **Chat List:** Displays a list of conversations, grouped by user, with the latest message preview and timestamp.
*   **Message Sending:** Users can type and send messages within an active chat window.
*   **Message Status Indicators:** Messages show 'sent', 'delivered', or 'read' statuses (simulated via backend updates).
*   **Backend API:** A Node.js (Express) API handles message storage and retrieval.
*   **MongoDB Integration:** Uses Mongoose to interact with a MongoDB database for persistent message storage.
*   **Payload Processing Script:** Includes a script to simulate incoming WhatsApp webhook payloads and populate the database, useful for initial data seeding and testing.

## 🚀 Tech Stack

**Frontend:**
*   **Next.js 15:** React framework for building the user interface.
*   **React 19:** JavaScript library for building interactive UIs.
*   **TypeScript:** For type-safe JavaScript.
*   **Tailwind CSS 4:** For rapid and responsive UI styling.
*   **Axios:** For making HTTP requests to the backend API.
*   **Lucide React:** For beautiful, customizable icons.

**Backend:**
*   **Node.js:** JavaScript runtime.
*   **Express.js:** Web application framework for Node.js.
*   **Mongoose:** MongoDB object modeling for Node.js.
*   **`dotenv`:** For managing environment variables.
*   **`cors`:** Middleware for enabling Cross-Origin Resource Sharing.

**Database:**
*   **MongoDB:** NoSQL database for storing messages and chat data.

## 🏁 Getting Started

Follow these steps to get a copy of the project up and running on your local machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm, yarn, pnpm, or bun
*   A running MongoDB instance (local or cloud-hosted, e.g., MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YuvrajSingh/whatsapp-web-clone.git # Replace with your actual repo URL
    cd whatsapp-web-clone
    ```

2.  **Backend Setup:**
    Navigate to the `backend` directory, install dependencies, and start the server.

    ```bash
    cd backend
    npm install # or yarn install or pnpm install or bun install
    ```

    Create a `.env` file in the `backend` directory and add your MongoDB connection string:
    ```env
    MONGODB_CONNECTION_STRING="your_mongodb_atlas_connection_string"
    ```
    Replace `"your_mongodb_atlas_connection_string"` with your actual MongoDB connection string. The database name is `whatsapp`.

    Start the backend server:
    ```bash
    npm start # or yarn start or pnpm start or bun start
    ```
    The backend server will run on `http://localhost:5001`.

3.  **Frontend Setup:**
    Open a new terminal, navigate to the `frontend` directory, install dependencies, and start the development server.

    ```bash
    cd ../frontend
    npm install # or yarn install or pnpm install or bun install
    ```

    The frontend connects to `https://whatsapp-clone-43nx.onrender.com` by default (as seen in `frontend/src/app/page.tsx`). If you want to connect to your local backend, you would need to change the `API_URL` variable in `frontend/src/app/page.tsx` from `'https://whatsapp-clone-43nx.onrender.com'` to `'http://localhost:5001'`.

    Start the frontend development server:
    ```bash
    npm run dev # or yarn dev or pnpm dev or bun dev
    ```
    Open `http://localhost:3000` in your browser to see the application.

4.  **Data Seeding (Optional but Recommended):**
    To populate your local MongoDB database with initial chat data and message statuses, run the provided script.
    Open a new terminal, navigate to the `scripts` directory.

    ```bash
    cd ../scripts
    npm install # or yarn install or pnpm install or bun install
    ```

    Create a `.env` file in the `scripts` directory and add your MongoDB connection string (same as backend):
    ```env
    MONGODB_CONNECTION_STRING="your_mongodb_atlas_connection_string"
    ```

    Run the payload processing script:
    ```bash
    node processPayloads.js
    ```
    This script will parse the JSON files in `scripts/payloads` and insert/update messages in your MongoDB database. After running this, refresh your frontend (at `http://localhost:3000`) to see the seeded chats.

## 📖 Usage

Once both frontend and backend servers are running, and you've seeded the data:

*   **View Chats:** On the left sidebar, you'll see a list of chat conversations.
*   **Select a Chat:** Click on any chat item to open the conversation window.
*   **Send Messages:** Type your message in the input field at the bottom of the chat window and press Enter or click the send button. The message will appear in the chat with a "sent" status.
*   **Simulated Statuses:** The initial messages from the payloads will display 'read' or 'delivered' statuses as per the seeded data. Newly sent messages will initially show 'sent'.

## 📁 Project Structure

```
.
├── backend/                  # Node.js Express backend API
│   ├── index.js              # Main server file, API routes, and MongoDB schema
│   ├── package.json          # Backend dependencies
│   └── .gitignore            # Git ignore for backend
├── frontend/                 # Next.js React frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Reusable React components (ChatListItem, ChatWindow, StatusIcon)
│   │   │   ├── globals.css   # Global CSS for Tailwind
│   │   │   ├── layout.tsx    # Next.js root layout
│   │   │   ├── page.tsx      # Main application page (Home component)
│   │   │   └── types/index.ts # TypeScript interfaces for data models
│   │   └── favicon.ico       # Favicon
│   ├── public/               # Public assets
│   ├── .eslintrc.mjs         # ESLint configuration
│   ├── next.config.ts        # Next.js configuration
│   ├── package.json          # Frontend dependencies
│   ├── postcss.config.mjs    # PostCSS configuration for Tailwind
│   └── README.md             # Next.js default README (can be merged)
└── scripts/                  # Node.js scripts for data processing/seeding
    ├── payloads/             # Sample WhatsApp webhook JSON payloads
    ├── processPayloads.js    # Script to process payloads and populate MongoDB
    └── package.json          # Script dependencies
```

---
