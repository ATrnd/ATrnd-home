import { useState, useEffect } from 'react'

export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = useState({
    deviceType: 'desktop',
    screenSize: 'large',
    viewport: { width: 0, height: 0 },
    orientation: 'landscape',
    isTouchDevice: false
  })

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      // Screen size categories
      let screenSize = 'large'
      let deviceType = 'desktop'

      if (width < 768) {
        screenSize = 'mobile'
        deviceType = 'mobile'
      } else if (width < 1024) {
        screenSize = 'tablet'
        deviceType = 'tablet'
      } else if (width < 1920) {
        screenSize = 'desktop'
        deviceType = 'desktop'
      } else {
        screenSize = 'ultrawide'
        deviceType = 'desktop'
      }

      const orientation = width > height ? 'landscape' : 'portrait'

      setDeviceInfo({
        deviceType,
        screenSize,
        viewport: { width, height },
        orientation,
        isTouchDevice
      })
    }

    // Initial detection
    detectDevice()

    // Listen for resize events
    window.addEventListener('resize', detectDevice)
    window.addEventListener('orientationchange', detectDevice)

    return () => {
      window.removeEventListener('resize', detectDevice)
      window.removeEventListener('orientationchange', detectDevice)
    }
  }, [])

  return deviceInfo
}