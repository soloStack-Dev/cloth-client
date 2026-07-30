import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Container, Typography, Button, Card, CardMedia, CardContent, Grid, Paper, Dialog, IconButton } from '@mui/material'
import { Sparkles, ArrowRight, Star, Shield, Truck, Award, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const brands = [
  'SUSTAINABLE', 'PREMIUM QUALITY', 'CUSTOM FIT',
  'FREE SHIPPING', 'EASY RETURNS', 'ECO-FRIENDLY',
  'HANDCRAFTED', 'LIFETIME GUARANTEE',
]

const products = [
  {
    name: 'Floral Elegance',
    price: '$34.99',
    image: '/asserts/HomeAsserts/white-t-shirt-flower-design.png',
  },
  {
    name: 'Crimson Wave',
    price: '$29.99',
    image: '/asserts/HomeAsserts/red-design-t-shirt.png',
  },
  {
    name: 'Sunburst',
    price: '$32.99',
    image: '/asserts/HomeAsserts/yellow-t-shirt-design.png',
  },
  {
    name: 'Midnight Navy',
    price: '$36.99',
    image: '/asserts/HomeAsserts/dark-blue-t-shirt.png',
  },
]

const services = [
  {
    icon: '/asserts/HomeAsserts/service-section-icon.png',
    lucideIcon: Shield,
    title: 'Premium Quality',
    description: 'Our custom apparel uses only the finest materials, ensuring every piece feels luxurious and lasts for years to come.',
  },
  {
    icon: '/asserts/HomeAsserts/service-section-rocket-icon.png',
    lucideIcon: Truck,
    title: 'Fast Delivery',
    description: 'From design to doorstep in record time. Our streamlined production means you get your custom gear when you need it.',
  },
  {
    icon: '/asserts/HomeAsserts/service-section-gear-clock-icon.png',
    lucideIcon: Award,
    title: '24/7 Support',
    description: 'Our dedicated team is always available to help bring your vision to life, from design advice to order tracking.',
  },
]

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const brandStripRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const ctaSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(headingRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
        .fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
        .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
    }, heroRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const strip = brandStripRef.current
    if (!strip) return
    const ctx = gsap.context(() => {
      const width = strip.scrollWidth / 2
      gsap.to(strip, {
        x: -width,
        duration: 30,
        ease: 'none',
        repeat: -1,
      })
    }, brandStripRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = productsRef.current?.children
      if (cards) {
        gsap.fromTo(cards,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.15,
            scrollTrigger: { trigger: featuredRef.current, start: 'top 80%' },
          },
        )
      }
    }, featuredRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = servicesRef.current?.children
      if (cards) {
        gsap.fromTo(cards,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.2,
            scrollTrigger: { trigger: servicesRef.current, start: 'top 85%' },
          },
        )
      }
    }, servicesRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ctaSectionRef.current,
        { scale: 0.92, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: ctaSectionRef.current, start: 'top 85%' },
        },
      )
    }, ctaSectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box className="hero-section" ref={heroRef}>
        <Box className="hero-bg">
          <img src="/asserts/HomeAsserts/hero-section-image.png" alt="" />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)',
          }}
        />
        <Box className="hero-content">
          <Box className="hero-badge" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            <Sparkles size={14} />
            CUSTOM APPAREL DESIGN
          </Box>
          <Typography
            ref={headingRef}
            className="hero-headline"
            sx={{ color: 'white' }}
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
            ref={subRef}
            className="hero-sub"
            sx={{ color: 'rgba(255,255,255,0.8)' }}
          >
            Transform your ideas into wearable art. Premium custom apparel designed
            for those who dare to stand out — from bold graphics to elegant minimalism.
          </Typography>
          <Box ref={ctaRef} className="hero-cta-group">
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/design-studio"
              endIcon={<ArrowRight size={18} />}
              sx={{
                bgcolor: 'var(--primary-blue)',
                borderRadius: 9999,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': { bgcolor: 'var(--primary-hover)' },
              }}
            >
              Start Designing
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/collection"
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: 'white',
                borderRadius: 9999,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Explore Collection
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Brand Strip */}
      <Box sx={{ bgcolor: 'var(--bg-footer)', py: 3, overflow: 'hidden' }}>
        <Box ref={brandStripRef} sx={{ display: 'flex', gap: 6, whiteSpace: 'nowrap', width: 'fit-content' }}>
          {[...brands, ...brands].map((brand, i) => (
            <Typography
              key={i}
              component="span"
              sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', color: 'var(--text-muted)' }}
            >
              {brand}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Featured Products */}
      <Box ref={featuredRef} className="section-padding">
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box className="section-label" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Star size={14} />
              Collection
            </Box>
            <Typography variant="h2" className="section-heading">
              Featured Collection
            </Typography>
            <Typography className="section-sub" sx={{ mx: 'auto' }}>
              Handpicked designs ready to wear. Every piece tells a story.
            </Typography>
          </Box>
          <Grid container spacing={3} ref={productsRef}>
            {products.map((product, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  onClick={() => setSelectedImage(product.image)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 },
                  }}
                  elevation={2}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{ aspectRatio: '1/1', objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600 }} color="text.primary">
                      {product.name}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: 'var(--primary-blue)', mt: 0.5 }}>
                      {product.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Services */}
      <Box className="section-padding" sx={{ bgcolor: 'var(--bg-page)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography className="section-label">Why Choose Us</Typography>
            <Typography variant="h2" className="section-heading">
              Designed for You
            </Typography>
            <Typography className="section-sub" sx={{ mx: 'auto' }}>
              Every detail matters. That's why we go the extra mile.
            </Typography>
          </Box>
          <Grid container spacing={4} ref={servicesRef}>
            {services.map((service, i) => {
              const LucideIcon = service.lucideIcon
              return (
                <Grid key={i} size={{ xs: 12, md: 4 }}>
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      transition: 'all 0.3s',
                      '&:hover': { boxShadow: 6 },
                    }}
                    elevation={1}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: 'var(--primary-light)',
                        position: 'relative',
                      }}
                    >
                      <Box component="img" src={service.icon} alt="" sx={{ width: 32, height: 32 }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -4,
                          right: -4,
                          bgcolor: 'var(--primary-blue)',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <LucideIcon size={14} color="white" />
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                      {service.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {service.description}
                    </Typography>
                  </Paper>
                </Grid>
              )
            })}
          </Grid>
        </Container>
      </Box>

      {/* CTA Banner */}
      <Box
        ref={ctaSectionRef}
        sx={{ bgcolor: 'var(--primary-blue)', py: 10, textAlign: 'center' }}
      >
        <Container maxWidth="sm">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }} color="white">
            Ready to Create Your Original?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}>
            Your vision, your rules. Start building something uniquely yours today.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/design"
            endIcon={<ArrowRight size={20} />}
            sx={{
              bgcolor: 'white',
              color: 'var(--primary-blue)',
              fontWeight: 700,
              px: 5,
              py: 1.5,
              borderRadius: 9999,
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
          >
            Launch Design Tool
          </Button>
        </Container>
      </Box>

      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, overflow: 'hidden', position: 'relative', bgcolor: 'transparent', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' } } }}
      >
        <IconButton
          onClick={() => setSelectedImage(null)}
          sx={{
            position: 'absolute', top: 12, right: 12, zIndex: 10,
            bgcolor: 'rgba(0,0,0,0.5)', color: 'white',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
          }}
        >
          <X size={20} />
        </IconButton>
        {selectedImage && (
          <Box
            component="img"
            src={selectedImage}
            alt=""
            sx={{ width: '100%', display: 'block' }}
          />
        )}
      </Dialog>
    </Box>
  )
}
