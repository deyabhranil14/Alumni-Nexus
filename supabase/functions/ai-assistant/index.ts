
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback responses when OpenAI is unavailable
const fallbackResponses = {
  general: [
    "As your Alumni Nexus Assistant, I can help you with networking tips, career advice, and making alumni connections.",
    "The Alumni Nexus platform is designed to connect students and alumni for mentorship and career growth.",
    "Looking for mentorship? Try visiting the Mentorship section to connect with experienced alumni in your field.",
    "Networking is about quality connections. Try reaching out to alumni in your field of interest with specific questions.",
    "You can update your profile with your skills and interests to help find better alumni matches.",
  ],
  networking: [
    "For effective networking, start by identifying alumni in your field of interest and reach out with specific questions.",
    "Alumni networking events are great opportunities to make meaningful connections. Check the events section regularly.",
    "When reaching out to alumni, be clear about your goals and how they might be able to help you.",
    "Follow up after connecting with alumni to thank them for their time and maintain the relationship.",
  ],
  career: [
    "Consider exploring internship opportunities through alumni connections in your desired industry.",
    "Resume building is crucial for job hunting. Make sure to highlight projects relevant to your target field.",
    "Informational interviews with alumni can provide valuable insights into different career paths.",
    "LinkedIn is a great platform to maintain professional connections with alumni you meet through the network.",
  ],
  mentorship: [
    "When seeking a mentor, look for alumni with experience in areas you want to develop.",
    "Successful mentorship relationships require clear goals and regular communication.",
    "Be respectful of your mentor's time and come prepared with specific questions for your meetings.",
    "Both parties benefit from mentorship - mentors often gain fresh perspectives and leadership experience.",
  ],
  technical: [
    "Technical interviews often focus on problem-solving skills. Practice coding challenges to prepare.",
    "Building a portfolio of projects is important for technical roles. Consider collaborating with alumni on projects.",
    "Stay updated with industry trends through online courses, webinars, and alumni who work in the field.",
    "Soft skills like communication are just as important as technical skills in tech careers.",
  ]
};

const getFallbackResponse = (query) => {
  query = query.toLowerCase();
  
  if (query.includes("network") || query.includes("connect") || query.includes("alumni")) {
    return fallbackResponses.networking[Math.floor(Math.random() * fallbackResponses.networking.length)];
  } else if (query.includes("career") || query.includes("job") || query.includes("resume") || query.includes("interview")) {
    return fallbackResponses.career[Math.floor(Math.random() * fallbackResponses.career.length)];
  } else if (query.includes("mentor") || query.includes("guidance")) {
    return fallbackResponses.mentorship[Math.floor(Math.random() * fallbackResponses.mentorship.length)];
  } else if (query.includes("tech") || query.includes("coding") || query.includes("programming")) {
    return fallbackResponses.technical[Math.floor(Math.random() * fallbackResponses.technical.length)];
  } else {
    return fallbackResponses.general[Math.floor(Math.random() * fallbackResponses.general.length)];
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log("OpenAI API Key present:", !!openAIApiKey);
    
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
    
    // First try to use fallback responses as they're more reliable
    try {
      const fallbackResponse = getFallbackResponse(query);
      console.log("Using fallback response system");
      
      return new Response(
        JSON.stringify({ response: fallbackResponse }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } catch (fallbackError) {
      console.error("Error with fallback response:", fallbackError);
      // Continue to try OpenAI if fallback fails
    }
    
    // Try OpenAI as a backup if it's configured
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured in Supabase secrets');
    }
    
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
      // Use fallback response if OpenAI fails
      const fallbackResponse = getFallbackResponse(query);
      
      return new Response(
        JSON.stringify({ response: fallbackResponse }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
  } catch (error) {
    console.error("Error in AI assistant function:", error);
    // Even if everything fails, return a polite error message
    return new Response(
      JSON.stringify({ 
        response: "I apologize, but I'm having trouble processing your request at the moment. Please try again later or reach out to alumni through the networking section for assistance." 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  }
});
