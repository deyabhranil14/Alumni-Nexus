
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Bot } from "lucide-react";

export function MainLayout() {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponses, setAiResponses] = useState<Array<{query: string, response: string}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAIAssistantToggle = () => {
    setIsAIAssistantOpen(!isAIAssistantOpen);
  };

  const handleAIQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiQuery.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    // Placeholder for AI processing
    // This will be replaced with actual Supabase Edge Function call
    // that connects to an AI service like OpenAI
    setTimeout(() => {
      const demoResponses = [
        "I can help you connect with alumni in your field of interest.",
        "Based on your profile, I recommend exploring the upcoming Tech Career Expo event.",
        "Would you like me to suggest mentors specializing in software development?",
        "I've found 3 discussion threads related to your recent query about internships."
      ];
      
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      
      setAiResponses(prev => [...prev, {
        query: aiQuery,
        response: randomResponse
      }]);
      
      setAiQuery("");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      
      {/* AI Assistant Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={handleAIAssistantToggle}
          className="h-14 w-14 rounded-full bg-rajasthan-blue hover:bg-rajasthan-blue/90 shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
      
      {/* AI Assistant Drawer */}
      <Drawer open={isAIAssistantOpen} onOpenChange={setIsAIAssistantOpen}>
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader>
            <DrawerTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-rajasthan-blue" />
              Nexus AI Assistant
            </DrawerTitle>
            <DrawerDescription>
              Ask me anything about alumni connections, events, or career guidance.
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            {aiResponses.length > 0 ? (
              <div className="space-y-4">
                {aiResponses.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-muted p-3 rounded-lg text-sm">
                      <p className="font-medium">You asked:</p>
                      <p>{item.query}</p>
                    </div>
                    <div className="bg-rajasthan-blue/10 p-3 rounded-lg text-sm">
                      <p className="font-medium text-rajasthan-blue">Nexus AI:</p>
                      <p>{item.response}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Ask me about connecting with alumni, finding mentors, or discovering events.</p>
              </div>
            )}
          </div>
          
          <DrawerFooter>
            <form onSubmit={handleAIQuerySubmit} className="flex gap-2">
              <Input
                placeholder="Ask AI Assistant..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="flex-1"
                disabled={isProcessing}
              />
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Thinking..." : "Ask"}
              </Button>
            </form>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default MainLayout;
