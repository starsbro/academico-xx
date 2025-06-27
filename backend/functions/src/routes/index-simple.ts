// Define API routes - Simplified for debugging
import {Router} from "express";

const router = Router();

// Test Route
router.get("/", (req, res) => {
  res.status(200).send("Firebase Cloud Function Express API is running!");
});

// CORS Test Route
router.get("/cors-test", (req, res) => {
  res.status(200).json({
    message: "CORS is working!",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

// Temporary Test POST route
router.post("/test-post", (req, res) => {
  res.status(200).send("Test POST successful!");
});

// Simple test routes without complex parameters
router.get("/test-chats", (req, res) => {
  res.status(200).json({message: "Test chats endpoint working"});
});

export default router;
