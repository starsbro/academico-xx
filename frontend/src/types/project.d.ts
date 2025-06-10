// frontend/src/types/project.d.ts
export interface Project {
  id: string; // Use string for IDs, especially if from a database like Firestore
  title: string;
  date: string; // Or Date, depending on how you handle it
  status: 'In progress' | 'Done'; // Enforce specific status values
  image?: string; // Optional image URL
  bgColor?: string; // Optional background color
}
