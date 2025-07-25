import * as admin from "firebase-admin";
import {FieldValue} from "firebase-admin/firestore";

/**
 * Interface for a chat document returned from the database.
 */
interface UserChat {
  id: string;
  title: string;
  createdAt: string;
  lastUpdatedAt: string;
}

// Helper to get Firestore server timestamp

/**
 * Returns a Firestore server timestamp value.
 * @return {admin.firestore.FieldValue} Firestore server timestamp
 */
export function getServerTimestamp(): admin.firestore.FieldValue {
  return FieldValue.serverTimestamp();
}

/**
 * Create a new chat document for a given user.
 * @param {string} userId The ID of the user.
 * @param {string} title The title of the chat.
 * @return {Promise<admin.firestore.DocumentReference>} A new chat document
 */
export async function createChat(
  userId: string,
  title: string,
): Promise<admin.firestore.DocumentReference> {
  const db = admin.firestore();

  const chatRef = await db
    .collection("users")
    .doc(userId)
    .collection("chats")
    .add({
      title: title,
      createdAt: FieldValue.serverTimestamp(),
      lastUpdatedAt: FieldValue.serverTimestamp(),
      userId: userId,
    });
  return chatRef;
}

/**
 * Updates an existing chat document's fields
 * @param {string} userId The ID of the user.
 * @param {string} chatId The ID of the chat.
 * @param {object} data  data include title and the last updated time
 * @param {string} data.title the title of the chat
 * @param {string} data.lastUpdatedAt the last time of updating a chat
 *
 */
export async function updateChat(
  userId: string,
  chatId: string,
  data: {
    title?: string;
    lastUpdatedAt?: admin.firestore.FieldValue;
  },
): Promise<void> {
  const db = admin.firestore();

  const chatRef = db
    .collection("users")
    .doc(userId)
    .collection("chats")
    .doc(chatId);
  await chatRef.update(data);
}

/**
 * Deletes a chat and all its messages for a given user.
 * @param {string} userId The ID of the user.
 * @param {string} chatId The ID of the chat.
 */
export async function deleteChat(
  userId: string,
  chatId: string
): Promise<void> {
  const db = admin.firestore();
  const chatRef = db
    .collection("users")
    .doc(userId)
    .collection("chats")
    .doc(chatId);

  // Delete all messages in the chat
  const messagesSnap = await chatRef.collection("messages").get();
  const batch = db.batch();
  messagesSnap.forEach((doc) => batch.delete(doc.ref));
  batch.delete(chatRef); // Delete the chat document itself
  await batch.commit();
}

/**
 * Fetches all chats for a specific user, ordered by last update
 * @param {string} userId The ID of the user.
 * @return {Promise<UserChat[]>} all chats for a specific user
 */
export async function getChatsByUserId(userId: string): Promise<UserChat[]> {
  const db = admin.firestore();

  const chatsRef = db
    .collection("users")
    .doc(userId)
    .collection("chats")
    .orderBy("lastUpdatedAt", "desc");
  const snapshot = await chatsRef.get();
  const userChats: UserChat[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    userChats.push({
      id: doc.id,
      title: data.title || "Untitled Chat",
      createdAt: data.createdAt ? typeof data.createdAt.toDate === "function" ?
        data.createdAt.toDate().toISOString() :
        new Date(data.createdAt).toISOString() :
        new Date().toISOString(),
      lastUpdatedAt: data.lastUpdatedAt ?
        typeof data.lastUpdatedAt.toDate === "function" ?
          data.lastUpdatedAt.toDate().toISOString() :
          new Date(data.lastUpdatedAt).toISOString() :
        new Date().toISOString(),
    });
  });
  return userChats;
}
