import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Box, Container, Typography, Card, CardMedia, CardContent, Grid, Select, MenuItem, FormControl, Dialog, IconButton, Button, TextField } from '@mui/material'
import { Heart, ChevronDown, X, ShoppingBag, Search, Trash2 } from 'lucide-react'
import { fetchProducts, fetchAiProducts, deleteAiProduct } from '../lib/api'
import { useCartStore } from '../store/cartStore'

gsap.registerPlugin(ScrollTrigger)

const staticProducts = [
  { id: '1', name: 'Neon Pulse', description: 'Vibrant neon design', price: '32.99', imageUrl: '/asserts/CollectionAsserts/cat-drink-coffee-t-shirt.jpg' },
  { id: '2', name: 'Cyber Lotus', description: 'Digital flower pattern', price: '28.50', imageUrl: '/asserts/CollectionAsserts/cats-t-shirt.jpg' },
  { id: '3', name: 'Glitch Horizon', description: 'Glitch art landscape', price: '44.00', imageUrl: '/asserts/CollectionAsserts/city-design-t-shirt.jpg' },
  { id: '4', name: 'Neural Network', description: 'AI-inspired pattern', price: '39.95', imageUrl: '/asserts/CollectionAsserts/japanese-nature-t-shirt.jpg' },
  { id: '5', name: 'Tokyo Tiger', description: 'Japanese art style', price: '49.99', imageUrl: '/asserts/CollectionAsserts/Tokyo-Tiger-t-shirt.jpg' },
  { id: '6', name: 'Never Look Back', description: 'Motivational typography', price: '34.99', imageUrl: '/asserts/CollectionAsserts/never-look-back-t-shirt.jpg' },
  { id: '7', name: 'Black Cat', description: 'Playful cat design', price: '29.99', imageUrl: '/asserts/CollectionAsserts/black-cat-stuck-t-shirt.jpg' },
  { id: '8', name: 'Duck Finger', description: 'Funny duck design', price: '27.99', imageUrl: '/asserts/CollectionAsserts/duck-finger-t-shirt.jpg' },
]

const galleryImages = [
  { src: '/asserts/CollectionAsserts/cube-t-shirt.png', label: 'Abstract Cube' },
  { src: '/asserts/CollectionAsserts/japanese-tree-t-shirt.jpg', label: 'Japanese Tree' },
  { src: '/asserts/CollectionAsserts/pink-t-shirt.jpg', label: 'Pink Aesthetic' },
  { src: '/asserts/CollectionAsserts/tom-and-jerry-t-shirt.jpg', label: 'Tom & Jerry' },
  { src: '/asserts/CollectionAsserts/white-t-shirt-colorful-design.png', label: 'Colorful Design' },
  { src: '/asserts/CollectionAsserts/women-black-t-shirt.png', label: 'Women Black Tee' },
]

type ProductItem = typeof staticProducts[number]

