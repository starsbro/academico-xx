'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { Button } from './../components/Button';
import { Input } from './../components/ui/input';
import { ScrollArea } from './../components/ui/scroll-area';
import { Home, PenTool, Paperclip, Send, ArrowUp } from 'lucide-react';

export default function Component() {
  const chatHistory = Array.from({ length: 13 }, (_, i) => `new chat ${32 - i}`);

  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    // Return a loading state or null if user data is not yet loaded or not signed in
    // You might want to show a skeleton or just the UserButton here.
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Academico.ai</h1>
          <div className="flex items-center gap-3">
            {/* Show UserButton only when it's loaded to prevent hydration issues */}
            {isLoaded && <UserButton />}
          </div>
        </div>
      </header>
    );
  }

  // user.firstName, user.lastName, user.fullName, user.username, user.emailAddresses, etc.
  const username = user.username || user.fullName || user.emailAddresses[0]?.emailAddress || 'Guest';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-400 to-blue-600 text-white flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center gap-3">
          {/* <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div> */}
          <UserButton />
          <span className="font-medium">Academic {username}</span>
          <Home className="w-5 h-5 ml-auto" />
        </div>

        {/* New Chat Button */}
        <div className="px-4 mb-4">
          <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 justify-start gap-2">
            <PenTool className="w-4 h-4" />
            New
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 px-4">
          <h3 className="text-sm font-medium mb-3 opacity-90">Chat History</h3>
          <ScrollArea className="h-full">
            <div className="space-y-1">
              {chatHistory.map((chat, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-white hover:bg-white/20 h-8 text-sm font-normal"
                >
                  {chat}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <p className="text-gray-700 leading-relaxed text-sm">
                CRISPR, an acronym for Clustered Regularly Interspaced Short Palindromic Repeats, is a revolutionary
                technology in genetic engineering and biotechnology. It is primarily known for its role in genome
                editing, where it allows for precise modifications to DNA sequences. The CRISPR/Cas9 system, a widely
                used variant, employs guide RNA to direct the Cas9 endonuclease to specific DNA sites, facilitating
                targeted double-strand breaks and subsequent gene editing (ali2020roleofmodern lines 347-385). CRISPR
                technology has diverse applications, including multiplex genome engineering, precision genome
                regulation, and high-throughput functional genomics (ali2020roleofmodern lines 762-798). It is
                instrumental in tissue engineering, where it aids in addressing tissue architecture, immune response,
                and cell differentiation. For instance, CRISPR/Cas9 has been used to edit adipose-derived stem cells to
                promote osteogenic differentiation, offering alternatives to traditional growth factors
                (ali2020roleofmodern lines 347-385). In medical research, CRISPR is utilized for modeling diseases, such
                as colorectal cancer in human intestinal organoids, and correcting genetic mutations, like those in
                Duchenne muscular dystrophy (ali2020roleofmodern lines 830-867). The technology also supports the
                development of isogenic cell lines for disease modeling and optogenetic control systems for precise
                regulation of cell differentiation (ali2020roleofmodern lines 385-433).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Button
                variant="outline"
                className="h-16 bg-purple-100 border-purple-200 hover:bg-purple-150 text-purple-700 text-xs font-medium flex flex-col items-center justify-center gap-1"
              >
                <span className="text-center leading-tight">Generate Search Knowledge Graph</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 bg-purple-100 border-purple-200 hover:bg-purple-150 text-purple-700 text-xs font-medium flex flex-col items-center justify-center gap-1"
              >
                <span className="text-center leading-tight">Search Knowledge Graph</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 bg-purple-100 border-purple-200 hover:bg-purple-150 text-purple-700 text-xs font-medium flex flex-col items-center justify-center gap-1"
              >
                <span className="text-center leading-tight">Generate Full Context Knowledge Graph</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 bg-purple-100 border-purple-200 hover:bg-purple-150 text-purple-700 text-xs font-medium flex flex-col items-center justify-center gap-1"
              >
                <span className="text-center leading-tight">Full Context Knowledge Graph</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Input placeholder="I am thinking about..." className="pr-20 h-12 text-sm" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button size="small" variant="outline" className="h-8 w-8 p-0">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button size="small" variant="outline" className="h-8 w-8 p-0">
                  <Send className="w-4 h-4" />
                </Button>
                <Button size="small" className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600">
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
