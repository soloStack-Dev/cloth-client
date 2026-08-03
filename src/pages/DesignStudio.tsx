/**
 * DesignStudio.tsx
 * ----------------
 * The fullscreen t-shirt design tool.
 *
 * Layout is three panels: a left sidebar (text/image tools), the center
 * canvas (draggable text + images on a t-shirt), and a right sidebar
 * (materials + AI save). The whole editor state lives in the
 * `designStore`, so any component can read/update it.
 *
 * Key interactions:
 *   - Drag placed images / text around the canvas (percent-based coords)
 *   - Eraser tool removes images / text on click
 *   - Save captures the canvas as PNG and asks the backend for a listing
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import html2canvas from 'html2canvas'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Tooltip,
  Dialog,
} from '@mui/material'
import {
  Upload,
  Type,
  Image,
  Palette,
  Pencil,
  Pen,
  Paintbrush,
  Eraser,
  Sparkles,
  Save,
  Compass,
  ChevronDown,
  Plus,
  Trash2,
  RotateCcw,
  RotateCw,
  ArrowLeftRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { useDesignStore } from '../store/designStore'
import type { PlacedImage } from '../store/designStore'
import { generateAiListing } from '../lib/api'

/* ------------------------------------------------------------------ */
/* Static data for the studio                                          */
/* ------------------------------------------------------------------ */

// MUI Select arrow icon.
const DropdownIcon = (props: { className?: string }) => (
  <ChevronDown size={16} className={props.className} />
)

/** Quick-pick colors for the text on the canvas. */
const textColorSwatches = [
  { name: 'Dark', hex: '#1F2937' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Yellow', hex: '#F59E0B' },
]

/** Quick-pick colors for the t-shirt itself. */
const shirtColorSwatches = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1F2937' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Yellow', hex: '#F59E0B' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Teal', hex: '#14B8A6' },
]

