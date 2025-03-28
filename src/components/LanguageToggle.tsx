
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="bg-bookswap-cream/30 text-bookswap-darkbrown border-bookswap-darkbrown/20 hover:bg-bookswap-beige/30 flex items-center gap-1"
    >
      <Globe className="h-4 w-4" />
      <span>{currentLang === 'en' ? 'ES' : 'EN'}</span>
    </Button>
  );
};

export default LanguageToggle;
