/**
 * Blog.tsx
 * --------
 * "Wearable Art Feed" page.
 *
 * Fetches posts from the backend, but falls back to a static gallery
 * when the API is offline. Includes a GSAP entrance animation and a
 * newsletter signup block.
 */

import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Box, Container, Typography, Button, Card, CardMedia, TextField } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { fetchBlogPosts } from '../lib/api'

gsap.registerPlugin(ScrollTrigger)

/** Static gallery used when the backend is unreachable. */
const staticPosts = [
  { id: '1', title: 'Butterfly Effect', imageUrl: '/asserts/BlogAsserts/butterfly-design-t-shirt.jpg' },
  { id: '2', title: 'Ducky Fresh', imageUrl: '/asserts/BlogAsserts/duck-design-t-shirt.jpg' },
  { id: '3', title: 'I Am OK', imageUrl: '/asserts/BlogAsserts/iam-ok-t-shirt-design.jpg' },
  { id: '4', title: 'Iced Coffee Club', imageUrl: '/asserts/BlogAsserts/Iced-Coffee-Club-Oversized-T-Shirt.jpg' },
  { id: '5', title: 'Chai Culture', imageUrl: '/asserts/BlogAsserts/indian-tea-design-t-shirt.jpg' },
  { id: '6', title: 'Little Lady', imageUrl: '/asserts/BlogAsserts/little-lady-t-shirt-design.jpg' },
  { id: '7', title: 'Mama Girl', imageUrl: '/asserts/BlogAsserts/MAMA-GIRL-Round-Neck-Short-Sleeve-T-Shirt.jpg' },
  { id: '8', title: 'Modern Typography', imageUrl: '/asserts/BlogAsserts/modern-text-design-t-shirt.jpg' },
  { id: '9', title: 'Motivation Daily', imageUrl: '/asserts/BlogAsserts/Motivational-Typography-T-shirt-Design.jpg' },
  { id: '10', title: 'Mr. Bean Tee', imageUrl: '/asserts/BlogAsserts/mr-bean-toy-t-shirt.jpg' },
  { id: '11', title: 'Never Design', imageUrl: '/asserts/BlogAsserts/never-design-t-shirt.jpg' },
  { id: '12', title: 'Premium Feel', imageUrl: '/asserts/BlogAsserts/Premium-Quality-T-Shirt-Design.jpg' },
  { id: '13', title: 'R Design', imageUrl: '/asserts/BlogAsserts/R-design-t-shirt.jpg' },
  { id: '14', title: 'Tee Style', imageUrl: '/asserts/BlogAsserts/Tee-style-t-shirt.jpg' },
  { id: '15', title: 'Summer Breeze', imageUrl: '/asserts/BlogAsserts/Unisex-Cotton-Printed-T-Shirt-Casual-Summer-Outfit-Trendy-Graphic-Tee.jpg' },
  { id: '16', title: 'Zone Out Frog', imageUrl: '/asserts/BlogAsserts/zone-out-frog-t-shirt.jpg' },
]

/** Shape of a blog post returned by the API. */
interface BlogPost {
  id: string
  title: string
  imageUrl: string
}

