
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, MapPin, Mail, Calendar } from "lucide-react";
import { User } from "@/types";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  return (
    <div className="relative h-48 md:h-64 bg-gradient-to-r from-rajasthan-blue to-rajasthan-turquoise rounded-t-xl">
      {user.coverImage && (
        <img 
          src={user.coverImage} 
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
          <AvatarImage src={user.profileImage} />
          <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="absolute bottom-4 left-40 text-white">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <div className="flex items-center gap-4 text-sm mt-1">
          {user.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{user.location}</span>
            </div>
          )}
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-1" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
