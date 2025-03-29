
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [abortController, setAbortController] = useState<AbortController | null>(null);


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
    if (!validateForm()) return;

    const controller = new AbortController();
    setAbortController(controller);

    try {
      await login(email, password, controller.signal); // Pasamos el signal para cancelación
      navigate('/profile');
    } catch (err) {
        console.error('Login error:', err.message);
    } finally {
      setAbortController(null);
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  const footer = (
    <>
      <div className="text-sm text-bookswap-brown text-center">
        For demo, use:
        <div className="text-bookswap-darkbrown font-medium">
          Email: user@example.com | Password: password
        </div>
      </div>
      <div className="text-center text-sm text-bookswap-brown mt-4">
        Don't have an account?{' '}
        <Link 
          to="/register" 
          className="font-medium text-bookswap-secondary hover:text-bookswap-secondary/90 transition-colors"
        >
          Sign up
        </Link>
      </div>
    </>
  );

  return (
    <AuthLayout
      title="Welcome Back"
      description="Log in to your account to continue your book swapping journey"
      footer={footer}
    >
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
    </AuthLayout>
  );
}
