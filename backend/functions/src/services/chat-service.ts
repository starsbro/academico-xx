// Service layer for chat-related business logic
// Move controller logic here from chat-controller.ts

import * as chatModel from "../models/chat-model";
import { Request, Response } from "express";

/**
 * Deletes a chat for a given user and chat ID.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export async function deleteChat(req: Request, res: Response) {
  const userId = req.params.userId;
  const chatId = req.params.chatId;
  try {
    await chatModel.deleteChat(userId, chatId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
}

/**
 * Retrieves all chats for a given user.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export async function getChats(req: Request, res: Response) {
  const requestedUserId = req.params.userId;
  try {
    const userChats = await chatModel.getChatsByUserId(requestedUserId);
    res.status(200).json(userChats);
  } catch (error) {
    console.error(
      `Service: Error fetching user chats for ${requestedUserId}:`,
      error,
    );
    res.status(500).send("Internal Server Error: Could not fetch user chats.");
  }
}

/**
 * Updates the title of a chat for a given user and chat ID.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export async function updateChatTitle(req: Request, res: Response) {
  const requestedUserId = req.params.userId;
  const requestedChatId = req.params.chatId;
  const { title } = req.body;
  if (!title) {
    res.status(400).send("Missing required field: title.");
    return;
  }
  try {
    await chatModel.updateChat(requestedUserId, requestedChatId, {
      title: title,
      lastUpdatedAt: chatModel.getServerTimestamp(),
    });
    res.status(200).json({
      status: "success",
      message: "Chat title updated successfully.",
    });
  } catch (error) {
    console.error(
      `Service: Error updating chat title for chat ${requestedChatId}:`,
      error,
    );
    res.status(500).send("Internal Server Error: Could not update chat title.");
  }
}
