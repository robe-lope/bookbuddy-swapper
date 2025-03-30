import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Book, Match, mapSupabaseBook, SupabaseMatch } from '@/types';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, signal?: AbortSignal) => Promise<void>;
  register: (email: string, username: string, password: string, userType?: string, signal?: AbortSignal) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  fetchUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (session) {
          await fetchUserProfile();
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setError(error instanceof Error ? error.message : 'An error occurred while retrieving your session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await fetchUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setUser(null);
        return;
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (profileError) throw profileError;
      
      const { data: ownedBooksData, error: ownedBooksError } = await supabase
        .from('books')
        .select('*')
        .eq('owner_id', session.user.id)
        .eq('is_wanted', false);
      if (ownedBooksError) throw ownedBooksError;
      
      const { data: wantedBooksData, error: wantedBooksError } = await supabase
        .from('books')
        .select('*')
        .eq('owner_id', session.user.id)
        .eq('is_wanted', true);
      if (wantedBooksError) throw wantedBooksError;
      
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .or(`user_a_id.eq.${session.user.id},user_b_id.eq.${session.user.id}`);
      if (matchesError) throw matchesError;
      
      const ownedBooks = ownedBooksData ? ownedBooksData.map(mapSupabaseBook) : [];
      const wantedBooks = wantedBooksData ? wantedBooksData.map(mapSupabaseBook) : [];
      
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        username: profileData?.username || '',
        userType: profileData?.user_type || 'individual',
        location: profileData?.location || null,
        createdAt: new Date(profileData?.created_at),
        booksOwned: ownedBooks,
        booksWanted: wantedBooks,
        matches: matchesData as unknown as Match[] || [],
        completedSwaps: [],
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching your profile');
    }
  };

  const login = async (email: string, password: string, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    
    try {
      
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Login timed out after 10 seconds')), 10000)
      );

      const loginPromise = supabase.auth.signInWithPassword({ email, password });

      await Promise.race([loginPromise, timeoutPromise]);
      
      const result = await Promise.race([loginPromise, timeoutPromise]);
      const { error } = await loginPromise; 
      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome back to BookSwap!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string, userType: string = 'individual', signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Registration timed out after 10 seconds')), 10000)
      );

      const registerPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            user_type: userType,
          },
        },
      });


    const result = await Promise.race([registerPromise, timeoutPromise]);


    const { error } = await registerPromise;
    if (error) throw error;

      toast({
        title: "Registration successful",
        description: "Check your email to confirm your account!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during registration';
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Logout failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};