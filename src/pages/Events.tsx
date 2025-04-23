
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from "@/components/events/EventForm";
import { Separator } from "@/components/ui/separator";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
  created_by: string;
  creator_name?: string;
  participants_count?: number;
  is_joined?: boolean;
}

export default function Events() {
  const { user, isGuest } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Fetch all events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (eventsError) {
        throw eventsError;
      }
      
      if (!eventsData) {
        setEvents([]);
        setLoading(false);
        return;
      }
      
      // Get creator names
      const creatorIds = [...new Set(eventsData.map(event => event.created_by))].filter(Boolean);
      let creatorNames: {[key: string]: string} = {};
      
      if (creatorIds.length > 0) {
        const { data: creatorsData } = await supabase
          .from('users')
          .select('id, name')
          .in('id', creatorIds);
          
        if (creatorsData) {
          creatorsData.forEach(creator => {
            creatorNames[creator.id] = creator.name;
          });
        }
      }
      
      // Check which events the user has joined
      let userParticipations: {[key: string]: boolean} = {};
      
      if (user && !isGuest) {
        const { data: participationsData } = await supabase
          .from('event_participants')
          .select('event_id')
          .eq('user_id', user.id);
          
        if (participationsData) {
          participationsData.forEach(p => {
            userParticipations[p.event_id!] = true;
          });
        }
      }
      
      // Get participant counts
      const participantCounts: {[key: string]: number} = {};
      
      const { data: countData } = await supabase
        .from('event_participants')
        .select('event_id, count')
        .count('id');
        
      if (countData) {
        countData.forEach(item => {
          if (item.event_id) {
            participantCounts[item.event_id] = Number(item.count);
          }
        });
      }
      
      // Combine all data
      const enrichedEvents = eventsData.map(event => ({
        ...event,
        creator_name: event.created_by ? creatorNames[event.created_by] : 'Unknown',
        participants_count: participantCounts[event.id] || 0,
        is_joined: userParticipations[event.id] || false
      }));
      
      setEvents(enrichedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!user || isGuest) {
      toast.error('Please sign in to join events');
      return;
    }
    
    try {
      setJoinLoading(prev => ({ ...prev, [eventId]: true }));
      
      const event = events.find(e => e.id === eventId);
      if (event?.is_joined) {
        // Leave event
        const { error } = await supabase
          .from('event_participants')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', eventId);
          
        if (error) throw error;
        
        toast.success('You have left this event');
        
        // Update local state
        setEvents(events.map(e => 
          e.id === eventId 
            ? { ...e, is_joined: false, participants_count: Math.max(0, (e.participants_count || 0) - 1) } 
            : e
        ));
      } else {
        // Join event
        const { error } = await supabase
          .from('event_participants')
          .insert({
            user_id: user.id,
            event_id: eventId
          });
          
        if (error) throw error;
        
        toast.success('You have joined this event');
        
        // Update local state
        setEvents(events.map(e => 
          e.id === eventId 
            ? { ...e, is_joined: true, participants_count: (e.participants_count || 0) + 1 } 
            : e
        ));
      }
    } catch (error) {
      console.error('Error joining/leaving event:', error);
      toast.error('Failed to process your request');
    } finally {
      setJoinLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleCreateSuccess = () => {
    fetchEvents();
    toast.success('Event created successfully!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const canCreateEvent = user && !isGuest && user.role === 'alumni';

  return (
    <>
      <Helmet>
        <title>Events | ConnectEd</title>
      </Helmet>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground mt-1">
              Join events organized by alumni and faculty
            </p>
          </div>
          
          {canCreateEvent && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Create Event</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Share your event details. All fields are required.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <EventForm userId={user.id} onSuccess={handleCreateSuccess} />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="bg-muted/20 h-20"></CardHeader>
                <CardContent className="pt-6">
                  <div className="h-5 bg-muted w-3/4 mb-4 rounded"></div>
                  <div className="h-4 bg-muted w-1/2 mb-2 rounded"></div>
                  <div className="h-4 bg-muted w-full mb-2 rounded"></div>
                  <div className="h-4 bg-muted w-2/3 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {formatDate(event.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {event.participants_count || 0} joined
                    </div>
                    <div>By {event.creator_name || 'Unknown'}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleJoinEvent(event.id)}
                    disabled={joinLoading[event.id] || isGuest}
                    variant={event.is_joined ? "outline" : "default"}
                    className="w-full"
                  >
                    {joinLoading[event.id] ? 
                      'Processing...' : 
                      event.is_joined ? 'Leave Event' : 'Join Event'
                    }
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="w-full p-6 text-center">
            <p className="text-muted-foreground mb-4">No events found</p>
            {canCreateEvent && (
              <p className="text-sm">
                As an alumni, you can create new events for everyone to join.
              </p>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
