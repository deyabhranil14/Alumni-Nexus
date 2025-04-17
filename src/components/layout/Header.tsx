
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell,
  MessageSquare,
  Search,
  Menu,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const isMobile = useIsMobile();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // This would come from auth context in a real app
  
  // Temporary function to toggle login state for demo purposes
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-rajasthan-blue p-1">
              <img 
                src="/logo.svg" 
                alt="Alumni Nexus" 
                className="h-8 w-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/32/1E40AF/FFFFFF?text=AN";
                }}
              />
            </div>
            <span className="font-bold text-rajasthan-blue text-xl hidden sm:inline-block">
              Alumni Nexus
            </span>
          </Link>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search alumni, students, posts..."
              className="w-full rounded-full border border-input bg-background pl-8 pr-4 py-2 text-sm ring-offset-background"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-rajasthan-blue hover:bg-rajasthan-blue/90" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          ) : (
            <>
              {/* Icons - Condensed on mobile */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rajasthan-saffron"></span>
                <span className="sr-only">Notifications</span>
              </Button>
              <Button variant="ghost" size="icon" className="relative hidden md:flex">
                <MessageSquare className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rajasthan-saffron"></span>
                <span className="sr-only">Messages</span>
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                      <AvatarFallback>RK</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleLogin}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
        </div>
      </div>
    </header>
  );
}

export default Header;
