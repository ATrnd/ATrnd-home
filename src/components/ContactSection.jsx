import styles from './Section.module.css'
import GlitchCanvas from './GlitchCanvas'
import contactMobile from '/images/atrnd-contact-mobile-v1.png'
import contactDesktop from '/images/atrnd-contact-v1.png'

function ContactSection({ onClick, isGlitchActive, onHover }) {
  return (
    <div
      className={`relative cursor-pointer group overflow-hidden ${styles.sectionContainer} ${styles.contactSection}`}
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      {/* Mobile Image */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${contactMobile})` }}
      ></div>

      {/* Desktop Image */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: `url(${contactDesktop})` }}
      ></div>

      {/* Glitch Effect Overlay */}
      <GlitchCanvas
        imageSrc={contactDesktop}
        mobileImageSrc={contactMobile}
        intensity="low"
        isActive={isGlitchActive}
      />

      {/* Overlay for interaction */}
      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
    </div>
  )
}

export default ContactSection