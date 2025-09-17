import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import AboutSection from './components/AboutSection'
import WorkSection from './components/WorkSection'
import VisionSection from './components/VisionSection'
import ContactSection from './components/ContactSection'
import SectionDetail from './components/SectionDetail'
import styles from './components/App.module.css'

function App() {
  const [currentSection, setCurrentSection] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [activeGlitchBanner, setActiveGlitchBanner] = useState(-1) // -1 = none, 0-3 = banner index
  const savedScrollPosition = useRef(0)

  // Define different glitch patterns with varying speeds
  const glitchPatterns = {
    fast: {
      glitchDuration: [1000, 1500], // 1-1.5 seconds
      pauseDuration: [500, 1200],   // 0.5-1.2 seconds
      name: 'Fast'
    },
    medium: {
      glitchDuration: [2000, 3000], // 2-3 seconds
      pauseDuration: [1500, 3000],  // 1.5-3 seconds
      name: 'Medium'
    },
    slow: {
      glitchDuration: [3000, 4000], // 3-4 seconds
      pauseDuration: [3000, 6000],  // 3-6 seconds
      name: 'Slow'
    },
    burst: {
      glitchDuration: [800, 1200],  // 0.8-1.2 seconds
      pauseDuration: [300, 700],    // 0.3-0.7 seconds (rapid fire)
      name: 'Burst'
    }
  }

  const handleSectionClick = (section) => {
    // Clear any active glitch before navigating
    setActiveGlitchBanner(-1)

    // Save current scroll position before navigating
    savedScrollPosition.current = window.scrollY
    setIsAnimating(true)

    // Fade out, then navigate after animation
    setTimeout(() => {
      setCurrentSection(section)
      setIsAnimating(false)
    }, 150)
  }

  const handleBackClick = () => {
    setIsAnimating(true)

    // Fade out, then navigate back after animation
    setTimeout(() => {
      setCurrentSection(null)
      setActiveGlitchBanner(-1) // Reset glitch state when returning to homepage
      setIsAnimating(false)
    }, 150)
  }

  // Handle scroll restoration after grid is rendered
  useEffect(() => {
    if (!currentSection && !isAnimating && savedScrollPosition.current > 0) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, savedScrollPosition.current)
          console.log('Restored scroll to:', savedScrollPosition.current)
        })
      })
    }
  }, [currentSection, isAnimating])

  // Handle hover-triggered glitch effects with random patterns
  const handleSectionHover = (bannerIndex, isHovering) => {
    if (isHovering) {
      const patternNames = Object.keys(glitchPatterns)
      const randomPattern = patternNames[Math.floor(Math.random() * patternNames.length)]
      const pattern = glitchPatterns[randomPattern]

      setActiveGlitchBanner(bannerIndex)
    } else {
      setActiveGlitchBanner(-1)
    }
  }

  // Show section detail if a section is selected
  if (currentSection) {
    return (
      <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <SectionDetail section={currentSection} onBack={handleBackClick} />
      </div>
    )
  }

  // Show main grid view
  return (
    <div className={`min-h-screen bg-white text-black flex flex-col desktop-bg transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      <Header />

      <main className={styles.gridWrapper}>
        {/* Center black circle for desktop 2x2 grid */}
        <div className={styles.centerCircle}></div>

        {/* Mobile-first 4-section grid */}
        <div className={styles.sectionsGrid}>
          <AboutSection
            onClick={() => handleSectionClick('about')}
            isGlitchActive={activeGlitchBanner === 0}
            onHover={(isHovering) => handleSectionHover(0, isHovering)}
          />
          <WorkSection
            onClick={() => handleSectionClick('work')}
            isGlitchActive={activeGlitchBanner === 1}
            onHover={(isHovering) => handleSectionHover(1, isHovering)}
          />
          <VisionSection
            onClick={() => handleSectionClick('vision')}
            isGlitchActive={activeGlitchBanner === 2}
            onHover={(isHovering) => handleSectionHover(2, isHovering)}
          />
          <ContactSection
            onClick={() => handleSectionClick('contact')}
            isGlitchActive={activeGlitchBanner === 3}
            onHover={(isHovering) => handleSectionHover(3, isHovering)}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
