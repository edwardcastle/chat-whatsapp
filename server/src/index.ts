import express from 'express';
import {createServer} from 'http';
import {Server as SocketIOServer} from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import twilio, {Twilio} from 'twilio';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import path from 'path';
import Message from '../../src/types/message'
import {useMessageStorage} from "../../src/composables/useMessageStorage";


dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({path: path.resolve(__dirname, '../.env')});

const messageStore = useMessageStorage()

console.log('Environment check:');
console.log('TWILIO_ACCOUNT_SID exists:', !!process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN exists:', !!process.env.TWILIO_AUTH_TOKEN);

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Send message endpoint
app.post('/api/send-message', async (req, res) => {
  try {
    const {to, content} = req.body;

    const message = await twilioClient.messages.create({
      body: content,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to}`
    });

    const formattedMessage = {
      id: message.sid,
      content: message.body,
      timestamp: new Date(message.dateCreated),
      sender: message.from.replace('whatsapp:', ''),
      direction: 'outbound' as const
    };

    // Broadcast the sent message to all connected clients
    io.emit('whatsapp-message', formattedMessage);

    res.json(formattedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      error: 'Failed to send message',
      details: error.message
    });
  }
});

app.use(express.urlencoded({extended: true}));

// Webhook endpoint for incoming messages
app.post('/webhook', async (req, res) => {
  try {
    console.log('Received webhook:', {
      body: req.body,
      headers: req.headers
    });

    // Validate required fields
    if (!req.body.From || !req.body.MessageSid || !req.body.Body) {
      console.warn('Missing required fields in webhook:', req.body);
      return res.status(400).send('Missing required fields');
    }

    const message = {
      id: req.body.MessageSid,
      content: req.body.Body,
      timestamp: new Date(),
      sender: req.body.From.replace('whatsapp:', ''),
      status: 'pending',
      direction: 'incoming' as Message
    };

    console.log('Processed message:', message);

    io.emit('whatsapp-message', message);
    message.status = 'sent'
    messageStore.saveMessage(message);

    console.log('Message broadcasted to WebSocket clients');

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
