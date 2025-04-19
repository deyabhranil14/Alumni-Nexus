
import React, { useState, useEffect } from "react";
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
import { Bot, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIChatMessage {
  query: string;
  response: string;
}

export function MainLayout() {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponses, setAiResponses] = useState<AIChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAIAssistantToggle = () => {
    setIsAIAssistantOpen(!isAIAssistantOpen);
  };

  const handleAIQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiQuery.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setError(null);
    
    // Show the user's query immediately
    const newQuery = aiQuery.trim();
    setAiQuery("");
    
    try {
      console.log("Calling AI assistant function with query:", newQuery);
      console.log("Sending history:", aiResponses.slice(-5));
      
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          query: newQuery,
          history: aiResponses.slice(-5) // Send last 5 exchanges for context
        },
      });

      console.log("AI assistant response:", data, "Error:", error);
      
      if (error) {
        throw new Error(`Function error: ${error.message}`);
      }
      
      if (!data || !data.response) {
        throw new Error('No response received from AI');
      }
      
      setAiResponses(prev => [...prev, {
        query: newQuery,
        response: data.response
      }]);
      
      toast.success("AI response received");
      
    } catch (err) {
      console.error("AI Assistant error:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      setError(errorMessage);
      toast.error(`AI Assistant error: ${errorMessage}`);
      
      // Add only the user's message when there's an error
      setAiResponses(prev => [...prev, {
        query: newQuery,
        response: `Sorry, I encountered an error: ${errorMessage}`
      }]);
    } finally {
      setIsProcessing(false);
    }
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
                      <p className="whitespace-pre-wrap">{item.response}</p>
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
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
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
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Ask"
                )}
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
