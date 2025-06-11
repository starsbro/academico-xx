// backend-ts/src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (replace with your service account key path)
// In a production environment with Cloud Functions, you typically don't need this line
// as the environment handles initialization. For local testing, keep it.
const serviceAccount = require('../path/to/your/serviceAccountKey.json'); // **IMPORTANT: Keep this file secure!**

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://academico-ai.firebaseio.com' 

  });
} catch (error: any) {
  if (!/already exists/.test(error.message)) {
    console.error('Firebase admin initialization error', error.stack);
  }
}


const db = admin.firestore(); // For Firestore

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Define a type for your chat message
interface ChatMessage {
  userId: string;
  message: string;
  timestamp: Date; // Store as a Date object for Firestore
}

// Example: Save a new chat message
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { userId, message, timestamp } = req.body;

    if (!userId || !message || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields: userId, message, timestamp' });
    }

    // Convert timestamp string to Date object
    const chatTimestamp = new Date(timestamp);
    if (isNaN(chatTimestamp.getTime())) {
      return res.status(400).json({ error: 'Invalid timestamp format' });
    }

    const newMessage: Omit<ChatMessage, 'timestamp'> & { timestamp: admin.firestore.Timestamp } = {
      userId,
      message,
      timestamp: admin.firestore.Timestamp.fromDate(chatTimestamp), // Store as Firestore Timestamp
    };

    const newMessageRef = await db.collection('chats').add(newMessage);

    return res.status(201).json({ id: newMessageRef.id, message: 'Chat message saved successfully!' });
  } catch (error) {
    console.error('Error saving chat message:', error);
    return res.status(500).json({ error: 'Failed to save chat message.' });
  }
});

// Example: Get chat history for a user
app.get('/api/chat-history/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const chatRef = db.collection('chats')
                      .where('userId', '==', userId)
                      .orderBy('timestamp', 'asc');
    const snapshot = await chatRef.get();

    const chatHistory = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        message: data.message,
        timestamp: (data.timestamp as admin.firestore.Timestamp).toDate().toISOString(), // Convert Timestamp to ISO string
      } as { id: string; userId: string; message: string; timestamp: string }; // Explicit cast
    });

    res.status(200).json(chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history.' });
  }
});

// Basic root route
app.get('/', (req: Request, res: Response) => {
  res.send('Academico.ai Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});