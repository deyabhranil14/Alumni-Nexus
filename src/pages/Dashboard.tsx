
import React from "react";
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
  Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Dashboard() {
  const { user, loading, session, isGuest } = useAuth();
  
  console.log("Dashboard rendering with:", {
    userExists: !!user,
    loading,
    sessionExists: !!session,
    userName: user?.name,
    userRole: user?.role,
    isGuest
  });

  // No longer redirect to login if not authenticated
  // Instead, show the dashboard for all users (including guests)
  
  // Mock data - in a real app this would come from an API
  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Career Expo",
      date: "Jun 15, 2025",
      location: "Virtual",
      attendees: 120
    },
    {
      id: 2,
      title: "Alumni Meetup",
      date: "Jul 8, 2025",
      location: "Jaipur",
      attendees: 85
    },
    {
      id: 3,
      title: "AI & ML Workshop",
      date: "Aug 22, 2025",
      location: "Virtual",
      attendees: 65
    }
  ];
  
  const mentorshipRequests = [
    {
      id: 1,
      name: "Rahul Kumar",
      field: "Software Development",
      message: "Looking for guidance in backend development career paths.",
      image: "https://i.pravatar.cc/150?img=11"
    },
    {
      id: 2,
      name: "Priya Sharma",
      field: "UI/UX Design",
      message: "Need advice on building a strong design portfolio.",
      image: "https://i.pravatar.cc/150?img=26"
    }
  ];
  
  const recommendedConnections = [
    {
      id: 1,
      name: "Amit Gupta",
      role: "Senior Developer at Amazon",
      match: "95% match - Web Development",
      image: "https://i.pravatar.cc/150?img=33"
    },
    {
      id: 2,
      name: "Neha Singh",
      role: "Data Scientist at Microsoft",
      match: "90% match - AI/ML",
      image: "https://i.pravatar.cc/150?img=29"
    },
    {
      id: 3,
      name: "Karan Patel",
      role: "Startup Founder",
      match: "85% match - Entrepreneurship",
      image: "https://i.pravatar.cc/150?img=17"
    }
  ];
  
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
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-rajasthan-blue to-rajasthan-turquoise text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">
                    {isGuest ? 'Welcome, Guest!' : `Welcome back, ${user.name || "Friend"}!`}
                  </h1>
                  <p className="opacity-90">
                    {isGuest 
                      ? "Explore the alumni network without logging in"
                      : "Your alumni network is growing. You have 5 new connection requests."}
                  </p>
                </div>
                <div className="hidden md:block">
                  <img 
                    src="/logo.svg" 
                    alt="Alumni Nexus"
                    className="h-16 w-16 opacity-20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content Area - 2/3 width on desktop */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="bg-white border-none shadow-sm">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="rounded-full bg-rajasthan-blue/10 p-2 mb-2">
                    <Users className="h-5 w-5 text-rajasthan-blue" />
                  </div>
                  <p className="text-2xl font-bold">124</p>
                  <p className="text-xs text-muted-foreground">Connections</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-sm">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="rounded-full bg-rajasthan-saffron/10 p-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-rajasthan-saffron" />
                  </div>
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-xs text-muted-foreground">Unread Messages</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-sm">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="rounded-full bg-rajasthan-turquoise/10 p-2 mb-2">
                    <Calendar className="h-5 w-5 text-rajasthan-turquoise" />
                  </div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Upcoming Events</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-none shadow-sm">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="rounded-full bg-rajasthan-maroon/10 p-2 mb-2">
                    <Bell className="h-5 w-5 text-rajasthan-maroon" />
                  </div>
                  <p className="text-2xl font-bold">7</p>
                  <p className="text-xs text-muted-foreground">Notifications</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Upcoming Events */}
            <Card className="bg-white border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-rajasthan-blue" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted h-10 w-10 flex flex-col items-center justify-center rounded-md text-xs font-medium">
                          <span>{event.date.split(" ")[0]}</span>
                          <span>{event.date.split(" ")[1]}</span>
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{event.location}</span>
                            <span className="mx-1">•</span>
                            <Users className="h-3 w-3 mr-1" />
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/events">View All Events</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Mentorship Requests */}
            <Card className="bg-white border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-rajasthan-blue" />
                  Mentorship Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mentorshipRequests.map(request => (
                    <div key={request.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={request.image} />
                          <AvatarFallback>{request.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{request.name}</p>
                          <p className="text-sm text-muted-foreground">{request.field}</p>
                          <p className="text-xs mt-1">{request.message}</p>
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
          </div>
          
          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
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
                        <p className="font-semibold">0</p>
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
                  <Button className="w-full" variant="outline" asChild>
                    <Link to={`/profile/${user.id}`}>View Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* AI Recommended Connections */}
            <Card className="bg-white border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-rajasthan-blue" />
                  AI-Recommended Connections
                </CardTitle>
                <CardDescription>People you might want to connect with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedConnections.map(connection => (
                    <div key={connection.id} className="flex items-center gap-3 pb-3 border-b last:border-0">
                      <Avatar>
                        <AvatarImage src={connection.image} />
                        <AvatarFallback>{connection.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{connection.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{connection.role}</p>
                        <p className="text-xs text-rajasthan-saffron mt-1">{connection.match}</p>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0">Connect</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/connections">Find More</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Quick Links */}
            <Card className="bg-white border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/forum">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Forums
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/jobs">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Job Board
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/resources">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Resources
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/analytics">
                      <BarChart className="h-4 w-4 mr-2" />
                      Analytics
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/mentorship">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Mentorship
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/recognition">
                      <Award className="h-4 w-4 mr-2" />
                      Recognition
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
