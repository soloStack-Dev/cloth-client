const API_BASE = 'http://localhost:3001/api'

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function fetchAiProducts() {
  try {
    const res = await fetch(`${API_BASE}/ai/products`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function generateAiListing(data: {
  text: string
  font: string
  shirtColor: string
  imageUrl: string
  keyword: string
}) {
  const res = await fetch(`${API_BASE}/ai/generate-listing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('AI generation failed')
  return res.json()
}

export async function deleteAiProduct(id: string) {
  const res = await fetch(`${API_BASE}/ai/products/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Delete failed')
  return res.json()
}

export async function fetchBlogPosts() {
  const res = await fetch(`${API_BASE}/blog`)
  if (!res.ok) throw new Error('Failed to fetch blog posts')
  return res.json()
}

export async function login(data: { username: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Login failed')
  return res.json()
}

export async function signup(data: { username: string; email: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Signup failed')
  return res.json()
}
