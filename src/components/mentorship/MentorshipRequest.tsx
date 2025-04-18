
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const mentorshipSchema = z.object({
  goals: z.string().min(10, "Please describe your goals in at least 10 characters"),
  notes: z.string().optional(),
});

type MentorshipFormValues = z.infer<typeof mentorshipSchema>;

interface MentorshipRequestProps {
  mentorId?: string; // Optional: can be provided directly as prop or from URL
}

export default function MentorshipRequest({ mentorId: propMentorId }: MentorshipRequestProps) {
  const { mentorId: urlMentorId } = useParams<{ mentorId: string }>();
  const finalMentorId = propMentorId || urlMentorId;
  
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<MentorshipFormValues>({
    resolver: zodResolver(mentorshipSchema),
    defaultValues: {
      goals: "",
      notes: "",
    },
  });
  
  async function onSubmit(values: MentorshipFormValues) {
    if (!user) {
      toast.error("You must be logged in to request mentorship");
      return;
    }
    
    if (!finalMentorId) {
      toast.error("No mentor selected");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert the mentorship request
      const { data, error } = await supabase.from('mentorships').insert({
        mentor_id: finalMentorId,
        mentee_id: user.id,
        goals: values.goals,
        notes: values.notes || "",
        status: "pending",
      });
      
      if (error) throw error;
      
      toast.success("Mentorship request sent successfully!");
      form.reset();
      
      // Create notification for mentor
      await supabase.from('notifications').insert({
        user_id: finalMentorId,
        type: "mentorship_request",
        content: `${user.name} has requested your mentorship`,
        link_to: `/mentorship/requests`,
      });
      
    } catch (error) {
      console.error("Error submitting mentorship request:", error);
      toast.error("Failed to send mentorship request");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground">You need to be logged in to request mentorship.</p>
            <Button className="mt-4">Log In</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!finalMentorId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground">No mentor selected. Please select a mentor to request mentorship.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Mentorship</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Goals</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What do you hope to achieve through this mentorship? Be specific about your career or academic goals."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Clearly defined goals help mentors understand how they can best assist you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any specific areas, questions, or topics you'd like to focus on?"
                      className="min-h-16"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending Request..." : "Send Mentorship Request"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
