import React from 'react';
import { Toaster } from 'react-hot-toast';
import AppRouter from './routes';

const App: React.FC = () => {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#0F172A',
            border: '1px solid #E2E8F0',
            borderRadius: '1rem',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </>
  );
};

export default App;
