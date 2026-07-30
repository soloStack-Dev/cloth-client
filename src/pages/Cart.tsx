
import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Box, Container, Typography, Button, Grid, IconButton, Paper } from '@mui/material'
import { Trash2, Minus, Plus, ArrowRight, Lock, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

export default function Cart() {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, subtotal } = useCartStore()
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const summaryRef = useRef<HTMLDivElement>(null)
  const emptyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        summaryRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      )
    }, summaryRef)
    return () => ctx.revert()
  }, [])

  const handleRemove = (id: string) => {
    const el = itemRefs.current.get(id)
    if (el) {
      gsap.to(el, {
        x: -60, opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in',
        onComplete: () => removeItem(id),
      })
    } else {
      removeItem(id)
    }
  }

  const setItemRef = (id: string, el: HTMLDivElement | null) => {
    if (el) itemRefs.current.set(id, el)
    else itemRefs.current.delete(id)
  }

  const subtotalAmount = subtotal()
  const tax = subtotalAmount * 0.02
  const total = subtotalAmount + tax

  if (items.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Box ref={emptyRef} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 16, textAlign: 'center' }}>
            <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <ShoppingBag size={36} color="#0055FF" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A', mb: 1 }}>
              Your canvas is empty
            </Typography>
            <Typography sx={{ color: '#64748B', mb: 4 }}>
              Start exploring our collection and add your favorites.
            </Typography>
            <Button
              component={Link}
              to="/collection"
              endIcon={<ArrowRight size={18} />}
              sx={{
                bgcolor: '#0055FF',
                color: 'white',
                fontWeight: 600,
                px: 6,
                py: 1.75,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '15px',
                '&:hover': { bgcolor: '#0044CC' },
              }}
            >
              Browse Collection
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#0055FF', fontSize: '36px' }}>
              Your Canvas
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.5 }}>
              {items.length} ITEM{items.length !== 1 ? 'S' : ''}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((item) => (
              <Paper
                key={item.id}
                ref={(el) => setItemRef(item.id, el)}
                sx={{ borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', p: 2.5, display: 'flex', gap: 2 }}
              >
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.name}
                  sx={{ width: 80, height: 80, borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, color: '#0F172A', fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#94A3B8', mt: 0.5 }}>
                    Size: {item.size}, Color: {item.colorName}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0055FF', fontSize: '16px', mt: 1 }}>
                    ${item.price.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', flexShrink: 0 }}>
                  <IconButton onClick={() => handleRemove(item.id)} sx={{ color: '#EF4444', '&:hover': { bgcolor: '#FEF2F2' } }}>
                    <Trash2 size={20} />
                  </IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F1F5F9', borderRadius: '9999px', height: 36 }}>
                    <IconButton
                      onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                      size="small"
                      sx={{ color: '#64748B', '&:hover': { color: '#0F172A' }, px: 1.5 }}
                    >
                      <Minus size={14} />
                    </IconButton>
                    <Typography sx={{ px: 1.5, fontSize: '14px', fontWeight: 600, color: '#0F172A', minWidth: 24, textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      size="small"
                      sx={{ color: '#64748B', '&:hover': { color: '#0F172A' }, px: 1.5 }}
                    >
                      <Plus size={14} />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box ref={summaryRef} sx={{ position: { md: 'sticky' }, top: { md: 100 }, alignSelf: 'flex-start' }}>
              <Paper sx={{ bgcolor: '#0F172A', borderRadius: '20px', p: 3.5, boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}>
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '20px', mb: 3 }}>
                  Summary
                </Typography>
                <Box sx={{ '& > :not(:last-child)': { mb: 1.5 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#CBD5E1', fontSize: '14px' }}>Subtotal</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 500, fontSize: '14px' }}>${subtotalAmount.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#CBD5E1', fontSize: '14px' }}>Shipping</Typography>
                    <Typography sx={{ color: '#10B981', fontWeight: 600, fontSize: '14px' }}>FREE</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography sx={{ color: '#CBD5E1', fontSize: '14px' }}>Tax</Typography>
                    <Typography sx={{ color: 'white', fontWeight: 500, fontSize: '14px' }}>${tax.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ pt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>Total</Typography>
                      <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '28px' }}>${total.toFixed(2)}</Typography>
                    </Box>
                    <Typography sx={{ color: '#6B7280', fontSize: '11px', mt: 0.5 }}>
                      inclusive of all taxes
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  onClick={() => navigate('/checkout')}
                  endIcon={<ArrowRight size={18} />}
                  sx={{
                    mt: 3,
                    bgcolor: '#0055FF',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '15px',
                    py: 2,
                    borderRadius: '14px',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#0044CC' },
                  }}
                >
                  Order Now
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
                  <Lock size={12} color="#6B7280" />
                  <Typography sx={{ color: '#6B7280', fontSize: '12px' }}>
                    Secure encrypted checkout
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
