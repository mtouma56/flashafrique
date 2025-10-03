import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './styles/globals.css'
import { router } from './router'
import { SessionProvider } from './context/SessionProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <SessionProvider>
        <RouterProvider router={router} />
      </SessionProvider>
    </HelmetProvider>
  </StrictMode>,
)
