
export type User = {
  id: string;
  email: string;
  username: string;
  userType?: string;
  location?: string | null;
  createdAt: Date;
  booksOwned: Book[];
  booksWanted: Book[];
  matches: Match[];
  completedSwaps: Swap[];
};

export type BookCondition = 'like-new' | 'very-good' | 'good' | 'fair' | 'poor';
export type EducationalLevel = 'primary' | 'secondary' | 'high-school' | 'university' | 'other';

// Adjusted to match Supabase column names with camelCase for frontend usage
export type Book = {
  id: string;
  isbn?: string;
  title: string;
  author: string;
  genre: string;
  condition?: BookCondition;
  description?: string;
  imageUrl?: string;
  ownerId: string; // Matches owner_id in Supabase
  isAvailable: boolean; // Matches is_available in Supabase
  isWanted?: boolean; // Matches is_wanted in Supabase
  isSchoolBook?: boolean; // Matches is_school_book in Supabase
  educationalLevel?: EducationalLevel;
  subject?: string;
  createdAt: Date; // Matches created_at in Supabase
  updatedAt: Date; // Matches updated_at in Supabase
};

// This is what we'll use internally in our app
export type Match = {
  id: string;
  userA: User;
  userB: User;
  bookFromA: Book;
  bookFromB: Book;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: Date;
  messages: Message[];
};

// This maps to what we get directly from Supabase
export type SupabaseMatch = {
  id: string;
  user_a_id: string;
  user_b_id: string;
  book_from_a_id: string;
  book_from_b_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  matchId: string; // Matches match_id in Supabase
  senderId: string; // Matches sender_id in Supabase
  content: string;
  createdAt: Date; // Matches created_at in Supabase
  read: boolean;
};

export type Swap = {
  id: string;
  matchId: string;
  userA: User;
  userB: User;
  bookFromA: Book;
  bookFromB: Book;
  completedAt: Date;
  rating?: number;
  review?: string;
};

// Convert Supabase response to frontend types
export const mapSupabaseBook = (book: any): Book => ({
  id: book.id,
  isbn: book.isbn,
  title: book.title,
  author: book.author,
  genre: book.genre,
  condition: book.condition as BookCondition,
  description: book.description,
  imageUrl: book.image_url,
  ownerId: book.owner_id,
  isAvailable: book.is_available,
  isWanted: book.is_wanted,
  isSchoolBook: book.is_school_book,
  educationalLevel: book.educational_level as EducationalLevel,
  subject: book.subject,
  createdAt: new Date(book.created_at),
  updatedAt: new Date(book.updated_at)
});

// For now, we'll use dummy data with these interfaces
export const generateDummyData = () => {
  const users: Partial<User>[] = [
    { id: '1', username: 'bookworm', email: 'bookworm@example.com' },
    { id: '2', username: 'pagelover', email: 'pagelover@example.com' },
    { id: '3', username: 'bibliophile', email: 'bibliophile@example.com' },
  ];

  const books: Partial<Book>[] = [
    {
      id: '1',
      isbn: '9780061120084',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Classic',
      condition: 'very-good',
      description: 'A classic novel about racial inequality in the American South.',
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800',
      ownerId: '1',
      isAvailable: true,
      createdAt: new Date(2023, 5, 15),
      updatedAt: new Date(2023, 5, 15),
    },
    {
      id: '2',
      title: 'The Great Gatsby',
      isbn: '9780743273565',
      author: 'F. Scott Fitzgerald',
      genre: 'Classic',
      condition: 'good',
      description: 'The story of eccentric millionaire Jay Gatsby.',
      imageUrl: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=800',
      ownerId: '2',
      isAvailable: true,
      createdAt: new Date(2023, 6, 10),
      updatedAt: new Date(2023, 6, 10),
    },
    {
      id: '3',
      title: 'Dune',
      author: 'Frank Herbert',
      genre: 'Science Fiction',
      condition: 'like-new',
      description: 'The epic science fiction masterpiece.',
      imageUrl: 'https://images.unsplash.com/photo-1609866138210-84bb689f3c61?q=80&w=800',
      ownerId: '3',
      isAvailable: true,
      createdAt: new Date(2023, 7, 5),
      updatedAt: new Date(2023, 7, 5),
    },
    {
      id: '4',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      genre: 'Romance',
      condition: 'fair',
      description: 'A romantic novel about Elizabeth Bennet and Mr. Darcy.',
      imageUrl: 'https://images.unsplash.com/photo-1614955223913-1b231ffc7c5a?q=80&w=800',
      ownerId: '1',
      isAvailable: true,
      createdAt: new Date(2023, 8, 20),
      updatedAt: new Date(2023, 8, 20),
    },
    {
      id: '5',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasy',
      condition: 'good',
      description: 'A fantasy novel about Bilbo Baggins.',
      imageUrl: 'https://images.unsplash.com/photo-1550399504-8953e1a6f6a5?q=80&w=800',
      ownerId: '2',
      isAvailable: true,
      createdAt: new Date(2023, 9, 1),
      updatedAt: new Date(2023, 9, 1),
    },
    {
      id: '6',
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian',
      condition: 'very-good',
      description: 'A dystopian novel about totalitarianism.',
      imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800',
      ownerId: '3',
      isAvailable: true,
      createdAt: new Date(2023, 10, 15),
      updatedAt: new Date(2023, 10, 15),
    },
  ];

  const wantedBooks: Partial<Book>[] = [
    {
      id: '7',
      isbn: '9780316769488',
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      genre: 'Classic',
      ownerId: '2',
      isAvailable: false,
      createdAt: new Date(2023, 5, 20),
      updatedAt: new Date(2023, 5, 20),
    },
    {
      id: '8',
      title: 'Lord of the Flies',
      author: 'William Golding',
      genre: 'Classic',
      ownerId: '1',
      isAvailable: false,
      createdAt: new Date(2023, 6, 15),
      updatedAt: new Date(2023, 6, 15),
    },
    {
      id: '9',
      title: 'Brave New World',
      author: 'Aldous Huxley',
      genre: 'Dystopian',
      ownerId: '3',
      isAvailable: false,
      createdAt: new Date(2023, 7, 10),
      updatedAt: new Date(2023, 7, 10),
    },
  ];

  const matches: Partial<Match>[] = [
    {
      id: '1',
      status: 'pending',
      createdAt: new Date(2023, 11, 1),
    },
  ];

  return {
    users,
    books,
    wantedBooks,
    matches,
  };
};