/** Decorative gradient swatches in the extended color picker. */
const gradientBlocks = [
  { name: 'Sunset', value: 'linear-gradient(135deg, #FF6B6B, #FFA94D)', color: '#FF6B6B' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #4ECDC4, #2C3E7B)', color: '#4ECDC4' },
  { name: 'Forest', value: 'linear-gradient(135deg, #11998E, #38EF7D)', color: '#11998E' },
  { name: 'Lavender', value: 'linear-gradient(135deg, #9D4EDD, #FF6B6B)', color: '#9D4EDD' },
  { name: 'Midnight', value: 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)', color: '#0F2027' },
  { name: 'Peach', value: 'linear-gradient(135deg, #FAD0C4, #FFD1FF)', color: '#FAD0C4' },
]

/** Font names shown in the font dropdown. */
const fontOptions = ['Montserrat Bold', 'Inter', 'Playfair Display', 'BIG CAPS', 'Cursive', 'Halloween']

/**
 * Map a font option to the actual CSS font-family used on the canvas.
 * Kept as a lookup table so the JSX only needs to read `fontFamily`.
 */
const FONT_FAMILIES: Record<string, string> = {
  'Montserrat Bold': 'Montserrat, sans-serif',
  Inter: 'Inter, sans-serif',
  'Playfair Display': 'Playfair Display, serif',
  'BIG CAPS': 'Impact, Arial Black, sans-serif',
  Cursive: 'Brush Script MT, cursive',
  Halloween: 'Nosifer, Creepster, fantasy',
}

const fontFamilyFor = (font: string) => FONT_FAMILIES[font] ?? 'Inter, sans-serif'

/** Predefined designs the user can click to place on the shirt. */
const designThumbnails = [
  { src: '/asserts/DesignStudioAsserts/mountine-design.png', name: 'Mountain' },
  { src: '/asserts/DesignStudioAsserts/chicle-design.png', name: 'Chicle' },
  { src: '/asserts/DesignStudioAsserts/Daamn-design.png', name: 'Daamn' },
  { src: '/asserts/DesignStudioAsserts/spider-man-design.png', name: 'Spider-Man' },
  { src: '/asserts/DesignStudioAsserts/jesus-design.png', name: 'Jesus' },
  { src: '/asserts/DesignStudioAsserts/tokyo-revenger-design.png', name: 'Tokyo Revenger' },
  { src: '/asserts/DesignStudioAsserts/zunitsu-aaaah-design.png', name: 'Zunitsu' },
  { src: '/asserts/DesignStudioAsserts/spidy-design.png', name: 'Spidy' },
]

/** Drawing tools shown in the right sidebar. */
const tools = [
  { id: 'pencil', label: 'Color Pencil', icon: Pencil },
  { id: 'pen', label: 'Color Pen', icon: Pen },
  { id: 'brush', label: 'Color Brush', icon: Paintbrush },
  { id: 'eraser', label: 'Eraser', icon: Eraser },
]

export default function DesignStudio() {
  const {
    text,
    font,
    color,
    shirtColor,
    textAlign,
    textX,
    textY,
    textRotation,
    textFlipH,
    sleeve,
    activeTool,
    placedImages,
    uploadedImages,
    setText,
    setFont,
    setColor,
    setShirtColor,
    setTextAlign,
    setTextPosition,
    setTextRotation,
    setTextFlipH,
    setSleeve,
    setActiveTool,
    addPlacedImage,
    updatePlacedImage,
    removePlacedImage,
    addUploadedImage,
    removeUploadedImage,
  } = useDesignStore()

  const [showPalette, setShowPalette] = useState(false)
  const [paletteHex, setPaletteHex] = useState(shirtColor)
  const [editingHex, setEditingHex] = useState(false)

  // Keep the hex textbox in sync with the chosen shirt color, unless the
  // user is currently typing a custom hex value. This "adjust state during
  // render" pattern avoids a setState-in-effect lint error.
  if (!editingHex && paletteHex !== shirtColor) {
    setPaletteHex(shirtColor)
  }
  const [dragImageId, setDragImageId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDraggingText, setIsDraggingText] = useState(false)
  const [textDragOffset, setTextDragOffset] = useState({ x: 0, y: 0 })
  const [hoveredUploadId, setHoveredUploadId] = useState<string | null>(null)
  const [hoveredPlacedId, setHoveredPlacedId] = useState<string | null>(null)
  const [hoveredText, setHoveredText] = useState(false)
  const [deleteZoneActive, setDeleteZoneActive] = useState(false)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [keyword, setKeyword] = useState('')
  const [showMobileTools, setShowMobileTools] = useState(false)
  const [showMobileMaterials, setShowMobileMaterials] = useState(false)

  const canvasInnerRef = useRef<HTMLDivElement>(null)

  const leftSidebarRef = useRef<HTMLDivElement>(null)
  const rightSidebarRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const activeToolRef = useRef<HTMLButtonElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ------------------------------------------------------------------ */
  /* Entrance animations                                                 */
  /* ------------------------------------------------------------------ */

  // Slide both sidebars in from their edges and fade the canvas up.
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (leftSidebarRef.current) {
        gsap.fromTo(leftSidebarRef.current, { x: -280, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
      }
      if (rightSidebarRef.current) {
        gsap.fromTo(rightSidebarRef.current, { x: 300, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.1 })
      }
      if (canvasRef.current) {
        gsap.fromTo(canvasRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.2 })
      }
    })
    return () => ctx.revert()
  }, [])

  // Give the active tool a quick "pulse" so the user sees the selection.
  useEffect(() => {
    if (activeToolRef.current && activeTool) {
      const ctx = gsap.context(() => {
        gsap.fromTo(activeToolRef.current, { scale: 1 }, { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.inOut' })
      }, activeToolRef)
      return () => ctx.revert()
    }
  }, [activeTool])

  /* ------------------------------------------------------------------ */
  /* Upload flow: choose file → preview in crop dialog → add to library */
  /* ------------------------------------------------------------------ */

  // Click the hidden file input.
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Read the chosen file as a data URL so we can preview it.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target?.result as string
      setCropImageSrc(src)
      setCropDialogOpen(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // User confirmed the crop dialog — save the image to the store.
  const handleCropConfirm = () => {
    if (cropImageSrc) {
      const id = crypto.randomUUID()
      addUploadedImage({ id, src: cropImageSrc, name: 'Uploaded' })
    }
    setCropDialogOpen(false)
    setCropImageSrc(null)
  }

  // Clicking a thumbnail places a copy of that image on the canvas.
  const handleDesignClick = (imgSrc: string) => {
    const id = crypto.randomUUID()
    addPlacedImage({ id, src: imgSrc, x: 10, y: 15, width: 40, height: 40, rotation: 0, flipH: false })
  }

  /* ------------------------------------------------------------------ */
  /* Drag & drop on the canvas (images and text)                         */
  /* ------------------------------------------------------------------ */

  // Record where the grab happened so the image follows the cursor 1:1.
  const handleImageMouseDown = (e: React.MouseEvent, img: PlacedImage) => {
    if (activeTool === 'eraser') return
    e.preventDefault()
    e.stopPropagation()
    const rect = canvasInnerRef.current?.getBoundingClientRect()
    if (!rect) return
    setDragImageId(img.id)
    setDeleteZoneActive(false)
    setDragOffset({
      x: ((e.clientX - rect.left) / rect.width) * 100 - img.x,
      y: ((e.clientY - rect.top) / rect.height) * 100 - img.y,
    })
  }

  // Convert cursor movement into new (clamped) % coordinates while dragging.
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasInnerRef.current?.getBoundingClientRect()
    if (!rect) return
    if (dragImageId) {
      const pctX = ((e.clientX - rect.left) / rect.width) * 100
      const pctY = ((e.clientY - rect.top) / rect.height) * 100
      updatePlacedImage(dragImageId, {
        x: Math.max(0, Math.min(100, pctX - dragOffset.x)),
        y: Math.max(0, Math.min(100, pctY - dragOffset.y)),
      })
      // Highlight the delete zone while the image is dragged over it.
      const el = document.elementFromPoint(e.clientX, e.clientY)
      setDeleteZoneActive(!!el?.closest('[data-delete-zone]'))
    }
    if (isDraggingText) {
      const pctX = ((e.clientX - rect.left) / rect.width) * 100
      const pctY = ((e.clientY - rect.top) / rect.height) * 100
      setTextPosition(
        Math.max(0, Math.min(100, pctX - textDragOffset.x)),
        Math.max(0, Math.min(100, pctY - textDragOffset.y)),
      )
    }
  }, [dragImageId, dragOffset, updatePlacedImage, isDraggingText, textDragOffset, setTextPosition])

  // Dropping: if over the delete zone, remove the image; always reset drag.
  const handleCanvasMouseUp = useCallback(() => {
    if (dragImageId && deleteZoneActive) {
      removePlacedImage(dragImageId)
    }
    setDragImageId(null)
    setDeleteZoneActive(false)
    setIsDraggingText(false)
  }, [dragImageId, deleteZoneActive, removePlacedImage])

  /* ------------------------------------------------------------------ */
  /* Eraser tool: click a placed image / the text to remove it           */
  /* ------------------------------------------------------------------ */

  const handleEraserClick = (placedImg: PlacedImage) => {
    if (activeTool === 'eraser') {
      removePlacedImage(placedImg.id)
    }
  }

  const handleEraserOnText = () => {
    if (activeTool === 'eraser' && text) {
      setText('')
    }
  }

  // Same grab-offset logic as images, but for the text overlay.
  const handleTextMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'eraser') return
    e.preventDefault()
    e.stopPropagation()
    const rect = canvasInnerRef.current?.getBoundingClientRect()
    if (!rect) return
    setIsDraggingText(true)
    setTextDragOffset({
      x: ((e.clientX - rect.left) / rect.width) * 100 - textX,
      y: ((e.clientY - rect.top) / rect.height) * 100 - textY,
    })
  }

  /* ------------------------------------------------------------------ */
  /* Save: snapshot canvas → ask AI for a listing → add to collection    */
  /* ------------------------------------------------------------------ */

  const handleSaveDesign = async () => {
    setAiLoading(true)
    setAiResult(null)
    try {
      const canvasEl = canvasRef.current

      // Snapshot the canvas as PNG (fall back to a stock image on error).
      let capturedImage = placedImages.length > 0 ? placedImages[0].src : '/asserts/CollectionAsserts/cat-drink-coffee-t-shirt.jpg'
      if (canvasEl) {
        try {
          const cvs = await html2canvas(canvasEl, { useCORS: true, scale: 2 })
          capturedImage = cvs.toDataURL('image/png')
        } catch {
          // Keep the fallback image.
        }
      }

      // Send the design to the backend so it shows up in the Collection.
      await generateAiListing({
        text,
        font,
        shirtColor,
        imageUrl: capturedImage,
        keyword,
      })
      setAiResult('Design saved and added to Collection!')
    } catch {
      setAiResult('AI generation failed. Try again.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#F8FAFC',
        overflow: 'hidden',
      }}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* ------------------------------------------------------------ */}
      {/* Crop dialog — previews an uploaded image before adding it    */}
      {/* ------------------------------------------------------------ */}
      <Dialog open={cropDialogOpen} onClose={() => setCropDialogOpen(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 2, color: '#0F172A' }}>
            Crop Image
          </Typography>
          {cropImageSrc && (
            <Box
              component="img"
              src={cropImageSrc}
              sx={{ width: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 2, mb: 2 }}
            />
          )}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button onClick={() => setCropDialogOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCropConfirm}
              sx={{ bgcolor: '#0055FF', textTransform: 'none', '&:hover': { bgcolor: '#0044CC' } }}
            >
              Add Image
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* ------------------------------------------------------------ */}
      {/* Embedded header (the studio replaces the shared site header) */}
      {/* ------------------------------------------------------------ */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: '#E2E8F0',
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Typography
          component={Link}
          to="/"
          sx={{
            fontSize: 20,
            fontWeight: 700,
            color: '#0F172A',
            letterSpacing: '-0.5px',
            textDecoration: 'none',
          }}
        >
          Electric Canvas
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            component={Link}
            to="/"
            sx={{
              fontSize: 13,
              color: '#64748B',
              textDecoration: 'none',
              '&:hover': { color: '#0055FF' },
              transition: 'color 0.2s',
            }}
          >
            Back to Home
          </Typography>
          <Button
            variant="contained"
            startIcon={<Save size={16} />}
            sx={{
              bgcolor: '#0055FF',
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              px: 2.5,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': { bgcolor: '#0044CC' },
            }}
          >
            Start Designing
          </Button>
        </Box>
      </Box>

      {/* ------------------------------------------------------------ */}
      {/* Three-panel layout: tools | canvas | materials                */}
      {/* ------------------------------------------------------------ */}
      <Box sx={{ display: 'flex', flex: 1, overflow: { xs: 'auto', lg: 'hidden' }, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Left Sidebar — text + image design tools */}
        <Box
          ref={leftSidebarRef}
          sx={{
            width: { xs: '100%', lg: 260 },
            flexShrink: 0,
            bgcolor: 'white',
            borderRight: { xs: 'none', lg: '1px solid' },
            borderBottom: { xs: '1px solid', lg: 'none' },
            borderColor: '#E2E8F0',
            overflowY: 'auto',
            p: 2.5,
            display: { xs: showMobileTools ? 'flex' : 'none', lg: 'flex' },
            flexDirection: 'column',
            gap: 3,
            maxHeight: { xs: showMobileTools ? 300 : 0, lg: 'none' },
            transition: 'max-height 0.3s ease',
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>
            Design Tools
          </Typography>

          {/* Upload Button */}
          <Button
            variant="outlined"
            startIcon={<Upload size={20} />}
            onClick={handleUploadClick}
            sx={{
              width: '100%',
              justifyContent: 'flex-start',
              border: '1.5px dashed',
              borderColor: '#CBD5E1',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: 14,
              color: '#0055FF',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#EBF1FF',
                borderColor: '#0055FF',
              },
            }}
          >
            Upload Device Image
          </Button>

          {/* TEXT DESIGNS */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Type size={14} color="#64748B" />
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Text Designs
                </Typography>
              </Box>
              <Typography
                component={Link}
                to="/collection"
                sx={{
                  fontSize: 12,
                  color: '#0055FF',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                More
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Text input moved above color */}
              <TextField
                fullWidth
                multiline
                minRows={2}
                maxRows={6}
                size="small"
                label="Your Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text here..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: 14,
                    borderRadius: 1.5,
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#0055FF', borderWidth: 2 },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: 12,
                    color: '#64748B',
                    '&.Mui-focused': { color: '#0055FF' },
                  },
                }}
              />
              {/* Text color swatches */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#64748B', mr: 0.5 }}>
                  Color:
                </Typography>
                {textColorSwatches.map((s) => (
                  <Tooltip key={s.hex} title={s.name} arrow>
                    <IconButton
                      onClick={() => setColor(s.hex)}
                      sx={{
                        width: 22,
                        height: 22,
                        bgcolor: s.hex,
                        border: '1.5px solid',
                        borderColor: s.hex === '#FFFFFF' ? '#CBD5E1' : 'transparent',
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
                        transition: 'transform 0.15s',
                        '&:hover': { transform: 'scale(1.2)', bgcolor: s.hex },
                        ...(color === s.hex && {
                          outline: '2px solid #0055FF',
                          outlineOffset: 2,
                        }),
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
              <FormControl fullWidth size="small">
                <InputLabel
                  sx={{
                    fontSize: 12,
                    color: '#64748B',
                    '&.Mui-focused': { color: '#0055FF' },
                  }}
                >
                  Font Style
                </InputLabel>
                <Select
                  value={font}
                  label="Font Style"
                  onChange={(e) => setFont(e.target.value)}
                  IconComponent={DropdownIcon}
                  sx={{
                    fontSize: 14,
                    borderRadius: 1.5,
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#0055FF', borderWidth: 2 },
                  }}
                >
                  {fontOptions.map((f) => (
                    <MenuItem key={f} value={f} sx={{ fontSize: 14 }}>
                      {f}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Text alignment buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#64748B', mr: 0.5 }}>
                  Align:
                </Typography>
                {(['left', 'center', 'right'] as const).map((a) => (
                  <IconButton
                    key={a}
                    onClick={() => setTextAlign(a)}
                    sx={{
                      width: 30,
                      height: 26,
                      bgcolor: textAlign === a ? '#0055FF' : '#F1F5F9',
                      borderRadius: 1,
                      '&:hover': { bgcolor: textAlign === a ? '#0044CC' : '#E2E8F0' },
                      transition: 'all 0.15s',
                    }}
                  >
                    <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                      {a === 'left' && (
                        <>
                          <line x1="1" y1="2" x2="13" y2="2" stroke={textAlign === a ? 'white' : '#64748B'} strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="6" x2="9" y2="6" stroke={textAlign === a ? 'white' : '#64748B'} strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="10" x2="11" y2="10" stroke={textAlign === a ? 'white' : '#64748B'} strokeWidth="1.5" strokeLinecap="round" />
                        </>
                      )}
                      {a === 'center' && (
                        <>
                          <line x1="1" y1="2" x2="13" y2="2" stroke={textAlign === a ? 'white' : '#64748B'} strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="3" y1="6" x2="11" y2="6" stroke={textAlign === a ? 'white' : '#64748B'} strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="2" y1="10" x2="12" y2="10" stroke={textAlign === a ? 'white' : '#64748B'} strokeWidth="1.5" strokeLinecap="round" />
                        </>
                      )}
                      {a === 'right' && (
                        <>
                          <line x1="1" y1="2" x2="13" y2="2" stroke={textAlign === a ? 'white' : '#64748B'} strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="5" y1="6" x2="13" y2="6" stroke={textAlign === a ? 'white' : '#64748B'} strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="3" y1="10" x2="13" y2="10" stroke={textAlign === a ? 'white' : '#64748B'} strokeWidth="1.5" strokeLinecap="round" />
                        </>
                      )}
                    </svg>
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Box>

          {/* IMAGE DESIGNS */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Image size={14} color="#64748B" />
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Image Designs
                </Typography>
              </Box>
              <Typography
                component={Link}
                to="/collection"
                sx={{
                  fontSize: 12,
                  color: '#0055FF',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                More
              </Typography>
            </Box>
            {/* Predefined designs */}
            <Grid container spacing={1.5}>
              {designThumbnails.map((img, i) => (
                <Grid size={6} key={i}>
                  <Tooltip title={img.name} arrow>
                    <Card
                      onClick={() => handleDesignClick(img.src)}
                      elevation={0}
                      sx={{
                        aspectRatio: '1/1',
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: '#E2E8F0',
                        overflow: 'hidden',
                        bgcolor: 'white',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#0055FF',
                          transform: 'scale(1.03)',
                          boxShadow: 1,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={img.src}
                        alt={img.name}
                        sx={{ objectFit: 'cover', height: '100%' }}
                      />
                    </Card>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
            {/* Uploaded images with delete on hover */}
            {uploadedImages.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
                  Your Uploads
                </Typography>
                <Grid container spacing={1.5}>
                  {uploadedImages.map((img) => (
                    <Grid size={6} key={img.id}>
                      <Box
                        onMouseEnter={() => setHoveredUploadId(img.id)}
                        onMouseLeave={() => setHoveredUploadId(null)}
                        sx={{ position: 'relative', aspectRatio: '1/1' }}
                      >
                        <Card
                          onClick={() => handleDesignClick(img.src)}
                          elevation={0}
                          sx={{
                            aspectRatio: '1/1',
                            borderRadius: 2,
                            cursor: 'pointer',
                            border: '1px solid',
                            borderColor: '#E2E8F0',
                            overflow: 'hidden',
                            bgcolor: 'white',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: '#0055FF',
                              transform: 'scale(1.03)',
                              boxShadow: 1,
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={img.src}
                            alt={img.name}
                            sx={{ objectFit: 'cover', height: '100%' }}
                          />
                        </Card>
                        {hoveredUploadId === img.id && (
                          <IconButton
                            onClick={(e) => { e.stopPropagation(); removeUploadedImage(img.id) }}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'rgba(239,68,68,0.9)',
                              color: 'white',
                              width: 24,
                              height: 24,
                              '&:hover': { bgcolor: '#EF4444' },
                              zIndex: 2,
                            }}
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>

          {/* Coming Soon Card */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: '#EBF1FF',
              borderRadius: 2.5,
              p: 2,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mt: 1,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                Coming Soon
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#64748B', mt: 0.5, lineHeight: 1.5 }}>
                Custom Texture Mapping & Embroidery simulation tool.
              </Typography>
            </Box>
            <Compass size={22} color="#0055FF" style={{ flexShrink: 0, marginLeft: 12 }} />
          </Paper>
        </Box>

        {/* Center Canvas — the live t-shirt preview */}
        <Container
          maxWidth={false}
          className="dot-grid"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowY: 'auto',
            py: { xs: 2, md: 4 },
            px: { xs: 2, md: '40px !important' },
          }}
        >
          {/* Mobile Toolbar – toggle buttons for sidebars */}
          <Box sx={{ display: { xs: 'flex', lg: 'none' }, gap: 1, mb: 2, width: '100%' }}>
            <Button
              size="small"
              variant={showMobileTools ? 'contained' : 'outlined'}
              onClick={() => setShowMobileTools(!showMobileTools)}
              sx={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1.5,
                px: 2,
                py: 0.75,
                borderColor: '#CBD5E1',
                color: showMobileTools ? 'white' : '#64748B',
                bgcolor: showMobileTools ? '#0055FF' : 'transparent',
                '&:hover': { bgcolor: showMobileTools ? '#0044CC' : '#F1F5F9' },
              }}
            >
              Design Tools
            </Button>
            <Button
              size="small"
              variant={showMobileMaterials ? 'contained' : 'outlined'}
              onClick={() => setShowMobileMaterials(!showMobileMaterials)}
              sx={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1.5,
                px: 2,
                py: 0.75,
                borderColor: '#CBD5E1',
                color: showMobileMaterials ? 'white' : '#64748B',
                bgcolor: showMobileMaterials ? '#0055FF' : 'transparent',
                '&:hover': { bgcolor: showMobileMaterials ? '#0044CC' : '#F1F5F9' },
              }}
            >
              Materials
            </Button>
          </Box>
          {/* Toggle Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              onClick={() => setSleeve('full')}
              variant="outlined"
              startIcon={<ShirtIcon />}
              sx={{
                px: 2.5,
                py: 1.25,
                borderRadius: 1.5,
                fontSize: 13,
                fontWeight: 500,
                textTransform: 'none',
                borderColor: sleeve === 'full' ? '#0055FF' : '#E2E8F0',
                color: sleeve === 'full' ? '#0055FF' : '#64748B',
                bgcolor: 'white',
                boxShadow: sleeve === 'full' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                '&:hover': {
                  borderColor: sleeve === 'full' ? '#0055FF' : '#CBD5E1',
                  bgcolor: 'white',
                },
              }}
            >
              Full-Hand
            </Button>
            <Button
              onClick={() => setSleeve('half')}
              variant="outlined"
              startIcon={<HalfHandIcon />}
              sx={{
                px: 2.5,
                py: 1.25,
                borderRadius: 1.5,
                fontSize: 13,
                fontWeight: 500,
                textTransform: 'none',
                borderColor: sleeve === 'half' ? '#0055FF' : '#E2E8F0',
                color: sleeve === 'half' ? '#0055FF' : '#64748B',
                bgcolor: 'white',
                boxShadow: sleeve === 'half' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                '&:hover': {
                  borderColor: sleeve === 'half' ? '#0055FF' : '#CBD5E1',
                  bgcolor: 'white',
                },
              }}
            >
              Half-Hand
            </Button>
          </Box>

          {/* Canvas Container */}
          <Box
            ref={canvasRef}
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: { xs: '100%', md: 500 },
              aspectRatio: '4/5',
              border: '2px dashed',
              borderColor: '#CBD5E1',
              borderRadius: 2.5,
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Box
              ref={canvasInnerRef}
              sx={{
                position: 'relative',
                width: '80%',
                maxWidth: 340,
                mx: 'auto',
                userSelect: 'none',
              }}
            >
              {/* T-shirt base */}
              <Box
                component="img"
                src="/asserts/DesignStudioAsserts/white-t-shirt.png"
                alt="T-shirt mockup"
                draggable={false}
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
              {/* Shirt color overlay – clipped to t-shirt shape */}
              {shirtColor !== '#FFFFFF' && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    bgcolor: shirtColor,
                    mixBlendMode: 'multiply',
                    opacity: 0.45,
                    pointerEvents: 'none',
                    maskImage: 'url(/asserts/DesignStudioAsserts/white-t-shirt.png)',
                    maskSize: '100% 100%',
                    maskRepeat: 'no-repeat',
                    WebkitMaskImage: 'url(/asserts/DesignStudioAsserts/white-t-shirt.png)',
                    WebkitMaskSize: '100% 100%',
                    WebkitMaskRepeat: 'no-repeat',
                  }}
                />
              )}

              {/* Placed images (draggable + delete zone + rotate/flip) */}
              {placedImages.map((placed) => (
                <Box
                  key={placed.id}
                  onMouseDown={(e) => handleImageMouseDown(e, placed)}
                  onMouseEnter={() => setHoveredPlacedId(placed.id)}
                  onMouseLeave={() => { if (hoveredPlacedId === placed.id) setHoveredPlacedId(null) }}
                  onClick={() => handleEraserClick(placed)}
                  sx={{
                    position: 'absolute',
                    zIndex: 10,
                    left: `${placed.x}%`,
                    top: `${placed.y}%`,
                    width: `${placed.width}%`,
                    height: `${placed.height}%`,
                    cursor: activeTool === 'eraser' ? 'crosshair' : 'grab',
                    overflow: 'visible',
                    borderRadius: 1,
                    boxShadow: dragImageId === placed.id ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
                    transition: dragImageId === placed.id ? 'none' : 'box-shadow 0.2s',
                    '&:hover': {
                      outline: '2px solid #0055FF',
                      outlineOffset: 1,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      transform: `${placed.flipH ? 'scaleX(-1)' : ''} ${placed.rotation !== 0 ? `rotate(${placed.rotation}deg)` : ''}`.trim() || 'none',
                    }}
                  >
                    <Box
                      component="img"
                      src={placed.src}
                      alt=""
                      draggable={false}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        pointerEvents: 'none',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  {/* Delete zone – visible on hover or when dragged over */}
                  {(hoveredPlacedId === placed.id || (dragImageId === placed.id && deleteZoneActive)) && (
                    <Box
                      data-delete-zone="true"
                      onMouseEnter={() => setDeleteZoneActive(true)}
                      onMouseLeave={() => setDeleteZoneActive(false)}
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        zIndex: 20,
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: deleteZoneActive && dragImageId === placed.id ? '#EF4444' : 'rgba(239,68,68,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: deleteZoneActive && dragImageId === placed.id
                          ? '0 0 20px rgba(239,68,68,0.9), 0 0 40px rgba(239,68,68,0.4)'
                          : '0 2px 8px rgba(0,0,0,0.25)',
                        transform: deleteZoneActive && dragImageId === placed.id ? 'scale(1.25)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                      }}
                      onClick={(e) => { e.stopPropagation(); removePlacedImage(placed.id) }}
                    >
                      <Trash2 size={13} color="white" />
                    </Box>
                  )}
                  {/* Rotation controls – visible on hover */}
                  {hoveredPlacedId === placed.id && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -18,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 0.5,
                        zIndex: 20,
                      }}
                    >
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); updatePlacedImage(placed.id, { rotation: placed.rotation - 15 }) }}
                        sx={{
                          width: 22,
                          height: 22,
                          bgcolor: 'rgba(255,255,255,0.95)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': { bgcolor: '#EBF1FF' },
                        }}
                      >
                        <RotateCcw size={12} color="#0055FF" />
                      </IconButton>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); updatePlacedImage(placed.id, { rotation: placed.rotation + 15 }) }}
                        sx={{
                          width: 22,
                          height: 22,
                          bgcolor: 'rgba(255,255,255,0.95)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': { bgcolor: '#EBF1FF' },
                        }}
                      >
                        <RotateCw size={12} color="#0055FF" />
                      </IconButton>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); updatePlacedImage(placed.id, { flipH: !placed.flipH }) }}
                        sx={{
                          width: 22,
                          height: 22,
                          bgcolor: placed.flipH ? '#0055FF' : 'rgba(255,255,255,0.95)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': { bgcolor: placed.flipH ? '#0044CC' : '#EBF1FF' },
                        }}
                      >
                        <ArrowLeftRight size={12} color={placed.flipH ? 'white' : '#0055FF'} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              ))}

              {/* Text overlay – draggable with hover controls */}
              {text && (
                <Box
                  onMouseDown={handleTextMouseDown}
                  onMouseEnter={() => setHoveredText(true)}
                  onMouseLeave={() => setHoveredText(false)}
                  onClick={handleEraserOnText}
                  sx={{
                    position: 'absolute',
                    top: `${textY}%`,
                    left: `${textX}%`,
                    width: '80%',
                    transform: `translate(-${textAlign === 'center' ? 50 : textAlign === 'right' ? 100 : 0}%, 0) ${textFlipH ? 'scaleX(-1)' : ''} ${textRotation !== 0 ? `rotate(${textRotation}deg)` : ''}`.trim() || 'none',
                    textAlign,
                    zIndex: 5,
                    cursor: activeTool === 'eraser' ? 'crosshair' : 'grab',
                    '&:hover': {
                      outline: activeTool === 'eraser' ? '2px dashed #EF4444' : '2px solid #0055FF',
                      outlineOffset: 1,
                      borderRadius: 1,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: 16, sm: 20 },
                      fontWeight: 600,
                      lineHeight: 1.3,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      fontFamily: fontFamilyFor(font),
                      color,
                      textAlign,
                    }}
                  >
                    {text}
                  </Typography>
                  {/* Hover controls – delete, rotate, flip */}
                  {hoveredText && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -18,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 0.5,
                        zIndex: 20,
                      }}
                    >
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); setTextRotation(textRotation - 15) }}
                        sx={{
                          width: 22,
                          height: 22,
                          bgcolor: 'rgba(255,255,255,0.95)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': { bgcolor: '#EBF1FF' },
                        }}
                      >
                        <RotateCcw size={12} color="#0055FF" />
                      </IconButton>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); setTextRotation(textRotation + 15) }}
                        sx={{
                          width: 22,
                          height: 22,
                          bgcolor: 'rgba(255,255,255,0.95)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': { bgcolor: '#EBF1FF' },
                        }}
                      >
                        <RotateCw size={12} color="#0055FF" />
                      </IconButton>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); setTextFlipH(!textFlipH) }}
                        sx={{
                          width: 22,
                          height: 22,
                          bgcolor: textFlipH ? '#0055FF' : 'rgba(255,255,255,0.95)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': { bgcolor: textFlipH ? '#0044CC' : '#EBF1FF' },
                        }}
                      >
                        <ArrowLeftRight size={12} color={textFlipH ? 'white' : '#0055FF'} />
                      </IconButton>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); setText('') }}
                        sx={{
                          width: 22,
                          height: 22,
                          bgcolor: 'rgba(239,68,68,0.85)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                          '&:hover': { bgcolor: '#EF4444' },
                        }}
                      >
                        <Trash2 size={12} color="white" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>

          {/* Bottom Color Picker Bar – controls shirt color */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              px: 2.5,
              py: 1.5,
              maxWidth: { xs: '100%', md: 480 },
              width: '100%',
            }}
          >
            {/* Main row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
              <Palette size={16} color="#64748B" />
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', flex: 1 }}>
                {shirtColorSwatches.slice(0, 6).map((s) => (
                  <Tooltip key={s.hex} title={s.name} arrow>
                    <IconButton
                      onClick={() => { setShirtColor(s.hex); setPaletteHex(s.hex) }}
                      sx={{
                        width: 26,
                        height: 26,
                        bgcolor: s.hex,
                        border: s.hex === '#FFFFFF' ? '1.5px solid #CBD5E1' : 'none',
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
                        transition: 'transform 0.15s',
                        '&:hover': { transform: 'scale(1.15)', bgcolor: s.hex },
                        ...(shirtColor === s.hex && {
                          outline: '2px solid #0055FF',
                          outlineOffset: 2,
                        }),
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
              <Tooltip title="More colors" arrow>
                <IconButton
                  onClick={() => setShowPalette(!showPalette)}
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: showPalette ? '#0055FF' : '#F1F5F9',
                    color: showPalette ? 'white' : '#64748B',
                    '&:hover': { bgcolor: showPalette ? '#0044CC' : '#E2E8F0' },
                    transition: 'all 0.2s',
                  }}
                >
                  <Plus size={14} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Expanded palette + hex input */}
            {showPalette && (
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1, borderTop: '1px solid #E2E8F0' }}>
                {/* Gradient blocks */}
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Gradients & More
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {shirtColorSwatches.slice(6).map((s) => (
                    <Tooltip key={s.hex} title={s.name} arrow>
                      <IconButton
                        onClick={() => { setShirtColor(s.hex); setPaletteHex(s.hex) }}
                        onMouseEnter={() => { setShirtColor(s.hex); setPaletteHex(s.hex) }}
                        sx={{
                          width: 30,
                          height: 30,
                          bgcolor: s.hex,
                          border: s.hex === '#FFFFFF' ? '1.5px solid #CBD5E1' : 'none',
                          boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
                          transition: 'transform 0.1s',
                          '&:hover': { transform: 'scale(1.2)', bgcolor: s.hex },
                          ...(shirtColor === s.hex && {
                            outline: '2px solid #0055FF',
                            outlineOffset: 2,
                          }),
                        }}
                      />
                    </Tooltip>
                  ))}
                  {gradientBlocks.map((g, i) => (
                    <Tooltip key={i} title={g.name} arrow>
                      <Box
                        onClick={() => { setShirtColor(g.color); setPaletteHex(g.color) }}
                        onMouseEnter={() => { setShirtColor(g.color); setPaletteHex(g.color) }}
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          background: g.value,
                          cursor: 'pointer',
                          boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
                          transition: 'transform 0.1s',
                          '&:hover': { transform: 'scale(1.2)' },
                          ...(shirtColor === g.color && {
                            outline: '2px solid #0055FF',
                            outlineOffset: 2,
                          }),
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
                {/* Alphanumeric hex input */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    HEX
                  </Typography>
                  <TextField
                    size="small"
                    value={paletteHex}
                    onFocus={() => setEditingHex(true)}
                    onBlur={() => setEditingHex(false)}
                    onChange={(e) => {
                      const val = e.target.value
                      setPaletteHex(val)
                      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                        setShirtColor(val)
                      }
                    }}
                    placeholder="#FFFFFF"
                    variant="outlined"
                    sx={{
                      width: 110,
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'monospace',
                        fontSize: 12,
                        borderRadius: 1,
                        '& fieldset': { borderColor: '#E2E8F0' },
                        '&:hover fieldset': { borderColor: '#CBD5E1' },
                        '&.Mui-focused fieldset': { borderColor: '#0055FF' },
                      },
                      '& .MuiInputBase-input': {
                        py: 0.75,
                        px: 1.25,
                        textTransform: 'uppercase',
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
          </Paper>
        </Container>

        {/* Right Sidebar — materials, tools, AI save */}
        <Box
          ref={rightSidebarRef}
          sx={{
            width: { xs: '100%', lg: 280 },
            flexShrink: 0,
            bgcolor: 'white',
            borderLeft: { xs: 'none', lg: '1px solid' },
            borderTop: { xs: '1px solid', lg: 'none' },
            borderColor: '#E2E8F0',
            overflowY: 'auto',
            p: 2.5,
            display: { xs: showMobileMaterials ? 'flex' : 'none', lg: 'flex' },
            flexDirection: 'column',
            gap: 2.5,
            maxHeight: { xs: showMobileMaterials ? 300 : 0, lg: 'none' },
            transition: 'max-height 0.3s ease',
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>
            Creation Materials
          </Typography>

          {/* Tools Grid */}
          <Grid container spacing={1.5}>
            {tools.map((tool) => {
              const Icon = tool.icon
              const isActive = activeTool === tool.id
              return (
                <Grid size={6} key={tool.id}>
                  <Box
                    component="button"
                    onClick={() => setActiveTool(isActive ? null : tool.id)}
                    ref={isActive ? activeToolRef : undefined}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                      borderRadius: 2,
                      border: isActive ? '2px solid' : '1px solid',
                      borderColor: isActive ? '#0055FF' : '#E2E8F0',
                      bgcolor: isActive ? '#EBF1FF' : 'white',
                      p: 2,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: isActive ? '#0055FF' : '#CBD5E1',
                        boxShadow: isActive ? 0 : 1,
                      },
                    }}
                  >
                    <Icon size={24} color={isActive ? '#0055FF' : '#64748B'} />
                    <Typography sx={{ fontSize: 11, fontWeight: 500, color: isActive ? '#0055FF' : '#64748B' }}>
                      {tool.label}
                    </Typography>
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {/* AI FEATURES */}
          <Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                mb: 1.5,
              }}
            >
              AI Features
            </Typography>
            <Card
              elevation={0}
              sx={{ bgcolor: '#0F172A', borderRadius: 3, overflow: 'hidden' }}
            >
              <CardMedia sx={{ p: 2.5, pb: 0 }}>
                <Sparkles size={24} color="#06B6D4" />
              </CardMedia>
              <CardContent sx={{ pt: 1.5, pb: 2.5, px: 2.5 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'white' }}>
                  AI Studio
                </Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'white', mt: 0.5 }}>
                  Generative Fabric Design
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#94A3B8', mt: 1, lineHeight: 1.5 }}>
                  Coming soon: Describe your pattern and let AI craft the canvas for you.
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Keyword / Name input */}
          <TextField
            fullWidth
            size="small"
            label="T-shirt name keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. spidy t-shirt"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: 13,
                borderRadius: 1.5,
                '& fieldset': { borderColor: '#E2E8F0' },
                '&:hover fieldset': { borderColor: '#CBD5E1' },
                '&.Mui-focused fieldset': { borderColor: '#0055FF', borderWidth: 2 },
              },
              '& .MuiInputLabel-root': {
                fontSize: 12,
                color: '#64748B',
                '&.Mui-focused': { color: '#0055FF' },
              },
            }}
          />

          {/* Save Button */}
          <Button
            variant="contained"
            fullWidth
            disabled={aiLoading}
            onClick={handleSaveDesign}
            startIcon={aiLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
            sx={{
              bgcolor: '#0055FF',
              color: 'white',
              fontWeight: 600,
              fontSize: 14,
              borderRadius: 2,
              py: 1.75,
              textTransform: 'none',
              mt: 'auto',
              '&:hover': { bgcolor: '#0044CC' },
              '&:disabled': { bgcolor: '#94A3B8' },
            }}
          >
            {aiLoading ? 'Generating...' : 'Save Design'}
          </Button>
          {aiResult && (
            <Typography
              sx={{
                fontSize: 12,
                color: aiResult.includes('failed') ? '#EF4444' : '#10B981',
                textAlign: 'center',
                mt: 1,
              }}
            >
              {aiResult.includes('failed') ? '' : <CheckCircle2 size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />}
              {aiResult}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

function ShirtIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 5L3 9l3 2 2-4M18 5l3 4-3 2-2-4" />
      <path d="M6 5l2 4 2 12h4l2-12 2-4" />
    </svg>
  )
}

function HalfHandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 5L3 9l3 2 2-4M18 5l3 4-3 2-2-4" />
      <path d="M6 5l2 4 2 12h4l2-12 2-4" />
      <line x1="12" y1="5" x2="12" y2="21" />
    </svg>
  )
}
