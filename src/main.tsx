import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import './index.css'
import './i18n'
import { router } from './routes'
import { PWAInstallPrompt, PWAUpdatePrompt, OfflineIndicator } from './components/features/pwa'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <PWAInstallPrompt />
    <PWAUpdatePrompt />
    <OfflineIndicator />
  </StrictMode>,
)
