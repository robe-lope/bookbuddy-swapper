
import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookPlus, Upload, BookMarked, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Book, BookCondition } from '@/types';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function PostBook() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('offer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for books to offer
  const [offerBook, setOfferBook] = useState<Partial<Book>>({
    isbn: '',
    title: '',
    author: '',
    genre: '',
    condition: 'good',
    description: '',
    price: null,
    acceptsSwap: true,
  });
  
  // Form state for books wanted
  const [wantedBook, setWantedBook] = useState<Partial<Book>>({
    isbn: '',
    title: '',
    author: '',
    genre: '',
  });
  
  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const genres = ['Classic', 'Science Fiction', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Biography', 'History', 'Philosophy', 'Poetry'];
  
  const conditionOptions: { value: BookCondition; label: string }[] = [
    { value: 'like-new', label: 'Like New' },
    { value: 'very-good', label: 'Very Good' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];
  
  const fetchBookByIsbn = useCallback(async (isbn: string, isOffer: boolean) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await response.json();
      
      if (data.totalItems === 0) {
        toast({
          title: "No book found",
          description: "No book matches that ISBN",
          variant: "destructive",
        });
        return;
      }

      const book = data.items[0].volumeInfo;
      const bookData = {
        isbn,
        title: book.title || '',
        author: book.authors?.[0] || '',
        genre: book.categories?.[0] || '',
      };

      if (isOffer) {
        setOfferBook(prev => ({ ...prev, ...bookData }));
      } else {
        setWantedBook(prev => ({ ...prev, ...bookData }));
      }

      toast({
        title: "Book found",
        description: `Autofilled: ${book.title}`,
      });
      console.log('Book data:', book);
    } catch (error) {
      console.error('Error fetching book data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch book data",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleOfferInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOfferBook(prev => ({ ...prev, [name]: value }));
    if (name === 'isbn' && value.length >= 10) {
      fetchBookByIsbn(value, true);
    }
  };
  
  const handleWantedInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWantedBook(prev => ({ ...prev, [name]: value }));
    if (name === 'isbn' && value.length >= 10) {
      fetchBookByIsbn(value, false);
    }
  };
  
  const handleOfferSelectChange = (name: string, value: string) => {
    setOfferBook(prev => ({ ...prev, [name]: value }));
  };
  
  const handleWantedSelectChange = (name: string, value: string) => {
    setWantedBook(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }
    
    if (!file.type.includes('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };
  
  const validateOfferForm = () => {
    if (!offerBook.title?.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter the book title",
        variant: "destructive",
      });
      return false;
    }
    
    if (!offerBook.author?.trim()) {
      toast({
        title: "Missing author",
        description: "Please enter the book author",
        variant: "destructive",
      });
      return false;
    }
    
    if (!offerBook.genre) {
      toast({
        title: "Missing genre",
        description: "Please select a book genre",
        variant: "destructive",
      });
      return false;
    }
    
    if (!offerBook.condition) {
      toast({
        title: "Missing condition",
        description: "Please select the book condition",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const validateWantedForm = () => {
    if (!wantedBook.title?.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter the book title",
        variant: "destructive",
      });
      return false;
    }
    
    if (!wantedBook.author?.trim()) {
      toast({
        title: "Missing author",
        description: "Please enter the book author",
        variant: "destructive",
      });
      return false;
    }
    
    if (!wantedBook.genre) {
      toast({
        title: "Missing genre",
        description: "Please select a book genre",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const uploadImage = async (file: File) => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('book-images')
        .upload(fileName, file);
        
      if (error) {
        console.error('Storage error:', error);
        throw error;
      }
      
      const { data: urlData } = supabase.storage.from('book-images').getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add a book",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (!validateOfferForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Starting book offer submission process');
      console.log('Current user:', user);
      
      let imageUrl = null;
      if (imageFile) {
        console.log('Uploading image...');
        imageUrl = await uploadImage(imageFile);
        console.log('Image uploaded successfully:', imageUrl);
      }
      
      const bookData = {
        isbn: offerBook.isbn || null,
        title: offerBook.title,
        author: offerBook.author,
        genre: offerBook.genre,
        condition: offerBook.condition,
        description: offerBook.description || null,
        image_url: imageUrl,
        owner_id: user.id,
        is_available: true,
        is_wanted: false,
        is_school_book: false,
        price: offerBook.price ? Number(offerBook.price) : null,
        accepts_swap: offerBook.acceptsSwap
      };
      
      console.log('Submitting book data to Supabase:', bookData);
      
      const { data, error } = await supabase.from('books').insert([bookData]).select();
      
      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to add book: ${error.message}`);
      }
      
      console.log('Book added successfully:', data);
      
      toast({
        title: "Book added successfully",
        description: "Your book has been added to your offers"
      });
      
      // Reset form
      setOfferBook({
        isbn: '',
        title: '',
        author: '',
        genre: '',
        condition: 'good',
        description: '',
        price: null,
        acceptsSwap: true
      });
      setImagePreview(null);
      setImageFile(null);
      
    } catch (error: any) {
      console.error('Error adding book:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add book",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleWantedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add a book",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (!validateWantedForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const bookData = {
        isbn: wantedBook.isbn || null,
        title: wantedBook.title,
        author: wantedBook.author,
        genre: wantedBook.genre,
        description: wantedBook.description || null,
        owner_id: user.id,
        is_available: false,
        is_wanted: true,
        is_school_book: false
      };
      
      const { data, error } = await supabase.from('books').insert([bookData]).select();
      
      if (error) {
        throw new Error(`Failed to add book: ${error.message}`);
      }
      
      toast({
        title: "Book added successfully",
        description: "Your book has been added to your wishlist"
      });
      
      // Reset form
      setWantedBook({
        isbn: '',
        title: '',
        author: '',
        genre: '',
        description: ''
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add book",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-bookswap-cream flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-serif text-bookswap-darkbrown mb-4">Authentication Required</h2>
          <p className="text-bookswap-brown mb-6">Please log in to add or request books.</p>
          <div className="flex space-x-4 justify-center">
            <Button onClick={() => navigate('/login')} className="bg-bookswap-brown hover:bg-bookswap-brown/90">
              Log In
            </Button>
            <Button onClick={() => navigate('/register')} variant="outline" className="border-bookswap-brown text-bookswap-brown">
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bookswap-cream animate-fade-in">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bookswap-darkbrown mb-4">
            Post a Book
          </h1>
          <p className="text-bookswap-brown text-lg">
            Share books you own or add books you're looking for
          </p>
        </div>
        
        <Tabs 
          defaultValue="offer" 
          value={activeTab}
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="bg-bookswap-beige/40 w-full flex p-1 rounded-lg mb-8">
            <TabsTrigger 
              value="offer" 
              className="w-1/2 data-[state=active]:bg-white data-[state=active]:text-bookswap-darkbrown data-[state=active]:shadow-sm rounded-md py-3"
            >
              <BookPlus className="h-4 w-4 mr-2" />
              Books I'm Offering
            </TabsTrigger>
            <TabsTrigger 
              value="want" 
              className="w-1/2 data-[state=active]:bg-white data-[state=active]:text-bookswap-darkbrown data-[state=active]:shadow-sm rounded-md py-3"
            >
              <BookMarked className="h-4 w-4 mr-2" />
              Books I Want
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="offer" className="animate-fade-up">
            <div className="bg-white rounded-lg shadow-sm border border-bookswap-beige p-6">
              <form onSubmit={handleOfferSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="isbn" className="text-bookswap-darkbrown">
                              ISBN <span className="text-gray-500">(optional)</span>
                            </Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter a 10 or 13-digit ISBN to autofill book details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Input
                        id="isbn"
                        name="isbn"
                        value={offerBook.isbn}
                        onChange={handleOfferInputChange}
                        placeholder="Enter the book's ISBN (10 or 13 digits)"
                        className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-bookswap-darkbrown">
                        Book Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={offerBook.title}
                        onChange={handleOfferInputChange}
                        placeholder="Enter the book title"
                        className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="author" className="text-bookswap-darkbrown">
                        Author <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="author"
                        name="author"
                        value={offerBook.author}
                        onChange={handleOfferInputChange}
                        placeholder="Enter the author's name"
                        className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="genre" className="text-bookswap-darkbrown">
                        Genre <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={offerBook.genre} 
                        onValueChange={(value) => handleOfferSelectChange('genre', value)}
                      >
                        <SelectTrigger className="border-bookswap-beige focus:ring-bookswap-brown/20">
                          <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-bookswap-beige">
                          {genres.map(genre => (
                            <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-bookswap-darkbrown">
                        Condition <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup 
                        value={offerBook.condition} 
                        onValueChange={(value) => handleOfferSelectChange('condition', value as BookCondition)}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2"
                      >
                        {conditionOptions.map(option => (
                          <div 
                            key={option.value} 
                            className={`flex items-center space-x-2 border rounded-md p-3 transition-colors ${
                              offerBook.condition === option.value 
                                ? 'border-bookswap-brown bg-bookswap-beige/20' 
                                : 'border-bookswap-beige hover:bg-bookswap-beige/10'
                            }`}
                          >
                            <RadioGroupItem 
                              value={option.value} 
                              id={option.value}
                              className="text-bookswap-brown"
                            />
                            <Label 
                              htmlFor={option.value} 
                              className={`flex-grow cursor-pointer ${
                                offerBook.condition === option.value 
                                  ? 'text-bookswap-darkbrown font-medium' 
                                  : 'text-bookswap-brown'
                              }`}
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="image" className="text-bookswap-darkbrown block">
                        Book Image
                      </Label>
                      
                      {imagePreview ? (
                        <div className="relative rounded-md overflow-hidden border border-bookswap-beige h-48 group">
                          <img 
                            src={imagePreview} 
                            alt="Book preview" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-bookswap-darkbrown/0 group-hover:bg-bookswap-darkbrown/60 transition-colors flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={removeImage}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-bookswap-beige rounded-md h-48 flex flex-col items-center justify-center p-4 hover:bg-bookswap-beige/10 transition-colors">
                          <Upload className="h-8 w-8 text-bookswap-brown mb-2" />
                          <p className="text-sm text-bookswap-brown text-center mb-2">
                            Drag and drop an image or click to browse
                          </p>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-bookswap-beige text-bookswap-darkbrown"
                            onClick={() => document.getElementById('image')?.click()}
                          >
                            Upload Image
                          </Button>
                        </div>
                      )}
                      <p className="text-xs text-bookswap-brown mt-1">
                        Maximum file size: 5MB. Formats: JPG, PNG, GIF
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-bookswap-darkbrown">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={offerBook.description}
                        onChange={handleOfferInputChange}
                        placeholder="Add details about the book's condition, edition, etc."
                        className="border-bookswap-beige focus-visible:ring-bookswap-brown/20 min-h-[120px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-bookswap-darkbrown">
                        Price (optional)
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={offerBook.price ?? ''}
                        onChange={handleOfferInputChange}
                        placeholder="Enter price in your currency (e.g., 500)"
                        className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="acceptsSwap"
                        checked={offerBook.acceptsSwap}
                        onCheckedChange={(checked) => setOfferBook(prev => ({ ...prev, acceptsSwap: !!checked }))}
                      />
                      <Label htmlFor="acceptsSwap" className="text-bookswap-darkbrown">
                        Accept swap for this book
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-bookswap-beige flex justify-end">
                  <Button
                    type="submit"
                    className="bg-bookswap-brown hover:bg-bookswap-brown/90 text-white font-serif"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <BookPlus className="mr-2 h-4 w-4" />
                        Add Book to My Offers
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="want" className="animate-fade-up">
            <div className="bg-white rounded-lg shadow-sm border border-bookswap-beige p-6">
              <form onSubmit={handleWantedSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="wantedTitle" className="text-bookswap-darkbrown">
                      Book Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="wantedTitle"
                      name="title"
                      value={wantedBook.title}
                      onChange={handleWantedInputChange}
                      placeholder="Enter the book title you're looking for"
                      className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="wantedAuthor" className="text-bookswap-darkbrown">
                      Author <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="wantedAuthor"
                      name="author"
                      value={wantedBook.author}
                      onChange={handleWantedInputChange}
                      placeholder="Enter the author's name"
                      className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="wantedGenre" className="text-bookswap-darkbrown">
                      Genre <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={wantedBook.genre} 
                      onValueChange={(value) => handleWantedSelectChange('genre', value)}
                    >
                      <SelectTrigger className="border-bookswap-beige focus:ring-bookswap-brown/20">
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-bookswap-beige">
                        {genres.map(genre => (
                          <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="wantedDescription" className="text-bookswap-darkbrown">
                      Additional Information (Optional)
                    </Label>
                    <Textarea
                      id="wantedDescription"
                      name="description"
                      value={wantedBook.description}
                      onChange={handleWantedInputChange}
                      placeholder="Edition preferences, etc."
                      className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-bookswap-beige flex justify-end">
                  <Button
                    type="submit"
                    className="bg-bookswap-accent hover:bg-bookswap-accent/90 text-white font-serif"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <BookMarked className="mr-2 h-4 w-4" />
                        Add to My Wishlist
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
