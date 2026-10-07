import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faClock, faLeaf, faSeedling } from '@fortawesome/free-solid-svg-icons'
import { Link, useParams } from 'react-router-dom'
import { farmAdvice } from './farmAdvice'

export default function FarmerAdviceDetail() {
  const { slug } = useParams()
  const advice = farmAdvice.find(item => item.slug === slug)

  if (!advice) {
    return (
      <div className="farmer-subpage farmer-advice-not-found">
        <span className="farmer-section-label">FARM ADVICE</span>
        <h1>Advice not found</h1>
        <p>This farm note may have moved.</p>
        <Link to="/farmer/dashboard" className="farmer-heading-link"><FontAwesomeIcon icon={faArrowLeft} /> Back to dashboard</Link>
      </div>
    )
  }

  const related = farmAdvice.filter(item => item.slug !== advice.slug)

  return (
    <article className="farmer-subpage farmer-advice-detail">
      <Link to="/farmer/dashboard" className="farmer-advice-back"><FontAwesomeIcon icon={faArrowLeft} /> Back to My farm</Link>
      <div className="farmer-advice-detail-heading">
        <span className="farmer-section-label">{advice.category} <i>·</i> TODAY’S FARM ADVICE</span>
        <h1>{advice.title}</h1>
        <p>{advice.summary}</p>
        <span className="farmer-advice-duration"><FontAwesomeIcon icon={faClock} /> {advice.readTime}</span>
      </div>

      <figure className="farmer-advice-detail-photo">
        <img src={advice.image} alt={advice.imageAlt} />
        <figcaption>{advice.photoCaption} <span>PHOTO · BOLDSTONE</span></figcaption>
      </figure>

      <div className="farmer-advice-article-grid">
        <div className="farmer-advice-article-copy">
          <p className="farmer-advice-lead">{advice.lead}</p>
          <h2>What to do</h2>
          <ol>{advice.steps.map(step => <li key={step}>{step}</li>)}</ol>
          <aside className="farmer-advice-note"><FontAwesomeIcon icon={faSeedling} /><p><strong>Field note</strong><span>{advice.note}</span></p></aside>
        </div>
        <aside className="farmer-advice-side-note"><FontAwesomeIcon icon={faLeaf} /><span>Good farm records make it easier to spot changes and discuss the next step with your agronomist.</span></aside>
      </div>

      <section className="farmer-related-advice">
        <div className="farmer-panel-heading"><div><span className="farmer-section-label">MORE FIELD NOTES</span><h2>Keep learning</h2></div><Link to="/farmer/dashboard">All advice <FontAwesomeIcon icon={faArrowRight} /></Link></div>
        <div className="farmer-related-grid">
          {related.map(item => <Link to={`/farmer/advice/${item.slug}`} key={item.slug} className="farmer-related-card"><img src={item.image} alt="" /><span><small>{item.category}</small><strong>{item.title}</strong></span><FontAwesomeIcon icon={faArrowRight} /></Link>)}
        </div>
      </section>
    </article>
  )
}