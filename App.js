import React from 'react';
import { TailwindProvider } from 'tailwindcss-react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigation from './navigation/AppNavigation';
import ErrorBoundary from './utils/ErrorBoundary';



const queryClient = new QueryClient();


export default function App() {

  return (
    <ErrorBoundary>
      <TailwindProvider>
        <QueryClientProvider client={queryClient}>
          <AppNavigation/>
        </QueryClientProvider>
      </TailwindProvider>
    </ErrorBoundary>
  );
}
