import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { User, UserEducation, UserExperience, UserSkill, UserRole } from "@/types";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileEducation } from "./ProfileEducation";
import { ProfileExperience } from "./ProfileExperience";
import { ProfileSkills } from "./ProfileSkills";

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
        
        const { data: educationData, error: educationError } = await supabase
          .from('user_education')
          .select('*')
          .eq('user_id', targetUserId);
          
        if (educationError) throw educationError;
        
        const { data: experienceData, error: experienceError } = await supabase
          .from('user_experience')
          .select('*')
          .eq('user_id', targetUserId);
          
        if (experienceError) throw experienceError;
        
        const { data: skillsData, error: skillsError } = await supabase
          .from('user_skills')
          .select('*')
          .eq('user_id', targetUserId);
          
        if (skillsError) throw skillsError;
        
        const userProfile: User = {
          id: userData.id,
          role: userData.role as UserRole,
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
        
        const transformedEducation: UserEducation[] = educationData ? educationData.map(edu => ({
          degree: edu.degree,
          institution: edu.institution,
          fieldOfStudy: edu.field_of_study,
          startYear: edu.start_year,
          endYear: edu.end_year,
          isOngoing: edu.is_ongoing
        })) : [];
        
        const transformedExperience: UserExperience[] = experienceData ? experienceData.map(exp => ({
          title: exp.title,
          company: exp.company,
          location: exp.location,
          startDate: exp.start_date,
          endDate: exp.end_date,
          isOngoing: exp.is_ongoing,
          description: exp.description || ""
        })) : [];
        
        const transformedSkills: UserSkill[] = skillsData ? skillsData.map(skill => ({
          name: skill.name,
          level: skill.level as "beginner" | "intermediate" | "advanced" | "expert"
        })) : [];
        
        setEducation(transformedEducation);
        setExperience(transformedExperience);
        setSkills(transformedSkills);
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
      <Card className="border-none shadow-sm mb-8">
        <ProfileHeader user={profileUser} isOwnProfile={isOwnProfile} />
        
        <CardContent className="pt-16 pb-6">
          {profileUser.bio && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">About</h3>
              <p className="text-muted-foreground">{profileUser.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="experience" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="experience">
          <ProfileExperience experience={experience} isOwnProfile={isOwnProfile} />
        </TabsContent>
        
        <TabsContent value="education">
          <ProfileEducation education={education} isOwnProfile={isOwnProfile} />
        </TabsContent>
        
        <TabsContent value="skills">
          <ProfileSkills skills={skills} isOwnProfile={isOwnProfile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
