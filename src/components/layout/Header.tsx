
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell,
  MessageSquare,
  Search,
  Menu,
  User,
  Users,
  Globe,
  MessageSquare as Chat,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function Header() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, logout, isGuest, updateGuestInfo } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for "${searchQuery}"...`);
      // In a real app, this would navigate to search results
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="pb-6">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="grid gap-4">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted"
                    onClick={() => (document.querySelector('.close-button') as HTMLButtonElement)?.click()}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/network" 
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted"
                    onClick={() => (document.querySelector('.close-button') as HTMLButtonElement)?.click()}
                  >
                    <Users className="h-4 w-4" />
                    Network
                  </Link>
                  <Link 
                    to="/mentorship" 
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted"
                    onClick={() => (document.querySelector('.close-button') as HTMLButtonElement)?.click()}
                  >
                    Mentorship
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted"
                    onClick={() => (document.querySelector('.close-button') as HTMLButtonElement)?.click()}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
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
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/network">
                <Globe className="h-4 w-4 mr-2" />
                Network
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/mentorship">Mentorship</Link>
            </Button>
          </div>
        </div>

        <div className={`${isSearchOpen ? 'flex' : 'hidden'} md:flex flex-1 max-w-md mx-4`}>
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alumni, students, posts..."
              className="w-full rounded-full border border-input bg-background pl-8 pr-4 py-2 text-sm ring-offset-background"
            />
          </form>
        </div>
        
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rajasthan-saffron"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/network?tab=assistant">
              <Chat className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rajasthan-saffron"></span>
              <span className="sr-only">AI Assistant</span>
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImage || undefined} alt={user?.name} />
                  <AvatarFallback>{isGuest ? <User size={16} /> : user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{isGuest ? "Guest User" : user?.name || "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/network">Network</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isGuest ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register">Register</Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Header;
