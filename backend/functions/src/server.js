// src/server.js
// require('dotenv').config(); // Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import express, { json } from 'express';
import cors from 'cors';
//import { admin, db } from './config/firebaseAdmin.js'; // Import initialized Firebase Admin
import pkg from 'firebase-admin';
const { admin } = pkg;
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'; // For Clerk authentication

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow cross-origin requests from your Next.js frontend
app.use(json()); // Enable JSON body parsing

// --- Protected Route Example (using Clerk authentication) ---
app.get(
  '/api/protected-data',
  ClerkExpressRequireAuth({
    // You might need to set a custom domain for Clerk if not using default
    // clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET // Optional, for webhooks
  }),
  async (req, res) => {
    try {
      // Clerk adds user information to the request object
      const userId = req.auth.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: User ID not found' });
      }

      // Example: Fetch user-specific data from Firestore
      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User data not found in Firestore.' });
      }

      res.json({
        message: `Hello from protected API! User ID: ${userId}`,
        userData: userDoc.data(),
      });
    } catch (error) {
      console.error('Error fetching protected data:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// --- Example: Create a new document in Firestore ---
app.post('/api/create-item', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID not found' });
    }

    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required.' });
    }

    const newItemRef = await db.collection('items').add({
      name,
      description,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: userId, // Link to the Clerk user ID
    });

    res.status(201).json({ message: 'Item created successfully', itemId: newItemRef.id });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Basic public route (no Clerk auth)
app.get('/api/public-data', (req, res) => {
  res.json({ message: 'This is public data!' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
