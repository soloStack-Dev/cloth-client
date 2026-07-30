import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ShoppingCart, Menu, X } from 'lucide-react'

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

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
    }
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <header ref={headerRef} className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">Electric Canvas</Link>

        <nav className="header-nav">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}
              className={location.pathname === link.path ? 'active' : ''}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/design-studio" className="header-cta">Start Designing</Link>
          <Link to="/cart" className="header-cart-btn" aria-label="Cart">
            <ShoppingCart size={20} />
          </Link>
          <button className="header-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}
              className={location.pathname === link.path ? 'active' : ''}>
              {link.label}
            </Link>
          ))}
          <Link to="/design-studio" className="mobile-cta">Start Designing</Link>
        </div>
      )}
    </header>
  )
}
