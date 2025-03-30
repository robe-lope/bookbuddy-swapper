
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  BookMarked, 
  MessageSquare, 
  History, 
  Settings, 
  Edit, 
  LogOut, 
  Trash2 
} from 'lucide-react';
import BookCard from '@/components/BookCard';
import { Book, Match, mapSupabaseBook } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [ownedBooks, setOwnedBooks] = useState<Book[]>([]);
  const [wantedBooks, setWantedBooks] = useState<Book[]>([]);
  const [matches, setMatches] = useState<Partial<Match>[]>([
    // Dejamos matches mockeado por ahora
    {
      id: '1',
      status: 'pending',
      createdAt: new Date(2023, 11, 1),
    },
  ]);
  
  const [completedSwaps, setCompletedSwaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserBooks = async (userId: string) => {
    try {
      // Libros ofrecidos
      const { data: ownedData, error: ownedError } = await supabase
        .from('books')
        .select('*')
        .eq('owner_id', userId)
        .eq('is_available', true);

      if (ownedError) throw ownedError;

      // Libros deseados
      const { data: wantedData, error: wantedError } = await supabase
        .from('books')
        .select('*')
        .eq('owner_id', userId)
        .eq('is_wanted', true);

      if (wantedError) throw wantedError;

      const ownedBooksData = ownedData.map(mapSupabaseBook);
      const wantedBooksData = wantedData.map(mapSupabaseBook);

      setOwnedBooks(ownedBooksData);
      setWantedBooks(wantedBooksData);
    } catch (error: any) { // Usamos Error como tipo, como resolvimos antes
      console.error('Error fetching user books:', error.message);
      toast({
        title: "Error",
        description: "Failed to load your books",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserBooks(user.id);
    } else {
      setIsLoading(false); // Si no hay usuario, no intentamos cargar
    }
  }, [user]);
  

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/');
  };
  
  const handleRemoveBook = async (id: string, isWanted: boolean) => {
    try {
      // Eliminamos el libro de Supabase
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)
        .eq('owner_id', user.id);

      if (error) throw error;

      // Actualizamos el estado local
      if (isWanted) {
        setWantedBooks(current => current.filter(book => book.id !== id));
      } else {
        setOwnedBooks(current => current.filter(book => book.id !== id));
      }
      
      toast({
        title: "Book removed",
        description: `The book has been removed from your ${isWanted ? 'wishlist' : 'offers'}`,
      });
    } catch (error: any) {
      console.error('Error removing book:', error.message);
      toast({
        title: "Error",
        description: "Failed to remove the book",
        variant: "destructive",
      });
    }
  };

  // If the user is not authenticated, redirect to login
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bookswap-cream animate-fade-in">
        <div className="bg-white p-8 rounded-lg shadow-md border border-bookswap-beige max-w-md w-full text-center">
          <BookOpen className="h-12 w-12 text-bookswap-brown mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-bookswap-darkbrown mb-4">
            Login Required
          </h2>
          <p className="text-bookswap-brown mb-6">
            You need to be logged in to view your profile.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button className="bg-bookswap-brown text-white hover:bg-bookswap-brown/90">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="border-bookswap-brown text-bookswap-darkbrown hover:bg-bookswap-beige/20">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bookswap-cream animate-fade-in">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-bookswap-beige p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-2 border-bookswap-beige">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="bg-bookswap-brown text-white text-xl">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-grow text-center md:text-left">
              <h1 className="font-serif text-3xl font-bold text-bookswap-darkbrown mb-2">
                {user.username || 'BookLover'}
              </h1>
              <p className="text-bookswap-brown mb-4">
                {user.email || 'user@example.com'}
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                <Badge className="bg-bookswap-beige text-bookswap-darkbrown">
                  {ownedBooks.length} Books Offered
                </Badge>
                <Badge className="bg-bookswap-beige text-bookswap-darkbrown">
                  {wantedBooks.length} Books Wanted
                </Badge>
                <Badge className="bg-bookswap-beige text-bookswap-darkbrown">
                  {completedSwaps.length} Completed Swaps
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-bookswap-beige text-bookswap-darkbrown hover:bg-bookswap-beige/20"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-bookswap-beige text-bookswap-darkbrown hover:bg-bookswap-beige/20"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </div>
            
            <div className="hidden md:block border-l border-bookswap-beige pl-6">
              <div className="text-center space-y-4">
                <div>
                  <div className="text-3xl font-bold text-bookswap-brown">{ownedBooks.length + wantedBooks.length}</div>
                  <div className="text-sm text-bookswap-brown">Total Books</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-bookswap-brown">{matches.length}</div>
                  <div className="text-sm text-bookswap-brown">Active Matches</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <Tabs defaultValue="my-books" className="w-full">
          <TabsList className="bg-bookswap-beige/40 w-full grid grid-cols-4 p-1 rounded-lg mb-8">
            <TabsTrigger 
              value="my-books" 
              className="data-[state=active]:bg-white data-[state=active]:text-bookswap-darkbrown data-[state=active]:shadow-sm rounded-md py-3"
            >
              <BookOpen className="h-4 w-4 mr-2 hidden md:inline-block" />
              My Books
            </TabsTrigger>
            <TabsTrigger 
              value="wishlist" 
              className="data-[state=active]:bg-white data-[state=active]:text-bookswap-darkbrown data-[state=active]:shadow-sm rounded-md py-3"
            >
              <BookMarked className="h-4 w-4 mr-2 hidden md:inline-block" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger 
              value="matches" 
              className="data-[state=active]:bg-white data-[state=active]:text-bookswap-darkbrown data-[state=active]:shadow-sm rounded-md py-3"
            >
              <MessageSquare className="h-4 w-4 mr-2 hidden md:inline-block" />
              Matches
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-white data-[state=active]:text-bookswap-darkbrown data-[state=active]:shadow-sm rounded-md py-3"
            >
              <History className="h-4 w-4 mr-2 hidden md:inline-block" />
              History
            </TabsTrigger>
          </TabsList>
          
          {/* My Books Tab */}
          <TabsContent value="my-books" className="animate-fade-up">
            <div className="bg-white rounded-lg shadow-sm border border-bookswap-beige p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-bookswap-darkbrown">
                  Books I'm Offering
                </h2>
                <Link to="/post-book">
                  <Button className="bg-bookswap-brown hover:bg-bookswap-brown/90 text-white">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Add Book
                  </Button>
                </Link>
              </div>
              
              {ownedBooks.length === 0 ? (
                <div className="text-center py-12 bg-bookswap-beige/10 rounded-lg border border-dashed border-bookswap-beige">
                  <BookOpen className="h-12 w-12 text-bookswap-brown opacity-40 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold text-bookswap-darkbrown mb-2">
                    No Books Added Yet
                  </h3>
                  <p className="text-bookswap-brown mb-6 max-w-md mx-auto">
                    You haven't added any books to swap yet. Start by adding books you're willing to trade!
                  </p>
                  <Link to="/post-book">
                    <Button className="bg-bookswap-brown hover:bg-bookswap-brown/90 text-white">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Add Your First Book
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownedBooks.map((book) => (
                    <div key={book.id} className="group relative">
                      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleRemoveBook(book.id!, false)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <BookCard book={book} showActions={false} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="animate-fade-up">
            <div className="bg-white rounded-lg shadow-sm border border-bookswap-beige p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-bookswap-darkbrown">
                  Books I Want
                </h2>
                <Link to="/post-book?tab=want">
                  <Button className="bg-bookswap-accent hover:bg-bookswap-accent/90 text-white">
                    <BookMarked className="mr-2 h-4 w-4" />
                    Add Book
                  </Button>
                </Link>
              </div>
              
              {wantedBooks.length === 0 ? (
                <div className="text-center py-12 bg-bookswap-beige/10 rounded-lg border border-dashed border-bookswap-beige">
                  <BookMarked className="h-12 w-12 text-bookswap-brown opacity-40 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold text-bookswap-darkbrown mb-2">
                    No Wanted Books Added
                  </h3>
                  <p className="text-bookswap-brown mb-6 max-w-md mx-auto">
                    You haven't added any books to your wishlist yet. Start by adding books you're looking for!
                  </p>
                  <Link to="/post-book?tab=want">
                    <Button className="bg-bookswap-accent hover:bg-bookswap-accent/90 text-white">
                      <BookMarked className="mr-2 h-4 w-4" />
                      Add Book to Wishlist
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wantedBooks.map((book) => (
                    <div key={book.id} className="group relative">
                      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleRemoveBook(book.id!, true)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <BookCard book={book} showActions={false} isWanted={true} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Matches Tab */}
          <TabsContent value="matches" className="animate-fade-up">
            <div className="bg-white rounded-lg shadow-sm border border-bookswap-beige p-6">
              <h2 className="font-serif text-2xl font-bold text-bookswap-darkbrown mb-6">
                Your Matches
              </h2>
              
              {matches.length === 0 ? (
                <div className="text-center py-12 bg-bookswap-beige/10 rounded-lg border border-dashed border-bookswap-beige">
                  <MessageSquare className="h-12 w-12 text-bookswap-brown opacity-40 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold text-bookswap-darkbrown mb-2">
                    No Matches Yet
                  </h3>
                  <p className="text-bookswap-brown mb-6 max-w-md mx-auto">
                    You don't have any matches yet. Add more books to your collection and wishlist to increase your chances of finding a match!
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link to="/post-book">
                      <Button className="bg-bookswap-brown hover:bg-bookswap-brown/90 text-white">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Add Book to Offer
                      </Button>
                    </Link>
                    <Link to="/post-book?tab=want">
                      <Button className="bg-bookswap-accent hover:bg-bookswap-accent/90 text-white">
                        <BookMarked className="mr-2 h-4 w-4" />
                        Add Book to Wishlist
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <Link to="/matches">
                  <Button className="w-full justify-center py-8 bg-bookswap-beige/20 hover:bg-bookswap-beige/30 text-bookswap-darkbrown border border-dashed border-bookswap-beige">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    View {matches.length} Active Matches
                  </Button>
                </Link>
              )}
            </div>
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history" className="animate-fade-up">
            <div className="bg-white rounded-lg shadow-sm border border-bookswap-beige p-6">
              <h2 className="font-serif text-2xl font-bold text-bookswap-darkbrown mb-6">
                Swap History
              </h2>
              
              <div className="text-center py-12 bg-bookswap-beige/10 rounded-lg border border-dashed border-bookswap-beige">
                <History className="h-12 w-12 text-bookswap-brown opacity-40 mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold text-bookswap-darkbrown mb-2">
                  No Completed Swaps Yet
                </h3>
                <p className="text-bookswap-brown mb-6 max-w-md mx-auto">
                  You haven't completed any swaps yet. Once you complete a swap, it will appear in your history.
                </p>
                <Link to="/browse">
                  <Button className="bg-bookswap-brown hover:bg-bookswap-brown/90 text-white">
                    Browse Available Books
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
