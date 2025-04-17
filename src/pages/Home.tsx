
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Users, Calendar, MessageSquare, Award, TrendingUp, Briefcase } from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rajasthan-blue to-rajasthan-turquoise py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('/network-pattern.svg')] opacity-10"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Connect, Share, Grow with Alumni Nexus
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Bridging the gap between alumni and students of Technical Education Department, Rajasthan for mentorship, networking, and career guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-rajasthan-blue hover:bg-white/90" asChild>
                  <Link to="/register">Join the Network</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/hero-image.png" 
                alt="Students and Alumni connecting"
                className="rounded-lg shadow-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x400/1E40AF/FFFFFF?text=Alumni+Nexus";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center p-4">
              <p className="text-3xl md:text-4xl font-bold text-rajasthan-blue">5000+</p>
              <p className="text-sm md:text-base text-muted-foreground">Registered Alumni</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl md:text-4xl font-bold text-rajasthan-blue">12000+</p>
              <p className="text-sm md:text-base text-muted-foreground">Current Students</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl md:text-4xl font-bold text-rajasthan-blue">800+</p>
              <p className="text-sm md:text-base text-muted-foreground">Mentorship Connections</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl md:text-4xl font-bold text-rajasthan-blue">250+</p>
              <p className="text-sm md:text-base text-muted-foreground">Events Organized</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rajasthan-blue mb-4">How Alumni Nexus Helps You</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides tools and resources to foster meaningful connections and professional growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-none shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-rajasthan-blue/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-rajasthan-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Networking</h3>
                <p className="text-muted-foreground">
                  Connect with alumni and peers who share your interests and career goals for valuable professional relationships.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-rajasthan-saffron/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-rajasthan-saffron" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mentorship</h3>
                <p className="text-muted-foreground">
                  Get guidance from experienced alumni who've walked your path and can offer real-world insights and advice.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-rajasthan-turquoise/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-rajasthan-turquoise" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Career Guidance</h3>
                <p className="text-muted-foreground">
                  Access resources, job opportunities, and professional development tools to advance your career path.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Events and Forum Preview */}
      <section className="py-16">
        <div className="container">
          <Tabs defaultValue="events" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-rajasthan-blue">Latest Updates</h2>
              <TabsList>
                <TabsTrigger value="events">Upcoming Events</TabsTrigger>
                <TabsTrigger value="discussions">Recent Discussions</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="events" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Event cards would be dynamically generated in a real application */}
                <Card>
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-rajasthan-saffron mb-1">Jun 15, 2025 • Virtual</div>
                    <h3 className="font-semibold text-lg mb-2">Tech Career Expo 2025</h3>
                    <p className="text-sm text-muted-foreground mb-4">Join industry leaders and alumni for discussions on emerging tech careers.</p>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-rajasthan-saffron mb-1">Jul 8, 2025 • Jaipur</div>
                    <h3 className="font-semibold text-lg mb-2">Annual Alumni Meetup</h3>
                    <p className="text-sm text-muted-foreground mb-4">Network with fellow alumni and celebrate achievements from the past year.</p>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-rajasthan-saffron mb-1">Aug 22, 2025 • Virtual</div>
                    <h3 className="font-semibold text-lg mb-2">AI & ML Workshop Series</h3>
                    <p className="text-sm text-muted-foreground mb-4">Hands-on workshops led by alumni working in artificial intelligence.</p>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link to="/events">View All Events</Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="discussions" className="mt-0">
              <div className="space-y-4">
                {/* Forum discussions would be dynamically generated in a real application */}
                <Card className="p-4">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-muted h-10 w-10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">Transitioning from Academia to Industry</h3>
                        <p className="text-xs text-muted-foreground">Started by Rajat K. • 2d ago • 15 replies</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-muted h-10 w-10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">Advice for Internships in Software Development</h3>
                        <p className="text-xs text-muted-foreground">Started by Priya S. • 3d ago • 24 replies</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-muted h-10 w-10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">Emerging Tech Opportunities in Rajasthan</h3>
                        <p className="text-xs text-muted-foreground">Started by Amit G. • 4d ago • 8 replies</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </Card>
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link to="/forum">Visit Forum</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Success Stories */}
      <section className="py-16 bg-gradient-to-r from-rajasthan-blue to-rajasthan-turquoise text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Hear from students and alumni who have benefited from our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-none text-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="rounded-full bg-white/10 p-1">
                    <img
                      src="https://i.pravatar.cc/100?img=32"
                      alt="Ankit S."
                      className="h-12 w-12 rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ankit S.</h3>
                    <p className="text-sm opacity-80">Software Engineer at Google</p>
                    <p className="text-xs opacity-70">Alumni, 2020</p>
                  </div>
                </div>
                <p className="italic opacity-90">
                  "The mentorship I received through Alumni Nexus helped me prepare for technical interviews and secure my dream job at Google. I'm now giving back by mentoring current students."
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-none text-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="rounded-full bg-white/10 p-1">
                    <img
                      src="https://i.pravatar.cc/100?img=26"
                      alt="Meera R."
                      className="h-12 w-12 rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">Meera R.</h3>
                    <p className="text-sm opacity-80">AI Research Scientist</p>
                    <p className="text-xs opacity-70">Alumni, 2018</p>
                  </div>
                </div>
                <p className="italic opacity-90">
                  "The networking events organized through Alumni Nexus connected me with researchers in my field, leading to collaborations that advanced my career in AI research."
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-none text-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="rounded-full bg-white/10 p-1">
                    <img
                      src="https://i.pravatar.cc/100?img=60"
                      alt="Rahul T."
                      className="h-12 w-12 rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">Rahul T.</h3>
                    <p className="text-sm opacity-80">Entrepreneur & Founder</p>
                    <p className="text-xs opacity-70">Student, Final Year</p>
                  </div>
                </div>
                <p className="italic opacity-90">
                  "As a student, the guidance from alumni entrepreneurs helped me launch my startup. Their experience navigating challenges was invaluable to my success."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-rajasthan-blue mb-4">Ready to Connect?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our community of alumni and students to network, mentor, and grow together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-rajasthan-blue hover:bg-rajasthan-blue/90" asChild>
                <Link to="/register">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/explore">Explore Platform</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
