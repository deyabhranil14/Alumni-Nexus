
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, User, MessageSquare, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type ConnectionStatus = "none" | "pending" | "connected";

type NetworkUser = {
  id: string;
  name: string;
  role: string;
  title?: string;
  company?: string;
  institution?: string;
  course?: string;
  profileImage?: string;
  connectionStatus: ConnectionStatus;
  skills: string[];
};

// Sample data for demonstration
const sampleUsers: NetworkUser[] = [
  {
    id: "user1",
    name: "Dr. Rajesh Kumar",
    role: "faculty",
    title: "Professor",
    company: "IIT Delhi",
    profileImage: "https://i.pravatar.cc/150?img=10",
    connectionStatus: "none",
    skills: ["Machine Learning", "Computer Vision", "Neural Networks"],
  },
  {
    id: "user2",
    name: "Priya Sharma",
    role: "alumni",
    title: "Senior Software Engineer",
    company: "Microsoft",
    profileImage: "https://i.pravatar.cc/150?img=28",
    connectionStatus: "none",
    skills: ["React", "TypeScript", "Cloud Computing"],
  },
  {
    id: "user3",
    name: "Amit Singh",
    role: "student",
    course: "Computer Science",
    institution: "IIIT Hyderabad",
    profileImage: "https://i.pravatar.cc/150?img=15",
    connectionStatus: "none",
    skills: ["Python", "Data Science", "Web Development"],
  },
  {
    id: "user4",
    name: "Neha Reddy",
    role: "alumni",
    title: "Product Manager",
    company: "Amazon",
    profileImage: "https://i.pravatar.cc/150?img=23",
    connectionStatus: "none",
    skills: ["Product Strategy", "UI/UX", "Agile"],
  },
  {
    id: "user5",
    name: "Vikram Verma",
    role: "alumni",
    title: "Startup Founder",
    company: "TechNova",
    profileImage: "https://i.pravatar.cc/150?img=12",
    connectionStatus: "none",
    skills: ["Entrepreneurship", "Business Development", "Leadership"],
  },
  {
    id: "user6",
    name: "Anjali Gupta",
    role: "student",
    course: "Electronics Engineering",
    institution: "Delhi Technological University",
    profileImage: "https://i.pravatar.cc/150?img=25",
    connectionStatus: "none",
    skills: ["Circuit Design", "IoT", "Embedded Systems"],
  },
];

const PeopleConnect = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<NetworkUser[]>(sampleUsers);
  const [filteredUsers, setFilteredUsers] = useState<NetworkUser[]>(sampleUsers);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("networkUsers");
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
        setFilteredUsers(parsedUsers);
      } catch (error) {
        console.error("Error parsing stored users:", error);
        setUsers(sampleUsers);
        setFilteredUsers(sampleUsers);
      }
    }
  }, []);

  // Save to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem("networkUsers", JSON.stringify(users));
  }, [users]);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleConnectionAction = (userId: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          let newStatus: ConnectionStatus = "none";
          let message = "";

          switch (u.connectionStatus) {
            case "none":
              newStatus = "pending";
              message = `Connection request sent to ${u.name}`;
              break;
            case "pending":
              newStatus = "connected";
              message = `You are now connected with ${u.name}`;
              break;
            case "connected":
              newStatus = "none";
              message = `Connection with ${u.name} has been removed`;
              break;
          }

          toast.success(message);
          return { ...u, connectionStatus: newStatus };
        }
        return u;
      })
    );
  };

  const getConnectionButtonText = (status: ConnectionStatus) => {
    switch (status) {
      case "none":
        return (
          <>
            <UserPlus className="h-4 w-4 mr-1" />
            Connect
          </>
        );
      case "pending":
        return "Pending";
      case "connected":
        return "Message";
      default:
        return "Connect";
    }
  };

  const getConnectionButtonVariant = (status: ConnectionStatus): "default" | "outline" | "secondary" => {
    switch (status) {
      case "none":
        return "default";
      case "pending":
        return "secondary";
      case "connected":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Connect with Alumni & Students</h1>
        <p className="text-muted-foreground">
          Expand your network by connecting with alumni, students, and faculty
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, role, company, or skills..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map((networkUser) => (
          <Card key={networkUser.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-3">
                <Avatar className="h-14 w-14">
                  {networkUser.profileImage ? (
                    <AvatarImage src={networkUser.profileImage} alt={networkUser.name} />
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                  <AvatarFallback>{networkUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{networkUser.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {networkUser.title || networkUser.course}{" "}
                    {networkUser.company && `at ${networkUser.company}`}
                    {networkUser.institution && `at ${networkUser.institution}`}
                  </p>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {networkUser.role}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <div className="flex flex-wrap gap-1 mt-2">
                {networkUser.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-between p-3">
              <Button
                variant={getConnectionButtonVariant(networkUser.connectionStatus)}
                size="sm"
                className="flex-1"
                onClick={() => handleConnectionAction(networkUser.id)}
              >
                {getConnectionButtonText(networkUser.connectionStatus)}
              </Button>
              {networkUser.connectionStatus === "connected" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={() => toast.success(`Opening chat with ${networkUser.name}`)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PeopleConnect;
