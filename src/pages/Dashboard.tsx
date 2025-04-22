
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  GraduationCap,
  Bell,
  MessageSquare,
  Users,
  BarChart,
  BookOpen,
  Briefcase,
  Award,
  MapPin,
  TrendingUp,
  Loader2,
  User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

// Animation variants for different elements
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut" 
    }
  })
};

export function Dashboard() {
  const { user, loading, session, isGuest } = useAuth();
  
  // Fetch connections count
  const { data: connectionsData, isLoading: loadingConnections } = useQuery({
    queryKey: ['connections', user?.id],
    queryFn: async () => {
      if (!user?.id) return { count: 0 };
      
      const { data: outgoingConnections, error: outError } = await supabase
        .from('mentorships')
        .select('id')
        .eq('mentee_id', user.id)
        .eq('status', 'active');
        
      const { data: incomingConnections, error: inError } = await supabase
        .from('mentorships')
        .select('id')
        .eq('mentor_id', user.id)
        .eq('status', 'active');
        
      if (outError || inError) {
        console.error("Error fetching connections:", outError || inError);
        return { count: 0 };
      }
      
      return { 
        count: (outgoingConnections?.length || 0) + (incomingConnections?.length || 0)
      };
    },
    enabled: !!user?.id && !isGuest
  });
  
  // Fetch unread messages count
  const { data: messagesData, isLoading: loadingMessages } = useQuery({
    queryKey: ['unread-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return { count: 0 };
      
      const { data, error } = await supabase
        .from('messages')
        .select('id')
        .eq('receiver_id', user.id)
        .eq('read', false);
        
      if (error) {
        console.error("Error fetching unread messages:", error);
        return { count: 0 };
      }
      
      return { count: data?.length || 0 };
    },
    enabled: !!user?.id && !isGuest
  });
  
  // Fetch unread notifications count
  const { data: notificationsData, isLoading: loadingNotifications } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return { count: 0 };
      
      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_read', false);
        
      if (error) {
        console.error("Error fetching notifications:", error);
        return { count: 0 };
      }
      
      return { count: data?.length || 0 };
    },
    enabled: !!user?.id && !isGuest
  });
  
  // Fetch recommended connections
  const { data: recommendedUsers, isLoading: loadingRecommendations } = useQuery({
    queryKey: ['recommended-users', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Find users with similar education background
      const { data: userEducation } = await supabase
        .from('user_education')
        .select('institution')
        .eq('user_id', user.id);
        
      if (userEducation && userEducation.length > 0) {
        // Get users from same institutions
        const institution = userEducation[0].institution;
        
        const { data: similarEducationUsers } = await supabase
          .from('user_education')
          .select('user_id, institution')
          .eq('institution', institution)
          .neq('user_id', user.id);
          
        if (similarEducationUsers && similarEducationUsers.length > 0) {
          const userIds = similarEducationUsers.map(u => u.user_id);
          
          const { data: recommendedProfiles } = await supabase
            .from('users')
            .select('id, name, role, profile_image, bio, location')
            .in('id', userIds)
            .limit(3);
            
          return recommendedProfiles || [];
        }
      }
      
      // If no education match, just return some random users
      const { data: randomUsers } = await supabase
        .from('users')
        .select('id, name, role, profile_image, bio, location')
        .neq('id', user.id)
        .limit(3);
        
      return randomUsers || [];
    },
    enabled: !!user?.id && !isGuest
  });
  
  // Fetch mentorship requests
  const { data: mentorshipRequests, isLoading: loadingMentorships } = useQuery({
    queryKey: ['mentorship-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('mentorships')
        .select(`
          id,
          goals,
          mentee:mentee_id (id, name, profile_image)
        `)
        .eq('mentor_id', user.id)
        .eq('status', 'pending');
        
      if (error) {
        console.error("Error fetching mentorship requests:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id && !isGuest && user?.role === 'alumni'
  });
  
  if (loading) {
    return (
      <div className="container py-8 min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-12 w-12 text-rajasthan-blue animate-spin" />
            <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container py-8 min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg text-muted-foreground">Unable to load user data</p>
            <Button asChild>
              <Link to="/login">Go to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container py-8">
        {/* Welcome Banner */}
        <motion.div 
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Card className="bg-gradient-to-r from-rajasthan-blue to-rajasthan-turquoise text-white border-none overflow-hidden relative">
            <CardContent className="p-6 z-10 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <motion.h1 
                    className="text-2xl font-bold"
                    variants={fadeIn}
                    custom={1}
                  >
                    {isGuest ? 'Welcome, Guest!' : `Welcome back, ${user.name || "Friend"}!`}
                  </motion.h1>
                  <motion.p 
                    className="opacity-90"
                    variants={fadeIn}
                    custom={2}
                  >
                    {isGuest 
                      ? "Explore the alumni network without logging in"
                      : "Your alumni network awaits. Connect, learn, and grow together."}
                  </motion.p>
                </div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.2 }}
                  transition={{ duration: 0.5 }}
                  className="hidden md:block"
                >
                  <img 
                    src="/logo.svg" 
                    alt="Alumni Nexus"
                    className="h-16 w-16"
                  />
                </motion.div>
              </div>
            </CardContent>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('/network-pattern.svg')] bg-repeat"></div>
            </div>
          </Card>
        </motion.div>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content Area - 2/3 width on desktop */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <motion.div variants={fadeIn} custom={1} initial="hidden" animate="visible">
                <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="rounded-full bg-rajasthan-blue/10 p-2 mb-2">
                      <Users className="h-5 w-5 text-rajasthan-blue" />
                    </div>
                    <p className="text-2xl font-bold">{loadingConnections ? '...' : connectionsData?.count || 0}</p>
                    <p className="text-xs text-muted-foreground">Connections</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeIn} custom={2} initial="hidden" animate="visible">
                <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="rounded-full bg-rajasthan-saffron/10 p-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-rajasthan-saffron" />
                    </div>
                    <p className="text-2xl font-bold">{loadingMessages ? '...' : messagesData?.count || 0}</p>
                    <p className="text-xs text-muted-foreground">Unread Messages</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeIn} custom={3} initial="hidden" animate="visible">
                <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="rounded-full bg-rajasthan-turquoise/10 p-2 mb-2">
                      <Calendar className="h-5 w-5 text-rajasthan-turquoise" />
                    </div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">Upcoming Events</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeIn} custom={4} initial="hidden" animate="visible">
                <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="rounded-full bg-rajasthan-maroon/10 p-2 mb-2">
                      <Bell className="h-5 w-5 text-rajasthan-maroon" />
                    </div>
                    <p className="text-2xl font-bold">{loadingNotifications ? '...' : notificationsData?.count || 0}</p>
                    <p className="text-xs text-muted-foreground">Notifications</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Mentorship Requests - Only show if there are any */}
            {!loadingMentorships && mentorshipRequests && mentorshipRequests.length > 0 && (
              <motion.div variants={fadeIn} custom={5} initial="hidden" animate="visible">
                <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-rajasthan-blue" />
                      Mentorship Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mentorshipRequests.map((request: any) => (
                        <div key={request.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={request.mentee.profile_image} />
                              <AvatarFallback>
                                {request.mentee.name ? request.mentee.name.charAt(0) : <User className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{request.mentee.name}</p>
                              <p className="text-xs mt-1">{request.goals}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-rajasthan-blue hover:bg-rajasthan-blue/90">Accept</Button>
                            <Button size="sm" variant="outline">Decline</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/mentorship">Manage Mentorships</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* Getting Started - Show for new users with no connections */}
            {!loadingConnections && (!connectionsData || connectionsData.count === 0) && (
              <motion.div variants={fadeIn} custom={6} initial="hidden" animate="visible">
                <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <Users className="h-5 w-5 mr-2 text-rajasthan-blue" />
                      Getting Started
                    </CardTitle>
                    <CardDescription>Welcome to Alumni Nexus! Here's how to get started</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 pb-4 border-b">
                        <div className="bg-rajasthan-blue/10 rounded-full p-2">
                          <User className="h-5 w-5 text-rajasthan-blue" />
                        </div>
                        <div>
                          <h3 className="font-medium">Complete Your Profile</h3>
                          <p className="text-sm text-muted-foreground">Add your education, experience, and skills to help others find you</p>
                          <Button size="sm" variant="outline" className="mt-2" asChild>
                            <Link to="/profile">Update Profile</Link>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 pb-4 border-b">
                        <div className="bg-rajasthan-blue/10 rounded-full p-2">
                          <Users className="h-5 w-5 text-rajasthan-blue" />
                        </div>
                        <div>
                          <h3 className="font-medium">Find Connections</h3>
                          <p className="text-sm text-muted-foreground">Connect with alumni and students based on your interests and background</p>
                          <Button size="sm" variant="outline" className="mt-2" asChild>
                            <Link to="/network">Find People</Link>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-rajasthan-blue/10 rounded-full p-2">
                          <GraduationCap className="h-5 w-5 text-rajasthan-blue" />
                        </div>
                        <div>
                          <h3 className="font-medium">Explore Mentorship</h3>
                          <p className="text-sm text-muted-foreground">Find a mentor or become one to help others in their career journey</p>
                          <Button size="sm" variant="outline" className="mt-2" asChild>
                            <Link to="/mentorship">Mentorship</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
          
          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div variants={fadeIn} custom={7} initial="hidden" animate="visible">
              <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4 ring-2 ring-offset-2 ring-rajasthan-blue/20">
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback>
                        {user.name ? user.name.charAt(0) : <User className="h-8 w-8" />}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-xl">{user.name || "User"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.role === 'alumni' && user.experience && user.experience[0] ? 
                        `${user.experience[0].title} at ${user.experience[0].company}` : 
                        (user.role === 'student' ? "Student" : user.role || "User")}
                    </p>
                    {user.location && (
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="border-t border-b w-full my-4 py-3">
                      <div className="flex justify-around">
                        <div className="text-center">
                          <p className="font-semibold">{loadingConnections ? '...' : connectionsData?.count || 0}</p>
                          <p className="text-xs text-muted-foreground">Connections</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">0</p>
                          <p className="text-xs text-muted-foreground">Mentees</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">0</p>
                          <p className="text-xs text-muted-foreground">Events</p>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link to="/profile">View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* AI Recommended Connections */}
            <motion.div variants={fadeIn} custom={8} initial="hidden" animate="visible">
              <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-rajasthan-blue" />
                    AI-Recommended Connections
                  </CardTitle>
                  <CardDescription>People you might want to connect with</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingRecommendations ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : recommendedUsers && recommendedUsers.length > 0 ? (
                    <div className="space-y-4">
                      {recommendedUsers.map((connection: any) => (
                        <div key={connection.id} className="flex items-center gap-3 pb-3 border-b last:border-0">
                          <Avatar>
                            <AvatarImage src={connection.profile_image} />
                            <AvatarFallback>
                              {connection.name ? connection.name.charAt(0) : <User className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{connection.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{connection.role}</p>
                            <p className="text-xs text-rajasthan-saffron mt-1">Similar education background</p>
                          </div>
                          <Button size="sm" variant="outline" className="shrink-0" asChild>
                            <Link to={`/profile/${connection.id}`}>View</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>Complete your profile to get recommendations</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/network">Find More</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Quick Links */}
            <motion.div variants={fadeIn} custom={9} initial="hidden" animate="visible">
              <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to="/chat">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Messages
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to="/network">
                        <Users className="h-4 w-4 mr-2" />
                        Network
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to="/mentorship">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Mentorship
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to="/profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
