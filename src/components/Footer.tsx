/**
 * Footer.tsx
 * ----------
 * Shared site footer. Each page can pass a `variant` that selects a
 * different set of columns, description and social links from the
 * `content` table below.
 */

import { Link } from 'react-router-dom'
import { Globe, Share2, Code, Send } from 'lucide-react'

/** Which footer configuration to render. */
type FooterVariant = 'default' | 'blog' | 'collection' | 'about' | 'auth' | 'cart'

/** A single link row inside a footer column. */
interface FooterLink {
  l: string
  to: string
}

/** One column: a heading plus either links or a newsletter signup. */
interface FooterColumn {
  heading: string
  links?: FooterLink[]
  newsletter?: boolean
}

/** All the content a footer variant needs. */
interface FooterContent {
  desc: string
  columns: [FooterColumn, FooterColumn, FooterColumn]
  social?: boolean
}

/**
 * Content table keyed by variant.
 * Every entry describes the description text, three columns and whether
 * the social icons should be shown.
 */
const content: Record<FooterVariant, FooterContent> = {
  default: {
    desc: 'Empowering individual expression through high-quality custom apparel and intuitive design tools.',
    columns: [
      {
        heading: 'PLATFORM',
        links: [
          { l: 'Design Tool', to: '/design-studio' },
          { l: 'Community Gallery', to: '/collection' },
          { l: 'Pricing Plans', to: '/pricing' },
          { l: 'Templates', to: '/collection' },
        ],
      },
      {
        heading: 'COMPANY',
        links: [
          { l: 'About Us', to: '/about' },
          { l: 'Careers', to: '#' },
          { l: 'Sustainability', to: '#' },
          { l: 'Blog', to: '/blog' },
        ],
      },
      {
        heading: 'SUPPORT',
        links: [
          { l: 'Contact Us', to: '#' },
          { l: 'Shipping Info', to: '#' },
          { l: 'Privacy Policy', to: '#' },
          { l: 'Terms of Service', to: '#' },
        ],
      },
    ],
    social: true,
  },
  about: {
    desc: 'Empowering individual expression through high-quality custom apparel and intuitive design tools.',
    columns: [
      {
        heading: 'PLATFORM',
        links: [
          { l: 'Design Tool', to: '/design-studio' },
          { l: 'Community Gallery', to: '/collection' },
          { l: 'Pricing Plans', to: '/pricing' },
          { l: 'Templates', to: '/collection' },
        ],
      },
      {
        heading: 'COMPANY',
        links: [
          { l: 'About Us', to: '/about' },
          { l: 'Careers', to: '#' },
          { l: 'Sustainability', to: '#' },
          { l: 'Blog', to: '/blog' },
        ],
      },
      {
        heading: 'SUPPORT',
        links: [
          { l: 'Contact Us', to: '#' },
          { l: 'Shipping Info', to: '#' },
          { l: 'Privacy Policy', to: '#' },
          { l: 'Terms of Service', to: '#' },
        ],
      },
    ],
    social: true,
  },
  blog: {
    desc: 'Empowering designers to turn digital art into premium wearable masterpieces.',
    columns: [
      {
        heading: 'RESOURCES',
        links: [
          { l: 'Shipping Info', to: '#' },
          { l: 'Returns Policy', to: '#' },
          { l: 'Care Guide', to: '#' },
          { l: 'Affiliates', to: '#' },
        ],
      },
      {
        heading: 'COMPANY',
        links: [
          { l: 'About Us', to: '/about' },
          { l: 'Careers', to: '#' },
          { l: 'Contact Us', to: '#' },
          { l: 'Press Kit', to: '#' },
        ],
      },
      {
        heading: 'LEGAL',
        links: [
          { l: 'Privacy Policy', to: '#' },
          { l: 'Terms of Service', to: '#' },
          { l: 'Cookie Policy', to: '#' },
        ],
      },
    ],
    social: true,
  },
  collection: {
    desc: 'Redefining apparel through the lens of creative technology. Your imagination, our canvas.',
    columns: [
      {
        heading: 'Quick Links',
        links: [
          { l: 'Design Tool', to: '/design-studio' },
          { l: 'Collection', to: '/collection' },
          { l: 'Pricing', to: '/pricing' },
          { l: 'Blog', to: '/blog' },
        ],
      },
      {
        heading: 'Support',
        links: [
          { l: 'Privacy Policy', to: '#' },
          { l: 'Terms of Service', to: '#' },
          { l: 'Shipping Info', to: '#' },
          { l: 'Contact Us', to: '#' },
        ],
      },
      { heading: 'Join the Lab', newsletter: true },
    ],
    social: true,
  },
  auth: {
    desc: 'The modern studio for digital creators and apparel entrepreneurs.',
    columns: [
      {
        heading: 'Quick Links',
        links: [
          { l: 'Privacy Policy', to: '#' },
          { l: 'Terms of Service', to: '#' },
          { l: 'Shipping Info', to: '#' },
          { l: 'Contact Us', to: '#' },
        ],
      },
      {
        heading: 'Connect',
        links: [
          { l: 'Instagram', to: '#' },
          { l: 'Twitter', to: '#' },
          { l: 'LinkedIn', to: '#' },
          { l: 'Pinterest', to: '#' },
        ],
      },
      { heading: 'Newsletter', newsletter: true },
    ],
  },
  cart: {
    desc: 'Pioneering the future of expressive apparel through artistic precision and digital craft.',
    columns: [
      {
        heading: 'SHOP',
        links: [
          { l: 'New Arrivals', to: '/collection' },
          { l: 'Custom Builder', to: '/design-studio' },
          { l: 'Limited Edition', to: '/collection' },
          { l: 'Sale', to: '/collection' },
        ],
      },
      {
        heading: 'HELP',
        links: [
          { l: 'Privacy Policy', to: '#' },
          { l: 'Terms of Service', to: '#' },
          { l: 'Shipping Info', to: '#' },
          { l: 'Contact Us', to: '#' },
        ],
      },
      { heading: 'NEWSLETTER', newsletter: true },
    ],
  },
}

/** Social icons shown in the brand column. */
const socialIcons = [Globe, Share2, Code]

export default function Footer({ variant = 'default' }: { variant?: FooterVariant }) {
  // Fall back to the default config if an unknown variant is passed.
  const c = content[variant] ?? content.default

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand column — name, description and social icons. */}
          <div className="footer-brand">
            <Link to="/" className="footer-brand-name">Electric Canvas</Link>
            <p className="footer-desc">{c.desc}</p>
            {c.social && (
              <div className="footer-social">
                {socialIcons.map((Icon, i) => (
                  <div key={i} className="footer-social-icon">
                    <Icon size={16} color="#475569" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Three configurable link / newsletter columns. */}
          {c.columns.map((column, i) => (
            <div key={i}>
              <h4 className="footer-heading">{column.heading}</h4>
              {column.newsletter ? (
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
                  {column.links?.map((link) => (
                    <Link key={link.l} to={link.to} className="footer-link">{link.l}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom legal strip. */}
        <div className="footer-bottom">
          <span className="footer-bottom-text">© 2024 Electric Canvas. All rights reserved.</span>
          <span className="footer-bottom-text">Made for Creators · Crafted in Studio</span>
        </div>
      </div>
    </footer>
  )
}
