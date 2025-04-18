
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil, MapPin, Calendar, Mail, Briefcase, GraduationCap, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { User, UserEducation, UserExperience, UserSkill } from "@/types";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [education, setEducation] = useState<UserEducation[]>([]);
  const [experience, setExperience] = useState<UserExperience[]>([]);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isOwnProfile = currentUser?.id === (userId || currentUser?.id);
  
  // Fetch user profile data
  useEffect(() => {
    const targetUserId = userId || currentUser?.id;
    
    if (!targetUserId) {
      setLoading(false);
      return;
    }
    
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', targetUserId)
          .single();
          
        if (userError) throw userError;
        
        if (!userData) {
          setError('User not found');
          setLoading(false);
          return;
        }
        
        // Fetch education
        const { data: educationData, error: educationError } = await supabase
          .from('user_education')
          .select('*')
          .eq('user_id', targetUserId);
          
        if (educationError) throw educationError;
        
        // Fetch experience
        const { data: experienceData, error: experienceError } = await supabase
          .from('user_experience')
          .select('*')
          .eq('user_id', targetUserId);
          
        if (experienceError) throw experienceError;
        
        // Fetch skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('user_skills')
          .select('*')
          .eq('user_id', targetUserId);
          
        if (skillsError) throw skillsError;
        
        // Transform data to match our types
        const userProfile: User = {
          id: userData.id,
          role: userData.role,
          name: userData.name,
          email: userData.email,
          profileImage: userData.profile_image,
          coverImage: userData.cover_image,
          location: userData.location,
          bio: userData.bio,
          joinDate: userData.join_date,
          education: [],
          experience: [],
          skills: [],
          interests: []
        };
        
        setProfileUser(userProfile);
        setEducation(educationData || []);
        setExperience(experienceData || []);
        setSkills(skillsData || []);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [userId, currentUser?.id]);

  if (loading) {
    return (
      <div className="container py-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rajasthan-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (error || !profileUser) {
    return (
      <div className="container py-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-lg text-muted-foreground">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Profile Header */}
      <Card className="border-none shadow-sm mb-8">
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-rajasthan-blue to-rajasthan-turquoise rounded-t-xl">
          {profileUser.coverImage && (
            <img 
              src={profileUser.coverImage} 
              alt="Cover"
              className="w-full h-full object-cover rounded-t-xl"
            />
          )}
          
          {isOwnProfile && (
            <Button 
              size="sm" 
              variant="secondary"
              className="absolute top-4 right-4"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
          )}
          
          <div className="absolute -bottom-12 left-8">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={profileUser.profileImage} />
              <AvatarFallback className="text-xl">{profileUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <CardContent className="pt-16 pb-6">
          <div className="flex flex-wrap justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{profileUser.name}</h1>
              
              <div className="text-muted-foreground space-y-1 mt-2">
                {profileUser.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{profileUser.location}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{profileUser.email}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Joined {new Date(profileUser.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              {!isOwnProfile && (
                <div className="flex gap-2">
                  <Button>Connect</Button>
                  <Button variant="outline">Send Message</Button>
                </div>
              )}
            </div>
          </div>
          
          {profileUser.bio && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">About</h3>
              <p className="text-muted-foreground">{profileUser.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Profile Tabs */}
      <Tabs defaultValue="experience" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Experience
                </div>
                {isOwnProfile && (
                  <Button size="sm" variant="outline">
                    <Pencil className="h-4 w-4 mr-1" />
                    Add Experience
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {experience.length > 0 ? (
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-6" />}
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{exp.title}</h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(exp.startDate).toLocaleDateString()} - 
                            {exp.isOngoing ? ' Present' : ` ${new Date(exp.endDate!).toLocaleDateString()}`}
                          </p>
                          {exp.description && (
                            <p className="mt-2 text-sm">{exp.description}</p>
                          )}
                        </div>
                        {isOwnProfile && (
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No experience added yet</p>
                  {isOwnProfile && (
                    <Button variant="outline" className="mt-4">
                      Add Experience
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Education
                </div>
                {isOwnProfile && (
                  <Button size="sm" variant="outline">
                    <Pencil className="h-4 w-4 mr-1" />
                    Add Education
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {education.length > 0 ? (
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-6" />}
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-muted-foreground">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground">
                            {edu.startYear} - {edu.isOngoing ? 'Present' : edu.endYear}
                          </p>
                          <p className="text-sm">{edu.fieldOfStudy}</p>
                        </div>
                        {isOwnProfile && (
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <GraduationCap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No education added yet</p>
                  {isOwnProfile && (
                    <Button variant="outline" className="mt-4">
                      Add Education
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Skills
                </div>
                {isOwnProfile && (
                  <Button size="sm" variant="outline">
                    <Pencil className="h-4 w-4 mr-1" />
                    Add Skills
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="px-3 py-1 rounded-full bg-muted text-sm flex items-center gap-1"
                    >
                      {skill.name}
                      <span className="text-xs text-muted-foreground">({skill.level})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No skills added yet</p>
                  {isOwnProfile && (
                    <Button variant="outline" className="mt-4">
                      Add Skills
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
