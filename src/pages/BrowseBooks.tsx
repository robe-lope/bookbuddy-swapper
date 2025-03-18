
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, CheckCircle, SlidersHorizontal } from 'lucide-react';
import BookCard from '@/components/BookCard';
import { Book, generateDummyData } from '@/types';
import Navbar from '@/components/Navbar';

export default function BrowseBooks() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [booksData, setBooksData] = useState<Partial<Book>[]>([]);
  const [wantedBooksData, setWantedBooksData] = useState<Partial<Book>[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      const data = generateDummyData();
      setBooksData(data.books);
      setWantedBooksData(data.wantedBooks);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const genres = ['Classic', 'Science Fiction', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Biography', 'History', 'Philosophy', 'Poetry'];
  const conditions = ['like-new', 'very-good', 'good', 'fair', 'poor'];
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
  ];
  
  const filterBooks = (books: Partial<Book>[]) => {
    return books.filter(book => {
      const matchesSearch = 
        searchTerm === '' || 
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        book.author?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = 
        selectedGenre === 'all' || 
        book.genre === selectedGenre;
      
      const matchesCondition = 
        selectedCondition === 'all' || 
        book.condition === selectedCondition;
      
      return matchesSearch && matchesGenre && (matchesCondition || !book.condition);
    }).sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (new Date(b.createdAt!).getTime()) - (new Date(a.createdAt!).getTime());
        case 'oldest':
          return (new Date(a.createdAt!).getTime()) - (new Date(b.createdAt!).getTime());
        case 'title-asc':
          return a.title!.localeCompare(b.title!);
        case 'title-desc':
          return b.title!.localeCompare(a.title!);
        default:
          return 0;
      }
    });
  };
  
  const filteredBooks = filterBooks(booksData);
  const filteredWantedBooks = filterBooks(wantedBooksData);
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('all');
    setSelectedCondition('all');
    setSortBy('newest');
  };
  
  const hasActiveFilters = searchTerm !== '' || selectedGenre !== 'all' || selectedCondition !== 'all';

  return (
    <div className="min-h-screen bg-bookswap-cream animate-fade-in">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-bookswap-darkbrown mb-4">
            Browse Books
          </h1>
          <p className="text-bookswap-brown text-lg max-w-2xl mx-auto">
            Discover books available for swap and find your next read
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-bookswap-beige mb-8 p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-bookswap-brown" />
              </div>
              <Input
                type="text"
                placeholder="Search by title or author"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-bookswap-beige bg-transparent focus-visible:ring-bookswap-brown/20"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-bookswap-beige text-bookswap-darkbrown hover:bg-bookswap-beige/20"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-bookswap-beige text-bookswap-darkbrown hover:bg-bookswap-beige/20"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-bookswap-beige">
                  {sortOptions.map(option => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`text-bookswap-darkbrown hover:bg-bookswap-beige/10 ${sortBy === option.value ? 'font-medium' : ''}`}
                    >
                      {sortBy === option.value && (
                        <CheckCircle className="h-4 w-4 mr-2 text-bookswap-accent" />
                      )}
                      {sortBy !== option.value && (
                        <div className="w-4 mr-2" />
                      )}
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  className="text-bookswap-brown hover:text-bookswap-darkbrown hover:bg-bookswap-beige/20"
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-bookswap-beige animate-fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genre" className="text-bookswap-darkbrown block mb-2">
                    Genre
                  </Label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="border-bookswap-beige bg-transparent focus:ring-bookswap-brown/20">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-bookswap-beige">
                      <SelectItem value="all">All Genres</SelectItem>
                      {genres.map(genre => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="condition" className="text-bookswap-darkbrown block mb-2">
                    Condition
                  </Label>
                  <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                    <SelectTrigger className="border-bookswap-beige bg-transparent focus:ring-bookswap-brown/20">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-bookswap-beige">
                      <SelectItem value="all">Any Condition</SelectItem>
                      {conditions.map(condition => (
                        <SelectItem key={condition} value={condition}>
                          {condition.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Books Grid */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="bg-bookswap-beige/40 w-full sm:w-auto mb-8 flex space-x-2 p-1 rounded-lg">
            <TabsTrigger 
              value="available" 
              className="data-[state=active]:bg-white data-[state=active]:text-bookswap-darkbrown data-[state=active]:shadow-sm rounded-md font-serif"
            >
              Available Books
            </TabsTrigger>
            <TabsTrigger 
              value="wanted" 
              className="data-[state=active]:bg-white data-[state=active]:text-bookswap-darkbrown data-[state=active]:shadow-sm rounded-md font-serif"
            >
              Wanted Books
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="available">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="h-96 bg-white rounded-lg animate-pulse">
                    <div className="h-48 bg-bookswap-beige/30 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-6 bg-bookswap-beige/40 rounded mb-2"></div>
                      <div className="h-4 bg-bookswap-beige/40 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-bookswap-beige/30 rounded w-1/4 mb-4"></div>
                      <div className="h-16 bg-bookswap-beige/20 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-bookswap-beige">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-bookswap-beige/30">
                  <Search className="h-8 w-8 text-bookswap-brown" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-bookswap-darkbrown mb-2">
                  No Books Found
                </h3>
                <p className="text-bookswap-brown">
                  No books match your current search criteria. Try adjusting your filters.
                </p>
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="mt-4 text-bookswap-secondary hover:text-bookswap-secondary/90"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book, index) => (
                  <div 
                    key={book.id} 
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="wanted">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-72 bg-white rounded-lg animate-pulse">
                    <div className="h-48 bg-bookswap-beige/30 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-6 bg-bookswap-beige/40 rounded mb-2"></div>
                      <div className="h-4 bg-bookswap-beige/40 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredWantedBooks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-bookswap-beige">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-bookswap-beige/30">
                  <Search className="h-8 w-8 text-bookswap-brown" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-bookswap-darkbrown mb-2">
                  No Wanted Books Found
                </h3>
                <p className="text-bookswap-brown">
                  No wanted books match your current search criteria. Try adjusting your filters.
                </p>
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="mt-4 text-bookswap-secondary hover:text-bookswap-secondary/90"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredWantedBooks.map((book, index) => (
                  <div 
                    key={book.id} 
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <BookCard book={book} isWanted={true} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Additional Information */}
        <div className="mt-12">
          <Accordion type="single" collapsible className="bg-white rounded-lg border border-bookswap-beige">
            <AccordionItem value="item-1" className="border-b border-bookswap-beige">
              <AccordionTrigger className="px-4 py-4 hover:bg-bookswap-beige/10 text-bookswap-darkbrown font-serif font-medium text-lg">
                How Book Swapping Works
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-bookswap-brown">
                <p className="mb-3">
                  Book swapping on our platform is simple:
                </p>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>
                    <strong className="text-bookswap-darkbrown">Post your books:</strong> Add books you own and are willing to swap, as well as books you're looking for.
                  </li>
                  <li>
                    <strong className="text-bookswap-darkbrown">Find matches:</strong> Our system automatically finds potential swaps when another user has a book you want and vice versa.
                  </li>
                  <li>
                    <strong className="text-bookswap-darkbrown">Arrange the swap:</strong> When a match is found, you'll be notified and can message the other user to arrange the exchange.
                  </li>
                  <li>
                    <strong className="text-bookswap-darkbrown">Complete the swap:</strong> Meet up or mail the books to each other, then mark the swap as complete.
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-b border-bookswap-beige">
              <AccordionTrigger className="px-4 py-4 hover:bg-bookswap-beige/10 text-bookswap-darkbrown font-serif font-medium text-lg">
                Book Condition Guidelines
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-bookswap-brown">
                <div className="space-y-3">
                  <p>
                    We use the following condition ratings for books:
                  </p>
                  <ul className="space-y-2">
                    <li>
                      <strong className="text-bookswap-darkbrown">Like New:</strong> Appears new and unread with no visible defects or marks.
                    </li>
                    <li>
                      <strong className="text-bookswap-darkbrown">Very Good:</strong> Shows slight wear but no tears or marks. Pages may be slightly yellowed.
                    </li>
                    <li>
                      <strong className="text-bookswap-darkbrown">Good:</strong> Some wear visible but all pages intact. May have some highlighting or notes.
                    </li>
                    <li>
                      <strong className="text-bookswap-darkbrown">Fair:</strong> Obvious wear with possible minor damage. May have significant notes or highlighting.
                    </li>
                    <li>
                      <strong className="text-bookswap-darkbrown">Poor:</strong> Significant wear or damage but text complete and readable.
                    </li>
                  </ul>
                  <p>
                    Please be honest about your book's condition to ensure a good experience for all users.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="px-4 py-4 hover:bg-bookswap-beige/10 text-bookswap-darkbrown font-serif font-medium text-lg">
                Popular Genres
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-bookswap-brown">
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <Button
                      key={genre}
                      variant="outline"
                      className="border-bookswap-beige hover:bg-bookswap-beige/20 text-bookswap-darkbrown"
                      onClick={() => setSelectedGenre(genre)}
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
