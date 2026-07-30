import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Button, TextField, Grid, Paper, Divider } from '@mui/material'
import { CreditCard, Wallet, ArrowLeft, CheckCircle } from 'lucide-react'
import { z } from 'zod'
import { useCartStore } from '../store/cartStore'

const checkoutSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().min(1, 'Email is required'),
  address: z.string().min(1, 'Address is required'),
  paymentMethod: z.enum(['card', 'upi']),
})

type PaymentMethod = 'card' | 'upi'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotalAmount = subtotal()
  const tax = 12.74
  const total = subtotalAmount + tax

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data = {
      username: form.get('username') as string,
      email: form.get('email') as string,
      address: form.get('address') as string,
      paymentMethod,
    }
    const result = checkoutSchema.safeParse(data)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    useCartStore.getState().clearCart()
    navigate('/')
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <Container maxWidth="sm" sx={{ py: '60px' }}>
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748B', textDecoration: 'none', fontSize: '14px', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <Box component="form" onSubmit={handleSubmit}>
          <Paper sx={{ borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)', p: 5 }}>
            {/* Shipping & Details */}
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '20px', mb: 3 }}>
                Shipping & Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#0F172A', mb: 0.75 }}>
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    name="username"
                    placeholder="John Creative"
                    slotProps={{ htmlInput: { sx: { fontSize: '14px', py: 1.5 } } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&:hover fieldset': { borderColor: '#CBD5E1' },
                        '&.Mui-focused fieldset': { borderColor: '#0055FF' },
                      },
                    }}
                  />
                  {errors.username && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.username}
                    </Typography>
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#0F172A', mb: 0.75 }}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    placeholder="john@electriccanvas.com"
                    slotProps={{ htmlInput: { sx: { fontSize: '14px', py: 1.5 } } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&:hover fieldset': { borderColor: '#CBD5E1' },
                        '&.Mui-focused fieldset': { borderColor: '#0055FF' },
                      },
                    }}
                  />
                  {errors.email && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.email}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Box>
                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#0F172A', mb: 0.75 }}>
                  Message / Full Address
                </Typography>
                <TextField
                  fullWidth
                  name="address"
                  multiline
                  rows={3}
                  placeholder="123 Creative Street, Design District, 90210"
                  slotProps={{ htmlInput: { sx: { fontSize: '14px', py: 1.5 } } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: '#CBD5E1' },
                      '&.Mui-focused fieldset': { borderColor: '#0055FF' },
                    },
                  }}
                />
                {errors.address && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.address}
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 5 }} />

            {/* Payment Method */}
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '20px', mb: 3 }}>
                Payment Method
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper
                    onClick={() => setPaymentMethod('card')}
                    sx={{
                      position: 'relative',
                      p: 2.5,
                      borderRadius: '14px',
                      border: paymentMethod === 'card' ? '2px solid #0055FF' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                      '&:hover': { borderColor: paymentMethod === 'card' ? '#0055FF' : '#CBD5E1' },
                    }}
                  >
                    <Box sx={{ position: 'absolute', top: 16, right: 16, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: paymentMethod === 'card' ? 'none' : '2px solid #CBD5E1', bgcolor: paymentMethod === 'card' ? '#0055FF' : 'transparent' }}>
                      {paymentMethod === 'card' && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'white' }} />}
                    </Box>
                    <CreditCard size={24} color="#0055FF" style={{ marginBottom: 12 }} />
                    <Typography sx={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>
                      Card Payment
                    </Typography>
                    <Typography sx={{ color: '#94A3B8', fontSize: '12px', mt: 0.5 }}>
                      Visa, Mastercard, Amex
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper
                    onClick={() => setPaymentMethod('upi')}
                    sx={{
                      position: 'relative',
                      p: 2.5,
                      borderRadius: '14px',
                      border: paymentMethod === 'upi' ? '2px solid #0055FF' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                      '&:hover': { borderColor: paymentMethod === 'upi' ? '#0055FF' : '#CBD5E1' },
                    }}
                  >
                    <Box sx={{ position: 'absolute', top: 16, right: 16, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: paymentMethod === 'upi' ? 'none' : '2px solid #CBD5E1', bgcolor: paymentMethod === 'upi' ? '#0055FF' : 'transparent' }}>
                      {paymentMethod === 'upi' && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'white' }} />}
                    </Box>
                    <Wallet size={24} color="#0055FF" style={{ marginBottom: 12 }} />
                    <Typography sx={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>
                      UPI / Wallet
                    </Typography>
                    <Typography sx={{ color: '#94A3B8', fontSize: '12px', mt: 0.5 }}>
                      GPay, PhonePe, Apple Pay
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Order Summary */}
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '20px', mb: 3 }}>
                Order Summary
              </Typography>
              <Box sx={{ '& > :not(:last-child)': { mb: 1 } }}>
                {items.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#64748B', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                      {item.name} × {item.quantity}
                    </Typography>
                    <Typography sx={{ color: '#0F172A', fontWeight: 500, fontSize: '14px' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ '& > :not(:last-child)': { mb: 0.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#64748B', fontSize: '14px' }}>Subtotal</Typography>
                  <Typography sx={{ color: '#0F172A', fontSize: '14px' }}>${subtotalAmount.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#64748B', fontSize: '14px' }}>Tax</Typography>
                  <Typography sx={{ color: '#0F172A', fontSize: '14px' }}>${tax.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '16px' }}>Total</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0055FF', fontSize: '16px' }}>${total.toFixed(2)}</Typography>
                </Box>
              </Box>
            </Box>

            <Button
              type="submit"
              fullWidth
              endIcon={<CheckCircle size={20} />}
              sx={{
                bgcolor: '#0055FF',
                color: 'white',
                fontWeight: 600,
                fontSize: '16px',
                py: 1.75,
                borderRadius: '12px',
                textTransform: 'none',
                '&:hover': { bgcolor: '#0044CC' },
              }}
            >
              Place Order
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}
