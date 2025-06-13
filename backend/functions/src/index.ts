
// backend/functions/src/index.ts

import * as functions from "firebase-functions";
import * as functionsV1 from "firebase-functions/v1";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import {FieldValue} from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Debugging admin initialization
console.log("Admin initialized:", !!admin);
console.log("Admin.firestore:", !!admin.firestore);
console.log("Admin.firestore.FieldValue:",
  !!admin.firestore.FieldValue); // Should be true
console.log("Explicitly imported FieldValue:", !!FieldValue); // Should be true

const app = express();

app.use(cors({origin: true}));
app.use(express.json());

// Add a logging middleware to see all incoming requests to the Express app
app.use((req, res, next) => {
  console.log(`Express: Incoming Request - 
    Method: ${req.method}, Path: ${req.path}`);
  next();
});

// API Endpoints

app.post("/chat", async (req, res) => {
  console.log("Express: /chat POST request received");
  try {
    const {userId, message, timestamp} = req.body;

    // Basic validation
    if (!userId || !message || !timestamp) {
      res.status(400)
        .send("Missing required field: userId, message, and timestamp.");
      return;
    }

    // Add message to Firestore
    const newMessageRef = await db.collection("messages").add({
      userId: userId,
      message: message,
      timestamp: FieldValue.serverTimestamp(),
    });

    // Get the newly created document to return its ID and actual timestamp
    const newDoc = await newMessageRef.get();
    const savedMessage = newDoc.data();

    res.status(201).json({
      id: newDoc.id,
      userId: savedMessage?.userId,
      message: savedMessage?.message,
      timestamp: savedMessage?.timestamp ?
        (savedMessage.timestamp as admin.firestore.Timestamp)
          .toDate().toISOString() :
        new Date().toISOString(),
    });
    console.log("Express: /chat POST - Message sent successfully");
    return;
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Internal Server Error: Could not send message.");
    return;
  }
});


app.get("/chat-history/:userId", async (req, res) => {
  const requestedUserId = req.params.userId;
  console.log(`Express: /chat-history/${requestedUserId} GET request received`);

  try {
    const messagesRef = db.collection("messages").orderBy("timestamp", "asc");
    const snapshot = await messagesRef.get();

    const chatHistory: any[] = [];
    snapshot.forEach((doc) =>{
      const data = doc.data();
      chatHistory.push({
        id: doc.id,
        userId: data.userId,
        message: data.message,
        timestamp: data.timestamp ?
          (data.timestamp as admin.firestore.Timestamp).toDate().toISOString() :
          new Date().toISOString(),
      });
    });

    res.status(200).json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history: ", error);
    res.status(500)
      .send("Internal Server Error: Could not fetch chat history.");
  }
});

// Export the Express app as an HTTP Cloud Function

exports.api = functions.https.onRequest(app);

// Firebase Function for adding timestamp
export const addTimestampOnMessageCreate = functionsV1.firestore
  .document("messages/{messageId}")
  .onCreate(async (snap, context) => {
    const newMessage = snap.data();
    const messageId = context.params.messageId;

    console.log(`Functions: 
      New message created with ID: ${messageId}`, newMessage);

    try {
      await db.collection("messages").doc(messageId).update({
        processedByFunctionAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Message ${messageId} 
        updated with processedByFunctionAt timestamp.`);
    } catch (error) {
      console.error(`Error updating message ${messageId}:`, error);
    }
  });
