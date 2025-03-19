import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.tsx'
import { ThemeContextProvider } from './context/ThemeContext.tsx';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <ThemeContextProvider>
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID!}>
        <App />
      </GoogleOAuthProvider>
    </AuthProvider>
  </ThemeContextProvider>
)
