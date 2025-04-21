
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SocialFeed from "@/components/feed/SocialFeed";
import PeopleConnect from "@/components/networking/PeopleConnect";
import { Bot } from "lucide-react";

export function Network() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-rajasthan-blue dark:text-rajasthan-turquoise">Alumni Network</h1>
        <p className="text-muted-foreground">
          Connect with alumni, share updates, and get advice from your community
        </p>
      </div>

      <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="connect">People</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="min-h-[500px]">
          <SocialFeed />
        </TabsContent>
        
        <TabsContent value="connect" className="min-h-[500px]">
          <PeopleConnect />
        </TabsContent>
      </Tabs>
      
      {/* AI Assistant Promo Card */}
      <div className="mt-12 bg-gradient-to-r from-rajasthan-blue to-rajasthan-turquoise rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <Bot className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Need guidance? Ask our AI Assistant</h3>
              <p className="opacity-90">Get instant answers about alumni connections, career advice, and more</p>
            </div>
          </div>
          <Button asChild className="bg-white text-rajasthan-blue hover:bg-white/90">
            <Link to="/assistant">
              Open AI Assistant
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Network;
