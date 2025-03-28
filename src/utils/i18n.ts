
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Recursos de traducción
const resources = {
  en: {
    translation: {
      // Hero section
      "tagline": "Give your books a second life",
      "title": "Swap Books, Share Stories",
      "description": "BookSwap connects book lovers to exchange their favorite reads. Find new stories while giving your books a new home.",
      "joinCommunity": "Join the Community",
      "browseBooks": "Browse Books",
      
      // How it works section
      "howItWorks": "How BookSwap Works",
      "howDescription": "Our platform makes exchanging books simple and enjoyable. Follow these steps to start swapping.",
      "postBooks": "Post Your Books",
      "postDescription": "List the books you own and want to swap, along with those you're looking for.",
      "findBooks": "Find Books You Want",
      "findDescription": "Browse through available books from other users and filter by genre or condition.",
      "connectSwap": "Connect & Swap",
      "connectDescription": "Get notified when there's a match and arrange the swap through our messaging system.",
      
      // Featured books section
      "featuredBooks": "Featured Books",
      "discoverReaders": "Discover what other readers are sharing",
      "viewAllBooks": "View All Books",
      "availableBooks": "Available Books",
      "wantedBooks": "Wanted Books",
      
      // Community section
      "joinOurCommunity": "Join our community",
      "connectTitle": "Connect with Fellow Book Lovers",
      "communityDescription": "BookSwap is more than just exchanging books—it's about creating connections through shared stories. Join our community of passionate readers and discover new favorites while giving your books a second life.",
      "signUpNow": "Sign Up Now",
      "exploreBooks": "Explore Books",
      "booksAvailable": "Books Available",
      "activeUsers": "Active Users",
      "successfulSwaps": "Successful Swaps",
      "citiesCovered": "Cities Covered",
      
      // Footer
      "about": "About",
      "blog": "Blog",
      "faq": "FAQ",
      "contact": "Contact",
      "privacy": "Privacy",
      "allRights": "All rights reserved.",
      "madeWith": "Made with ♥ for book lovers everywhere"
    }
  },
  es: {
    translation: {
      // Hero section
      "tagline": "Da una segunda vida a tus libros",
      "title": "Intercambia Libros, Comparte Historias",
      "description": "BookSwap conecta a amantes de los libros para intercambiar sus lecturas favoritas. Encuentra nuevas historias mientras das un nuevo hogar a tus libros.",
      "joinCommunity": "Únete a la Comunidad",
      "browseBooks": "Explorar Libros",
      
      // How it works section
      "howItWorks": "Cómo Funciona BookSwap",
      "howDescription": "Nuestra plataforma hace que intercambiar libros sea simple y agradable. Sigue estos pasos para comenzar a intercambiar.",
      "postBooks": "Publica Tus Libros",
      "postDescription": "Lista los libros que tienes y quieres intercambiar, junto con aquellos que estás buscando.",
      "findBooks": "Encuentra Libros que Quieres",
      "findDescription": "Navega por los libros disponibles de otros usuarios y filtra por género o condición.",
      "connectSwap": "Conecta e Intercambia",
      "connectDescription": "Recibe notificaciones cuando hay una coincidencia y organiza el intercambio a través de nuestro sistema de mensajería.",
      
      // Featured books section
      "featuredBooks": "Libros Destacados",
      "discoverReaders": "Descubre lo que otros lectores están compartiendo",
      "viewAllBooks": "Ver Todos los Libros",
      "availableBooks": "Libros Disponibles",
      "wantedBooks": "Libros Buscados",
      
      // Community section
      "joinOurCommunity": "Únete a nuestra comunidad",
      "connectTitle": "Conecta con Otros Amantes de los Libros",
      "communityDescription": "BookSwap es más que solo intercambiar libros—se trata de crear conexiones a través de historias compartidas. Únete a nuestra comunidad de lectores apasionados y descubre nuevos favoritos mientras das una segunda vida a tus libros.",
      "signUpNow": "Regístrate Ahora",
      "exploreBooks": "Explorar Libros",
      "booksAvailable": "Libros Disponibles",
      "activeUsers": "Usuarios Activos",
      "successfulSwaps": "Intercambios Exitosos",
      "citiesCovered": "Ciudades Cubiertas",
      
      // Footer
      "about": "Acerca de",
      "blog": "Blog",
      "faq": "Preguntas Frecuentes",
      "contact": "Contacto",
      "privacy": "Privacidad",
      "allRights": "Todos los derechos reservados.",
      "madeWith": "Hecho con ♥ para amantes de los libros en todas partes"
    }
  }
};

// Inicializar i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Idioma predeterminado
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // No es necesario para React
    }
  });

export default i18n;
