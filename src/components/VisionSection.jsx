import styles from './Section.module.css'
import GlitchCanvas from './GlitchCanvas'

function VisionSection({ onClick, isGlitchActive, onHover }) {
  return (
    <div
      className={`relative cursor-pointer group overflow-hidden ${styles.sectionContainer} ${styles.visionSection}`}
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      {/* Mobile Image */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: 'url(/images/atrnd-vision-mobile-v1.png)' }}
      ></div>

      {/* Desktop Image */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: 'url(/images/atrnd-vision-v1.png)' }}
      ></div>

      {/* Glitch Effect Overlay */}
      <GlitchCanvas
        imageSrc="/images/atrnd-vision-v1.png"
        mobileImageSrc="/images/atrnd-vision-mobile-v1.png"
        intensity="low"
        isActive={isGlitchActive}
      />

      {/* Overlay for interaction */}
      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
    </div>
  )
}

export default VisionSection