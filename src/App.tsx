
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n';
import AppRoutes from './routes/AppRoutes';
import { StorageBucketSetup } from './components/StorageBucket';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StorageBucketSetup />
            <AppRoutes />
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
}

export default App;
