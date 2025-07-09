/* eslint-disable */
import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

/**
 * Express middleware to authenticate Firebase ID tokens from Authorization header.
 * Adds the decoded user to req.user if valid, else returns 401 Unauthorized.
 */
export async function authenticateFirebaseToken(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    res.status(401).json({ error: "No auth token" });
    return;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    req.user = decoded;
    next();
    return;
  } catch (err) {
    res.status(401).json({ error: "Invalid auth token" });
    return;
  }
}
