import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css'
import App from './App.jsx'
import { LocationProvide } from './context/LocationContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SeatProvider } from './context/SeatContext';
import { AuthProvider } from "./context/AuthProvider";
import { UserProvider } from './context/UserContext.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
      <LocationProvide>
        <SeatProvider>
          <AuthProvider>
            <UserProvider>
        <App />
        </UserProvider>
        </AuthProvider>
        </SeatProvider>
      </LocationProvide>
      </QueryClientProvider>
    </Router>
  </StrictMode>,
)
