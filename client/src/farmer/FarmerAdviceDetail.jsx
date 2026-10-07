import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faClock, faLeaf, faSeedling } from '@fortawesome/free-solid-svg-icons'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useFarmerResource } from './farmerApi'

export default function FarmerAdviceDetail() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const adviceSlug = slug || searchParams.get('slug')
  const { data: detailData, error: detailError, loading: detailLoading } = useFarmerResource(`advice/${adviceSlug}`)
  const { data: listData } = useFarmerResource('advice')
  const advice = detailData?.advice?.[0]
  const related = (listData?.advice || []).filter(item => item.slug !== adviceSlug)

  if (detailLoading) return <div className="farmer-page-message" role="status">Loading farm advice...</div>

  if (detailError || !advice) {
    return (
      <div className="farmer-subpage farmer-advice-not-found">
        <span className="farmer-section-label">FARM ADVICE</span>
        <h1>Advice not found</h1>
        <p>This farm note may have moved.</p>
        <Link to="/farmers/dashboard" className="farmer-heading-link"><FontAwesomeIcon icon={faArrowLeft} /> Back to dashboard</Link>
      </div>
    )
  }

  return (
    <article className="farmer-subpage farmer-advice-detail">
      <Link to="/farmers/dashboard" className="farmer-advice-back"><FontAwesomeIcon icon={faArrowLeft} /> Back to My farm</Link>
      <div className="farmer-advice-detail-heading">
        <span className="farmer-section-label">{advice.category} <i>·</i> TODAY’S FARM ADVICE</span>
        <h1>{advice.title}</h1>
        <p>{advice.summary}</p>
        <span className="farmer-advice-duration"><FontAwesomeIcon icon={faClock} /> {advice.read_time}</span>
      </div>

      <figure className="farmer-advice-detail-photo">
        <img src={advice.image} alt={advice.image_alt} />
        <figcaption>{advice.photo_caption} <span>PHOTO · BOLDSTONE</span></figcaption>
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
        <div className="farmer-panel-heading"><div><span className="farmer-section-label">MORE FIELD NOTES</span><h2>Keep learning</h2></div><Link to="/farmers/dashboard">All advice <FontAwesomeIcon icon={faArrowRight} /></Link></div>
        <div className="farmer-related-grid">
          {related.map(item => <Link to={`/farmers/advice?slug=${encodeURIComponent(item.slug)}`} key={item.slug} className="farmer-related-card"><img src={item.image} alt="" /><span><small>{item.category}</small><strong>{item.title}</strong></span><FontAwesomeIcon icon={faArrowRight} /></Link>)}
        </div>
      </section>
    </article>
  )
}