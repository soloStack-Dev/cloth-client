/**
 * main.tsx
 * --------
 * Application entry point.
 *
 * Wraps the app in the providers it needs:
 *   - StrictMode      → surfaces bugs during development
 *   - QueryClientProvider → powers all data fetching (TanStack Query)
 *   - BrowserRouter   → client-side routing
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'

/**
 * Shared query client.
 * Caching is tuned for a demo shop: data stays fresh for 5 minutes,
 * is garbage-collected after 30 minutes and is never re-fetched just
 * because the window regains focus.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
})

// Mount the whole app tree into the #root element from index.html.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
