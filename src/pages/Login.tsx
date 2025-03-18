
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
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await login(email, password);
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
            <CardTitle className="font-serif text-2xl text-center text-bookswap-darkbrown">Welcome Back</CardTitle>
            <CardDescription className="text-center text-bookswap-brown">
              Log in to your account to continue your book swapping journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label 
                    htmlFor="password" 
                    className="text-bookswap-darkbrown"
                  >
                    Password
                  </Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-bookswap-brown hover:text-bookswap-secondary transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="input-focus-effect rounded-md border border-bookswap-beige">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
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
                    Logging in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-bookswap-brown text-center">
              For demo, use:
              <div className="text-bookswap-darkbrown font-medium">
                Email: user@example.com | Password: password
              </div>
            </div>
            <div className="text-center text-sm text-bookswap-brown">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-bookswap-secondary hover:text-bookswap-secondary/90 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
