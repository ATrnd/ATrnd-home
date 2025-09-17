import styles from './Section.module.css'
import GlitchCanvas from './GlitchCanvas'
import aboutMobile from '/images/atrnd-about-mobile-v1.png'
import aboutDesktop from '/images/atrnd-about-v1.png'

function AboutSection({ onClick, isGlitchActive, onHover }) {
  return (
    <div
      className={`relative cursor-pointer group overflow-hidden ${styles.sectionContainer} ${styles.aboutSection}`}
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      {/* Mobile Image - 375px to 767px */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${aboutMobile})` }}
      ></div>

      {/* Desktop Image - 768px and up */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: `url(${aboutDesktop})` }}
      ></div>

      {/* Glitch Effect Overlay */}
      <GlitchCanvas
        imageSrc={aboutDesktop}
        mobileImageSrc={aboutMobile}
        intensity="low"
        isActive={isGlitchActive}
      />

      {/* Overlay for interaction */}
      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
    </div>
  )
}

export default AboutSection
