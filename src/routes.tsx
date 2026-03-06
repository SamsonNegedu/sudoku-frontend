import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import Root from './Root'
import { GamePage } from './pages/GamePage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { VideosPage } from './pages/VideosPage'

// Root route
const rootRoute = createRootRoute({
  component: Root,
})

// Index route - redirect to game
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: async ({ navigate }) => {
    throw navigate({ to: '/game' })
  },
})

// Game route (default)
const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game',
  component: GamePage,
})

// Analytics route
const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: AnalyticsPage,
})

// Video Tutorials route
const videosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/videos',
  component: VideosPage,
})

// Individual Video route
const videoDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/videos/$videoId',
  component: VideosPage,
})

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  gameRoute,
  analyticsRoute,
  videosRoute,
  videoDetailRoute,
])

// Create and export router
export const router = createRouter({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
