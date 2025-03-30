
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Send, ChevronRight, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { Book, Match, Message } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';

export default function Matches() {
  const { toast } = useToast();
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  // Mock data
  const [matches, setMatches] = useState<Match[]>([
    {
      id: '1',
      status: 'pending',
      createdAt: new Date(2023, 11, 1),
      messages: [
        {
          id: '1',
          matchId: '1',
          senderId: '2',
          content: 'Hi there! I noticed we have a potential book swap. Are you interested?',
          createdAt: new Date(2023, 11, 1, 12, 30),
          read: true,
        },
        {
          id: '2',
          matchId: '1',
          senderId: '1',
          content: 'Yes, definitely! I\'ve been looking for your book for a while.',
          createdAt: new Date(2023, 11, 1, 12, 45),
          read: true,
        },
        {
          id: '3',
          matchId: '1',
          senderId: '2',
          content: 'Great! Would you prefer to meet up or mail the book?',
          createdAt: new Date(2023, 11, 1, 13, 0),
          read: false,
        },
      ],
      userA: {
        id: '1',
        username: 'BookLover',
        email: 'booklover@example.com',
        createdAt: new Date(),
        booksOwned: [],
        booksWanted: [],
        matches: [],
        completedSwaps: []
      },
      userB: {
        id: '2',
        username: 'PageTurner',
        email: 'pageturner@example.com',
        createdAt: new Date(),
        booksOwned: [],
        booksWanted: [],
        matches: [],
        completedSwaps: []
      },
      bookFromA: {
        id: '1',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Classic',
        condition: 'very-good',
        ownerId: '1',
        isAvailable: true,
        price: 500,
        acceptsSwap: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      bookFromB: {
        id: '7',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        genre: 'Classic',
        condition: 'good',
        ownerId: '2',
        isAvailable: true,
        price: 500,
        acceptsSwap: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    },
    {
      id: '2',
      status: 'pending',
      createdAt: new Date(2023, 10, 15),
      messages: [],
      userA: {
        id: '1',
        username: 'BookLover',
        email: 'booklover@example.com',
        createdAt: new Date(),
        booksOwned: [],
        booksWanted: [],
        matches: [],
        completedSwaps: []
      },
      userB: {
        id: '3',
        username: 'Bibliophile',
        email: 'bibliophile@example.com',
        createdAt: new Date(),
        booksOwned: [],
        booksWanted: [],
        matches: [],
        completedSwaps: []
      },
      bookFromA: {
        id: '4',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        condition: 'fair',
        ownerId: '1',
        isAvailable: true,
        price: 500,
        acceptsSwap: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      bookFromB: {
        id: '8',
        title: 'Lord of the Flies',
        author: 'William Golding',
        genre: 'Classic',
        condition: 'like-new',
        ownerId: '3',
        isAvailable: true,
        price: 500,
        acceptsSwap: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    },
  ]);
  
  const currentUser = { 
    id: '1', 
    username: 'BookLover',
    email: 'booklover@example.com',
    createdAt: new Date(),
    booksOwned: [],
    booksWanted: [],
    matches: [],
    completedSwaps: []
  }; // Mock current user
  
  const handleSendMessage = () => {
    if (!activeMatchId || !newMessage.trim()) return;
    
    // Find the active match
    const matchIndex = matches.findIndex(match => match.id === activeMatchId);
    if (matchIndex === -1) return;
    
    // Create a new message
    const message: Message = {
      id: Date.now().toString(),
      matchId: activeMatchId,
      senderId: currentUser.id,
      content: newMessage.trim(),
      createdAt: new Date(),
      read: false,
    };
    
    // Add the message to the match's messages
    const updatedMatches = [...matches];
    updatedMatches[matchIndex] = {
      ...updatedMatches[matchIndex],
      messages: [...(updatedMatches[matchIndex].messages || []), message],
    };
    
    setMatches(updatedMatches);
    setNewMessage('');
  };
  
  const handleAcceptMatch = (matchId: string) => {
    // Update match status
    const updatedMatches = matches.map(match => 
      match.id === matchId ? { ...match, status: 'accepted' as const } : match
    );
    
    setMatches(updatedMatches);
    
    toast({
      title: "Match accepted",
      description: "You've accepted the match. You can now arrange the swap!",
    });
  };
  
  const handleDeclineMatch = (matchId: string) => {
    // Update match status
    const updatedMatches = matches.map(match => 
      match.id === matchId ? { ...match, status: 'declined' as const } : match
    );
    
    setMatches(updatedMatches);
    
    toast({
      title: "Match declined",
      description: "You've declined the match.",
    });
  };
  
  const handleCompleteSwap = (matchId: string) => {
    // Update match status
    const updatedMatches = matches.map(match => 
      match.id === matchId ? { ...match, status: 'completed' as const } : match
    );
    
    setMatches(updatedMatches);
    
    toast({
      title: "Swap completed",
      description: "Congratulations! The book swap has been marked as completed.",
    });
  };
  
  const getOtherUser = (match: Partial<Match>) => {
    return match.userA?.id === currentUser.id ? match.userB : match.userA;
  };
  
  const getYourBook = (match: Partial<Match>) => {
    return match.userA?.id === currentUser.id ? match.bookFromA : match.bookFromB;
  };
  
  const getTheirBook = (match: Partial<Match>) => {
    return match.userA?.id === currentUser.id ? match.bookFromB : match.bookFromA;
  };
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };
  
  const getStatusText = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      case 'completed':
        return 'Completed';
      case 'pending':
      default:
        return 'Pending';
    }
  };
  
  const activeMatch = matches.find(match => match.id === activeMatchId);

  return (
    <div className="min-h-screen bg-bookswap-cream animate-fade-in">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bookswap-darkbrown mb-4">
            Your Matches
          </h1>
          <p className="text-bookswap-brown text-lg max-w-2xl mx-auto">
            Connect with other readers and arrange your book swaps
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Matches List */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm border border-bookswap-beige overflow-hidden">
              <div className="p-4 border-b border-bookswap-beige">
                <h2 className="font-serif text-lg font-semibold text-bookswap-darkbrown">
                  Your Matches ({matches.length})
                </h2>
              </div>
              
              {matches.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-bookswap-brown opacity-40 mx-auto mb-4" />
                  <h3 className="text-lg font-serif font-semibold text-bookswap-darkbrown mb-2">
                    No Matches Yet
                  </h3>
                  <p className="text-bookswap-brown">
                    You don't have any matches yet. Add more books to increase your chances!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-bookswap-beige max-h-[600px] overflow-y-auto">
                  {matches.map(match => {
                    const otherUser = getOtherUser(match);
                    const theirBook = getTheirBook(match);
                    const hasUnreadMessages = match.messages?.some(
                      msg => !msg.read && msg.senderId !== currentUser.id
                    );
                    
                    return (
                      <div 
                        key={match.id}
                        className={`p-4 hover:bg-bookswap-beige/10 transition-colors cursor-pointer ${
                          activeMatchId === match.id ? 'bg-bookswap-beige/20' : ''
                        }`}
                        onClick={() => setActiveMatchId(match.id!)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-bookswap-beige">
                            <AvatarFallback className="bg-bookswap-brown text-white">
                              {otherUser?.username?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-bookswap-darkbrown truncate">
                                {otherUser?.username || 'User'}
                              </h3>
                              <Badge className={getStatusColor(match.status)}>
                                {getStatusText(match.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-bookswap-brown truncate">
                              Wants: "{theirBook?.title}"
                            </p>
                          </div>
                          
                          {hasUnreadMessages && (
                            <div className="h-2 w-2 rounded-full bg-bookswap-accent"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {/* Chat/Match Details */}
          <div className="lg:col-span-8">
            {!activeMatch ? (
              <div className="bg-white rounded-lg shadow-sm border border-bookswap-beige h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-bookswap-brown opacity-40 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold text-bookswap-darkbrown mb-2">
                    Select a Match
                  </h3>
                  <p className="text-bookswap-brown max-w-md">
                    Select a match from the list to view details and chat with the other user
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-bookswap-beige h-full flex flex-col">
                {/* Match Header */}
                <div className="p-4 border-b border-bookswap-beige">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-bookswap-beige">
                        <AvatarFallback className="bg-bookswap-brown text-white">
                          {getOtherUser(activeMatch)?.username?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-bookswap-darkbrown">
                          {getOtherUser(activeMatch)?.username || 'User'}
                        </h3>
                        <p className="text-xs text-bookswap-brown">
                          Match created: {activeMatch.createdAt?.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(activeMatch.status)}>
                      {getStatusText(activeMatch.status)}
                    </Badge>
                  </div>
                </div>
                
                {/* Books Exchange */}
                <div className="p-4 border-b border-bookswap-beige">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-bookswap-beige overflow-hidden">
                      <CardHeader className="p-3 bg-bookswap-beige/10">
                        <CardTitle className="text-sm font-normal text-bookswap-brown">Your Book</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-10 bg-bookswap-beige/20 flex items-center justify-center rounded">
                            <BookOpen className="h-6 w-6 text-bookswap-brown/60" />
                          </div>
                          <div>
                            <h4 className="font-medium text-bookswap-darkbrown leading-tight">{getYourBook(activeMatch)?.title}</h4>
                            <p className="text-xs text-bookswap-brown">{getYourBook(activeMatch)?.author}</p>
                            <p className="text-xs text-bookswap-brown mt-1">
                              Condition: <span className="font-medium">{getYourBook(activeMatch)?.condition?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-bookswap-beige overflow-hidden">
                      <CardHeader className="p-3 bg-bookswap-beige/10">
                        <CardTitle className="text-sm font-normal text-bookswap-brown">Their Book</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-10 bg-bookswap-beige/20 flex items-center justify-center rounded">
                            <BookOpen className="h-6 w-6 text-bookswap-brown/60" />
                          </div>
                          <div>
                            <h4 className="font-medium text-bookswap-darkbrown leading-tight">{getTheirBook(activeMatch)?.title}</h4>
                            <p className="text-xs text-bookswap-brown">{getTheirBook(activeMatch)?.author}</p>
                            <p className="text-xs text-bookswap-brown mt-1">
                              Condition: <span className="font-medium">{getTheirBook(activeMatch)?.condition?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {activeMatch.status === 'pending' && (
                    <div className="flex gap-3 mt-4 justify-end">
                      <Button 
                        variant="outline" 
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => handleDeclineMatch(activeMatch.id!)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAcceptMatch(activeMatch.id!)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                    </div>
                  )}
                  
                  {activeMatch.status === 'accepted' && (
                    <div className="flex gap-3 mt-4 justify-end">
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleCompleteSwap(activeMatch.id!)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Completed
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 flex flex-col-reverse gap-3 max-h-[300px]">
                  {!activeMatch.messages?.length ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-8 w-8 text-bookswap-brown opacity-40 mx-auto mb-3" />
                      <p className="text-bookswap-brown">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  ) : (
                    activeMatch.messages.slice().reverse().map(message => {
                      const isOwnMessage = message.senderId === currentUser.id;
                      
                      return (
                        <div 
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[75%] rounded-lg p-3 ${
                              isOwnMessage 
                                ? 'bg-bookswap-brown text-white rounded-br-none' 
                                : 'bg-bookswap-beige/30 text-bookswap-darkbrown rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-white/70' : 'text-bookswap-brown'}`}>
                              {new Date(message.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                {/* Message Input */}
                {activeMatch.status !== 'declined' && (
                  <div className="p-3 border-t border-bookswap-beige">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="border-bookswap-beige focus-visible:ring-bookswap-brown/20"
                      />
                      <Button 
                        type="submit" 
                        disabled={!newMessage.trim()}
                        className="bg-bookswap-brown hover:bg-bookswap-brown/90 text-white"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