export default function Collection() {
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  const queryClient = useQueryClient()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState('Latest Arrivals')
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const { data: aiData } = useQuery({
    queryKey: ['ai-products'],
    queryFn: fetchAiProducts,
    refetchInterval: 3000,
  })

  const products = [...(data ?? staticProducts), ...(aiData ?? [])]

  const isAiProduct = (id: string) => aiData?.some((p: ProductItem) => p.id === id) ?? false

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteAiProduct(id)
      queryClient.invalidateQueries({ queryKey: ['ai-products'] })
    } catch { /* ignore */ }
  }

  const filteredProducts = products
    .filter((p: ProductItem) =>
      !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a: ProductItem, b: ProductItem) => {
      if (filter === 'Price: Low to High') return parseFloat(a.price) - parseFloat(b.price)
      if (filter === 'Price: High to Low') return parseFloat(b.price) - parseFloat(a.price)
      return 0
    })

  const heroRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const gridHeaderRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const galleryGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(heroContentRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridHeaderRef.current) {
        gsap.fromTo(gridHeaderRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, scrollTrigger: { trigger: gridRef.current, start: 'top 85%' } },
        )
      }
    }, gridRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsContainerRef.current?.children
      if (cards) {
        gsap.fromTo(cards,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, scrollTrigger: { trigger: gridRef.current, start: 'top 80%' } },
        )
      }
    }, gridRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = galleryGridRef.current?.children
      if (items) {
        gsap.fromTo(items,
          { y: 40, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.06, scrollTrigger: { trigger: galleryRef.current, start: 'top 85%' } },
        )
      }
    }, galleryRef)
    return () => ctx.revert()
  }, [])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleBuyNow = (product: ProductItem) => {
    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      imageUrl: product.imageUrl,
      quantity: 1,
      size: 'M',
      colorName: 'Standard',
    })
    setSelectedProduct(null)
    navigate('/cart')
  }

  return (
    <Box>
      <Box
        ref={heroRef}
        sx={{
          py: { xs: 6, md: 10 },
          px: { xs: 3, lg: 6 },
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F4FF 50%, #EEF2FF 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Box ref={heroContentRef} sx={{ maxWidth: 560 }}>
            <Typography
              sx={{ fontSize: '48px', fontWeight: 700, lineHeight: 1.1, color: 'var(--color-text-primary)' }}
            >
              Curated Creations
            </Typography>
            <Typography
              sx={{ mt: 2, color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}
            >
              Browse the vault of community-designed masterpieces. Every piece is a unique synthesis of human imagination and algorithmic precision.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box ref={gridRef} sx={{ py: { xs: 6, md: 8 }, px: { xs: 3, lg: 6 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box
            ref={gridHeaderRef}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
              mb: 4,
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{ color: 'var(--color-primary-blue)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                THE VAULT
              </Typography>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', mt: 0.5 }}>
                Community Favorites
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: { xs: 'stretch', sm: 'center' } }}>
              <TextField
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <Box component="span" sx={{ display: 'flex', mr: 0.5, color: 'var(--text-muted)' }}>
                        <Search size={16} />
                      </Box>
                    ),
                  },
                }}
                sx={{
                  minWidth: 180,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    '& fieldset': { borderColor: 'var(--border-default)' },
                    '&:hover fieldset': { borderColor: 'var(--primary-blue)' },
                  },
                }}
              />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  IconComponent={(props) => <ChevronDown size={16} {...props} />}
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-default)' },
                  }}
                >
                  <MenuItem value="Latest Arrivals">Latest Arrivals</MenuItem>
                  <MenuItem value="Best Sellers">Best Sellers</MenuItem>
                  <MenuItem value="Price: Low to High">Price: Low to High</MenuItem>
                  <MenuItem value="Price: High to Low">Price: High to Low</MenuItem>
                  <MenuItem value="Trending">Trending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Grid container spacing={3} ref={cardsContainerRef}>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
                    <Box sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                      <Box sx={{ aspectRatio: '1/1', bgcolor: '#e0e0e0' }} />
                      <Box sx={{ p: 2.5 }}>
                        <Box sx={{ height: 16, bgcolor: '#e0e0e0', borderRadius: 1, width: '75%', mb: 1.5 }} />
                        <Box sx={{ height: 12, bgcolor: '#e0e0e0', borderRadius: 1, width: '50%' }} />
                      </Box>
                    </Box>
                  </Grid>
                ))
              : isError
              ? (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography color="error" variant="h6">Failed to load products</Typography>
                      <Typography sx={{ color: 'var(--color-text-muted)', mt: 1 }}>Please try again later.</Typography>
                    </Box>
                  </Grid>
                )
              : filteredProducts.map((product: ProductItem) => {
                  const isFav = favorites.has(product.id)
                  return (
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={product.id}>
                      <Card
                        onClick={() => setSelectedProduct(product)}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 3,
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                          },
                        }}
                        elevation={0}
                      >
                        <Box sx={{ aspectRatio: '1/1', overflow: 'hidden', bgcolor: '#fafafa' }}>
                          <CardMedia
                            component="img"
                            image={product.imageUrl}
                            alt={product.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.5s ease',
                            }}
                            className="product-card-img"
                          />
                        </Box>
                        <CardContent sx={{ p: 2.5 }}>
                          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', mt: 0.5, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {product.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-blue)' }}>
                              ${product.price}
                            </Typography>
                            <Box
                              component="button"
                              onClick={(e) => { e.preventDefault(); toggleFavorite(product.id) }}
                              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                              aria-pressed={isFav}
                              sx={{
                                p: 0.75,
                                borderRadius: '50%',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.2s ease',
                                '&:hover': { transform: 'scale(1.1)' },
                                '&:active': { transform: 'scale(0.9)' },
                              }}
                            >
                              <Heart
                                size={20}
                                fill={isFav ? '#ef4444' : 'none'}
                                stroke={isFav ? '#ef4444' : 'var(--color-text-muted)'}
                              />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
          </Grid>
        </Container>
      </Box>

      <Box ref={galleryRef} sx={{ py: { xs: 8, md: 12 }, px: { xs: 3, lg: 6 }, backgroundColor: '#0F172A' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              sx={{ color: '#60A5FA', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              INSPIRATION FEED
            </Typography>
            <Typography sx={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', mt: 1.5 }}>
              Wearable Art Gallery
            </Typography>
            <Typography sx={{ color: 'var(--color-text-muted)', maxWidth: 600, mx: 'auto', mt: 2, fontSize: '0.875rem', lineHeight: 1.7 }}>
              A curated look into the possibilities of the Electric Canvas. These trending designs represent the frontier of digital fashion.
            </Typography>
          </Box>

          <Box
            ref={galleryGridRef}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 2.5,
              gridAutoRows: { xs: '200px', md: '240px' },
            }}
          >
            {galleryImages.map((img, i) => {
              const isLarge = i === 0
              const isTall = i === 3
              return (
                <Box
                  key={i}
                  className="gallery-cell"
                  sx={{
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.4s ease',
                    '&:hover': { transform: 'scale(1.02)' },
                    '&:hover .gallery-cell-img': { transform: 'scale(1.05)' },
                    '&:hover .gallery-cell-overlay': { opacity: 1 },
                    '&:hover .gallery-cell-label': { opacity: 1, transform: 'translateY(0)' },
                    ...(isLarge ? { gridColumn: 'span 2', gridRow: 'span 2' } : {}),
                    ...(isTall ? { md: { gridRow: 'span 2' } } : {}),
                  }}
                >
                  <Box
                    component="img"
                    className="gallery-cell-img"
                    src={img.src}
                    alt={img.label}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  <Box
                    className="gallery-cell-overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                  <Typography
                    className="gallery-cell-label"
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      opacity: 0,
                      transform: 'translateY(8px)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {img.label}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Container>
      </Box>

      {/* Product Detail Dialog */}
      <Dialog
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, overflow: 'hidden', position: 'relative' } } }}
      >
        {selectedProduct && (
          <>
            <IconButton
              onClick={() => setSelectedProduct(null)}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 10,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <X size={20} />
            </IconButton>
            <Box
              component="img"
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              sx={{ width: '100%', maxHeight: 320, objectFit: 'cover', display: 'block' }}
            />
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedProduct.name}
              </Typography>
              <Typography sx={{ mt: 1, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {selectedProduct.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
                <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                  ${selectedProduct.price}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {isAiProduct(selectedProduct.id) && (
                    <Button
                      variant="outlined"
                      startIcon={<Trash2 size={16} />}
                      onClick={() => { handleDeleteProduct(selectedProduct.id); setSelectedProduct(null) }}
                      sx={{
                        borderColor: '#EF4444',
                        color: '#EF4444',
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.9375rem',
                        '&:hover': { borderColor: '#DC2626', bgcolor: 'rgba(239,68,68,0.06)' },
                      }}
                    >
                      Delete
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    startIcon={<ShoppingBag size={18} />}
                    onClick={() => handleBuyNow(selectedProduct)}
                    sx={{
                      bgcolor: 'var(--primary-blue)',
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '0.9375rem',
                      '&:hover': { bgcolor: 'var(--primary-hover)' },
                    }}
                  >
                    Buy Now
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Dialog>
    </Box>
  )
}
