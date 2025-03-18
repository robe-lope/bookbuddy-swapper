
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/context/AuthContext';

type RegisterFormProps = {
  onSubmit: (e: React.FormEvent) => Promise<void>;
};

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('individual');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  
  const { loading, error, register } = useAuth();
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
      await register(email, username, password, userType);
    }
  };

  return (
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
      
      <div className="space-y-2">
        <Label className="text-bookswap-darkbrown">
          Account Type
        </Label>
        <RadioGroup 
          value={userType} 
          onValueChange={setUserType} 
          className="flex gap-6 pt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="individual" 
              id="individual"
              className="border-bookswap-beige text-bookswap-brown"
            />
            <Label htmlFor="individual" className="text-bookswap-brown">Individual</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="business" 
              id="business"
              className="border-bookswap-beige text-bookswap-brown"
            />
            <Label htmlFor="business" className="text-bookswap-brown">Business/Bookstore</Label>
          </div>
        </RadioGroup>
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
  );
};
