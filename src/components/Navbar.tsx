
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X, User, MessageSquare, Search, Home, PlusCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Mock authentication state - In a real app, this would come from an auth context
  const isAuthenticated = false;
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bookswap-cream/80 backdrop-blur-md border-b border-bookswap-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <BookOpen className="h-6 w-6 text-bookswap-brown group-hover:text-bookswap-secondary transition-colors" />
            <span className="font-serif text-xl font-semibold text-bookswap-darkbrown">
              BookSwap
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant={isActive('/') ? "default" : "ghost"}
                className={`text-bookswap-darkbrown hover:text-bookswap-darkbrown ${isActive('/') ? 'bg-bookswap-beige hover:bg-bookswap-beige/90' : 'hover:bg-bookswap-beige/20'}`}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/browse">
              <Button 
                variant={isActive('/browse') ? "default" : "ghost"}
                className={`text-bookswap-darkbrown hover:text-bookswap-darkbrown ${isActive('/browse') ? 'bg-bookswap-beige hover:bg-bookswap-beige/90' : 'hover:bg-bookswap-beige/20'}`}
              >
                <Search className="mr-2 h-4 w-4" />
                Browse
              </Button>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/post-book">
                  <Button 
                    variant={isActive('/post-book') ? "default" : "ghost"}
                    className={`text-bookswap-darkbrown hover:text-bookswap-darkbrown ${isActive('/post-book') ? 'bg-bookswap-beige hover:bg-bookswap-beige/90' : 'hover:bg-bookswap-beige/20'}`}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Post Book
                  </Button>
                </Link>
                <Link to="/matches">
                  <Button 
                    variant={isActive('/matches') ? "default" : "ghost"}
                    className={`text-bookswap-darkbrown hover:text-bookswap-darkbrown ${isActive('/matches') ? 'bg-bookswap-beige hover:bg-bookswap-beige/90' : 'hover:bg-bookswap-beige/20'}`}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Matches
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button 
                    variant={isActive('/profile') ? "default" : "ghost"}
                    className={`text-bookswap-darkbrown hover:text-bookswap-darkbrown ${isActive('/profile') ? 'bg-bookswap-beige hover:bg-bookswap-beige/90' : 'hover:bg-bookswap-beige/20'}`}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant={isActive('/login') ? "default" : "ghost"}
                    className={`text-bookswap-darkbrown hover:text-bookswap-darkbrown ${isActive('/login') ? 'bg-bookswap-beige hover:bg-bookswap-beige/90' : 'hover:bg-bookswap-beige/20'}`}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    variant="default"
                    className="bg-bookswap-brown hover:bg-bookswap-brown/90 text-white"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </nav>
        )}
        
        {/* Mobile Menu Trigger */}
        {isMobile && (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
                <Menu className="h-5 w-5 text-bookswap-darkbrown" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-bookswap-cream border-l border-bookswap-beige p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-bookswap-beige flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-bookswap-brown" />
                    <span className="font-serif text-lg font-semibold text-bookswap-darkbrown">
                      BookSwap
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5 text-bookswap-darkbrown" />
                  </Button>
                </div>
                
                <nav className="flex flex-col p-4 gap-2">
                  <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      variant={isActive('/') ? "default" : "ghost"}
                      className={`w-full justify-start text-bookswap-darkbrown hover:text-bookswap-darkbrown ${isActive('/') ? 'bg-bookswap-beige hover:bg-bookswap-beige/90' : 'hover:bg-bookswap-beige/20'}`}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Button>
                  </Link>
                  <Link to="/browse" onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      variant={isActive('/browse') ? "default" : "ghost"}
                      className={`w-full justify-start text-bookswap-darkbrown hover:text-bookswap-darkbrown ${isActive('/browse') ? 'bg-bookswap-beige hover:bg-bookswap-beige/90' : 'hover:bg-bookswap-beige/20'}`}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Browse
                    </Button>
                  </Link>
                  
                  {isAuthenticated ? (
                    <>
                      <Link to="/post-book" onClick={() => setIsMenuOpen(false)}>
                        <Button 
                          variant={isActive('/post-book') ? "default" : "ghost"}
                          className={`w-full justify-start text-bookswap-darkbrown hover:text-bookswap-darkbrown ${isActive('/post-book') ? 'bg-bookswap-beige hover:bg-bookswap-beige/90' : 'hover:bg-bookswap-beige/20'}`}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Post Book
                        </Button>
                      </Link>
                      <Link to="/matches" onClick={() => setIsMenuOpen(false)}>
                        <Button 
                          variant={isActive('/matches') ? "default" : "ghost"}
                          className={`w-full justify-start text-bookswap-darkbrown hover:text-bookswap-darkbrown ${isActive('/matches') ? 'bg-bookswap-beige hover:bg-bookswap-beige/90' : 'hover:bg-bookswap-beige/20'}`}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Matches
                        </Button>
                      </Link>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        <Button 
                          variant={isActive('/profile') ? "default" : "ghost"}
                          className={`w-full justify-start text-bookswap-darkbrown hover:text-bookswap-darkbrown ${isActive('/profile') ? 'bg-bookswap-beige hover:bg-bookswap-beige/90' : 'hover:bg-bookswap-beige/20'}`}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button 
                          variant={isActive('/login') ? "default" : "ghost"}
                          className={`w-full justify-start text-bookswap-darkbrown hover:text-bookswap-darkbrown ${isActive('/login') ? 'bg-bookswap-beige hover:bg-bookswap-beige/90' : 'hover:bg-bookswap-beige/20'}`}
                        >
                          Login
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button 
                          variant="default"
                          className="w-full justify-start bg-bookswap-brown hover:bg-bookswap-brown/90 text-white"
                        >
                          Register
                        </Button>
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
