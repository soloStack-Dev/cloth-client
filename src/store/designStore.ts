import { create } from 'zustand'

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

export interface UploadedImage {
  id: string
  src: string
  name: string
}

interface DesignState {
  text: string
  font: string
  color: string
  shirtColor: string
  textAlign: 'left' | 'center' | 'right'
  textX: number
  textY: number
  textRotation: number
  textFlipH: boolean
  sleeve: 'full' | 'half'
  activeTool: string | null
  placedImages: PlacedImage[]
  uploadedImages: UploadedImage[]
  setText: (text: string) => void
  setFont: (font: string) => void
  setColor: (color: string) => void
  setShirtColor: (color: string) => void
  setTextAlign: (align: 'left' | 'center' | 'right') => void
  setTextPosition: (x: number, y: number) => void
  setTextRotation: (rotation: number) => void
  setTextFlipH: (flipH: boolean) => void
  setSleeve: (sleeve: 'full' | 'half') => void
  setActiveTool: (tool: string | null) => void
  addPlacedImage: (image: PlacedImage) => void
  updatePlacedImage: (id: string, partial: Partial<PlacedImage>) => void
  removePlacedImage: (id: string) => void
  addUploadedImage: (image: UploadedImage) => void
  removeUploadedImage: (id: string) => void
  clearPlacedImages: () => void
}

function loadUploadedImages(): UploadedImage[] {
  try {
    const raw = localStorage.getItem('ds_uploaded_images')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUploadedImages(images: UploadedImage[]) {
  try {
    localStorage.setItem('ds_uploaded_images', JSON.stringify(images))
  } catch { /* quota exceeded – ignore */ }
}

export const useDesignStore = create<DesignState>((set, get) => ({
  text: '',
  font: 'Montserrat Bold',
  color: '#1F2937',
  shirtColor: '#FFFFFF',
  textAlign: 'center',
  textX: 10,
  textY: 30,
  textRotation: 0,
  textFlipH: false,
  sleeve: 'full',
  activeTool: null,
  placedImages: [],
  uploadedImages: loadUploadedImages(),
  setText: (text) => set({ text }),
  setFont: (font) => set({ font }),
  setColor: (color) => set({ color }),
  setShirtColor: (shirtColor) => set({ shirtColor }),
  setTextAlign: (textAlign) => set({ textAlign }),
  setTextPosition: (x, y) => set({ textX: x, textY: y }),
  setTextRotation: (rotation) => set({ textRotation: rotation }),
  setTextFlipH: (flipH) => set({ textFlipH: flipH }),
  setSleeve: (sleeve) => set({ sleeve }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  addPlacedImage: (image) => set((s) => ({ placedImages: [...s.placedImages, image] })),
  updatePlacedImage: (id, partial) =>
    set((s) => ({
      placedImages: s.placedImages.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    })),
  removePlacedImage: (id) =>
    set((s) => ({ placedImages: s.placedImages.filter((p) => p.id !== id) })),
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
  clearPlacedImages: () => set({ placedImages: [] }),
}))
