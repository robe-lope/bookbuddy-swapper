
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
      
      // The bucket is already set to public during creation
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
            title: 'Storage Setup Issue',
            description: 'There was a problem setting up the storage bucket for book images.',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error in bucket check:', error);
        setIsChecking(false);
        toast({
          title: 'Storage Error',
          description: 'Failed to set up storage for book images.',
          variant: 'destructive'
        });
      }
    };
    
    checkBucket();
  }, [toast]);
  
  // This component doesn't render anything visible
  return null;
}
