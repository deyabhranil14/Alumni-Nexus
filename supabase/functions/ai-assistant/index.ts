
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log("OpenAI API Key present:", !!openAIApiKey);
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured in Supabase secrets');
    }

    const requestData = await req.json().catch(e => {
      console.error("Error parsing request JSON:", e);
      throw new Error("Invalid JSON in request body");
    });
    
    const { query, history } = requestData;
    
    if (!query || typeof query !== 'string') {
      console.error("Invalid query format:", query);
      throw new Error("Query must be a non-empty string");
    }
    
    console.log("Received query:", query);
    console.log("History length:", history?.length || 0);
    
    // Convert history to the format expected by OpenAI
    const messages = [
      {
        role: "system",
        content: "You are a helpful AI assistant for Alumni Nexus, a platform connecting students with alumni mentors. You provide guidance about networking, career development, mentorship opportunities, and platform features. Your responses should be helpful, informative, and tailored to alumni networking context."
      }
    ];
    
    // Add conversation history
    if (history && history.length) {
      history.forEach((item) => {
        if (item && typeof item.query === 'string' && typeof item.response === 'string') {
          messages.push({ role: "user", content: item.query });
          messages.push({ role: "assistant", content: item.response });
        }
      });
    }
    
    // Add the current query
    messages.push({ role: "user", content: query });
    
    console.log("Sending request to OpenAI API with messages length:", messages.length);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(e => ({ error: { message: "Failed to parse error response" }}));
        console.error("OpenAI API error status:", response.status, "Response:", errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || JSON.stringify(errorData)}`);
      }

      const data = await response.json().catch(e => {
        console.error("Error parsing OpenAI response:", e);
        throw new Error("Failed to parse OpenAI response");
      });
      
      console.log("OpenAI response received successfully");
      const aiResponse = data.choices?.[0]?.message?.content;
      
      if (!aiResponse) {
        console.error("Missing content in OpenAI response:", data);
        throw new Error("No valid response content from OpenAI");
      }

      return new Response(
        JSON.stringify({ response: aiResponse }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } catch (openaiError) {
      console.error("OpenAI API call error:", openaiError);
      throw new Error(`OpenAI API call failed: ${openaiError.message}`);
    }
  } catch (error) {
    console.error("Error in AI assistant function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
