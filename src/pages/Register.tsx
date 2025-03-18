
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};
    
    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await register(email, username, password);
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bookswap-cream/80 animate-fade-in">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute w-96 h-96 -top-12 -left-12 bg-bookswap-brown rounded-full blur-3xl"></div>
        <div className="absolute w-96 h-96 -bottom-12 -right-12 bg-bookswap-secondary rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md animate-fade-up">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <BookOpen className="h-8 w-8 text-bookswap-brown group-hover:text-bookswap-secondary transition-colors" />
          <span className="font-serif text-2xl font-semibold text-bookswap-darkbrown">
            BookSwap
          </span>
        </Link>
        
        <Card className="border-bookswap-beige bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-center text-bookswap-darkbrown">Create Your Account</CardTitle>
            <CardDescription className="text-center text-bookswap-brown">
              Join our community of book lovers and start swapping
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="username" 
                  className="text-bookswap-darkbrown"
                >
                  Username
                </Label>
                <div className="input-focus-effect rounded-md border border-bookswap-beige">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="email" 
                  className="text-bookswap-darkbrown"
                >
                  Email
                </Label>
                <div className="input-focus-effect rounded-md border border-bookswap-beige">
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className="text-bookswap-darkbrown"
                >
                  Password
                </Label>
                <div className="input-focus-effect rounded-md border border-bookswap-beige">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="confirmPassword" 
                  className="text-bookswap-darkbrown"
                >
                  Confirm Password
                </Label>
                <div className="input-focus-effect rounded-md border border-bookswap-beige">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
              
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="border-bookswap-beige data-[state=checked]:bg-bookswap-brown data-[state=checked]:border-bookswap-brown"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label 
                    htmlFor="terms" 
                    className="text-sm font-normal text-bookswap-brown"
                  >
                    I agree to the{' '}
                    <Link 
                      to="/terms" 
                      className="font-medium text-bookswap-secondary hover:text-bookswap-secondary/90 transition-colors"
                    >
                      terms and conditions
                    </Link>
                  </Label>
                  {errors.terms && (
                    <p className="text-red-500 text-xs">{errors.terms}</p>
                  )}
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-bookswap-brown hover:bg-bookswap-brown/90 text-white"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full text-sm text-bookswap-brown">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-bookswap-secondary hover:text-bookswap-secondary/90 transition-colors"
              >
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
