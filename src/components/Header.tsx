/**
 * Header.tsx
 * ----------
 * Shared site header with the logo, main navigation and cart link.
 * Includes a slide-in entrance animation (GSAP) and a mobile menu.
 */

import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ShoppingCart, Menu, X } from 'lucide-react'

/** The navigation shown in both the desktop bar and the mobile menu. */
const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/collection', label: 'Collection' },
  { path: '/design-studio', label: 'Design' },
  { path: '/blog', label: 'Blog' },
  { path: '/about', label: 'About' },
]

export default function Header() {
  const location = useLocation()
  const headerRef = useRef<HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Remember which page the menu was opened on.
  const [lastPath, setLastPath] = useState(location.pathname)

  // Close the mobile menu whenever the user navigates to a new page.
  // (Adjusting state during render is the React-recommended way to sync
  // state to a prop change without an extra effect.)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setMobileOpen(false)
  }

  // Slide the header in from the top once on page load.
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      )
    }
  }, [])

  // Whether a link matches the current page (used to highlight it).
  const isActive = (path: string) => location.pathname === path

  return (
    <header ref={headerRef} className="header">
      <div className="header-inner">
        {/* Brand / logo — always goes home. */}
        <Link to="/" className="header-logo">Electric Canvas</Link>

        {/* Desktop navigation. */}
        <nav className="header-nav">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={isActive(link.path) ? 'active' : ''}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right-side actions: CTA, cart, mobile menu toggle. */}
        <div className="header-actions">
          <Link to="/design-studio" className="header-cta">Start Designing</Link>
          <Link to="/cart" className="header-cart-btn" aria-label="Cart">
            <ShoppingCart size={20} />
          </Link>
          <button
            className="header-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Drop-down menu used on small screens. */}
      {mobileOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={isActive(link.path) ? 'active' : ''}>
              {link.label}
            </Link>
          ))}
          <Link to="/design-studio" className="mobile-cta">Start Designing</Link>
        </div>
      )}
    </header>
  )
}
