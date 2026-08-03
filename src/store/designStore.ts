/**
 * designStore.ts
 * --------------
 * Global state for the Design Studio (Zustand).
 *
 * It holds every property a user can tweak on the canvas — the text,
 * colors, fonts, and the images they placed. Uploaded images are also
 * persisted to localStorage so they survive a page refresh.
 */

import { create } from 'zustand'

/** An image dragged onto the t-shirt canvas. */
export interface PlacedImage {
  id: string
  src: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  flipH: boolean
}

/** A user-uploaded image shown in the studio's sidebar. */
export interface UploadedImage {
  id: string
  src: string
  name: string
}

/** Full shape of the design state + the actions that update it. */
interface DesignState {
  // Text on the canvas.
  text: string
  font: string
  color: string
  textAlign: 'left' | 'center' | 'right'
  textX: number
  textY: number
  textRotation: number
  textFlipH: boolean

  // The t-shirt itself.
  shirtColor: string
  sleeve: 'full' | 'half'

  // Active drawing tool (eraser etc.) and canvas images.
  activeTool: string | null
  placedImages: PlacedImage[]
  uploadedImages: UploadedImage[]

  // Actions for text.
  setText: (text: string) => void
  setFont: (font: string) => void
  setColor: (color: string) => void
  setTextAlign: (align: 'left' | 'center' | 'right') => void
  setTextPosition: (x: number, y: number) => void
  setTextRotation: (rotation: number) => void
  setTextFlipH: (flipH: boolean) => void

  // Actions for the t-shirt.
  setShirtColor: (color: string) => void
  setSleeve: (sleeve: 'full' | 'half') => void

  // Actions for tools + placed images.
  setActiveTool: (tool: string | null) => void
  addPlacedImage: (image: PlacedImage) => void
  updatePlacedImage: (id: string, partial: Partial<PlacedImage>) => void
  removePlacedImage: (id: string) => void
  addUploadedImage: (image: UploadedImage) => void
  removeUploadedImage: (id: string) => void
  clearPlacedImages: () => void
}

/* ------------------------------------------------------------------ */
/* localStorage helpers for uploaded images                            */
/* ------------------------------------------------------------------ */

/** Load uploaded images from localStorage (safe against corrupt data). */
function loadUploadedImages(): UploadedImage[] {
  try {
    const raw = localStorage.getItem('ds_uploaded_images')
    return raw ? (JSON.parse(raw) as UploadedImage[]) : []
  } catch {
    return []
  }
}

/** Save uploaded images to localStorage. Ignored if the storage is full. */
function saveUploadedImages(images: UploadedImage[]): void {
  try {
    localStorage.setItem('ds_uploaded_images', JSON.stringify(images))
  } catch {
    // Storage full or unavailable — keep the session working anyway.
  }
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

export const useDesignStore = create<DesignState>((set, get) => ({
  // Default text settings.
  text: '',
  font: 'Montserrat Bold',
  color: '#1F2937',
  textAlign: 'center',
  textX: 10,
  textY: 30,
  textRotation: 0,
  textFlipH: false,

  // Default shirt settings.
  shirtColor: '#FFFFFF',
  sleeve: 'full',

  // No active tool, no placed images yet, but restore uploads.
  activeTool: null,
  placedImages: [],
  uploadedImages: loadUploadedImages(),

  // --- text actions ---
  setText: (text) => set({ text }),
  setFont: (font) => set({ font }),
  setColor: (color) => set({ color }),
  setTextAlign: (textAlign) => set({ textAlign }),
  setTextPosition: (x, y) => set({ textX: x, textY: y }),
  setTextRotation: (rotation) => set({ textRotation: rotation }),
  setTextFlipH: (flipH) => set({ textFlipH: flipH }),

  // --- shirt actions ---
  setShirtColor: (shirtColor) => set({ shirtColor }),
  setSleeve: (sleeve) => set({ sleeve }),

  // --- tool actions ---
  setActiveTool: (tool) => set({ activeTool: tool }),

  // --- placed image actions ---
  addPlacedImage: (image) => set((s) => ({ placedImages: [...s.placedImages, image] })),
  updatePlacedImage: (id, partial) =>
    set((s) => ({
      placedImages: s.placedImages.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    })),
  removePlacedImage: (id) =>
    set((s) => ({ placedImages: s.placedImages.filter((p) => p.id !== id) })),
  clearPlacedImages: () => set({ placedImages: [] }),

  // --- uploaded image actions (kept in sync with localStorage) ---
  addUploadedImage: (image) => {
    const next = [...get().uploadedImages, image]
    saveUploadedImages(next)
    set({ uploadedImages: next })
  },
  removeUploadedImage: (id) => {
    const next = get().uploadedImages.filter((i) => i.id !== id)
    saveUploadedImages(next)
    set({ uploadedImages: next })
  },
}))
