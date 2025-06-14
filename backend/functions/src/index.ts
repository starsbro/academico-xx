
// backend/functions/src/index.ts

import * as functions from "firebase-functions";
// import * as functionsV1 from "firebase-functions/v1";
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
console.log("Admin.firestore.FieldValue (after init):",
  admin.firestore.FieldValue); // Should be true
// console.log("Explicitly imported FieldValue (value):",
//   !!FieldValue); // Should be true

const app = express();

// app.use(cors({origin: true}));
app.use(cors({origin: "*"}));
app.use(express.json());

// Add a logging middleware to see all incoming requests to the Express app
app.use((req, res, next) => {
  console.log(`Express: Incoming Request - 
    Method: ${req.method}, 
    Path: ${req.path},
    Body: ${JSON.stringify(req.body)}`);
  next();
});

/**
 * TEST ROUTE: GET/
 * Added to quickly verify if Express routing is working at all.
 */
app.get("/", (req, res) => {
  console.log("Express: GET / route hit successfully!");
  res.status(200).send("Firebase Cloud Function Express API is runing!");
});

/**
 * TEMPORARY TEST ROUTE: POST /test-post
 * Used to verify if POST requests are being handled at all by the Express app.
 * Can be removed once the /message POST route is working correctly.
 */
app.post("/test-post", (req, res) => {
  console.log("Express: /test-post POST request received by handler");
  res.status(200).send("Test POST successful!");
});

// API Endpoints
// POST /message
// Handles sending a message.
// If chatId is provided, adds the message to the existing chat
// If chatId is not provided, create a new chat and then adds the message to it.

/**
 * Request Body:
 * {
 * "userId": "string",
 * "message": "string",
 * "timestamp": "ISO string",
 * "chatId": "string" (optional)
 * }
 *
 * Response:
 * {
 * "id":"messageId",
 * "userId": "senderUserId",
 * "message": "messageContent",
 * "timestamp": "ISO string",
 * "newChatId": "string" (only when a new chat was created)
 * }
 */
app.post("/message", async (req, res) => {
  console.log("Express: /message POST request received by handler");
  // console.log("Express: /chat POST request received");
  try {
    console.log("Express: Entering /message POST handler logic");
    const {userId, message, timestamp, chatId} = req.body;

    // Basic validation
    if (!userId || !message || !timestamp) {
      console.log("Express: /message POST - Missing required fields");
      res.status(400)
        .send("Missing required field: userId, message, and timestamp.");
      return;
    }

    let currentChatId = chatId;
    let newChatCreated = false;
    let chatRef: admin.firestore.DocumentReference;

    if (!currentChatId) {
      // Create a new chat document
      const newChatTitle = message.substring(0, 50) +
      (message.length > 50 ? "...": "");
      chatRef = await db.collection("users").doc(userId)
        .collection("chats").add({
          title: newChatTitle,
          createdAt: FieldValue.serverTimestamp(),
          lastUpdatedAt: FieldValue.serverTimestamp(),
          userId: userId,
        });
      currentChatId = chatRef.id;
      newChatCreated = true;
      console.log(`Express: New chat created with ID: ${currentChatId}`);
    } else {
      // Use existing chat document
      chatRef = db.collection("users").doc(userId)
        .collection("chats").doc(currentChatId);
      // Update the lastUpdatedAt field for the existing chat
      await chatRef.update({
        lastUpdateAt: FieldValue.serverTimestamp(),
      });
      console.log(`Express: Using existing chat with ID: ${currentChatId}`);
    }

    // Add message to the messages subcollection of the determined chat
    const newMessageRef = await chatRef.collection("messages").add({
      userId: userId,
      message: message,
      timestamp: FieldValue.serverTimestamp(),
    });

    // Get the newly created message document
    // to return its ID and actual timestamp
    const newDoc = await newMessageRef.get();
    const savedMessage = newDoc.data();

    // Prepare response, including newChatId if a new chat was created
    const responseBody: any = {
      id: newDoc.id,
      userId: savedMessage?.userId,
      message: savedMessage?.message,
      timestamp: savedMessage?.timestamp ?
        (savedMessage.timestamp as admin.firestore.Timestamp)
          .toDate().toISOString() :
        new Date().toISOString(),
    };

    if (newChatCreated) {
      responseBody.newChatId = currentChatId;
    }

    res.status(201).json(responseBody);
    console.log("Express: /message POST - Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Internal Server Error: Could not send message.");
  }
});

/**
 * GET /users/: userId/chats
 * Fetches a list of all chats for a specific user, ordered by last update.
 */
app.get("/users/:userId/chats", async (req, res) => {
  const requestedUserId = req.params.userId;
  console.log( `Express: 
    /users/${requestedUserId}/chats GET request received`);

  try {
    const chatsRef = db.collection("users").doc(requestedUserId)
      .collection("chats").orderBy("lastUpdatedAt", "desc");
    const snapshot = await chatsRef.get();

    const userChats: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      userChats.push({
        id: doc.id,
        title: data.title || "Untitled Chat",
        createdAt: data.createdAt ?
          (data.createdAt as admin.firestore.Timestamp).toDate().toISOString() :
          new Date().toISOString(),
      });
    });

    res.status(200).json(userChats);
  } catch (error) {
    console.error("Error fetching user chats: ", error);
    res.status(500)
      .send("Internal Server Error: Could not fetch user chats.");
  }
});

app.get("/users/:userId/chats/:chatId/messages",
  async (req, res) => {
    const requestedUserId = req.params.userId;
    const requestedChatId = req.params.chatId;
    console.log(`Express: /users/${requestedUserId}
      /chats/${requestedChatId}/messages GET request received`);

    try {
      const messagesRef = db.collection("users").doc(requestedUserId)
        .collection("chats").doc(requestedChatId).collection("messages")
        .orderBy("timestamp", "asc");

      const snapshot = await messagesRef.get();

      const chatMessages: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        chatMessages.push({
          id: doc.id,
          userId: data.userId,
          message: data.message,
          timestamp: data.timestamp ?
            (data.timestamp as admin.firestore.Timestamp)
              .toDate().toISOString() :
            new Date().toISOString(),
        });
      });

      res.status(200).json(chatMessages);
      console.log(`Express: Fetched 
        ${chatMessages.length} messages for chat ${requestedChatId}`);
    } catch (error) {
      console.error(`Error fetching messages 
      for chat ${requestedChatId}:`, error);
      res.status(500)
        .send("Internal Server Error: Could not fetch chat messages.");
    }
  });

// Generic 404 handler for Express routes mot matched
app.use((req, res) => {
  console.log(`Express: Unhandle route - 
    Method: ${req.method}, Path: ${req.path}`);
  res.status(404)
    .send(`Not Found: The requested resource 
    could not be found via Express routing.`);
});

// Export the Express app as an HTTP Cloud Function
exports.api = functions.https.onRequest(app);
