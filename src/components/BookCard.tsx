
import { useState } from 'react';
import { Book, BookCondition } from '@/types';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BookCardProps {
  book: Partial<Book>;
  showActions?: boolean;
  isWanted?: boolean;
}

const getConditionColor = (condition?: BookCondition) => {
  switch (condition) {
    case 'like-new':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'very-good':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'good':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'fair':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'poor':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getConditionText = (condition?: BookCondition) => {
  switch (condition) {
    case 'like-new':
      return 'Like New';
    case 'very-good':
      return 'Very Good';
    case 'good':
      return 'Good';
    case 'fair':
      return 'Fair';
    case 'poor':
      return 'Poor';
    default:
      return 'Unknown';
  }
};

export default function BookCard({ book, showActions = true, isWanted = false }: BookCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Handle image loading errors (especially for Google Books API urls)
  const handleImageError = () => {
    console.log('Image failed to load:', book.image_url);
    setImageError(true);
  };

  const hasValidImage = book.image_url && !imageError;

  return (
    <>
      <Card className="book-card overflow-hidden h-full flex flex-col transition-all duration-300 bg-white border-bookswap-beige hover:border-bookswap-brown">
        <CardContent className="p-0 flex-grow flex flex-col">
          <div className="relative">
            {!isWanted && hasValidImage ? (
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={book.image_url} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                  onError={handleImageError}
                />
                {book.condition && (
                  <Badge className={`absolute top-2 right-2 ${getConditionColor(book.condition)}`}>
                    {getConditionText(book.condition)}
                  </Badge>
                )}
                {book.price !== null && book.price !== undefined && (
                  <Badge className="absolute bottom-2 left-2 bg-bookswap-brown text-white">
                    {formatPrice(book.price)}
                  </Badge>
                )}
                {book.acceptsSwap && (
                  <Badge className="absolute bottom-2 right-2 bg-bookswap-accent text-white">
                    Swap Available
                  </Badge>
                )}
              </div>
            ) : (
              <div className="h-48 bg-bookswap-beige/30 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-bookswap-brown/40" />
                {isWanted && (
                  <Badge className="absolute top-2 right-2 bg-bookswap-accent text-white">
                    Wanted
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="p-4 flex-grow flex flex-col">
            <h3 className="font-serif font-medium text-lg leading-tight line-clamp-2 mb-1">
              {book.title}
            </h3>
            <p className="text-sm text-bookswap-brown mb-2">{book.author}</p>
            
            <div className="flex flex-wrap gap-1 mt-1 mb-3">
              <Badge variant="outline" className="bg-bookswap-cream text-bookswap-darkbrown border-bookswap-beige text-xs">
                {book.genre}
              </Badge>
            </div>
            
            {book.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
                {book.description}
              </p>
            )}
          </div>
        </CardContent>
        
        {showActions && (
          <CardFooter className="px-4 py-3 border-t border-bookswap-beige flex justify-between">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-9 px-3 text-bookswap-darkbrown hover:text-bookswap-darkbrown hover:bg-bookswap-beige/20"
                >
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-bookswap-beige sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl text-bookswap-darkbrown">
                    {book.title}
                  </DialogTitle>
                  <DialogDescription className="text-bookswap-brown">
                    By {book.author}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 mt-2">
                  {!isWanted && hasValidImage && (
                    <div className="max-h-64 overflow-hidden rounded-md">
                      <img 
                        src={book.image_url} 
                        alt={book.title} 
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline" className="bg-bookswap-cream text-bookswap-darkbrown border-bookswap-beige">
                      {book.genre}
                    </Badge>
                    {!isWanted && book.condition && (
                      <Badge className={getConditionColor(book.condition)}>
                        {getConditionText(book.condition)}
                      </Badge>
                    )}
                    {book.price !== null && book.price !== undefined && (
                      <Badge className="bg-bookswap-brown text-white">
                        {formatPrice(book.price)}
                      </Badge>
                    )}
                    {book.acceptsSwap && (
                      <Badge className="bg-bookswap-accent text-white">
                        Swap Available
                      </Badge>
                    )}
                  </div>
                  
                  {book.description && (
                    <p className="text-bookswap-darkbrown">
                      {book.description}
                    </p>
                  )}
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      className="bg-bookswap-brown text-white hover:bg-bookswap-brown/90"
                    >
                      {isWanted ? "I Have This Book" : "I Want This Book"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-9 w-9 rounded-full ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-bookswap-brown hover:text-bookswap-brown/70'} hover:bg-bookswap-beige/20`}
              onClick={toggleLike}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </CardFooter>
        )}
      </Card>
    </>
  );
}
