import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Button, Grid } from '@mui/material'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const OVERLAY_GRADIENT = 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)'

const galleryItems = [
  { title: "Spider's Web", artist: 'Alex Chen', image: '/asserts/AboutAsserts/black-t-shirt-spidy.png' },
  { title: 'Deep Blue', artist: 'Maria Santos', image: '/asserts/AboutAsserts/dark-blue-design-t-shirt.png' },
  { title: 'Green Revolt', artist: 'Jordan Lee', image: '/asserts/AboutAsserts/green-revolt-design-t-shirt.png' },
  { title: 'Midnight Whiskers', artist: 'Priya Patel', image: '/asserts/AboutAsserts/purple-t-shirt-cat-design.png' },
  { title: 'Shandel Wave', artist: 'Chris Kim', image: '/asserts/AboutAsserts/shandel-t-shirt-design.png' },
  { title: 'Butterfly Dream', artist: 'Emma Watson', image: '/asserts/AboutAsserts/t-shirt-white-butterfly-design.png' },
  { title: 'Dino Roar', artist: "Liam O'Brien", image: '/asserts/AboutAsserts/yellow-t-shirt-dino-design.png' },
  { title: 'Urban Grey', artist: 'Sam Taylor', image: '/asserts/AboutAsserts/grey-t-shirt.png' },
]

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const storyTextRef = useRef<HTMLDivElement>(null)
  const storyImagesRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const galleryGridRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroContentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        storyTextRef.current,
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: storyRef.current, start: 'top 80%' },
        },
      )
      gsap.fromTo(
        storyImagesRef.current,
        { x: 30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: storyRef.current, start: 'top 80%' },
        },
      )
    }, storyRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = galleryGridRef.current?.children
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.08,
            scrollTrigger: { trigger: galleryRef.current, start: 'top 80%' },
          },
        )
      }
    }, galleryRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0, scale: 0.98 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
        },
      )
    }, ctaRef)
    return () => ctx.revert()
  }, [])

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <style>{`
        .about-hero {
          position: relative;
          min-height: 80vh;
          max-height: 900px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .about-hero-bg {
          position: absolute;
          inset: 0;
          background-image: url(/asserts/AboutAsserts/hero-page-image.png);
          background-size: cover;
          background-position: center;
        }
        .about-hero-overlay {
          position: absolute;
          inset: 0;
          background: ${OVERLAY_GRADIENT};
        }
        .about-hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 0 24px;
          max-width: 800px;
          margin: 0 auto;
        }
        .about-section {
          padding: 80px 24px;
        }
        .about-container {
          max-width: 1280px;
          margin: 0 auto;
        }
        .about-gallery-grid {
          columns: 1;
          gap: 24px;
        }
        .about-gallery-card {
          break-inside: avoid;
          margin-bottom: 24px;
          border-radius: 20px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .about-gallery-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.10);
        }
        .about-gallery-card img {
          width: 100%;
          display: block;
          border-radius: 20px 20px 0 0;
        }
        .about-mockup-frame {
          border: 1px solid #E2E8F0;
          border-radius: 16px 16px 0 0;
          overflow: hidden;
        }
        .about-mockup-bar {
          height: 32px;
          background: #F8FAFC;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 6px;
        }
        .about-mockup-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .about-mockup-url {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        .about-mockup-url-inner {
          background: #fff;
          border-radius: 4px;
          height: 20px;
          width: 40%;
        }
        @media (min-width: 640px) {
          .about-gallery-grid { columns: 2; }
          .about-section { padding: 80px 48px; }
        }
        @media (min-width: 1024px) {
          .about-gallery-grid { columns: 3; }
        }
      `}</style>

      {/* Hero Section */}
      <Box ref={heroRef} className="about-hero">
        <Box className="about-hero-bg" />
        <Box className="about-hero-overlay" />
        <Box ref={heroContentRef} className="about-hero-content">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '34px', md: '52px' },
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#fff',
              textShadow: '0 2px 12px rgba(0,0,0,0.3)',
              mb: 2,
            }}
          >
            Where Your Imagination{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #60A5FA, #22D3EE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Meets the Fabric
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              fontWeight: 400,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '560px',
              mx: 'auto',
              mb: 4,
            }}
          >
            Crafting custom apparel for every age, every style, and every wild idea.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/design"
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={18} />}
              sx={{
                bgcolor: '#0055FF',
                color: '#fff',
                fontWeight: 600,
                px: 4,
                py: 1.75,
                borderRadius: '12px',
                fontSize: '15px',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#0044CC',
                  transform: 'scale(1.02)',
                },
                transition: 'all 150ms ease',
              }}
            >
              Explore the Canvas
            </Button>
            <Button
              component={Link}
              to="/how-it-works"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                borderWidth: 1.5,
                color: '#fff',
                fontWeight: 600,
                px: 4,
                py: 1.75,
                borderRadius: '12px',
                fontSize: '15px',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.6)',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'scale(1.02)',
                },
                transition: 'all 150ms ease',
              }}
            >
              How it Works
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Our Origin Section */}
      <Box ref={storyRef} sx={{ bgcolor: '#F8FAFC' }} className="about-section">
        <Box className="about-container">
          <Grid container spacing={{ xs: 4, lg: 6 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box ref={storyTextRef}>
                <Typography
                  sx={{
                    color: 'var(--primary-blue, #0055FF)',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    mb: 1,
                  }}
                >
                  The Journey
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '30px', md: '40px' },
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: '#0F172A',
                    mb: 2.5,
                  }}
                >
                  Our Origin
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    lineHeight: 1.7,
                    color: '#64748B',
                    maxWidth: '520px',
                    mb: 2.5,
                  }}
                >
                  Electric Canvas was born from a simple belief: your{' '}
                  <Box component="strong" sx={{ fontStyle: 'italic', fontWeight: 700 }}>style</Box> should be as
                  unique as <Box component="strong" sx={{ fontStyle: 'italic', fontWeight: 700 }}>you</Box> are. What started as a small workshop experimenting with
                  custom prints has grown into a movement — a community of creators, dreamers, and rebels who refuse to wear
                  what everyone else is wearing.
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    lineHeight: 1.7,
                    color: '#64748B',
                    maxWidth: '520px',
                    mb: 2.5,
                  }}
                >
                  Every piece we create begins with your vision. From the first sketch
                  to the final stitch, we pour craftsmanship and care into every step.
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    lineHeight: 1.7,
                    color: '#64748B',
                    maxWidth: '520px',
                    mb: 5,
                  }}
                >
                  Whether you're designing for yourself, your brand, or a special event,
                  we're here to turn your ideas into something real &mdash; something that
                  fits, feels, and speaks volumes without saying a word.
                </Typography>
                <Box sx={{ display: 'flex', gap: 6 }}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '36px',
                        fontWeight: 700,
                        lineHeight: 1,
                        color: 'var(--primary-blue, #0055FF)',
                      }}
                    >
                      100%
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        lineHeight: 1.4,
                        color: '#64748B',
                        mt: 0.5,
                      }}
                    >
                      Creative Control
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '36px',
                        fontWeight: 700,
                        lineHeight: 1,
                        color: 'var(--primary-blue, #0055FF)',
                      }}
                    >
                      &infin;
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        lineHeight: 1.4,
                        color: '#64748B',
                        mt: 0.5,
                      }}
                    >
                      Design Possibilities
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box ref={storyImagesRef} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    lineHeight: 0,
                  }}
                >
                  <Box
                    component="img"
                    src="/asserts/AboutAsserts/t-shirt-design-mechine.png"
                    alt="T-shirt design machine in creative workspace"
                    sx={{ width: '100%', height: { xs: 240, md: 300 }, objectFit: 'cover', display: 'block' }}
                  />
                </Box>
                <Box
                  sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    lineHeight: 0,
                    mt: { xs: 0, lg: 6 },
                  }}
                >
                  <Box
                    component="img"
                    src="/asserts/AboutAsserts/t-shirt-colorful-design.png"
                    alt="Colorful t-shirt design"
                    sx={{ width: '100%', height: { xs: 200, md: 240 }, objectFit: 'cover', display: 'block' }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Community Masterpieces Gallery */}
      <Box ref={galleryRef} sx={{ bgcolor: '#F1F5F9' }} className="about-section">
        <Box className="about-container">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'flex-end' }, mb: 5, gap: 2 }}>
            <Box>
              <Typography
                sx={{
                  color: 'var(--primary-blue, #0055FF)',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                Gallery
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '30px', md: '40px' },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: '#0F172A',
                }}
              >
                Community Masterpieces
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '14px', md: '15px' },
                lineHeight: 1.6,
                color: '#64748B',
                maxWidth: '400px',
                textAlign: { md: 'right' },
              }}
            >
              A curation of the boldest and most intricate designs created by our global community of visionaries.
            </Typography>
          </Box>
          <Box ref={galleryGridRef} className="about-gallery-grid">
            {galleryItems.map((item, i) => (
              <Box key={i} className="about-gallery-card">
                {i === 0 ? (
                  <Box className="about-mockup-frame">
                    <Box className="about-mockup-bar">
                      <Box className="about-mockup-dot" sx={{ bgcolor: '#EF4444' }} />
                      <Box className="about-mockup-dot" sx={{ bgcolor: '#F59E0B' }} />
                      <Box className="about-mockup-dot" sx={{ bgcolor: '#10B981' }} />
                      <Box className="about-mockup-url">
                        <Box className="about-mockup-url-inner" />
                      </Box>
                    </Box>
                    <Box
                      component="img"
                      src={item.image}
                      alt={`${item.title} design by ${item.artist}`}
                    />
                  </Box>
                ) : (
                  <Box
                    component="img"
                    src={item.image}
                    alt={`${item.title} design by ${item.artist}`}
                  />
                )}
                <Box sx={{ p: '20px 20px 24px' }}>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 600,
                      lineHeight: 1.3,
                      color: '#0F172A',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      lineHeight: 1.4,
                      color: '#94A3B8',
                      mt: 0.5,
                    }}
                  >
                    by {item.artist}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* CTA Banner */}
      <Box
        ref={ctaRef}
        sx={{ bgcolor: '#0055FF', py: { xs: 6, md: 10 }, px: '24px', textAlign: 'center' }}
      >
        <Box sx={{ maxWidth: '700px', mx: 'auto' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '30px', md: '40px' },
              fontWeight: 700,
              lineHeight: 1.2,
              color: '#fff',
              mb: 2,
            }}
          >
            Ready to Build Your Original?
          </Typography>
          <Typography
            sx={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.85)',
              maxWidth: '560px',
              mx: 'auto',
              mb: 4,
            }}
          >
            Join thousands of creators who stopped searching and started designing. Your perfect shirt is one click away.
          </Typography>
          <Button
            component={Link}
            to="/design"
            variant="contained"
            size="large"
            endIcon={<ArrowRight size={20} />}
            sx={{
              bgcolor: '#fff',
              color: '#0055FF',
              fontWeight: 700,
              px: 4,
              py: 1.75,
              borderRadius: '12px',
              fontSize: '15px',
              textTransform: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: '#F0F7FF',
                transform: 'scale(1.03)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
              },
              transition: 'all 150ms ease',
            }}
          >
            Launch Design Tool
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
