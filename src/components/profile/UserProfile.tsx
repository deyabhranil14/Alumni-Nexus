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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProfileEditForm } from "./ProfileEditForm";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, isGuest } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [education, setEducation] = useState<UserEducation[]>([]);
  const [experience, setExperience] = useState<UserExperience[]>([]);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const isOwnProfile = currentUser?.id === (userId || currentUser?.id);
  
  useEffect(() => {
    const targetUserId = userId || currentUser?.id;
    
    if (!targetUserId) {
      setLoading(false);
      // For guests with no userId param, use the current guest user
      if (isGuest && !userId && currentUser) {
        setProfileUser(currentUser);
        setLoading(false);
      }
      return;
    }
    
    // If viewing own guest profile
    if (isGuest && !userId) {
      setProfileUser(currentUser);
      setLoading(false);
      return;
    }
    
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select()
          .eq('id', targetUserId)
          .single();
          
        if (userError) throw userError;
        
        if (!userData) {
          setError('User not found');
          setLoading(false);
          return;
        }
        
        // Fetch education data
        const { data: educationData, error: educationError } = await supabase
          .from('user_education')
          .select()
          .eq('user_id', targetUserId);
          
        if (educationError) throw educationError;
        
        // Fetch experience data
        const { data: experienceData, error: experienceError } = await supabase
          .from('user_experience')
          .select()
          .eq('user_id', targetUserId);
          
        if (experienceError) throw experienceError;
        
        // Fetch skills data
        const { data: skillsData, error: skillsError } = await supabase
          .from('user_skills')
          .select()
          .eq('user_id', targetUserId);
          
        if (skillsError) throw skillsError;
        
        // Create user profile object
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
        
        // Transform education data
        const transformedEducation: UserEducation[] = educationData ? educationData.map(edu => ({
          degree: edu.degree,
          institution: edu.institution,
          fieldOfStudy: edu.field_of_study,
          startYear: edu.start_year,
          endYear: edu.end_year,
          isOngoing: edu.is_ongoing
        })) : [];
        
        // Transform experience data
        const transformedExperience: UserExperience[] = experienceData ? experienceData.map(exp => ({
          title: exp.title,
          company: exp.company,
          location: exp.location || "",
          startDate: exp.start_date,
          endDate: exp.end_date,
          isOngoing: exp.is_ongoing,
          description: exp.description || ""
        })) : [];
        
        // Transform skills data
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
    
    // Only fetch from database if not guest viewing own profile
    if (!(isGuest && currentUser?.id === targetUserId)) {
      fetchProfile();
    }
  }, [userId, currentUser?.id, isGuest, currentUser]);

  const handleProfileUpdate = async (updatedData: Partial<User>) => {
    if (!profileUser?.id) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updatedData.name,
          bio: updatedData.bio,
          location: updatedData.location,
          profile_image: updatedData.profileImage,
          cover_image: updatedData.coverImage
        })
        .eq('id', profileUser.id);
        
      if (error) throw error;
      
      // Update local state
      setProfileUser({
        ...profileUser,
        ...updatedData
      });
      
      setEditDialogOpen(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleAddEducation = async (education: UserEducation) => {
    if (!profileUser?.id) return;
    
    try {
      const { error } = await supabase
        .from('user_education')
        .insert({
          user_id: profileUser.id,
          institution: education.institution,
          degree: education.degree,
          field_of_study: education.fieldOfStudy,
          start_year: education.startYear,
          end_year: education.endYear,
          is_ongoing: education.isOngoing
        });
        
      if (error) throw error;
      
      // Refresh education data
      const { data, error: fetchError } = await supabase
        .from('user_education')
        .select()
        .eq('user_id', profileUser.id);
        
      if (fetchError) throw fetchError;
      
      const transformedEducation: UserEducation[] = data ? data.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        fieldOfStudy: edu.field_of_study,
        startYear: edu.startYear,
        endYear: edu.endYear,
        isOngoing: edu.isOngoing
      })) : [];
      
      setEducation(transformedEducation);
      toast.success("Education added successfully");
    } catch (error) {
      console.error("Error adding education:", error);
      toast.error("Failed to add education");
    }
  };

  const handleAddExperience = async (experience: UserExperience) => {
    if (!profileUser?.id) return;
    
    try {
      const { error } = await supabase
        .from('user_experience')
        .insert({
          user_id: profileUser.id,
          title: experience.title,
          company: experience.company,
          location: experience.location,
          start_date: experience.startDate,
          end_date: experience.endDate,
          is_ongoing: experience.isOngoing,
          description: experience.description
        });
        
      if (error) throw error;
      
      // Refresh experience data
      const { data, error: fetchError } = await supabase
        .from('user_experience')
        .select()
        .eq('user_id', profileUser.id);
        
      if (fetchError) throw fetchError;
      
      const transformedExperience: UserExperience[] = data ? data.map(exp => ({
        title: exp.title,
        company: exp.company,
        location: exp.location || "",
        startDate: exp.start_date,
        endDate: exp.end_date,
        isOngoing: exp.is_ongoing,
        description: exp.description || ""
      })) : [];
      
      setExperience(transformedExperience);
      toast.success("Experience added successfully");
    } catch (error) {
      console.error("Error adding experience:", error);
      toast.error("Failed to add experience");
    }
  };

  const handleAddSkill = async (skill: UserSkill) => {
    if (!profileUser?.id) return;
    
    try {
      const { error } = await supabase
        .from('user_skills')
        .insert({
          user_id: profileUser.id,
          name: skill.name,
          level: skill.level
        });
        
      if (error) throw error;
      
      // Refresh skills data
      const { data, error: fetchError } = await supabase
        .from('user_skills')
        .select()
        .eq('user_id', profileUser.id);
        
      if (fetchError) throw fetchError;
      
      const transformedSkills: UserSkill[] = data ? data.map(skill => ({
        name: skill.name,
        level: skill.level as "beginner" | "intermediate" | "advanced" | "expert"
      })) : [];
      
      setSkills(transformedSkills);
      toast.success("Skill added successfully");
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
    }
  };

  // Add a logging statement to help with debugging
  console.log("UserProfile rendering state:", { 
    loading, 
    error, 
    profileUser: profileUser?.id, 
    currentUser: currentUser?.id,
    isGuest, 
    userId, 
    isOwnProfile,
    skillsCount: skills.length 
  });

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
    <motion.div 
      className="container py-8"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <motion.div variants={fadeIn}>
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300 mb-8">
            <ProfileHeader
              user={profileUser}
              isOwnProfile={isOwnProfile}
              onEditClick={() => setEditDialogOpen(true)}
            />
            
            <CardContent className="pt-16 pb-6">
              {profileUser.bio ? (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">About</h3>
                  <p className="text-muted-foreground">{profileUser.bio}</p>
                </div>
              ) : isOwnProfile ? (
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground mb-2">Add a bio to tell others about yourself</p>
                  <Button variant="outline" onClick={() => setEditDialogOpen(true)}>Add Bio</Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>
        
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          {isOwnProfile && (
            <ProfileEditForm 
              user={profileUser} 
              onSave={handleProfileUpdate}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <motion.div variants={fadeIn}>
        <Tabs defaultValue="experience" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          
          <TabsContent value="experience">
            <ProfileExperience 
              experience={experience} 
              isOwnProfile={isOwnProfile} 
              onAddExperience={handleAddExperience}
            />
          </TabsContent>
          
          <TabsContent value="education">
            <ProfileEducation 
              education={education} 
              isOwnProfile={isOwnProfile} 
              onAddEducation={handleAddEducation}
            />
          </TabsContent>
          
          <TabsContent value="skills">
            <ProfileSkills 
              skills={skills} 
              isOwnProfile={isOwnProfile} 
              onAddSkill={handleAddSkill}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
