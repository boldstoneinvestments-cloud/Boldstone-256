import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faArrowTrendUp,
  faAward,
  faCalendarCheck,
  faCheck,
  faCircleExclamation,
  faCloudSun,
  faCoins,
  faGraduationCap,
  faHeartPulse,
  faLeaf,
  faSeedling,
  faShieldHalved,
  faTree,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

const production = [
  { year: '2022/23', value: '2.8 t', height: 42 },
  { year: '2023/24', value: '3.4 t', height: 55 },
  { year: '2024/25', value: '3.1 t', height: 50 },
  { year: '2025/26', value: '4.2 t', height: 68 },
  { year: '2026/27', value: '4.8 t', height: 82, current: true },
]

const opportunities = [
  { icon: faCoins, type: 'FINANCING', title: 'Seasonal input credit', detail: 'Applications close Oct 24', tone: 'ochre', link: '/farmer/apply-for-loan', action: 'Apply for loan' },
  { icon: faGraduationCap, type: 'TRAINING', title: 'Post-harvest quality clinic', detail: 'Kyenjojo · Oct 19', tone: 'green', link: '/farmer/opportunities', action: 'View details' },
  { icon: faShieldHalved, type: 'CERTIFICATION', title: 'Sustainable farm program', detail: 'Enrollment open', tone: 'blue', link: '/farmer/opportunities', action: 'View details' },
  { icon: faSeedling, type: 'INPUT DISCOUNTS', title: 'Seasonal input bundle', detail: 'Discounts from partner suppliers', tone: 'green', link: '/farmer/opportunities', action: 'View details' },
  { icon: faTree, type: 'LAND', title: 'Coffee-ready land', detail: 'New lease opportunities nearby', tone: 'ochre', link: '/farmer/opportunities', action: 'View details' },
]

function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="farmer-page-heading">
      <div>
        <div className="farmer-heading-kicker">{eyebrow} <span className="farmer-demo-badge">SAMPLE DATA</span></div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  )
}

