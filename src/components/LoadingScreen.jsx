import { useState, useEffect, useRef } from 'react'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import styles from './LoadingScreen.module.css'
import backgroundImage from '/images/bg_0.1.jpg'

function LoadingScreen({ onLoadingComplete }) {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState('INITIALIZING')
  const deviceInfo = useDeviceDetection()
  const loadingImageRef = useRef(null)

  // Loading stages
  const stages = [
    { name: 'INITIALIZING', duration: 500 },
    { name: 'LOADING : FONTS', duration: 800 },
    { name: 'LOADING : IMAGES', duration: 1200 },
    { name: 'LOADING : ASSETS', duration: 1000 },
    { name: 'COMPILING', duration: 600 },
    { name: 'READY', duration: 300 }
  ]

  useEffect(() => {
    let currentStage = 0
    let currentProgress = 0

    const progressInterval = setInterval(() => {
      const stage = stages[currentStage]
      const stageProgress = 100 / stages.length
      const increment = stageProgress / (stage.duration / 50) // 50ms intervals

      currentProgress += increment
      setLoadingProgress(Math.min(currentProgress, 100))

      // Update stage
      const newStageIndex = Math.floor(currentProgress / (100 / stages.length))
      if (newStageIndex !== currentStage && newStageIndex < stages.length) {
        currentStage = newStageIndex
        setLoadingStage(stages[currentStage].name)
      }

      // Complete loading
      if (currentProgress >= 100) {
        clearInterval(progressInterval)
        setTimeout(() => {
          onLoadingComplete?.()
        }, 500)
      }
    }, 50)

    return () => clearInterval(progressInterval)
  }, [onLoadingComplete])

  // Get device-specific styling
  const getLoadingScreenStyle = () => {
    const { screenSize } = deviceInfo

    switch (screenSize) {
      case 'mobile':
        return styles.mobileLoading
      case 'tablet':
        return styles.tabletLoading
      case 'ultrawide':
        return styles.ultrawideLoading
      default:
        return styles.desktopLoading
    }
  }

  // Show background on desktop/tablet only
  const showBackground = deviceInfo.screenSize !== 'mobile'

  return (
    <div className={`${styles.loadingContainer} ${getLoadingScreenStyle()}`}>
      {/* Background */}
      <div
        className={styles.background}
        style={showBackground ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {}}
      />

      {/* Main loading image */}
      <div className={styles.imageContainer}>
        <img
          ref={loadingImageRef}
          src="/images/atrnd_loading_img_v1.png"
          alt="ATrnd Loading"
          className={styles.loadingImage}
        />
      </div>

      {/* Progress bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <div className={styles.progressText}>
          {Math.round(loadingProgress)}%
        </div>
      </div>

      {/* Loading status */}
      <div className={styles.statusText}>
        {loadingStage}
      </div>
    </div>
  )
}

export default LoadingScreen