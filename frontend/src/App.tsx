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
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            borderRadius: '3px',
            padding: '10px 14px',
            fontSize: '13px',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 1px 3px rgba(0,0,0,.1)',
          },
          success: {
            iconTheme: { primary: '#16a34a', secondary: '#ffffff' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#ffffff' },
          },
        }}
      />
    </>
  );
};

export default App;
