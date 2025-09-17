import styles from './Section.module.css'
import GlitchCanvas from './GlitchCanvas'
import workMobile from '/images/atrnd-work-mobile-v1.png'
import workDesktop from '/images/atrnd-work-v1.png'

function WorkSection({ onClick, isGlitchActive, onHover }) {
  return (
    <div
      className={`relative cursor-pointer group overflow-hidden ${styles.sectionContainer} ${styles.workSection}`}
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      {/* Mobile Image */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${workMobile})` }}
      ></div>

      {/* Desktop Image */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: `url(${workDesktop})` }}
      ></div>

      {/* Glitch Effect Overlay */}
      <GlitchCanvas
        imageSrc={workDesktop}
        mobileImageSrc={workMobile}
        intensity="low"
        isActive={isGlitchActive}
      />

      {/* Overlay for interaction */}
      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
    </div>
  )
}

export default WorkSection
