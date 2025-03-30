
// Import necessary components and hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BookCondition, EducationalLevel } from '@/types';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookPlus, Upload, BookUp, Loader2 } from 'lucide-react';
import { fetchGoogleBookImage } from '@/components/StorageBucket';

// Define the schema for our form
const offerBookSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  isbn: z.string().optional(),
  genre: z.string().min(1, { message: 'Genre is required' }),
  condition: z.enum(['like-new', 'very-good', 'good', 'fair', 'poor']).optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  acceptsSwap: z.boolean().default(false),
  isSchoolBook: z.boolean().default(false),
  educationalLevel: z.enum(['primary', 'secondary', 'high-school', 'university', 'other']).optional(),
  subject: z.string().optional(),
});

const wantBookSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  genre: z.string().min(1, { message: 'Genre is required' }),
  isbn: z.string().optional(),
});

type OfferBookForm = z.infer<typeof offerBookSchema>;
type WantBookForm = z.infer<typeof wantBookSchema>;

const PostBook = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bookImageFile, setBookImageFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('offer');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const offerForm = useForm<OfferBookForm>({
    resolver: zodResolver(offerBookSchema),
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      genre: '',
      description: '',
      price: '',
      acceptsSwap: false,
      isSchoolBook: false,
    },
  });
  
  const wantForm = useForm<WantBookForm>({
    resolver: zodResolver(wantBookSchema),
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      isbn: '',
    },
  });

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/login');
        toast({
          title: "Authentication required",
          description: "You need to log in to post books.",
          variant: "destructive",
        });
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image less than 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    setBookImageFile(file);
    
    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const uploadBookImage = async (userId: string, bookId: string) => {
    if (!bookImageFile) return null;
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      const fileExt = bookImageFile.name.split('.').pop();
      const filePath = `${userId}/${bookId}.${fileExt}`;
      
      setUploadProgress(30);
      
      const { error: uploadError, data } = await supabase.storage
        .from('book-images')
        .upload(filePath, bookImageFile, {
          upsert: true,
          contentType: bookImageFile.type,
        });
      
      setUploadProgress(80);
      
      if (uploadError) {
        throw uploadError;
      }
      
      setUploadProgress(90);
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('book-images')
        .getPublicUrl(filePath);
      
      setUploadProgress(100);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onOfferSubmit = async (data: OfferBookForm) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication error",
          description: "Please log in and try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Convert price from string to number or null
      const priceValue = data.price ? parseFloat(data.price) : null;
      
      // Create book entry
      const { data: book, error } = await supabase
        .from('books')
        .insert({
          title: data.title,
          author: data.author,
          isbn: data.isbn || null,
          genre: data.genre,
          condition: data.condition || null,
          description: data.description || null,
          owner_id: user.id,
          is_available: true,
          is_wanted: false,
          is_school_book: data.isSchoolBook,
          educational_level: data.isSchoolBook ? data.educationalLevel : null,
          subject: data.isSchoolBook ? data.subject : null,
          price: priceValue,
          accepts_swap: data.acceptsSwap,
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Upload image if provided
      let imageUrl = null;
      if (bookImageFile) {
        imageUrl = await uploadBookImage(user.id, book.id);
      } else {
        // Try to get image from Google Books API if no image was uploaded
        imageUrl = await fetchGoogleBookImage(data.title, data.author);
      }
      
      // Update book with image URL if available
      if (imageUrl) {
        const { error: updateError } = await supabase
          .from('books')
          .update({ image_url: imageUrl })
          .eq('id', book.id);
        
        if (updateError) {
          console.error('Error updating book with image URL:', updateError);
        }
      }
      
      toast({
        title: "Book posted!",
        description: "Your book has been successfully added.",
      });
      
      navigate('/browse');
    } catch (error: any) {
      console.error('Error posting book:', error);
      toast({
        title: "Submission failed",
        description: error.message || "There was a problem posting your book.",
        variant: "destructive",
      });
    }
  };

  const onWantSubmit = async (data: WantBookForm) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication error",
          description: "Please log in and try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Create wanted book entry
      const { data: book, error } = await supabase
        .from('books')
        .insert({
          title: data.title,
          author: data.author,
          isbn: data.isbn || null,
          genre: data.genre,
          owner_id: user.id,
          is_available: false,
          is_wanted: true,
          is_school_book: false,
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Book added to wanted list!",
        description: "You'll be notified if someone offers this book.",
      });
      
      navigate('/browse');
    } catch (error: any) {
      console.error('Error adding wanted book:', error);
      toast({
        title: "Submission failed",
        description: error.message || "There was a problem adding your wanted book.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="font-serif text-3xl font-bold text-bookswap-darkbrown mb-6 text-center">
        Post a Book
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="offer" className="flex items-center gap-2">
            <BookPlus className="h-4 w-4" />
            Offer a Book
          </TabsTrigger>
          <TabsTrigger value="want" className="flex items-center gap-2">
            <BookUp className="h-4 w-4" />
            Want a Book
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="offer">
          <Card>
            <CardHeader>
              <CardTitle>Offer a Book</CardTitle>
              <CardDescription>
                Share your book with the community - offer it for sale or swap.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...offerForm}>
                <form onSubmit={offerForm.handleSubmit(onOfferSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <FormField
                        control={offerForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title*</FormLabel>
                            <FormControl>
                              <Input placeholder="Book title" {...field} />
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
                            <FormLabel>Author*</FormLabel>
                            <FormControl>
                              <Input placeholder="Author name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={offerForm.control}
                        name="isbn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ISBN</FormLabel>
                            <FormControl>
                              <Input placeholder="ISBN (optional)" {...field} />
                            </FormControl>
                            <FormDescription>
                              International Standard Book Number
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={offerForm.control}
                        name="genre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Genre*</FormLabel>
                            <FormControl>
                              <Input placeholder="Genre" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <FormField
                        control={offerForm.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condition</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="like-new">Like New</SelectItem>
                                <SelectItem value="very-good">Very Good</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="poor">Poor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={offerForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="Set a price (optional)" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Leave empty if you only want to swap
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={offerForm.control}
                        name="acceptsSwap"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Available for Swap</FormLabel>
                              <FormDescription>
                                Allow others to offer their books in exchange
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="mt-4">
                        <Label htmlFor="bookImage">Book Image</Label>
                        <div className="mt-2 flex items-center gap-4">
                          <Label 
                            htmlFor="bookImage" 
                            className="cursor-pointer flex items-center justify-center gap-2 border border-dashed border-input rounded-md p-4 hover:bg-muted/50 transition-colors"
                          >
                            <Upload className="h-5 w-5" />
                            {bookImageFile ? 'Change Image' : 'Upload Image'}
                          </Label>
                          <Input 
                            id="bookImage" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          
                          {previewUrl && (
                            <div className="relative w-24 h-24 overflow-hidden rounded-md border">
                              <img 
                                src={previewUrl} 
                                alt="Book preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          {!previewUrl && (
                            <div className="text-sm text-muted-foreground">
                              If no image is uploaded, we'll try to find one online
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <FormField
                    control={offerForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide a short description of the book" 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={offerForm.control}
                    name="isSchoolBook"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">School/Educational Book</FormLabel>
                          <FormDescription>
                            Is this a textbook or educational material?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {offerForm.watch('isSchoolBook') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={offerForm.control}
                        name="educationalLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Educational Level</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="primary">Primary School</SelectItem>
                                <SelectItem value="secondary">Secondary School</SelectItem>
                                <SelectItem value="high-school">High School</SelectItem>
                                <SelectItem value="university">University</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
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
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Mathematics, History" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-bookswap-brown hover:bg-bookswap-brown/90"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading... {uploadProgress}%
                      </>
                    ) : (
                      'Post Book'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="want">
          <Card>
            <CardHeader>
              <CardTitle>Want a Book</CardTitle>
              <CardDescription>
                Let the community know you're looking for a specific book.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...wantForm}>
                <form onSubmit={wantForm.handleSubmit(onWantSubmit)} className="space-y-6">
                  <FormField
                    control={wantForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title*</FormLabel>
                        <FormControl>
                          <Input placeholder="Book title" {...field} />
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
                        <FormLabel>Author*</FormLabel>
                        <FormControl>
                          <Input placeholder="Author name" {...field} />
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
                        <FormLabel>Genre*</FormLabel>
                        <FormControl>
                          <Input placeholder="Genre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={wantForm.control}
                    name="isbn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ISBN</FormLabel>
                        <FormControl>
                          <Input placeholder="ISBN (optional)" {...field} />
                        </FormControl>
                        <FormDescription>
                          International Standard Book Number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-bookswap-accent hover:bg-bookswap-accent/90"
                  >
                    Add to Wanted Books
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostBook;
