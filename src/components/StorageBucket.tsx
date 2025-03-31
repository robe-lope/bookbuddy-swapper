
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const fetchGoogleBookImage = async (title: string, author: string): Promise<string | null> => {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
    const data = await response.json();
    
    if (data.items && data.items.length > 0 && data.items[0].volumeInfo.imageLinks) {
      const imageUrl = data.items[0].volumeInfo.imageLinks.thumbnail || 
                        data.items[0].volumeInfo.imageLinks.smallThumbnail;
      
      // Return a high-quality version if available
      return imageUrl ? imageUrl.replace('http://', 'https://').replace('&zoom=1', '') : null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching Google book image:', error);
    return null;
  }
};

export const createBookImagesBucket = async () => {
  try {
    // Check if the bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'book-images');
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket('book-images', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });
      
      if (error) {
        console.error('Error creating book-images bucket:', error);
        return false;
      }
      
      console.log('Book-images bucket created with public access');
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking/creating storage bucket:', error);
    return false;
  }
};

export function StorageBucketSetup() {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkBucket = async () => {
      try {
        const success = await createBookImagesBucket();
        setIsChecking(false);
        
        if (success) {
          console.log('Book images storage bucket is ready');
        } else {
          toast({
            title: "Storage Setup Issue",
            description: "There was a problem setting up the storage bucket for book images.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error in bucket check:', error);
        setIsChecking(false);
        toast({
          title: "Storage Error",
          description: "Failed to set up storage for book images.",
          variant: "destructive"
        });
      }
    };
    
    checkBucket();
  }, [toast]);
  
  // This component doesn't render anything visible
  return null;
}
