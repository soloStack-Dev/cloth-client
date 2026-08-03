/**
 * api.ts
 * ------
 * Thin wrapper around the backend REST API.
 *
 * Every page calls these functions instead of `fetch` directly, so the
 * base URL, headers and error handling live in exactly one place.
 */

// Base URL of the backend (Vite injects VITE_API_URL at build time).
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

/* ------------------------------------------------------------------ */
/* Response types (client-side views of the server data)               */
/* ------------------------------------------------------------------ */

/** A product from the static catalog. */
export interface Product {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
  category?: string
  isFavorite?: boolean
}

/** A design created in the studio (either AI-generated or custom). */
export interface AiProduct {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
  keyword?: string
}

/** A blog post from the feed. */
export interface BlogPost {
  id: string
  title: string
  imageUrl: string
  author?: string
  content?: string
}

/* ------------------------------------------------------------------ */
/* Shared request helper                                               */
/* ------------------------------------------------------------------ */

/**
 * Perform a fetch to the API and throw a readable error when the server
 * responds with a non-2xx status.
 */
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options)

  if (!res.ok) throw new Error(`Request failed: ${path}`)

  return res.json() as Promise<T>
}

/** Helper that JSON-encodes a body for POST-like requests. */
function jsonBody(body: unknown): RequestInit {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

/* ------------------------------------------------------------------ */
/* Public API functions                                                */
/* ------------------------------------------------------------------ */

/** Fetch the static product catalog. */
export function fetchProducts(): Promise<Product[]> {
  return request('/products')
}

/**
 * Fetch AI + custom designs. Returns an empty array on any failure so
 * the Collection page still renders with the static fallback products.
 */
export async function fetchAiProducts(): Promise<AiProduct[]> {
  try {
    return await request('/ai/products')
  } catch {
    return []
  }
}

/** Ask the backend to generate a listing for a design in the studio. */
export function generateAiListing(data: {
  text: string
  font: string
  shirtColor: string
  imageUrl: string
  keyword: string
}): Promise<AiProduct> {
  return request('/ai/generate-listing', jsonBody(data))
}

/** Save a finished design directly (no AI) as a custom design. */
export function submitDesign(data: {
  name: string
  description: string
  price: string
  imageUrl: string
}): Promise<AiProduct> {
  return request('/ai/designs', jsonBody({ ...data, keyword: 'custom-design' }))
}

/** Delete one AI/custom design from the backend. */
export function deleteAiProduct(id: string): Promise<{ success: boolean }> {
  return request(`/ai/products/${id}`, { method: 'DELETE' })
}

/** Fetch the blog feed. */
export function fetchBlogPosts(): Promise<BlogPost[]> {
  return request('/blog')
}
