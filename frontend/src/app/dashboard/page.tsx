'use client';
// frontend/src/app/dashboard/page.tsx
// frontend/src/types/project.d.ts
import { Plus, MoreHorizontal } from 'lucide-react';
import { Button } from './../components/Button';
import { Badge } from './../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './../components/ui/dropdown-menu';
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useUser, UserButton } from '@clerk/nextjs';
import type { Project } from '../../types/project.d.ts'; // Import the shared Project type

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]); // State to store fetched projects
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        setErrorProjects(null);
        const response = await fetch('/api/projects'); // Call your Next.js API route
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch projects: ${errorData.details || response.statusText}`);
        }
        const data: Project[] = await response.json();
        setProjects(data);
      } catch (error: unknown) {
        console.error('Error fetching projects:', error);
        if (error instanceof Error) {
          setErrorProjects(error.message);
        } else {
          setErrorProjects('An unknown error occurred.');
        }
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []); // Empty dependency array means this runs once on mount

  const handleAddNewProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'A Brand New Project' }), // Example data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add project: ${errorData.details || response.statusText}`);
      }

      const newProject: Project = await response.json();
      setProjects((prevProjects) => [...prevProjects, newProject]); // Add the new project to state
      alert('New project added successfully!');
    } catch (error: unknown) {
      console.error('Error adding new project:', error);
      if (error instanceof Error) {
        alert(`Error adding project: ${error.message}`);
      } else {
        alert('An unknown error occurred while adding the project.');
      }
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Academico.ai</h1>
          <div className="flex items-center gap-3">{isLoaded && <UserButton />}</div>
        </div>
      </header>
    );
  }

  const username = user.username || user.fullName || user.emailAddresses[0]?.emailAddress || 'Guest';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Academico.ai</h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-600">{username}</span>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 py-4">Hi {username}! Welcome to Academico.ai</h2>

          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-semibold text-gray-800">Project Gallery</h3>
          </div>

          {/* Project Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {/* Add New Project Card */}
            <div
              className="bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg p-8 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity min-h-[280px]"
              onClick={handleAddNewProject} // Add click handler
            >
              <Plus className="h-12 w-12 text-white" />
            </div>

            {/* Loading/Error States for Projects */}
            {loadingProjects && <div className="col-span-full text-center text-gray-600">Loading projects...</div>}
            {errorProjects && (
              <div className="col-span-full text-center text-red-600">Error loading projects: {errorProjects}</div>
            )}
            {!loadingProjects && projects.length === 0 && !errorProjects && (
              <div className="col-span-full text-center text-gray-600">No projects found.</div>
            )}

            {/* Project Cards */}
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border-1 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow min-h-[280px] flex flex-col"
              >
                <div className={`h-32 ${project.bgColor} relative flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 p-4">
                    <div className="w-8 h-8 border-2 border-white rounded bg-white/20"></div>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-xs text-gray-500 mb-2">{project.date}</div>
                  <h4 className="font-medium text-gray-900 text-sm leading-tight mb-4 flex-1">{project.title}</h4>
                  <div className="flex justify-between items-center">
                    <Badge
                      variant={project.status === 'Done' ? 'default' : 'secondary'}
                      className={
                        project.status === 'Done'
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                      }
                    >
                      {project.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="small">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}

            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddNewProject}>
              <Plus className="h-4 w-4 mr-2" />
              New Research Project
            </Button>
          </div>

          {/* Project Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                <div className="col-span-6">Research Project</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Last activity</div>
                <div className="col-span-2">Actions</div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {projects.map((project) => (
                <div key={project.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6">
                      <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                        {project.title}
                      </a>
                    </div>
                    <div className="col-span-2">
                      <Badge
                        variant={project.status === 'Done' ? 'default' : 'secondary'}
                        className={
                          project.status === 'Done'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-sm text-gray-600">{project.date}</div>
                    <div className="col-span-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="small">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 'use client';

// import { Plus, MoreHorizontal } from 'lucide-react';
// import { Button } from './../components/Button';
// import { Badge } from './../components/ui/badge';
// //import { Avatar, AvatarImage, AvatarFallback } from './../components/ui/avatar';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from './../components/ui/dropdown-menu';
// import React from 'react';
// import { useUser, UserButton } from '@clerk/nextjs';

// const projects = [
//   {
//     id: 1,
//     title: 'Exploring Multimodal Approaches to Enhancing Human-Computer Interaction in Augmented Reality Systems',
//     date: 'Nov 11, 2024',
//     status: 'In progress',
//     image: '/placeholder.svg?height=200&width=300',
//     bgColor: 'bg-blue-400',
//   },
//   {
//     id: 2,
//     title: 'The Role of Microbiome Diversity in Modulating Human Metabolism: A Quantitative Genomics Perspective',
//     date: 'Oct 7, 2024',
//     status: 'Done',
//     image: '/placeholder.svg?height=200&width=300',
//     bgColor: 'bg-orange-400',
//   },
//   {
//     id: 3,
//     title:
//       'Optimizing Neural Network Architectures for Real-Time Natural Language Processing: Challenges and Innovations',
//     date: 'Apr 1, 2024',
//     status: 'Done',
//     image: '/placeholder.svg?height=200&width=300',
//     bgColor: 'bg-gray-600',
//   },
//   {
//     id: 4,
//     title:
//       'Assessing Climate Change Impacts on Coastal Ecosystems: Biodiversity Loss, Habitat Degradation, and Conservation Strategies',
//     date: 'Dec, 2022',
//     status: 'Done',
//     image: '/placeholder.svg?height=200&width=300',
//     bgColor: 'bg-blue-500',
//   },
// ];

// export default function Dashboard() {
//   //const [username, setUsername] = useState(''); // State to hold the username

//   // useEffect(() => {
//   //   // In a real app, you'd fetch the username from an API or local storage
//   //   // For demonstration, let's set a dummy username after a delay
//   //   setTimeout(() => {
//   //     setUsername('JohnDoe'); // Replace with actual logic to get the logged-in username
//   //   }, 1000);
//   // }, []);

//   const { isLoaded, isSignedIn, user } = useUser();

//   if (!isLoaded || !isSignedIn) {
//     // Return a loading state or null if user data is not yet loaded or not signed in
//     // You might want to show a skeleton or just the UserButton here.
//     return (
//       <header className="bg-white border-b border-gray-200 px-6 py-4">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-blue-600">Academico.ai</h1>
//           <div className="flex items-center gap-3">
//             {/* Show UserButton only when it's loaded to prevent hydration issues */}
//             {isLoaded && <UserButton />}
//           </div>
//         </div>
//       </header>
//     );
//   }

//   // user.firstName, user.lastName, user.fullName, user.username, user.emailAddresses, etc.
//   const username = user.username || user.fullName || user.emailAddresses[0]?.emailAddress || 'Guest';

//   // For AvatarFallback, you can use initials
//   let usernameInitials = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
//   if (user.lastName) {
//     usernameInitials += user.lastName.charAt(0).toUpperCase();
//   }
//   // Fallback if no first/last name
//   if (!usernameInitials && user.emailAddresses && user.emailAddresses[0]) {
//     usernameInitials = user.emailAddresses[0].emailAddress.charAt(0).toUpperCase();
//   }
//   // Default to '?' if nothing else is available
//   if (!usernameInitials) {
//     usernameInitials = '?';
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 px-6 py-4">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-blue-600">Academico.ai</h1>
//           <div className="flex items-center gap-3">
//             <span className="text-gray-600">{username}</span>
//             {/* <Avatar className="h-10 w-10">
//               <AvatarImage src={user.imageUrl || '/images/user-avatar.png'} alt={username} />
//               <AvatarFallback>{username ? username.charAt(0).toUpperCase() : ''}</AvatarFallback>
//               <AvatarFallback>{usernameInitials}</AvatarFallback>
//             </Avatar> */}
//             <UserButton />
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="px-6 py-8">
//         <div className="max-w-7xl mx-auto">
//           {/* <h2 className="text-4xl font-bold text-gray-900 mb-2">Hi Amy! Welcome to Academico.ai</h2> */}
//           <h2 className="text-4xl font-bold text-gray-900 mb-4 py-4">Hi {username}! Welcome to Academico.ai</h2>

//           <div className="flex justify-between items-center mb-8">
//             <h3 className="text-xl font-semibold text-gray-800">Project Gallery</h3>
//           </div>

//           {/* Project Gallery Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
//             {/* Add New Project Card */}
//             <div className="bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg p-8 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity min-h-[280px]">
//               <Plus className="h-12 w-12 text-white" />
//             </div>

//             {/* Project Cards */}
//             {projects.map((project) => (
//               <div
//                 key={project.id}
//                 className="bg-white border-1 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow min-h-[280px] flex flex-col"
//               >
//                 <div className={`h-32 ${project.bgColor} relative flex items-center justify-center`}>
//                   <div className="absolute inset-0 bg-black/20"></div>
//                   <div className="relative z-10 p-4">
//                     <div className="w-8 h-8 border-2 border-white rounded bg-white/20"></div>
//                   </div>
//                 </div>
//                 <div className="p-4 flex-1 flex flex-col">
//                   <div className="text-xs text-gray-500 mb-2">{project.date}</div>
//                   <h4 className="font-medium text-gray-900 text-sm leading-tight mb-4 flex-1">{project.title}</h4>
//                   <div className="flex justify-between items-center">
//                     <Badge
//                       variant={project.status === 'Done' ? 'default' : 'secondary'}
//                       className={
//                         project.status === 'Done'
//                           ? 'bg-green-100 text-green-800 hover:bg-green-100'
//                           : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
//                       }
//                     >
//                       {project.status}
//                     </Badge>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="outline" size="small">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent>
//                         <DropdownMenuItem>Edit</DropdownMenuItem>
//                         <DropdownMenuItem>Share</DropdownMenuItem>
//                         <DropdownMenuItem>Delete</DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             <Button className="bg-blue-600 hover:bg-blue-700">
//               <Plus className="h-4 w-4 mr-2" />
//               New Research Project
//             </Button>
//           </div>

//           {/* Project Table */}
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
//                 <div className="col-span-6">Research Project</div>
//                 <div className="col-span-2">Category</div>
//                 <div className="col-span-2">Last activity</div>
//                 <div className="col-span-2">Actions</div>
//               </div>
//             </div>
//             <div className="divide-y divide-gray-200">
//               {projects.map((project) => (
//                 <div key={project.id} className="px-6 py-4 hover:bg-gray-50">
//                   <div className="grid grid-cols-12 gap-4 items-center">
//                     <div className="col-span-6">
//                       <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
//                         {project.title}
//                       </a>
//                     </div>
//                     <div className="col-span-2">
//                       <Badge
//                         variant={project.status === 'Done' ? 'default' : 'secondary'}
//                         className={
//                           project.status === 'Done'
//                             ? 'bg-green-100 text-green-800 hover:bg-green-100'
//                             : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
//                         }
//                       >
//                         {project.status}
//                       </Badge>
//                     </div>
//                     <div className="col-span-2 text-sm text-gray-600">{project.date}</div>
//                     <div className="col-span-2">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="outline" size="small">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent>
//                           <DropdownMenuItem>Edit</DropdownMenuItem>
//                           <DropdownMenuItem>Share</DropdownMenuItem>
//                           <DropdownMenuItem>Delete</DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
