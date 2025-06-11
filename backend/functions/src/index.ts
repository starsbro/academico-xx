/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// backend/functions/src/index.ts
import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors'; // Import as module
import { Request, Response } from 'express';

const app = express();
// Configure CORS for your frontend's domain in production.
// For local development, allow all origins.
app.use(cors({ origin: true }));
app.use(express.json());

// --- Define Backend Project Interface ---
// This should ideally be shared or mirrored from your frontend/src/types/project.d.ts
interface Project {
  id: string;
  title: string;
  date: string;
  status: 'In progress' | 'Done';
  image?: string;
  bgColor?: string;
}

// --- Dummy Data (Next step: Replace with Firestore/Database Logic) ---
let projectsData: Project[] = [
  {
    id: '1', // Ensure IDs are strings
    title: 'Exploring Multimodal Approaches to Enhancing Human-Computer Interaction in Augmented Reality Systems',
    date: 'Nov 11, 2024',
    status: 'In progress',
    image: '/placeholder.svg?height=200&width=300',
    bgColor: 'bg-blue-400',
  },
  {
    id: '2',
    title: 'The Role of Microbiome Diversity in Modulating Human Metabolism: A Quantitative Genomics Perspective',
    date: 'Oct 7, 2024',
    status: 'Done',
    image: '/placeholder.svg?height=200&width=300',
    bgColor: 'bg-orange-400',
  },
  {
    id: '3',
    title:
      'Optimizing Neural Network Architectures for Real-Time Natural Language Processing: Challenges and Innovations',
    date: 'Apr 1, 2024',
    status: 'Done',
    image: '/placeholder.svg?height=200&width=300',
    bgColor: 'bg-gray-600',
  },
  {
    id: '4',
    title:
      'Assessing Climate Change Impacts on Coastal Ecosystems: Biodiversity Loss, Habitat Degradation, and Conservation Strategies',
    date: 'Dec, 2022',
    status: 'Done',
    image: '/placeholder.svg?height=200&width=300',
    bgColor: 'bg-blue-500',
  },
];

// --- Backend Endpoint to Get All Projects ---
app.get('/projects', (req: Request, res: Response<Project[]>) => {
  functions.logger.info('Accessed /projects endpoint');
  res.status(200).json(projectsData); // Send the dummy data
});

// --- Backend Endpoint to Add a New Project (Example for POST) ---
app.post('/projects', (req: Request, res: Response<Project | { message: string, error: any}>) => {
  functions.logger.info('POST /projects received.');
  functions.logger.info('Request body:', req.body);
  
  try {
    // Basic validation
    if (!req.body || typeof req.body.title !== 'string' || req.body.title.trim().length === 0) {
      functions.logger.warn('Invalid request body for new project:', req.body);
      res.status(400).json({ message: 'Title is required', error: null });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(), // Simple unique ID for now
      title: req.body.title || 'New Project',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'In progress',
      image: '/placeholder.svg?height=200&width=300',
      bgColor: 'bg-purple-400', // Default color for new projects
    };
    functions.logger.info('New project created (before push):', newProject); // This log should appear next

    projectsData.push(newProject); // Add to our in-memory array (replace with DB save)
    functions.logger.info('Project pushed to data array.'); // This log should appear next

    res.status(201).json(newProject); // Return the created project with a 201 status
    functions.logger.info('Response sent with status 201.');
    return;
  } catch (error: any) {
    functions.logger.error('Error during POST /projects:', error);
    //res.status(500).send('Internal Server Error processing request.');
    res.status(500).json({message: 'Internal Server Error processing request.', error: error.message || String(error)});
    return;
  } 
});


// Export the Express app as an HTTP Cloud Function
exports.api = functions.https.onRequest(app);