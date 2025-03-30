import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
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
import { Book, BookCondition } from '@/types';
import Navbar from '@/components/Navbar';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Esquema de validación con Zod
const offerBookSchema = z.object({
  isbn: z.string().optional(),
  title: z.string().min(1, { message: 'Book title is required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  genre: z.string().min(1, { message: 'Genre is required' }),
  condition: z.enum(['like-new', 'very-good', 'good', 'fair', 'poor'], { required_error: 'Condition is required' }),
  description: z.string().optional(),
  price: z.number().min(0, { message: 'Price must be positive' }).nullable(),
  acceptsSwap: z.boolean().default(true),
  isSchoolBook: z.boolean().default(false),
  educationalLevel: z.enum(['primary', 'secondary', 'high-school', 'university', 'other']).optional(),
  subject: z.string().optional(),
}).refine(
  (data) => !data.isSchoolBook || (data.educationalLevel && data.subject),
  { message: 'Educational level and subject are required for school books', path: ['educationalLevel'] }
);

const wantBookSchema = z.object({
  isbn: z.string().optional(),
  title: z.string().min(1, { message: 'Book title is required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  genre: z.string().min(1, { message: 'Genre is required' }),
  description: z.string().optional(),
});

type OfferBookForm = z.infer<typeof offerBookSchema>;
type WantBookForm = z.infer<typeof wantBookSchema>;

export default function PostBook() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('offer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Formularios con react-hook-form
  const offerForm = useForm<OfferBookForm>({
    resolver: zodResolver(offerBookSchema),
    defaultValues: {
      isbn: '',
      title: '',
      author: '',
      genre: '',
      condition: 'good',
      description: '',
      price: null,
      acceptsSwap: true,
      isSchoolBook: false,
      educationalLevel: undefined,
      subject: '',
    },
  });

  const wantForm = useForm<WantBookForm>({
    resolver: zodResolver(wantBookSchema),
    defaultValues: {
      isbn: '',
      title: '',
      author: '',
      genre: '',
      description: '',
    },
  });

  const genres = [
    'Ficción', 'No ficción', 'Clásicos', 'Ciencia ficción', 'Fantasía', 'Romance',
    'Misterio', 'Thriller', 'Terror', 'Aventura', 'Histórico', 'Poesía',
    'Ensayo', 'Biografía', 'Autobiografía', 'Filosofía', 'Psicología',
    'Crecimiento personal', 'Educación', 'Infantil', 'Juvenil', 'Arte',
    'Fotografía', 'Cómics', 'Manga', 'Gastronomía', 'Cocina', 'Autoayuda',
    'Negocios', 'Economía', 'Finanzas', 'Espiritualidad', 'Religión', 'Ciencias',
    'Matemáticas', 'Medicina', 'Salud', 'Deportes', 'Viajes', 'Política',
    'Sociología', 'Tecnología', 'Informática', 'Derecho'
  ];

  const conditionOptions: { value: BookCondition; label: string }[] = [
    { value: 'like-new', label: 'Like New' },
    { value: 'very-good', label: 'Very Good' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  const educationalLevels = [
    { value: 'primary', label: 'Primary School' },
    { value: 'secondary', label: 'Secondary School' },
    { value: 'high-school', label: 'High School' },
    { value: 'university', label: 'University' },
    { value: 'other', label: 'Other' },
  ];

  // Fetch por ISBN (del anterior)
  const fetchBookByIsbn = useCallback(async (isbn: string, form: typeof offerForm | typeof wantForm) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await response.json();
      if (data.totalItems === 0) {
        toast({ title: "No book found", description: "No book matches that ISBN", variant: "destructive" });
        return;
      }
      const book = data.items[0].volumeInfo;
      form.setValue('title', book.title || '');
      form.setValue('author', book.authors?.[0] || '');
      form.setValue('genre', book.categories?.[0] || '');
      toast({ title: "Book found", description: `Autofilled: ${book.title}` });
    } catch (error) {
      console.error('Error fetching book data:', error);
      toast({ title: "Error", description: "Failed to fetch book data", variant: "destructive" });
    }
  }, [toast]);

  // Fetch de imagen de Google Books (del nuevo)
  const fetchGoogleBookImage = async (title: string, author: string): Promise<string | null> => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title}+inauthor:${author}`);
      const data = await response.json();
      if (data.totalItems > 0 && data.items[0].volumeInfo.imageLinks?.thumbnail) {
        return data.items[0].volumeInfo.imageLinks.thumbnail;
      }
      return null;
    } catch (error) {
      console.error('Error fetching Google Book image:', error);
      return null;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please select an image under 5MB", variant: "destructive" });
      return;
    }
    if (!file.type.includes('image/')) {
      toast({ title: "Invalid file type", description: "Please select an image file", variant: "destructive" });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const uploadImage = async (file: File, userId: string, bookId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${bookId}.${fileExt}`;
      const { error } = await supabase.storage
        .from('book-images')
        .upload(filePath, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from('book-images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const onOfferSubmit = async (data: OfferBookForm) => {
    if (!user) {
      toast({ title: "Authentication required", description: "Please log in to add a book", variant: "destructive" });
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;
      const { data: book, error } = await supabase
        .from('books')
        .insert({
          isbn: data.isbn || null,
          title: data.title,
          author: data.author,
          genre: data.genre,
          condition: data.condition,
          description: data.description || null,
          owner_id: user.id,
          is_available: true,
          is_wanted: false,
          is_school_book: data.isSchoolBook,
          educational_level: data.isSchoolBook ? data.educationalLevel : null,
          subject: data.isSchoolBook ? data.subject : null,
          price: data.price,
          accepts_swap: data.acceptsSwap,
        })
        .select()
        .single();

      if (error) throw error;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, user.id, book.id);
      } else {
        imageUrl = await fetchGoogleBookImage(data.title, data.author);
      }

      if (imageUrl) {
        await supabase.from('books').update({ image_url: imageUrl }).eq('id', book.id);
      }

      toast({ title: "Book added successfully", description: "Your book has been added to your offers" });
      navigate('/browse');
    } catch (error: any) {
      console.error('Error adding book:', error);
      toast({ title: "Error", description: error.message || "Failed to add book", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onWantSubmit = async (data: WantBookForm) => {
    if (!user) {
      toast({ title: "Authentication required", description: "Please log in to add a book", variant: "destructive" });
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('books')
        .insert({
          isbn: data.isbn || null,
          title: data.title,
          author: data.author,
          genre: data.genre,
          description: data.description || null,
          owner_id: user.id,
          is_available: false,
          is_wanted: true,
          is_school_book: false,
        });

      if (error) throw error;

      toast({ title: "Book added successfully", description: "Your book has been added to your wishlist" });
      navigate('/browse');
    } catch (error: any) {
      console.error('Error adding book:', error);
      toast({ title: "Error", description: error.message || "Failed to add book", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              <Form {...offerForm}>
                <form onSubmit={offerForm.handleSubmit(onOfferSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <FormField
                        control={offerForm.control}
                        name="isbn"
                        render={({ field }) => (
                          <FormItem>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel className="text-bookswap-darkbrown">
                                    ISBN <span className="text-gray-500">(optional)</span>
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Enter a 10 or 13-digit ISBN to autofill book details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter the book's ISBN (10 or 13 digits)"
                                className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (e.target.value.length >= 10) fetchBookByIsbn(e.target.value, offerForm);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={offerForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-bookswap-darkbrown">
                              Book Title <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter the book title"
                                className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={offerForm.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-bookswap-darkbrown">
                              Author <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter the author's name"
                                className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={offerForm.control}
                        name="genre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-bookswap-darkbrown">
                              Genre <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-bookswap-beige focus:ring-bookswap-brown/20">
                                  <SelectValue placeholder="Select a genre" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white border-bookswap-beige">
                                {genres.map(genre => (
                                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={offerForm.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-bookswap-darkbrown">
                              Condition <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2"
                              >
                                {conditionOptions.map(option => (
                                  <div 
                                    key={option.value} 
                                    className={`flex items-center space-x-2 border rounded-md p-3 transition-colors ${
                                      field.value === option.value 
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
                                        field.value === option.value 
                                          ? 'text-bookswap-darkbrown font-medium' 
                                          : 'text-bookswap-brown'
                                      }`}
                                    >
                                      {option.label}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="image" className="text-bookswap-darkbrown block">
                          Book Image
                        </Label>
                        {imagePreview ? (
                          <div className="relative rounded-md overflow-hidden border border-bookswap-beige h-48 group">
                            <img src={imagePreview} alt="Book preview" className="w-full h-full object-cover" />
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

                      <FormField
                        control={offerForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-bookswap-darkbrown">Description</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Add details about the book's condition, edition, etc."
                                className="border-bookswap-beige focus-visible:ring-bookswap-brown/20 min-h-[120px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={offerForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-bookswap-darkbrown">Price (optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                placeholder="Enter price in your currency (e.g., 500)"
                                className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={offerForm.control}
                        name="acceptsSwap"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 pt-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-bookswap-darkbrown">
                              Accept swap for this book
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={offerForm.control}
                        name="isSchoolBook"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 pt-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-bookswap-darkbrown">
                              This is a school/educational book
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      {offerForm.watch('isSchoolBook') && (
                        <div className="space-y-6">
                          <FormField
                            control={offerForm.control}
                            name="educationalLevel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-bookswap-darkbrown">
                                  Educational Level <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="border-bookswap-beige focus:ring-bookswap-brown/20">
                                      <SelectValue placeholder="Select a level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-white border-bookswap-beige">
                                    {educationalLevels.map(level => (
                                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={offerForm.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-bookswap-darkbrown">
                                  Subject <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="e.g., Mathematics, History"
                                    className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
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
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="want" className="animate-fade-up">
            <div className="bg-white rounded-lg shadow-sm border border-bookswap-beige p-6">
              <Form {...wantForm}>
                <form onSubmit={wantForm.handleSubmit(onWantSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={wantForm.control}
                      name="isbn"
                      render={({ field }) => (
                        <FormItem>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <FormLabel className="text-bookswap-darkbrown">
                                  ISBN <span className="text-gray-500">(optional)</span>
                                </FormLabel>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Enter a 10 or 13-digit ISBN to autofill book details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter the book's ISBN (10 or 13 digits)"
                              className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                              onChange={(e) => {
                                field.onChange(e);
                                if (e.target.value.length >= 10) fetchBookByIsbn(e.target.value, wantForm);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={wantForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-bookswap-darkbrown">
                            Book Title <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter the book title you're looking for"
                              className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={wantForm.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-bookswap-darkbrown">
                            Author <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter the author's name"
                              className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={wantForm.control}
                      name="genre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-bookswap-darkbrown">
                            Genre <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-bookswap-beige focus:ring-bookswap-brown/20">
                                <SelectValue placeholder="Select a genre" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-bookswap-beige">
                              {genres.map(genre => (
                                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={wantForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-bookswap-darkbrown">
                            Additional Information (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Edition preferences, etc."
                              className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
              </Form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}