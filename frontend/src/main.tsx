import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.tsx'
import { ThemeContextProvider } from './context/ThemeContext.tsx';


createRoot(document.getElementById('root')!).render(
  <ThemeContextProvider>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID!} >
    <App />
  </GoogleOAuthProvider>,
  </ThemeContextProvider>
)
