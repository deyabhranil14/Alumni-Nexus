import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface UserProfileProps {
  // Add props here if needed
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_year: number;
  end_year?: number;
  is_ongoing: boolean;
}

interface Experience {
  id: string;
  company: string;
  title: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string;
}

const UserProfile: React.FC<UserProfileProps> = () => {
  const { user, isGuest } = useAuth();

  // Mock data for education
  const education: Education[] = [
    {
      id: "1",
      institution: "University of Rajasthan",
      degree: "B.Tech",
      field_of_study: "Computer Science",
      start_year: 2016,
      end_year: 2020,
      is_ongoing: false,
    },
    {
      id: "2",
      institution: "BITS Pilani",
      degree: "M.Tech",
      field_of_study: "Computer Science",
      start_year: 2020,
      is_ongoing: true,
    },
  ];

  // Mock data for experience
  const experience: Experience[] = [
    {
      id: "1",
      company: "Google",
      title: "Software Engineer",
      start_date: "2020-06-01",
      end_date: "2022-06-01",
      is_current: false,
      description: "Worked on the Search team.",
    },
    {
      id: "2",
      company: "Microsoft",
      title: "Software Engineer",
      start_date: "2022-06-01",
      is_current: true,
      description: "Working on the Azure team.",
    },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar_url || ""} alt={user.name || "User Avatar"} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{user.name || "Guest User"}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Education</h3>
            {education.map((edu) => (
              <div key={edu.id} className="mb-4 last:mb-0">
                <h4 className="font-semibold">{edu.institution}</h4>
                <p className="text-muted-foreground">
                  {edu.degree}, {edu.field_of_study}
                </p>
                <p className="text-sm text-muted-foreground">
                  {edu.start_year} - {edu.is_ongoing ? "Present" : edu.end_year}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Experience</h3>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4 last:mb-0">
                <h4 className="font-semibold">{exp.company}</h4>
                <p className="text-muted-foreground">
                  {exp.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}
                </p>
                <p className="text-sm text-muted-foreground">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            {isGuest ? (
              <Button asChild>
                <Link to="/register">Register to Connect</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/settings">Edit Profile</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
