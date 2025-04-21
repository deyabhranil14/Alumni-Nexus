
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, User, Briefcase, Users, LogOut, LogIn, Menu, X, Moon, Sun, Bot, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isGuest, updateGuestInfo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get first letter of name for avatar fallback
  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };
  
  const handleLogout = async () => {
    const { success } = await logout();
    if (success) {
      navigate("/");
    }
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b py-4 px-6 sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.svg" 
              alt="Alumni Nexus Logo" 
              className="h-8 w-auto mr-2"
            />
            <span className="text-xl font-bold text-rajasthan-blue dark:text-rajasthan-turquoise">
              Alumni Nexus
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/home" className="px-3 py-2 text-sm rounded-md hover:bg-muted dark:hover:bg-gray-800 transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="px-3 py-2 text-sm rounded-md hover:bg-muted dark:hover:bg-gray-800 transition-colors">
              Dashboard
            </Link>
            <Link to="/mentorship" className="px-3 py-2 text-sm rounded-md hover:bg-muted dark:hover:bg-gray-800 transition-colors">
              Mentorship
            </Link>
            <Link to="/network" className="px-3 py-2 text-sm rounded-md hover:bg-muted dark:hover:bg-gray-800 transition-colors">
              Network
            </Link>
            <Link to="/assistant" className="px-3 py-2 text-sm rounded-md hover:bg-muted dark:hover:bg-gray-800 transition-colors">
              AI Assistant
            </Link>
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-rajasthan-blue" />
              )}
            </Button>
            
            {/* Authentication Actions */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0 border">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage || ""} alt={user.name || "User"} />
                      <AvatarFallback className="bg-rajasthan-blue text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-1" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name || "User"}</span>
                      <span className="text-xs text-muted-foreground dark:text-gray-400">{user.email}</span>
                      {isGuest && (
                        <span className="text-xs text-rajasthan-saffron font-medium mt-1">Guest User</span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/network")}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Network</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/assistant")}>
                      <Bot className="mr-2 h-4 w-4" />
                      <span>AI Assistant</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/mentorship")}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Mentorship</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {isGuest ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/login")}>
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Log in</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/register")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Create Account</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden md:inline-flex"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </Button>
                <Button 
                  size="sm"
                  className="hidden md:inline-flex"
                  onClick={() => navigate("/register")}
                >
                  Sign up
                </Button>
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 pb-3 md:hidden">
            <div className="space-y-1">
              <Link 
                to="/home" 
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-muted dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-muted dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/mentorship" 
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-muted dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mentorship
              </Link>
              <Link 
                to="/network" 
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-muted dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Network
              </Link>
              <Link 
                to="/assistant" 
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-muted dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Assistant
              </Link>
              
              {!user && (
                <div className="pt-3 border-t border-muted mt-3 flex flex-col space-y-2">
                  <Button 
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                    variant="outline"
                  >
                    Log in
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate("/register");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