export default function Blog() {
  const [email, setEmail] = useState('')

  // Fetch the real feed; fall back to static posts if there is no data.
  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts,
  })
  const posts = data ?? staticPosts

  // Refs for the GSAP animations.
  const heroRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const newsletterRef = useRef<HTMLDivElement>(null)

  // Animate the hero text in sequence on mount.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(badgeRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(headingRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.3')
        .fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
    }, heroRef)
    return () => ctx.revert()
  }, [])

  // Stagger the post cards in when they scroll into view.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsContainerRef.current?.children
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.06,
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
          },
        )
      }
    }, gridRef)
    return () => ctx.revert()
  }, [])

  // Fade the newsletter block in when it scrolls into view.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        newsletterRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: newsletterRef.current, start: 'top 85%' },
        },
      )
    }, newsletterRef)
    return () => ctx.revert()
  }, [])

  return (
    <Box>
      {/* Hero header */}
      <Box
        ref={heroRef}
        sx={{
          py: { xs: 10, md: 14 },
          px: { xs: 3, lg: 6 },
          textAlign: 'center',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F4FF 40%, #E8EEFF 100%)',
        }}
      >
        <Container maxWidth="md">
          <Typography
            ref={badgeRef}
            component="span"
            sx={{
              display: 'inline-block',
              bgcolor: 'var(--color-primary-light)',
              color: 'var(--color-primary-blue)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              px: 3,
              py: 1,
              borderRadius: 999,
              mb: 3,
            }}
          >
            THE LATEST DROPS
          </Typography>
          <Typography
            ref={headingRef}
            sx={{ fontSize: { xs: '2.5rem', md: '3.25rem' }, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}
          >
            Wearable Art Feed
          </Typography>
          <Typography
            ref={subRef}
            sx={{ mt: 2, color: 'var(--color-text-secondary)', maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}
          >
            A curated stream of digital craftsmanship brought to life on premium fabrics. Discover the next generation of apparel designers.
          </Typography>
        </Container>
      </Box>

      {/* Masonry post gallery */}
      <Box ref={gridRef} sx={{ px: { xs: 3, lg: 6 }, py: { xs: 4, md: 6 }, bgcolor: 'white' }}>
        <Container maxWidth="lg" sx={{ maxWidth: '1200px !important' }}>
          <Box ref={cardsContainerRef} sx={{ columnCount: { xs: 1, sm: 2, lg: 3 }, columnGap: 2 }}>
            {isLoading
              ? /* Loading skeletons. */
                Array.from({ length: 6 }).map((_, i) => (
                  <Box key={i} sx={{ breakInside: 'avoid', mb: 2, borderRadius: 3, overflow: 'hidden', bgcolor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <Box sx={{ aspectRatio: '3/4', bgcolor: '#e0e0e0' }} />
                  </Box>
                ))
              : isError
                ? /* Error state. */
                  (
                    <Box sx={{ textAlign: 'center', py: 8, columnSpan: 'all' }}>
                      <Typography color="error" variant="h6">Failed to load blog posts</Typography>
                      <Typography sx={{ color: 'var(--color-text-muted)', mt: 1 }}>Please try again later.</Typography>
                    </Box>
                  )
                : /* Rendered posts. */
                  posts.map((post: BlogPost) => (
                    <Box key={post.id} sx={{ breakInside: 'avoid', mb: 2 }}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': { transform: 'scale(1.02)', boxShadow: '0 10px 40px rgba(0,0,0,0.12)' },
                        }}
                        elevation={0}
                      >
                        <CardMedia
                          component="img"
                          image={post.imageUrl}
                          alt={post.title}
                          sx={{ width: '100%', display: 'block' }}
                        />
                      </Card>
                    </Box>
                  ))}
          </Box>
        </Container>
      </Box>

      {/* Newsletter signup */}
      <Box sx={{ px: { xs: 3, lg: 6 }, pb: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg" sx={{ maxWidth: '1100px !important' }}>
          <Box
            ref={newsletterRef}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              alignItems: { xs: 'flex-start', lg: 'center' },
              justifyContent: 'space-between',
              gap: 4,
              p: { xs: 4, md: 6 },
              borderRadius: 6,
              background: 'linear-gradient(135deg, #F0F4FF, #E8EEFF)',
            }}
          >
            <Box sx={{ maxWidth: 400 }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Stay in the Creative Loop
              </Typography>
              <Typography sx={{ mt: 1.5, fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                Get exclusive early access to limited edition drops, designer interviews, and creative tool updates delivered to your inbox.
              </Typography>
            </Box>

            <Box sx={{ width: { xs: '100%', lg: 'auto' }, flexShrink: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
                <TextField
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'var(--color-border-default)' },
                    },
                    width: { xs: '100%', sm: 280 },
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<ArrowRight size={16} />}
                  sx={{
                    bgcolor: 'var(--primary-blue)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'var(--primary-hover)' },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
              <Typography sx={{ mt: 1, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Join 10,000+ creators. Unsubscribe anytime.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
