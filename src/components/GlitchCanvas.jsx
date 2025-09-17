import { useEffect, useRef, useState } from 'react'

class WebGlitch {
  constructor(canvas, imageSrc, intensity = 'low') {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d', { willReadFrequently: true })
    this.channelLen = 4
    this.imageSrc = imageSrc
    this.intensity = intensity
    this.imgOrigin = null
    this.copyData = []
    this.flowLineImgs = []
    this.shiftLineImgs = []
    this.shiftRGBs = []
    this.scatImgs = []
    this.throughFlag = true
    this.animationId = null
    this.isActive = false

    // Intensity-based probability thresholds
    this.probabilities = {
      low: { through: 85, shiftLine: 75, shiftRGB: 85, scat: 90 },
      medium: { through: 75, shiftLine: 60, shiftRGB: 70, scat: 85 },
      high: { through: 60, shiftLine: 40, shiftRGB: 50, scat: 75 }
    }

    this.loadImage()
  }

  loadImage() {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Set canvas dimensions to match container
      this.canvas.width = this.canvas.offsetWidth
      this.canvas.height = this.canvas.offsetHeight

      // Create temporary canvas to get image data
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      tempCanvas.width = this.canvas.width
      tempCanvas.height = this.canvas.height

      // Draw image to fit canvas
      tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height)
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)

      this.imgOrigin = imageData
      this.copyData = new Uint8ClampedArray(this.imgOrigin.data)

      this.initializeEffects()
      this.start()
    }
    img.src = this.imageSrc
  }

  initializeEffects() {
    // Flow line
    for (let i = 0; i < 1; i++) {
      this.flowLineImgs.push({
        pixels: null,
        t1: Math.floor(Math.random() * 1000),
        speed: Math.floor(Math.random() * 20) + 4,
        randX: Math.floor(Math.random() * 56) + 24
      })
    }

    // Shift line
    for (let i = 0; i < 3; i++) {
      this.shiftLineImgs.push(null)
    }

    // Shift RGB
    for (let i = 0; i < 1; i++) {
      this.shiftRGBs.push(null)
    }

    // Scattered images
    for (let i = 0; i < 2; i++) {
      this.scatImgs.push({
        imageData: null,
        x: 0,
        y: 0,
        width: 0,
        height: 0
      })
    }
  }

  replaceData(destImageData, srcPixels) {
    for (let i = 0; i < destImageData.data.length; i++) {
      destImageData.data[i] = srcPixels[i]
    }
  }

  flowLine(srcImageData, obj) {
    const destPixels = new Uint8ClampedArray(srcImageData.data)
    const width = srcImageData.width
    const height = srcImageData.height

    obj.t1 %= height
    obj.t1 += obj.speed
    const tempY = Math.floor(obj.t1)

    for (let y = 0; y < height; y++) {
      if (tempY === y) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * this.channelLen
          destPixels[index] = Math.min(255, srcImageData.data[index] + obj.randX)     // R
          destPixels[index + 1] = Math.min(255, srcImageData.data[index + 1] + obj.randX) // G
          destPixels[index + 2] = Math.min(255, srcImageData.data[index + 2] + obj.randX) // B
          destPixels[index + 3] = srcImageData.data[index + 3] // A
        }
      }
    }
    return destPixels
  }

  shiftLine(srcImageData) {
    const destPixels = new Uint8ClampedArray(srcImageData.data)
    const width = srcImageData.width
    const height = srcImageData.height

    const rangeMin = Math.floor(Math.random() * height)
    const rangeMax = rangeMin + Math.floor(Math.random() * (height - rangeMin))
    const offsetX = Math.floor(Math.random() * 80) - 40

    for (let y = rangeMin; y < rangeMax; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * this.channelLen
        const sourceX = Math.max(0, Math.min(width - 1, x + offsetX))
        const sourceIndex = (y * width + sourceX) * this.channelLen

        destPixels[index] = srcImageData.data[sourceIndex]
        destPixels[index + 1] = srcImageData.data[sourceIndex + 1]
        destPixels[index + 2] = srcImageData.data[sourceIndex + 2]
        destPixels[index + 3] = srcImageData.data[sourceIndex + 3]
      }
    }
    return destPixels
  }

  shiftRGB(srcImageData) {
    const destPixels = new Uint8ClampedArray(srcImageData.data)
    const width = srcImageData.width
    const height = srcImageData.height
    const range = 8

    const randR = (Math.floor(Math.random() * range * 2) - range) * width +
                  (Math.floor(Math.random() * range * 2) - range)
    const randG = (Math.floor(Math.random() * range * 2) - range) * width +
                  (Math.floor(Math.random() * range * 2) - range)
    const randB = (Math.floor(Math.random() * range * 2) - range) * width +
                  (Math.floor(Math.random() * range * 2) - range)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * this.channelLen

        const rIndex = Math.abs((index + randR * this.channelLen) % srcImageData.data.length)
        const gIndex = Math.abs((index + randG * this.channelLen) % srcImageData.data.length)
        const bIndex = Math.abs((index + randB * this.channelLen) % srcImageData.data.length)

        destPixels[index] = srcImageData.data[rIndex]
        destPixels[index + 1] = srcImageData.data[gIndex + 1]
        destPixels[index + 2] = srcImageData.data[bIndex + 2]
        destPixels[index + 3] = srcImageData.data[index + 3]
      }
    }
    return destPixels
  }

  getRandomRect(srcImageData) {
    const width = srcImageData.width
    const height = srcImageData.height
    const startX = Math.floor(Math.random() * (width - 30))
    const startY = Math.floor(Math.random() * (height - 20))
    const rectW = Math.floor(Math.random() * (width - startX - 30)) + 30
    const rectH = Math.floor(Math.random() * 20) + 1

    return this.ctx.getImageData(startX, startY, rectW, rectH)
  }

  setActive(active) {
    this.isActive = active
  }

  show() {
    if (!this.imgOrigin) return

    // Only show glitch effects when active
    if (!this.isActive) {
      // Show clean image when inactive
      this.replaceData(this.imgOrigin, this.copyData)
      this.ctx.putImageData(this.imgOrigin, 0, 0)
      return
    }

    // Restore original state
    this.replaceData(this.imgOrigin, this.copyData)

    const probs = this.probabilities[this.intensity]

    // For hover-triggered effects, reduce clean periods but keep some randomness
    const n = Math.floor(Math.random() * 100)
    if (n > 92 && this.throughFlag) {
      this.throughFlag = false
      setTimeout(() => {
        this.throughFlag = true
      }, Math.floor(Math.random() * 150) + 50)
    }

    if (!this.throughFlag) {
      this.ctx.putImageData(this.imgOrigin, 0, 0)
      return
    }

    // Apply effects
    this.flowLineImgs.forEach((obj, i) => {
      const pixels = this.flowLine(this.imgOrigin, obj)
      if (pixels) {
        this.replaceData(this.imgOrigin, pixels)
      }
    })

    this.shiftLineImgs.forEach((v, i, arr) => {
      if (Math.floor(Math.random() * 100) > probs.shiftLine) {
        arr[i] = this.shiftLine(this.imgOrigin)
        this.replaceData(this.imgOrigin, arr[i])
      } else if (arr[i]) {
        this.replaceData(this.imgOrigin, arr[i])
      }
    })

    this.shiftRGBs.forEach((v, i, arr) => {
      if (Math.floor(Math.random() * 100) > probs.shiftRGB) {
        arr[i] = this.shiftRGB(this.imgOrigin)
        this.replaceData(this.imgOrigin, arr[i])
      }
    })

    // Draw the glitched image
    this.ctx.putImageData(this.imgOrigin, 0, 0)

    // Scattered rectangles
    this.scatImgs.forEach((obj) => {
      if (Math.floor(Math.random() * 100) > probs.scat) {
        obj.x = Math.floor(Math.random() * this.canvas.width * 0.8)
        obj.y = Math.floor(Math.random() * this.canvas.height * 0.9)
        obj.imageData = this.getRandomRect(this.imgOrigin)
      }
      if (obj.imageData) {
        this.ctx.putImageData(obj.imageData, obj.x, obj.y)
      }
    })
  }

  start() {
    const animate = () => {
      this.show()
      this.animationId = requestAnimationFrame(animate)
    }
    animate()
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }
}

function GlitchCanvas({ imageSrc, mobileImageSrc, intensity = 'low', isActive = false, className = '' }) {
  const canvasRef = useRef(null)
  const glitchRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile/desktop breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    // Stop existing glitch
    if (glitchRef.current) {
      glitchRef.current.stop()
    }

    // Start new glitch with appropriate image
    const currentImageSrc = isMobile ? mobileImageSrc : imageSrc
    glitchRef.current = new WebGlitch(canvasRef.current, currentImageSrc, intensity)

    return () => {
      if (glitchRef.current) {
        glitchRef.current.stop()
      }
    }
  }, [imageSrc, mobileImageSrc, intensity, isMobile])

  // Update glitch active state
  useEffect(() => {
    if (glitchRef.current) {
      glitchRef.current.setActive(isActive)
    }
  }, [isActive])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        mixBlendMode: 'normal',
        opacity: 0.8,
        pointerEvents: 'none'
      }}
    />
  )
}

export default GlitchCanvas