// src/middleware/auth.js

// Express middleware to authenticate Firebase ID tokens.
// Adds the decoded user to req.user if valid, else returns 401.
import admin from "firebase-admin";

/**
 * Express middleware to authenticate
 * Firebase ID tokens from Authorization header.
 * Adds the decoded user to req.user if valid, else returns 401 Unauthorized.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function authenticateFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) return res.status(401).json({error: "No auth token"});

  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({error: "Invalid auth token"});
  }
}
