/**
 * Checkout.tsx
 * ------------
 * Checkout page: shipping details + payment method + order summary.
 *
 * The form is validated with Zod. On success the cart is cleared and
 * the user is sent back home (this is a demo, no real payment happens).
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Button, TextField, Grid, Paper, Divider } from '@mui/material'
import { CreditCard, Wallet, ArrowLeft, CheckCircle } from 'lucide-react'
import { z } from 'zod'
import { useCartStore } from '../store/cartStore'

/** Fixed demo tax shown on the order summary. */
const TAX = 12.74

/** Payment options the user can choose from. */
type PaymentMethod = 'card' | 'upi'

/** Fields that must be filled before the order can be placed. */
const checkoutSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().min(1, 'Email is required'),
  address: z.string().min(1, 'Address is required'),
  paymentMethod: z.enum(['card', 'upi']),
})

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal } = useCartStore()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Money math for the order summary.
  const subtotalAmount = subtotal()
  const total = subtotalAmount + TAX

  /** Validate the form and place the order if everything is valid. */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Read the native form fields into a plain object.
    const form = new FormData(e.currentTarget)
    const data = {
      username: form.get('username') as string,
      email: form.get('email') as string,
      address: form.get('address') as string,
      paymentMethod,
    }

    // Run Zod validation. If it fails, map errors by field name.
    const result = checkoutSchema.safeParse(data)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    // Valid — empty the cart and consider the order placed.
    setErrors({})
    useCartStore.getState().clearCart()
    navigate('/')
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <Container maxWidth="sm" sx={{ py: '60px' }}>
        {/* Back navigation. */}
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748B', textDecoration: 'none', fontSize: '14px', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <Box component="form" onSubmit={handleSubmit}>
          <Paper sx={{ borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)', p: 5 }}>
            {/* Shipping & details fields. */}
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
                    sx={textFieldStyles}
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
                    sx={textFieldStyles}
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
                  sx={textFieldStyles}
                />
                {errors.address && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.address}
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 5 }} />

            {/* Payment method selector (Card vs UPI). */}
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '20px', mb: 3 }}>
                Payment Method
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <PaymentOption
                    icon={<CreditCard size={24} color="#0055FF" />}
                    title="Card Payment"
                    subtitle="Visa, Mastercard, Amex"
                    selected={paymentMethod === 'card'}
                    onSelect={() => setPaymentMethod('card')}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <PaymentOption
                    icon={<Wallet size={24} color="#0055FF" />}
                    title="UPI / Wallet"
                    subtitle="GPay, PhonePe, Apple Pay"
                    selected={paymentMethod === 'upi'}
                    onSelect={() => setPaymentMethod('upi')}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Order summary lines. */}
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
                  <Typography sx={{ color: '#0F172A', fontSize: '14px' }}>${TAX.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '16px' }}>Total</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0055FF', fontSize: '16px' }}>${total.toFixed(2)}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Place order button. */}
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

/* ------------------------------------------------------------------ */
/* Reusable styled pieces                                              */
/* ------------------------------------------------------------------ */

/** Shared styling for the checkout text fields. */
const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '& fieldset': { borderColor: '#E2E8F0' },
    '&:hover fieldset': { borderColor: '#CBD5E1' },
    '&.Mui-focused fieldset': { borderColor: '#0055FF' },
  },
} as const

/** A clickable payment-method card with a radio-style indicator. */
function PaymentOption(props: {
  icon: React.ReactNode
  title: string
  subtitle: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <Paper
      onClick={props.onSelect}
      sx={{
        position: 'relative',
        p: 2.5,
        borderRadius: '14px',
        border: props.selected ? '2px solid #0055FF' : '1px solid #E2E8F0',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: props.selected ? '#0055FF' : '#CBD5E1' },
      }}
    >
      {/* Radio indicator in the corner. */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 18,
          height: 18,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: props.selected ? 'none' : '2px solid #CBD5E1',
          bgcolor: props.selected ? '#0055FF' : 'transparent',
        }}
      >
        {props.selected && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'white' }} />}
      </Box>

      {props.icon}
      <Typography sx={{ fontWeight: 600, color: '#0F172A', fontSize: '14px', mt: 1 }}>
        {props.title}
      </Typography>
      <Typography sx={{ color: '#94A3B8', fontSize: '12px', mt: 0.5 }}>
        {props.subtitle}
      </Typography>
    </Paper>
  )
}
