import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faChevronLeft, faChevronRight, faClock, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { farmAdvice } from './farmAdvice'

export default function FarmAdviceCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const activeAdvice = farmAdvice[activeIndex]

  useEffect(() => {
    if (!isPlaying) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex(index => (index + 1) % farmAdvice.length)
    }, 8000)
    return () => window.clearInterval(timer)
  }, [isPlaying])

  const move = direction => {
    setActiveIndex(index => (index + direction + farmAdvice.length) % farmAdvice.length)
  }

  return (
    <section
      className="farmer-advice"
      aria-label="Today's Farm Advice"
    >
      <div className="farmer-advice-heading">
        <div>
          <span className="farmer-section-label">FARM NOTES · UPDATED THIS WEEK</span>
          <h2>Today’s Farm Advice</h2>
        </div>
        <div className="farmer-advice-controls">
          <span>{String(activeIndex + 1).padStart(2, '0')} <i>/</i> {String(farmAdvice.length).padStart(2, '0')}</span>
          <button type="button" onClick={() => setIsPlaying(playing => !playing)} aria-label={isPlaying ? 'Pause advice rotation' : 'Play advice rotation'} aria-pressed={!isPlaying}>
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
          <button type="button" onClick={() => move(-1)} aria-label="Previous advice"><FontAwesomeIcon icon={faChevronLeft} /></button>
          <button type="button" onClick={() => move(1)} aria-label="Next advice"><FontAwesomeIcon icon={faChevronRight} /></button>
        </div>
      </div>

      <div className="farmer-advice-window" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            className="farmer-advice-slide"
            key={activeAdvice.slug}
            initial={{ opacity: 0, x: 56 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -56 }}
            transition={{ duration: 0.42, ease: 'easeOut' }}
          >
            <Link className="farmer-advice-link" to={`/farmer/advice/${activeAdvice.slug}`} aria-label={`Read advice: ${activeAdvice.title}`}>
              <div className="farmer-advice-photo">
                <img src={activeAdvice.image} alt={activeAdvice.imageAlt} />
                <span>{activeAdvice.photoCaption}</span>
              </div>
              <div className="farmer-advice-copy">
                <span className="farmer-advice-category">{activeAdvice.category}</span>
                <h3>{activeAdvice.title}</h3>
                <p>{activeAdvice.summary}</p>
                <div className="farmer-advice-meta"><span><FontAwesomeIcon icon={faClock} /> {activeAdvice.readTime}</span><span className="farmer-advice-read">Read advice <FontAwesomeIcon icon={faArrowRight} /></span></div>
              </div>
            </Link>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="farmer-advice-indicators" aria-label="Choose advice story">
        {farmAdvice.map((item, index) => (
          <button key={item.slug} type="button" className={index === activeIndex ? 'active' : ''} onClick={() => setActiveIndex(index)} aria-label={`Show advice ${index + 1}: ${item.title}`} aria-current={index === activeIndex ? 'true' : undefined} />
        ))}
      </div>
    </section>
  )
}