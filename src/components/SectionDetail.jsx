import { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import styles from './SectionDetail.module.css'
import sectionStyles from './Section.module.css'
import backgroundImage from '/images/bg_0.1.jpg'

// Import all section images
import aboutMobile from '/images/atrnd-about-mobile-v1.png'
import aboutDesktop from '/images/atrnd-about-v1.png'
import workMobile from '/images/atrnd-work-mobile-v1.png'
import workDesktop from '/images/atrnd-work-v1.png'
import visionMobile from '/images/atrnd-vision-mobile-v1.png'
import visionDesktop from '/images/atrnd-vision-v1.png'
import contactMobile from '/images/atrnd-contact-mobile-v1.png'
import contactDesktop from '/images/atrnd-contact-v1.png'

const sectionContent = {
  about: {
    title: "SECRETS EXPOSED",
    content: `Gm, it's me ATrnd.
I'm a dreamer I guess—playing with code, messing with bytes, and pushing pixels (hard).
I've been doing this for a while, sitting in dark rooms, formalizing ideas about... well, it's a secret, ssh! Games!
Of course there's ups and downs, distractions, and a bit of ADHD-fueled depression.
But I keep going.
Vibing in the dark forest.`,
    image: aboutMobile,
    imageDesktop: aboutDesktop
  },
  work: {
    title: "THE UNPREDICTABLE",
    content: `I'm building web3 stuff. :D
Currently focusing on Shape Grinders—
fusing 3D, NFTs, and some MMO love.
I do this every day.
And I hope I'll get it done in a few eons from now.
Sometimes when I feel really awkward about being unsocial, I even tweet about it.
But that's rare.`,
    image: workMobile,
    imageDesktop: workDesktop
  },
  vision: {
    title: "WEB3 + MMO",
    content: `Web3 + ForeverGames + U & I.
Ready to go?`,
    image: visionMobile,
    imageDesktop: visionDesktop
  },
  contact: {
    title: "GET IN TOUCH",
    content: `Not sure why you'd want to contact me.
But if you ever want to build something crazy and fight for the user—
hit me up.`,
    image: contactMobile,
    imageDesktop: contactDesktop
  }
}

function SectionDetail({ section, onBack }) {
  const data = sectionContent[section]
  const [showBackground, setShowBackground] = useState(false)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [section])

  // Handle responsive background
  useEffect(() => {
    const handleResize = () => {
      setShowBackground(window.innerWidth >= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!data) return null

  return (
    <div
      className="min-h-screen bg-white text-black flex flex-col"
      style={showBackground ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      <Header />

      <main className={`flex-1 px-4 ${styles.mainContainer}`} style={{ marginTop: '41px' }}>
        {/* Section Title */}
        <div className={styles.headerContainer} style={{ marginBottom: '41px' }}>
          <h1 className="text-2xl font-bold uppercase tracking-wide border-b border-gray-300" style={{ fontFamily: 'var(--font-orbitron)', color: 'rgba(0, 0, 0, 0.2)', paddingBottom: '16px' }}>
            {data.title}
          </h1>
        </div>

        {/* Content */}
        <div className={`text-lg md:text-xl leading-6 md:leading-7 whitespace-pre-line ${styles.contentContainer}`} style={{ fontFamily: 'var(--font-ibm-3270)', color: 'rgba(0, 0, 0, 0.9)', marginBottom: '41px' }}>
          {data.content}
        </div>

        {/* Section Image - Standalone for 768px+ ordering */}
        <div className={styles.imageContainer}>
          <div
            className={`relative overflow-hidden ${sectionStyles.servicePageContainer}`}
          >
            {/* Mobile Image - 375px to 767px */}
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat md:hidden"
              style={{ backgroundImage: `url(${data.image})` }}
            ></div>

            {/* Desktop Image - 768px and up */}
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat hidden md:block"
              style={{ backgroundImage: `url(${data.imageDesktop})` }}
            ></div>
          </div>
        </div>

        {/* Back Button - Standalone for 768px+ ordering */}
        <div className={styles.backButtonContainer}>
          <button
            onClick={onBack}
            className="cursor-pointer hover:opacity-70 transition-opacity"
            style={{ width: '66px', height: '93.8px' }}
          >
            <img src={`${import.meta.env.BASE_URL}back-btn-v1.svg`} alt="Back" className="w-full h-full" />
          </button>
        </div>

        {/* Back Button + Image Container for 480px side-by-side */}
        <div className={styles.buttonImageContainer}>
          {/* Back Button */}
          <div className={styles.backButtonContainer480}>
            <button
              onClick={onBack}
              className="cursor-pointer hover:opacity-70 transition-opacity"
              style={{ width: '66px', height: '93.8px' }}
            >
              <img src={`${import.meta.env.BASE_URL}back-btn-v1.svg`} alt="Back" className="w-full h-full" />
            </button>
          </div>

          {/* Section Image - For 480px side-by-side layout */}
          <div className={styles.imageContainer480}>
            <div
              className={`relative overflow-hidden ${sectionStyles.servicePageContainer}`}
            >
              {/* Mobile Image - 375px to 767px */}
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat md:hidden"
                style={{ backgroundImage: `url(${data.image})` }}
              ></div>

              {/* Desktop Image - 768px and up */}
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat hidden md:block"
                style={{ backgroundImage: `url(${data.imageDesktop})` }}
              ></div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SectionDetail
