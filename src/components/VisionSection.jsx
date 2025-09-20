import styles from './Section.module.css'
import GlitchCanvas from './GlitchCanvas'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import visionMobile from '/images/atrnd-vision-mobile-v1.png'
import visionDesktop from '/images/atrnd-vision-v1.png'

function VisionSection({ onClick, isGlitchActive, onHover }) {
  const deviceInfo = useDeviceDetection()
  const isMobile = deviceInfo.screenSize === 'mobile'
  const currentImage = isMobile ? visionMobile : visionDesktop

  return (
    <div
      className={`relative cursor-pointer group overflow-hidden ${styles.sectionContainer} ${styles.visionSection}`}
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      {/* Device-specific image loading */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${currentImage})` }}
      ></div>

      {/* Glitch Effect Overlay - only on desktop */}
      {!isMobile && (
        <GlitchCanvas
          imageSrc={currentImage}
          intensity="low"
          isActive={isGlitchActive}
        />
      )}

      {/* Overlay for interaction */}
      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
    </div>
  )
}

export default VisionSection