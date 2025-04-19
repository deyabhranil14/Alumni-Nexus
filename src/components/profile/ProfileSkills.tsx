
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Pencil } from "lucide-react";
import { UserSkill } from "@/types";

interface ProfileSkillsProps {
  skills: UserSkill[];
  isOwnProfile: boolean;
}

export function ProfileSkills({ skills, isOwnProfile }: ProfileSkillsProps) {
  // Add console log to debug skills rendering
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
            <Button size="sm" variant="outline">
              <Pencil className="h-4 w-4 mr-1" />
              Add Skills
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {skills && skills.length > 0 ? (
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
  );
}
