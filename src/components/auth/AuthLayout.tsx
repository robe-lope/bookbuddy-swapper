
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
  footer: ReactNode;
};

export const AuthLayout = ({ children, title, description, footer }: AuthLayoutProps) => {
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
            <CardTitle className="font-serif text-2xl text-center text-bookswap-darkbrown">{title}</CardTitle>
            <CardDescription className="text-center text-bookswap-brown">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
          <CardFooter>
            {footer}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
