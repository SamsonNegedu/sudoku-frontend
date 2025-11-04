import { RootRoute, Route, Router } from '@tanstack/react-router'
import Root from './Root'
import { GamePage } from './pages/GamePage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { VideosPage } from './pages/VideosPage'

// Root route
const rootRoute = new RootRoute({
  component: Root,
})

// Index route - redirect to game
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: async ({ navigate }) => {
    throw navigate({ to: '/game' })
  },
})

// Game route (default)
const gameRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/game',
  component: GamePage,
})

// Analytics route
const analyticsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: AnalyticsPage,
})

// Video Tutorials route
const videosRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/videos',
  component: VideosPage,
})

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  gameRoute,
  analyticsRoute,
  videosRoute,
])

// Create and export router
export const router = new Router({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
