
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SocialFeed from "@/components/feed/SocialFeed";
import PeopleConnect from "@/components/networking/PeopleConnect";
import AIChatAssistant from "@/components/chat/AIChatAssistant";

export function Network() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-rajasthan-blue">Alumni Network</h1>
        <p className="text-muted-foreground">
          Connect with alumni, share updates, and get advice from your community
        </p>
      </div>

      <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="connect">People</TabsTrigger>
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="min-h-[500px]">
          <SocialFeed />
        </TabsContent>
        
        <TabsContent value="connect" className="min-h-[500px]">
          <PeopleConnect />
        </TabsContent>
        
        <TabsContent value="assistant" className="min-h-[500px]">
          <AIChatAssistant />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Network;
