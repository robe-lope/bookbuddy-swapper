
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, BookPlus, MessageSquare, ArrowRight } from 'lucide-react';
import BookCard from '@/components/BookCard';
import LanguageToggle from '@/components/LanguageToggle';
import { generateDummyData } from '@/types';

export default function Index() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [dummyData, setDummyData] = useState(generateDummyData());

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // For the staggered animation of features
  const features = [
    {
      icon: <BookPlus className="h-10 w-10 text-bookswap-accent" />,
      title: t('postBooks'),
      description: t('postDescription')
    },
    {
      icon: <Search className="h-10 w-10 text-bookswap-accent" />,
      title: t('findBooks'),
      description: t('findDescription')
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-bookswap-accent" />,
      title: t('connectSwap'),
      description: t('connectDescription')
    },
  ];

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-bookswap-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute w-96 h-96 -top-12 -left-12 bg-bookswap-brown rounded-full blur-3xl"></div>
          <div className="absolute w-96 h-96 -bottom-12 -right-12 bg-bookswap-secondary rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="absolute top-0 right-0 z-10">
            <LanguageToggle />
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-bookswap-beige/70 text-bookswap-darkbrown text-sm font-medium mb-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
                {t('tagline')}
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-bookswap-darkbrown mb-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
                <span className="text-bookswap-secondary">{t('title').split(',')[0]}</span>, 
                <br /><span className="text-bookswap-accent">{t('title').split(',')[1]}</span>
              </h1>
              <p className="text-bookswap-brown text-lg mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: '400ms' }}>
                {t('description')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '500ms' }}>
                <Link to="/register">
                  <Button className="bg-bookswap-brown hover:bg-bookswap-brown/90 text-white px-6 py-6 h-auto text-base">
                    {t('joinCommunity')}
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button variant="outline" className="border-bookswap-brown text-bookswap-darkbrown hover:bg-bookswap-beige/50 px-6 py-6 h-auto text-base">
                    {t('browseBooks')}
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 flex items-center justify-center animate-fade-up" style={{ animationDelay: '600ms' }}>
              <div className="relative w-full max-w-lg h-72 sm:h-96">
                {/* Ajustes para dispositivos móviles */}
                <div className="absolute top-0 -right-4 sm:right-0 w-40 sm:w-48 h-56 sm:h-64 lg:w-60 lg:h-80 bg-white rounded-lg shadow-lg transform rotate-3 z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800" 
                    alt="Book" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="absolute top-6 sm:top-10 right-8 sm:right-12 w-40 sm:w-48 h-56 sm:h-64 lg:w-60 lg:h-80 bg-white rounded-lg shadow-lg transform -rotate-6 z-20">
                  <img 
                    src="https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=800" 
                    alt="Book" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="absolute top-12 sm:top-20 right-20 sm:right-24 w-40 sm:w-48 h-56 sm:h-64 lg:w-60 lg:h-80 bg-white rounded-lg shadow-lg transform rotate-6 z-30">
                  <img 
                    src="https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800" 
                    alt="Book" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bookswap-darkbrown mb-4">
              {t('howItWorks')}
            </h2>
            <p className="text-bookswap-brown text-lg max-w-3xl mx-auto">
              {t('howDescription')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-6 bg-bookswap-cream rounded-lg shadow-sm animate-fade-up transition-transform duration-300 hover:translate-y-[-5px]"
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold text-bookswap-darkbrown mb-3">
                  {feature.title}
                </h3>
                <p className="text-bookswap-brown">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Books Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bookswap-cream/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bookswap-darkbrown mb-2">
                {t('featuredBooks')}
              </h2>
              <p className="text-bookswap-brown text-lg">
                {t('discoverReaders')}
              </p>
            </div>
            <Link to="/browse">
              <Button 
                variant="ghost" 
                className="mt-4 sm:mt-0 font-serif text-bookswap-darkbrown hover:text-bookswap-darkbrown hover:bg-bookswap-beige/30"
              >
                {t('viewAllBooks')} 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="bg-bookswap-beige/40 w-full sm:w-auto mb-8 flex space-x-2 p-1 rounded-lg">
              <TabsTrigger 
                value="available" 
                className="data-[state=active]:bg-white data-[state=active]:text-bookswap-darkbrown data-[state=active]:shadow-sm rounded-md font-serif"
              >
                {t('availableBooks')}
              </TabsTrigger>
              <TabsTrigger 
                value="wanted" 
                className="data-[state=active]:bg-white data-[state=active]:text-bookswap-darkbrown data-[state=active]:shadow-sm rounded-md font-serif"
              >
                {t('wantedBooks')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="available">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-96 bg-white rounded-lg animate-pulse">
                      <div className="h-48 bg-bookswap-beige/30 rounded-t-lg"></div>
                      <div className="p-4">
                        <div className="h-6 bg-bookswap-beige/40 rounded mb-2"></div>
                        <div className="h-4 bg-bookswap-beige/40 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-bookswap-beige/30 rounded w-1/4 mb-4"></div>
                        <div className="h-16 bg-bookswap-beige/20 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  dummyData.books.slice(0, 4).map((book, index) => (
                    <div 
                      key={book.id} 
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <BookCard book={book} />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="wanted">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-72 bg-white rounded-lg animate-pulse">
                      <div className="h-48 bg-bookswap-beige/30 rounded-t-lg"></div>
                      <div className="p-4">
                        <div className="h-6 bg-bookswap-beige/40 rounded mb-2"></div>
                        <div className="h-4 bg-bookswap-beige/40 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  dummyData.wantedBooks.map((book, index) => (
                    <div 
                      key={book.id} 
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <BookCard book={book} isWanted={true} />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Community Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bookswap-brown text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16">
            <div className="lg:w-1/2">
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-4">
                {t('joinOurCommunity')}
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6">
                {t('connectTitle')}
              </h2>
              <p className="text-lg text-white/90 mb-8">
                {t('communityDescription')}
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link to="/register">
                  <Button className="bg-white text-bookswap-brown hover:bg-white/90 hover:text-bookswap-brown/90">
                    {t('signUpNow')}
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button 
                    variant="outline" 
                    className="text-white border-white hover:bg-white/10"
                  >
                    {t('exploreBooks')}
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-2 gap-4 max-w-lg">
              <div className="bg-white/10 p-6 rounded-lg">
                <h3 className="text-2xl font-serif font-bold mb-2">1000+</h3>
                <p className="text-white/80">{t('booksAvailable')}</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg">
                <h3 className="text-2xl font-serif font-bold mb-2">500+</h3>
                <p className="text-white/80">{t('activeUsers')}</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg">
                <h3 className="text-2xl font-serif font-bold mb-2">300+</h3>
                <p className="text-white/80">{t('successfulSwaps')}</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg">
                <h3 className="text-2xl font-serif font-bold mb-2">50+</h3>
                <p className="text-white/80">{t('citiesCovered')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-bookswap-darkbrown text-white/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-bookswap-beige mr-2" />
              <span className="font-serif text-xl font-semibold text-white">
                BookSwap
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                {t('about')}
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                {t('blog')}
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                {t('faq')}
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                {t('contact')}
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                {t('privacy')}
              </a>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/60 mb-4 md:mb-0">
              © {new Date().getFullYear()} BookSwap. {t('allRights')}
            </p>
            <p className="text-sm text-white/60">
              {t('madeWith')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
