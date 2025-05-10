import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { FirebaseProvider } from './firebase/FirebaseContext';
import { AuthProvider } from './firebase/AuthContext';
  
import './index.css';
import './style/main.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FirebaseProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </FirebaseProvider>
  </StrictMode>,
);
