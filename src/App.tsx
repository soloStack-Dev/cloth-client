/**
 * App.tsx
 * -------
 * Root component. Sets up the page shell (Header + Footer) and maps
 * every URL to its page component via react-router.
 *
 * The Design Studio is a "fullscreen" tool, so it hides the Header and
 * Footer and removes the default top padding.
 */

import { Routes, Route, useLocation } from 'react-router-dom'
import { useLayoutEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import DesignStudio from './pages/DesignStudio'
import Collection from './pages/Collection'
import Blog from './pages/Blog'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'

/** URL path of the fullscreen tool page. */
const STUDIO_PATH = '/design-studio'

/**
 * Scrolls the window back to the top whenever the route changes.
 * Without this, the browser keeps the old scroll position on navigation.
 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  const location = useLocation()
  const isStudio = location.pathname === STUDIO_PATH

  return (
    <>
      {/* Keep every navigation starting at the top of the new page. */}
      <ScrollToTop />

      {/* The studio manages its own chrome — hide the shared header. */}
      {!isStudio && <Header />}

      <main className={isStudio ? '' : 'pt-18 min-h-screen'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path={STUDIO_PATH} element={<DesignStudio />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      {!isStudio && <Footer />}
    </>
  )
}
