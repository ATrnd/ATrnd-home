import styles from './Section.module.css'
import GlitchCanvas from './GlitchCanvas'
import { useDeviceDetection } from '../hooks/useDeviceDetection'
import contactMobile from '/images/atrnd-contact-mobile-v1.png'
import contactDesktop from '/images/atrnd-contact-v1.png'

function ContactSection({ onClick, isGlitchActive, onHover }) {
  const deviceInfo = useDeviceDetection()
  const isMobile = deviceInfo.screenSize === 'mobile'
  const currentImage = isMobile ? contactMobile : contactDesktop

  return (
    <div
      className={`relative cursor-pointer group overflow-hidden ${styles.sectionContainer} ${styles.contactSection}`}
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

export default ContactSection