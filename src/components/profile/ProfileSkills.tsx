
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Pencil } from "lucide-react";
import { UserSkill } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface ProfileSkillsProps {
  skills: UserSkill[];
  isOwnProfile: boolean;
  onAddSkill?: (skill: UserSkill) => Promise<void>;
}

export function ProfileSkills({ skills = [], isOwnProfile, onAddSkill }: ProfileSkillsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  console.log("ProfileSkills - Rendering with skills:", skills);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Skills
          </div>
          {isOwnProfile && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setDialogOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Add Skills
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Array.isArray(skills) && skills.length > 0 ? (
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
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setDialogOpen(true)}
              >
                Add Skills
              </Button>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Add Skills Dialog */}
      {isOwnProfile && onAddSkill && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Skill</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Simple placeholder for the skill form */}
              <p className="text-muted-foreground">Skill form would go here</p>
              <Separator />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  // This is a placeholder - in a real implementation, you'd collect form data
                  const demoSkill: UserSkill = {
                    name: "Example Skill",
                    level: "intermediate"
                  };
                  onAddSkill(demoSkill).then(() => {
                    setDialogOpen(false);
                  });
                }}>Add Skill</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
