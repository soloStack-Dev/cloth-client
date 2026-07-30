import { Link } from 'react-router-dom'
import { Globe, Share2, Code, Send } from 'lucide-react'

interface FooterProps {
  variant?: 'default' | 'blog' | 'collection' | 'about' | 'auth' | 'cart'
}

const content: Record<string, {
  desc: string; c2h: string; c2: { l: string; to: string }[]
  c3h: string; c3: { l: string; to: string }[]
  c4h: string; c4: { l?: { l: string; to: string }[]; news?: boolean }
  social?: boolean
}> = {
  default: {
    desc: 'Empowering individual expression through high-quality custom apparel and intuitive design tools.',
    c2h: 'PLATFORM', c2: [{ l: 'Design Tool', to: '/design-studio' }, { l: 'Community Gallery', to: '/collection' }, { l: 'Pricing Plans', to: '/pricing' }, { l: 'Templates', to: '/collection' }],
    c3h: 'COMPANY', c3: [{ l: 'About Us', to: '/about' }, { l: 'Careers', to: '#' }, { l: 'Sustainability', to: '#' }, { l: 'Blog', to: '/blog' }],
    c4h: 'SUPPORT', c4: { l: [{ l: 'Contact Us', to: '#' }, { l: 'Shipping Info', to: '#' }, { l: 'Privacy Policy', to: '#' }, { l: 'Terms of Service', to: '#' }] },
    social: true,
  },
  about: {
    desc: 'Empowering individual expression through high-quality custom apparel and intuitive design tools.',
    c2h: 'PLATFORM', c2: [{ l: 'Design Tool', to: '/design-studio' }, { l: 'Community Gallery', to: '/collection' }, { l: 'Pricing Plans', to: '/pricing' }, { l: 'Templates', to: '/collection' }],
    c3h: 'COMPANY', c3: [{ l: 'About Us', to: '/about' }, { l: 'Careers', to: '#' }, { l: 'Sustainability', to: '#' }, { l: 'Blog', to: '/blog' }],
    c4h: 'SUPPORT', c4: { l: [{ l: 'Contact Us', to: '#' }, { l: 'Shipping Info', to: '#' }, { l: 'Privacy Policy', to: '#' }, { l: 'Terms of Service', to: '#' }] },
    social: true,
  },
  blog: {
    desc: 'Empowering designers to turn digital art into premium wearable masterpieces.',
    c2h: 'RESOURCES', c2: [{ l: 'Shipping Info', to: '#' }, { l: 'Returns Policy', to: '#' }, { l: 'Care Guide', to: '#' }, { l: 'Affiliates', to: '#' }],
    c3h: 'COMPANY', c3: [{ l: 'About Us', to: '/about' }, { l: 'Careers', to: '#' }, { l: 'Contact Us', to: '#' }, { l: 'Press Kit', to: '#' }],
    c4h: 'LEGAL', c4: { l: [{ l: 'Privacy Policy', to: '#' }, { l: 'Terms of Service', to: '#' }, { l: 'Cookie Policy', to: '#' }] },
    social: true,
  },
  collection: {
    desc: 'Redefining apparel through the lens of creative technology. Your imagination, our canvas.',
    c2h: 'Quick Links', c2: [{ l: 'Design Tool', to: '/design-studio' }, { l: 'Collection', to: '/collection' }, { l: 'Pricing', to: '/pricing' }, { l: 'Blog', to: '/blog' }],
    c3h: 'Support', c3: [{ l: 'Privacy Policy', to: '#' }, { l: 'Terms of Service', to: '#' }, { l: 'Shipping Info', to: '#' }, { l: 'Contact Us', to: '#' }],
    c4h: 'Join the Lab', c4: { news: true },
    social: true,
  },
  auth: {
    desc: 'The modern studio for digital creators and apparel entrepreneurs.',
    c2h: 'Quick Links', c2: [{ l: 'Privacy Policy', to: '#' }, { l: 'Terms of Service', to: '#' }, { l: 'Shipping Info', to: '#' }, { l: 'Contact Us', to: '#' }],
    c3h: 'Connect', c3: [{ l: 'Instagram', to: '#' }, { l: 'Twitter', to: '#' }, { l: 'LinkedIn', to: '#' }, { l: 'Pinterest', to: '#' }],
    c4h: 'Newsletter', c4: { news: true },
    social: false,
  },
  cart: {
    desc: 'Pioneering the future of expressive apparel through artistic precision and digital craft.',
    c2h: 'SHOP', c2: [{ l: 'New Arrivals', to: '/collection' }, { l: 'Custom Builder', to: '/design-studio' }, { l: 'Limited Edition', to: '/collection' }, { l: 'Sale', to: '/collection' }],
    c3h: 'HELP', c3: [{ l: 'Privacy Policy', to: '#' }, { l: 'Terms of Service', to: '#' }, { l: 'Shipping Info', to: '#' }, { l: 'Contact Us', to: '#' }],
    c4h: 'NEWSLETTER', c4: { news: true },
    social: false,
  },
}

export default function Footer({ variant = 'default' }: FooterProps) {
  const c = content[variant] || content.default

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-brand-name">Electric Canvas</Link>
            <p className="footer-desc">{c.desc}</p>
            {c.social && (
              <div className="footer-social">
                {[Globe, Share2, Code].map((Icon, i) => (
                  <div key={i} className="footer-social-icon"><Icon size={16} color="#475569" /></div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="footer-heading">{c.c2h}</h4>
            <div className="footer-links">
              {c.c2.map((link) => (
                <Link key={link.l} to={link.to} className="footer-link">{link.l}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer-heading">{c.c3h}</h4>
            <div className="footer-links">
              {c.c3.map((link) => (
                <Link key={link.l} to={link.to} className="footer-link">{link.l}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer-heading">{c.c4h}</h4>
            {c.c4.news ? (
              <div>
                <p className="footer-newsletter-desc">Stay updated with fresh canvases and drops.</p>
                <div className="newsletter-input-group">
                  <input type="email" placeholder="Email" className="newsletter-input" />
                  <button className="newsletter-btn" aria-label="Subscribe">
                    <Send size={16} color="white" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="footer-links">
                {c.c4.l?.map((link) => (
                  <Link key={link.l} to={link.to} className="footer-link">{link.l}</Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-bottom-text">© 2024 Electric Canvas. All rights reserved.</span>
          <span className="footer-bottom-text">Made for Creators · Crafted in Studio</span>
        </div>
      </div>
    </footer>
  )
}