function ProductionChart() {
  return (
    <section className="farmer-panel">
      <div className="farmer-panel-heading"><div><span className="farmer-section-label">PRODUCTION HISTORY</span><h2>Yield by season</h2></div><span className="farmer-status-chip">5 seasons</span></div>
      <div className="farmer-chart-summary"><strong>4.8 <small>tonnes forecast</small></strong><span className="farmer-positive"><FontAwesomeIcon icon={faArrowTrendUp} /> 14% <small>vs last season</small></span></div>
      <div className="farmer-bar-chart" aria-label="Production history by season">
        {production.map(season => (
          <div className={`farmer-bar-column${season.current ? ' current' : ''}`} key={season.year}>
            <span className="farmer-bar-value">{season.value}</span>
            <div className="farmer-bar-track"><span style={{ height: `${season.height}%` }} /></div>
            <span className="farmer-bar-year">{season.year}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function FarmerPerformance() {
  return (
    <div className="farmer-subpage">
      <PageHeading eyebrow="FARM PERFORMANCE" title="Performance" description="Yield, productivity, and crop health across your farm." />
      <div className="farmer-detail-grid">
        <ProductionChart />
        <section className="farmer-panel farmer-performance-summary">
          <div className="farmer-panel-heading"><div><span className="farmer-section-label">THIS SEASON</span><h2>Farm productivity</h2></div><FontAwesomeIcon className="farmer-reward-mark" icon={faHeartPulse} /></div>
          <strong className="farmer-large-value">387 <small>kg / acre</small></strong>
          <p className="farmer-muted-copy">Above the sample district average of 340 kg per acre.</p>
          <div className="farmer-score-row"><span>Crop health</span><strong>87 <small>/ 100</small></strong><div className="farmer-score-track"><i style={{ width: '87%' }} /></div></div>
          <div className="farmer-score-row sustainability"><span>Tree survival</span><strong>92 <small>%</small></strong><div className="farmer-score-track"><i style={{ width: '92%' }} /></div></div>
        </section>
      </div>
      <section className="farmer-panel farmer-data-note"><FontAwesomeIcon icon={faLeaf} /><span><strong>How to improve your score</strong><small>Complete the open agronomy tasks and record pruning, mulching, and input applications.</small></span><Link to="/farmer/agronomy">Open agronomy <FontAwesomeIcon icon={faArrowRight} /></Link></section>
    </div>
  )
}

export function FarmerPrices() {
  const prices = [
    { grade: 'Robusta FAQ', today: 'UGX 8,750', month: '+3.2%', tone: 'positive' },
    { grade: 'Robusta Screen 18', today: 'UGX 9,400', month: '+2.1%', tone: 'positive' },
    { grade: 'Arabica FAQ', today: 'UGX 12,600', month: '-0.8%', tone: 'negative' },
  ]
  return (
    <div className="farmer-subpage">
      <PageHeading eyebrow="MARKET INFORMATION" title="Coffee prices" description="Indicative local prices and recent movement. Confirm buyer offers before selling." />
      <section className="farmer-panel farmer-price-feature">
        <div><span className="farmer-section-label">ROBUSTA · FAQ · INDICATIVE FARMGATE</span><div className="farmer-market-price">UGX <strong>8,750</strong><span>/ kg</span></div><div className="farmer-market-change"><span className="farmer-positive"><FontAwesomeIcon icon={faArrowTrendUp} /> 3.2%</span><span>over the past 30 days</span></div></div>
        <div className="farmer-price-sparkline" aria-label="Price has generally increased over the past month">{[30, 38, 33, 45, 42, 57, 49, 64, 59, 74, 68, 86, 78, 94, 89, 100].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
      </section>
      <section className="farmer-panel">
        <div className="farmer-panel-heading"><div><span className="farmer-section-label">DAILY REFERENCE</span><h2>Indicative market prices</h2></div><span className="farmer-market-updated">Updated today</span></div>
        <div className="farmer-table-wrap"><table className="farmer-table"><thead><tr><th>Coffee type</th><th>Current price</th><th>30-day trend</th></tr></thead><tbody>{prices.map(price => <tr key={price.grade}><td>{price.grade}</td><td><strong>{price.today}</strong> / kg</td><td className={price.tone}>{price.month}</td></tr>)}</tbody></table></div>
      </section>
      <section className="farmer-recommendation farmer-price-guidance"><span>SELLING WINDOW</span><strong>Current trend is positive. Compare at least two buyer offers near harvest.</strong><p>This is a market indicator, not a guaranteed price or individualized financial recommendation.</p></section>
    </div>
  )
}

export function FarmerAgronomy() {
  const [completed, setCompleted] = useState([])
  const tasks = [
    { id: 'pest', title: 'Inspect north block for twig borer', detail: 'Pest alert · Block C · Check branches and remove affected material', due: 'Today', urgent: true },
    { id: 'mulch', title: 'Apply mulch around young trees', detail: 'Soil care · Block A · Keep mulch clear of the stem', due: 'Oct 12' },
    { id: 'estimate', title: 'Submit crop estimate', detail: 'Harvest planning · Record expected cherry volume', due: 'Oct 18' },
  ]
  return (
    <div className="farmer-subpage">
      <PageHeading eyebrow="CROP CARE" title="Agronomy" description="Tasks, alerts, and recommendations for the current season." />
      <section className="farmer-alert-strip"><span><FontAwesomeIcon icon={faCircleExclamation} /></span><p><strong>Pest alert · Coffee twig borer.</strong> Inspect the north block and contact your agronomist if damage is widespread.</p></section>
      <div className="farmer-detail-grid">
        <section className="farmer-panel">
          <div className="farmer-panel-heading"><div><span className="farmer-section-label">YOUR FIELD PLAN</span><h2>Tasks to complete</h2></div><span className="farmer-status-chip">{tasks.length - completed.length} open</span></div>
          <ul className="farmer-task-list farmer-full-task-list">{tasks.map(task => <li key={task.id} className={completed.includes(task.id) ? 'completed' : ''}><button className={`farmer-task-check${task.urgent ? ' urgent' : ''}${completed.includes(task.id) ? ' done' : ''}`} aria-label={`Mark ${task.title} ${completed.includes(task.id) ? 'incomplete' : 'complete'}`} onClick={() => setCompleted(items => items.includes(task.id) ? items.filter(item => item !== task.id) : [...items, task.id])}>{completed.includes(task.id) && <FontAwesomeIcon icon={faCheck} />}</button><span className="farmer-task-copy"><strong>{task.title}</strong><small>{task.detail}</small></span><span className={`farmer-task-due${task.urgent ? ' urgent' : ''}`}>{task.due}</span></li>)}</ul>
        </section>
        <section className="farmer-panel"><div className="farmer-panel-heading"><div><span className="farmer-section-label">FIELD CONDITIONS</span><h2>Weather & farm alerts</h2></div><FontAwesomeIcon className="farmer-reward-mark" icon={faCloudSun} /></div><div className="farmer-weather-detail"><strong>24°</strong><span>Partly cloudy in Kyenjojo</span></div><p className="farmer-muted-copy">Rain expected Friday. Plan foliar applications for tomorrow and avoid spraying before rainfall.</p><hr className="farmer-panel-rule" /><span className="farmer-section-label">FERTILIZER GUIDANCE</span><p className="farmer-muted-copy">Sample recommendation: review soil test results before applying fertilizer. Confirm rates with your agronomist.</p></section>
      </div>
    </div>
  )
}

export function FarmerHarvest() {
  return (
    <div className="farmer-subpage">
      <PageHeading eyebrow="HARVEST & SALES" title="Harvest and sales" description="Plan the upcoming crop and track recorded sales and payments." />
      <section className="farmer-panel farmer-harvest-feature"><div><span className="farmer-section-label">NEXT HARVEST</span><strong>Dec 20 <small>–</small> Jan 30</strong><span>Robusta · Main season · On track</span></div><FontAwesomeIcon icon={faCalendarCheck} /></section>
      <section className="farmer-metrics farmer-sales-metrics">
        <article className="farmer-metric"><span className="farmer-metric-icon moss"><FontAwesomeIcon icon={faSeedling} /></span><span className="farmer-metric-label">Harvest forecast</span><strong>4.8 tonnes</strong><span className="farmer-metric-detail">Expected this season</span></article>
        <article className="farmer-metric"><span className="farmer-metric-icon blue"><FontAwesomeIcon icon={faTree} /></span><span className="farmer-metric-label">Coffee sold</span><strong>2.1 tonnes</strong><span className="farmer-metric-detail">Recorded this season</span></article>
        <article className="farmer-metric"><span className="farmer-metric-icon ochre"><FontAwesomeIcon icon={faCoins} /></span><span className="farmer-metric-label">Revenue received</span><strong>UGX 14.7M</strong><span className="farmer-metric-detail">Payments cleared</span></article>
        <article className="farmer-metric"><span className="farmer-metric-icon coral"><FontAwesomeIcon icon={faCalendarCheck} /></span><span className="farmer-metric-label">Payment pending</span><strong>UGX 4.2M</strong><span className="farmer-metric-detail">One buyer invoice</span></article>
      </section>
      <section className="farmer-panel"><div className="farmer-panel-heading"><div><span className="farmer-section-label">SALES RECORD</span><h2>Recent deliveries</h2></div></div><div className="farmer-table-wrap"><table className="farmer-table"><thead><tr><th>Date</th><th>Grade</th><th>Quantity</th><th>Payment</th></tr></thead><tbody><tr><td>Sep 22</td><td>Robusta FAQ</td><td>850 kg</td><td><span className="farmer-payment-status paid">Paid</span></td></tr><tr><td>Aug 16</td><td>Robusta Screen 18</td><td>620 kg</td><td><span className="farmer-payment-status pending">Pending</span></td></tr><tr><td>Jul 09</td><td>Robusta FAQ</td><td>630 kg</td><td><span className="farmer-payment-status paid">Paid</span></td></tr></tbody></table></div></section>
    </div>
  )
}

export function FarmerOpportunities() {
  return (
    <div className="farmer-subpage">
      <PageHeading eyebrow="GROW YOUR FARM" title="Opportunities" description="Programs, services, and support available to your farm." />
      <div className="farmer-opportunity-page-list">{opportunities.map(item => <article className="farmer-panel farmer-opportunity-card" key={item.title}><span className={`farmer-opportunity-icon ${item.tone}`}><FontAwesomeIcon icon={item.icon} /></span><div><span className="farmer-section-label">{item.type}</span><h2>{item.title}</h2><p>{item.detail}</p></div><Link to={item.link} className="farmer-heading-link">{item.action}<FontAwesomeIcon icon={faArrowRight} /></Link></article>)}</div>
    </div>
  )
}

export function FarmerRewards() {
  return (
    <div className="farmer-subpage">
      <PageHeading eyebrow="FARMER REWARDS" title="Rewards" description="Quality and sustainable practices contribute to your farm rewards." />
      <div className="farmer-detail-grid">
        <section className="farmer-panel farmer-reward-overview"><div className="farmer-panel-heading"><div><span className="farmer-section-label">AVAILABLE BALANCE</span><h2>Your reward points</h2></div><FontAwesomeIcon className="farmer-reward-mark" icon={faAward} /></div><strong className="farmer-large-value">180 <small>points</small></strong><p className="farmer-muted-copy">Sample balance · earn points through quality and sustainability programs.</p><Link to="/farmer/opportunities" className="farmer-heading-link">Explore programs <FontAwesomeIcon icon={faArrowRight} /></Link></section>
        <section className="farmer-panel"><div className="farmer-panel-heading"><div><span className="farmer-section-label">FARM SCORES</span><h2>Progress overview</h2></div></div><div className="farmer-score-row"><span>Quality score</span><strong>84 <small>/ 100</small></strong><div className="farmer-score-track"><i style={{ width: '84%' }} /></div></div><div className="farmer-score-row sustainability"><span>Sustainability score</span><strong>76 <small>/ 100</small></strong><div className="farmer-score-track"><i style={{ width: '76%' }} /></div></div><p className="farmer-muted-copy">Improve your scores with harvest quality records, shade coverage, and soil-care activities.</p></section>
      </div>
      <section className="farmer-panel farmer-reward-catalog"><div className="farmer-panel-heading"><div><span className="farmer-section-label">REWARD CATALOG</span><h2>Available rewards</h2></div></div><div className="farmer-reward-items"><article><span className="farmer-metric-icon moss"><FontAwesomeIcon icon={faSeedling} /></span><strong>Seedling voucher</strong><small>250 points</small></article><article><span className="farmer-metric-icon ochre"><FontAwesomeIcon icon={faCoins} /></span><strong>Input discount</strong><small>300 points</small></article><article><span className="farmer-metric-icon blue"><FontAwesomeIcon icon={faGraduationCap} /></span><strong>Training seat</strong><small>180 points</small></article></div></section>
    </div>
  )
}

export function FarmerLoanApplication() {
  const [submitted, setSubmitted] = useState(false)
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('Farm inputs')
  const submit = event => {
    event.preventDefault()
    setSubmitted(true)
  }
  return (
    <div className="farmer-subpage">
      <PageHeading eyebrow="FINANCING" title="Apply for a loan" description="Prepare a seasonal input-credit application for your farm." />
      <div className="farmer-demo-notice"><FontAwesomeIcon icon={faCircleExclamation} /><span><strong>Preview only</strong><small>Loan applications are not connected to a lender yet. Submitting this form will not send an application.</small></span></div>
      {submitted ? <section className="farmer-panel farmer-form-confirmation"><span className="farmer-metric-icon moss"><FontAwesomeIcon icon={faCheck} /></span><h2>Application preview saved</h2><p>Your sample request for UGX {Number(amount || 0).toLocaleString()} for {purpose.toLowerCase()} is ready for review. No application was sent.</p><button className="farmer-heading-link" onClick={() => setSubmitted(false)}>Edit preview</button></section> : (
        <form className="farmer-panel farmer-loan-form" onSubmit={submit}>
          <div className="farmer-form-heading"><span className="farmer-section-label">SAMPLE APPLICATION</span><h2>Tell us what your farm needs</h2><p>All fields below are for the sample workflow.</p></div>
          <label>Requested amount (UGX)<input type="number" min="100000" step="50000" required value={amount} onChange={event => setAmount(event.target.value)} placeholder="e.g. 2,000,000" /></label>
          <label>Purpose<select value={purpose} onChange={event => setPurpose(event.target.value)}><option>Farm inputs</option><option>Harvest labor</option><option>Processing equipment</option><option>Farm improvement</option></select></label>
          <label>Repayment preference<select defaultValue="After harvest"><option>After harvest</option><option>Monthly installments</option><option>Discuss with lender</option></select></label>
          <button type="submit" className="farmer-primary-button">Review application <FontAwesomeIcon icon={faArrowRight} /></button>
        </form>
      )}
    </div>
  )
}