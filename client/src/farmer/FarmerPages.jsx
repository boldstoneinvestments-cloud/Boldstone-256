import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faArrowTrendUp,
  faAward,
  faCalendarCheck,
  faCalendarDays,
  faCheck,
  faCircleExclamation,
  faCloudSun,
  faCoins,
  faGraduationCap,
  faHeartPulse,
  faLeaf,
  faPercent,
  faSeedling,
  faShieldHalved,
  faTree,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { farmerApi, useFarmerResource } from './farmerApi'
import {
  calculateLoanRepayment,
  formatUgx,
  getLoanTypeLabel,
} from './loanCalculator.js'

function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="farmer-page-heading">
      <div>
        <div className="farmer-heading-kicker">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  )
}

function ProductionChart({ records }) {
  const maximum = Math.max(...records.map(item => Number(item.yield_tonnes)), 1)
  return (
    <section className="farmer-panel">
      <div className="farmer-panel-heading"><div><span className="farmer-section-label">PRODUCTION HISTORY</span><h2>Yield by season</h2></div><span className="farmer-status-chip">{records.length} seasons</span></div>
      <div className="farmer-chart-summary"><strong>{Number(records.at(-1)?.yield_tonnes || 0).toLocaleString()} <small>tonnes latest season</small></strong></div>
      <div className="farmer-bar-chart" aria-label="Production history by season">
        {records.map((season, index) => (
          <div className={`farmer-bar-column${index === records.length - 1 ? ' current' : ''}`} key={season.season}>
            <span className="farmer-bar-value">{Number(season.yield_tonnes).toLocaleString()} t</span>
            <div className="farmer-bar-track"><span style={{ height: `${Math.max(8, Number(season.yield_tonnes) / maximum * 100)}%` }} /></div>
            <span className="farmer-bar-year">{season.season}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function FarmerPerformance() {
  const { data, error, loading } = useFarmerResource('performance')
  if (loading) return <div className="farmer-page-message" role="status">Loading performance...</div>
  if (error) return <div className="farmer-page-message" role="alert">{error}</div>
  const records = data.records
  const summary = data.summary
  return (
    <div className="farmer-subpage">
      <PageHeading eyebrow="FARM PERFORMANCE" title="Performance" description="Yield, productivity, and crop health across your farm." />
      <div className="farmer-detail-grid">
        {records.length ? <ProductionChart records={records} /> : <section className="farmer-panel farmer-page-message">Yield history has not been added yet.</section>}
        <section className="farmer-panel farmer-performance-summary">
          <div className="farmer-panel-heading"><div><span className="farmer-section-label">THIS SEASON</span><h2>Farm productivity</h2></div><FontAwesomeIcon className="farmer-reward-mark" icon={faHeartPulse} /></div>
          <strong className="farmer-large-value">{Number(summary.productivity_kg_per_acre).toLocaleString()} <small>kg / acre</small></strong>
          <p className="farmer-muted-copy">Latest performance record for {data.farm.name}.</p>
          <div className="farmer-score-row"><span>Crop health</span><strong>{summary.crop_health_score} <small>/ 100</small></strong><div className="farmer-score-track"><i style={{ width: `${summary.crop_health_score}%` }} /></div></div>
          <div className="farmer-score-row sustainability"><span>Tree survival</span><strong>{Number(summary.tree_survival_percent).toLocaleString()} <small>%</small></strong><div className="farmer-score-track"><i style={{ width: `${summary.tree_survival_percent}%` }} /></div></div>
        </section>
      </div>
      <section className="farmer-panel farmer-data-note"><FontAwesomeIcon icon={faLeaf} /><span><strong>How to improve your score</strong><small>Complete the open agronomy tasks and record pruning, mulching, and input applications.</small></span><Link to="/farmers/agronomy">Open agronomy <FontAwesomeIcon icon={faArrowRight} /></Link></section>
    </div>
  )
}

export function FarmerPrices() {
  const { data, error, loading } = useFarmerResource('prices')
  if (loading) return <div className="farmer-page-message" role="status">Loading coffee prices...</div>
  if (error) return <div className="farmer-page-message" role="alert">{error}</div>
  const prices = data.prices
  const highlightedPrice = prices[0]
  return (
    <div className="farmer-subpage">
      <PageHeading eyebrow="MARKET INFORMATION" title="Coffee prices" description="Indicative local prices and recent movement. Confirm buyer offers before selling." />
      <section className="farmer-panel farmer-price-feature">
        <div><span className="farmer-section-label">{highlightedPrice ? `${highlightedPrice.coffee_type} · ${highlightedPrice.grade} · INDICATIVE FARMGATE` : 'INDICATIVE FARMGATE'}</span><div className="farmer-market-price">UGX <strong>{highlightedPrice ? Number(highlightedPrice.price_per_kg).toLocaleString() : '—'}</strong><span>/ kg</span></div><div className="farmer-market-change"><span className="farmer-positive"><FontAwesomeIcon icon={faArrowTrendUp} /> {highlightedPrice?.change_30d_percent ?? 0}%</span><span>over the past 30 days</span></div></div>
        <div className="farmer-price-sparkline" aria-label="Price trend summary"><span>{highlightedPrice?.updated_at ? new Date(highlightedPrice.updated_at).toLocaleDateString() : 'No update'}</span></div>
      </section>
      <section className="farmer-panel">
        <div className="farmer-panel-heading"><div><span className="farmer-section-label">DAILY REFERENCE</span><h2>Indicative market prices</h2></div><span className="farmer-market-updated">Admin updated</span></div>
        <div className="farmer-table-wrap"><table className="farmer-table"><thead><tr><th>Coffee type</th><th>Current price</th><th>30-day trend</th></tr></thead><tbody>{prices.map(price => <tr key={price.id}><td>{price.grade}</td><td><strong>UGX {Number(price.price_per_kg).toLocaleString()}</strong> / kg</td><td className={Number(price.change_30d_percent) < 0 ? 'negative' : 'positive'}>{Number(price.change_30d_percent) > 0 ? '+' : ''}{price.change_30d_percent}%</td></tr>)}</tbody></table>{!prices.length && <p className="farmer-empty-state">Prices have not been published yet.</p>}</div>
      </section>
      <section className="farmer-recommendation farmer-price-guidance"><span>SELLING WINDOW</span><strong>Current trend is positive. Compare at least two buyer offers near harvest.</strong><p>This is a market indicator, not a guaranteed price or individualized financial recommendation.</p></section>
    </div>
  )
}

export function FarmerAgronomy() {
  const { data, error, loading, refresh } = useFarmerResource('agronomy')
  const [savingTask, setSavingTask] = useState(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [formError, setFormError] = useState('')
  if (loading) return <div className="farmer-page-message" role="status">Loading field plan...</div>
  if (error) return <div className="farmer-page-message" role="alert">{error}</div>
  const tasks = data.tasks
  const settings = data.settings
  const updateTask = async task => {
    setSavingTask(task.id)
    try {
      await farmerApi(`agronomy/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify({ status: task.status === 'completed' ? 'open' : 'completed' }) })
      refresh()
    } finally {
      setSavingTask(null)
    }
  }
  const submitTask = async event => {
    event.preventDefault()
    setSavingTask('new')
    setFormError('')
    try {
      await farmerApi('agronomy', { method: 'POST', body: JSON.stringify({ title: newTaskTitle }) })
      setNewTaskTitle('')
      refresh()
    } catch (requestError) {
      setFormError(requestError.message)
    } finally {
      setSavingTask(null)
    }
  }
  return (
    <div className="farmer-subpage">
      <PageHeading eyebrow="CROP CARE" title="Agronomy" description="Tasks, alerts, and recommendations for the current season." />
      {tasks.some(task => task.is_urgent && task.status === 'open') && <section className="farmer-alert-strip"><span><FontAwesomeIcon icon={faCircleExclamation} /></span><p><strong>Priority field task.</strong> Complete the urgent task below and contact your agronomist if you need support.</p></section>}
      <div className="farmer-detail-grid">
        <section className="farmer-panel">
          <div className="farmer-panel-heading"><div><span className="farmer-section-label">YOUR FIELD PLAN</span><h2>Tasks to complete</h2></div><span className="farmer-status-chip">{data.open_count} open</span></div>
          <form className="farmer-task-submit" onSubmit={submitTask}><label className="sr-only" htmlFor="farmer-new-task">Add a farm task</label><input id="farmer-new-task" value={newTaskTitle} onChange={event => setNewTaskTitle(event.target.value)} placeholder="Add a task for your farm team" required /><button className="farmer-primary-button" disabled={savingTask === 'new'}>{savingTask === 'new' ? 'Submitting...' : 'Submit task'}</button></form>
          {formError && <p className="farmer-auth-inline-error" role="alert">{formError}</p>}
          <ul className="farmer-task-list farmer-full-task-list">{tasks.map(task => <li key={task.id} className={task.status === 'completed' ? 'completed' : ''}><button className={`farmer-task-check${task.is_urgent ? ' urgent' : ''}${task.status === 'completed' ? ' done' : ''}`} disabled={savingTask === task.id} aria-label={`Mark ${task.title} ${task.status === 'completed' ? 'incomplete' : 'complete'}`} onClick={() => updateTask(task)}>{task.status === 'completed' && <FontAwesomeIcon icon={faCheck} />}</button><span className="farmer-task-copy"><strong>{task.title}</strong><small>{task.detail}</small></span><span className={`farmer-task-due${task.is_urgent ? ' urgent' : ''}`}>{task.due_date ? new Date(`${task.due_date}T00:00:00`).toLocaleDateString() : 'No due date'}</span></li>)}</ul>
          {!tasks.length && <p className="farmer-empty-state">Your farm team has not added any tasks yet.</p>}
        </section>
        <section className="farmer-panel"><div className="farmer-panel-heading"><div><span className="farmer-section-label">FIELD CONDITIONS</span><h2>Weather & farm alerts</h2></div><FontAwesomeIcon className="farmer-reward-mark" icon={faCloudSun} /></div><div className="farmer-weather-detail"><strong>{settings.weather_temperature}°</strong><span>{settings.weather_summary}</span></div><p className="farmer-muted-copy">{settings.weather_guidance || 'Your farm team has not added weather guidance yet.'}</p><hr className="farmer-panel-rule" /><span className="farmer-section-label">FARMER GUIDANCE</span><p className="farmer-muted-copy">Recommendations are published by your farm team. Confirm application rates with an agronomist.</p></section>
      </div>
    </div>
  )
}

export function FarmerHarvest() {
  const { data, error, loading, refresh } = useFarmerResource('harvest')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [estimate, setEstimate] = useState({ season: '', coffee_type: 'robusta', expected_quantity_kg: '' })
  const [sale, setSale] = useState({ delivery_date: new Date().toISOString().slice(0, 10), grade: '', quantity_kg: '', price_per_kg: '', buyer: '' })

  if (loading) return <div className="farmer-page-message" role="status">Loading harvest records...</div>
  if (error) return <div className="farmer-page-message" role="alert">{error}</div>

  const saveEstimate = async event => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      await farmerApi('harvest/estimates', { method: 'POST', body: JSON.stringify(estimate) })
      setNotice('Harvest estimate submitted to Boldstone.')
      refresh()
    } catch (requestError) {
      setFormError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const saveSale = async event => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      await farmerApi('harvest/sales', { method: 'POST', body: JSON.stringify(sale) })
      setNotice('Delivery record submitted for admin review.')
      refresh()
    } catch (requestError) {
      setFormError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const summary = data.summary
  return (
    <div className="farmer-subpage">
      <PageHeading eyebrow="HARVEST & SALES" title="Harvest and sales" description="Plan the upcoming crop and track recorded sales and payments." />
      <section className="farmer-metrics farmer-sales-metrics">
        <article className="farmer-metric"><span className="farmer-metric-icon moss"><FontAwesomeIcon icon={faSeedling} /></span><span className="farmer-metric-label">Harvest forecast</span><strong>{(Number(summary.harvest_forecast_kg) / 1000).toLocaleString()} tonnes</strong><span className="farmer-metric-detail">Farmer submitted</span></article>
        <article className="farmer-metric"><span className="farmer-metric-icon blue"><FontAwesomeIcon icon={faTree} /></span><span className="farmer-metric-label">Coffee sold</span><strong>{(Number(summary.coffee_sold_kg) / 1000).toLocaleString()} tonnes</strong><span className="farmer-metric-detail">Recorded deliveries</span></article>
        <article className="farmer-metric"><span className="farmer-metric-icon ochre"><FontAwesomeIcon icon={faCoins} /></span><span className="farmer-metric-label">Revenue received</span><strong>{formatUgx(summary.revenue_received)}</strong><span className="farmer-metric-detail">Admin marked paid</span></article>
        <article className="farmer-metric"><span className="farmer-metric-icon coral"><FontAwesomeIcon icon={faCalendarCheck} /></span><span className="farmer-metric-label">Payment pending</span><strong>{formatUgx(summary.payment_pending)}</strong><span className="farmer-metric-detail">Awaiting admin update</span></article>
      </section>
      {formError && <p className="farmer-auth-inline-error" role="alert">{formError}</p>}
      {notice && <p className="farmer-form-success" role="status">{notice}</p>}
      <div className="farmer-detail-grid">
        <form className="farmer-panel farmer-data-form" onSubmit={saveEstimate}>
          <h2>Submit harvest estimate</h2>
          <label>Season<input required value={estimate.season} onChange={event => setEstimate(current => ({ ...current, season: event.target.value }))} placeholder="e.g. Main harvest 2026/2027" /></label>
          <label>Coffee type<select value={estimate.coffee_type} onChange={event => setEstimate(current => ({ ...current, coffee_type: event.target.value }))}><option value="robusta">Robusta</option><option value="arabica">Arabica</option></select></label>
          <label>Expected quantity (kg)<input type="number" min="0.01" step="0.01" required value={estimate.expected_quantity_kg} onChange={event => setEstimate(current => ({ ...current, expected_quantity_kg: event.target.value }))} /></label>
          <button className="farmer-primary-button" disabled={saving}>Submit estimate</button>
        </form>
        <form className="farmer-panel farmer-data-form" onSubmit={saveSale}>
          <h2>Record a coffee delivery</h2>
          <label>Delivery date<input type="date" required value={sale.delivery_date} onChange={event => setSale(current => ({ ...current, delivery_date: event.target.value }))} /></label>
          <label>Grade<input required value={sale.grade} onChange={event => setSale(current => ({ ...current, grade: event.target.value }))} placeholder="e.g. Robusta FAQ" /></label>
          <label>Quantity (kg)<input type="number" min="0.01" step="0.01" required value={sale.quantity_kg} onChange={event => setSale(current => ({ ...current, quantity_kg: event.target.value }))} /></label>
          <label>Price per kg (UGX)<input type="number" min="0" step="0.01" value={sale.price_per_kg} onChange={event => setSale(current => ({ ...current, price_per_kg: event.target.value }))} /></label>
          <label>Buyer<input value={sale.buyer} onChange={event => setSale(current => ({ ...current, buyer: event.target.value }))} /></label>
          <button className="farmer-primary-button" disabled={saving}>Submit delivery</button>
        </form>
      </div>
      <section className="farmer-panel"><div className="farmer-panel-heading"><div><span className="farmer-section-label">SALES RECORD</span><h2>Recent deliveries</h2></div></div><div className="farmer-table-wrap"><table className="farmer-table"><thead><tr><th>Date</th><th>Grade</th><th>Quantity</th><th>Payment</th></tr></thead><tbody>{data.sales.map(item => <tr key={item.id}><td>{new Date(`${item.delivery_date}T00:00:00`).toLocaleDateString()}</td><td>{item.grade}</td><td>{Number(item.quantity_kg).toLocaleString()} kg</td><td><span className={`farmer-payment-status ${item.payment_status}`}>{item.payment_status}</span></td></tr>)}</tbody></table>{!data.sales.length && <p className="farmer-empty-state">No coffee deliveries have been recorded yet.</p>}</div></section>
    </div>
  )
}

export function FarmerOpportunities() {
  const { data, error, loading } = useFarmerResource('opportunities')
  if (loading) return <div className="farmer-page-message" role="status">Loading opportunities...</div>
  if (error) return <div className="farmer-page-message" role="alert">{error}</div>
  const tones = { financing: 'ochre', training: 'green', certification: 'blue', input_discount: 'green', land: 'ochre' }
  const icons = { financing: faCoins, training: faGraduationCap, certification: faShieldHalved, input_discount: faSeedling, land: faTree }
  return (
    <div className="farmer-subpage">
      <PageHeading eyebrow="GROW YOUR FARM" title="Opportunities" description="Programs, services, and support available to your farm." />
      <div className="farmer-opportunity-page-list">{data.opportunities.map(item => <article className="farmer-panel farmer-opportunity-card" key={item.id}><span className={`farmer-opportunity-icon ${tones[item.type] || 'green'}`}><FontAwesomeIcon icon={icons[item.type] || faLeaf} /></span><div><span className="farmer-section-label">{item.type.replaceAll('_', ' ').toUpperCase()}</span><h2>{item.title}</h2><p>{item.detail}{item.location ? ` · ${item.location}` : ''}{item.closes_at ? ` · Closes ${new Date(`${item.closes_at}T00:00:00`).toLocaleDateString()}` : ''}</p></div>{item.type === 'financing' && <Link to="/farmers/apply-for-loan" className="farmer-heading-link">{item.action_label}<FontAwesomeIcon icon={faArrowRight} /></Link>}</article>)}{!data.opportunities.length && <p className="farmer-empty-state">No opportunities are currently published.</p>}</div>
    </div>
  )
}

export function FarmerRewards() {
  const { data, error, loading } = useFarmerResource('rewards')
  if (loading) return <div className="farmer-page-message" role="status">Loading rewards...</div>
  if (error) return <div className="farmer-page-message" role="alert">{error}</div>
  const balance = data.balance
  return (
    <div className="farmer-subpage">
      <PageHeading eyebrow="FARMER REWARDS" title="Rewards" description="Quality and sustainable practices contribute to your farm rewards." />
      <div className="farmer-detail-grid">
        <section className="farmer-panel farmer-reward-overview"><div className="farmer-panel-heading"><div><span className="farmer-section-label">AVAILABLE BALANCE</span><h2>Your reward points</h2></div><FontAwesomeIcon className="farmer-reward-mark" icon={faAward} /></div><strong className="farmer-large-value">{balance.points} <small>points</small></strong><p className="farmer-muted-copy">Your balance is maintained by Boldstone.</p><Link to="/farmers/opportunities" className="farmer-heading-link">Explore programs <FontAwesomeIcon icon={faArrowRight} /></Link></section>
        <section className="farmer-panel"><div className="farmer-panel-heading"><div><span className="farmer-section-label">FARM SCORES</span><h2>Progress overview</h2></div></div><div className="farmer-score-row"><span>Quality score</span><strong>{balance.quality_score} <small>/ 100</small></strong><div className="farmer-score-track"><i style={{ width: `${balance.quality_score}%` }} /></div></div><div className="farmer-score-row sustainability"><span>Sustainability score</span><strong>{balance.sustainability_score} <small>/ 100</small></strong><div className="farmer-score-track"><i style={{ width: `${balance.sustainability_score}%` }} /></div></div><p className="farmer-muted-copy">Scores and points are maintained by Boldstone.</p></section>
      </div>
      <section className="farmer-panel farmer-reward-catalog"><div className="farmer-panel-heading"><div><span className="farmer-section-label">REWARD CATALOG</span><h2>Available rewards</h2></div></div><div className="farmer-reward-items">{data.rewards.map((reward, index) => <article key={reward.id}><span className={`farmer-metric-icon ${['moss', 'ochre', 'blue'][index % 3]}`}><FontAwesomeIcon icon={[faSeedling, faCoins, faGraduationCap][index % 3]} /></span><strong>{reward.title}</strong><small>{reward.points_required} points</small></article>)}</div>{!data.rewards.length && <p className="farmer-empty-state">No rewards are currently available.</p>}</section>
    </div>
  )
}

export function FarmerLoanApplication() {
  const { data, error, loading, refresh } = useFarmerResource('loans')
  const [submitted, setSubmitted] = useState(null)
  const [amount, setAmount] = useState('2000000')
  const [loanType, setLoanType] = useState('cash')
  const [coffeeType, setCoffeeType] = useState('')
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  if (loading) return <div className="farmer-page-message" role="status">Loading loan settings...</div>
  if (error) return <div className="farmer-page-message" role="alert">{error}</div>
  const coffeePrices = data.coffee_prices
  const selectedCoffee = coffeePrices.find(grade => grade.grade === coffeeType) || coffeePrices[0]
  const repayment = calculateLoanRepayment({
    amount,
    interestRate: Number(data.interest_rate) / 100,
    coffeePricePerKg: selectedCoffee ? Number(selectedCoffee.price_per_kg) : 0,
  })

  const submit = async event => {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const result = await farmerApi('loans', {
        method: 'POST',
        body: JSON.stringify({
          amount_requested: amount,
          loan_type: loanType,
          coffee_grade: selectedCoffee?.grade,
          application_date: applicationDate,
        }),
      })
      setSubmitted(result.application)
      refresh()
    } catch (requestError) {
      setFormError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="farmer-subpage">
      <PageHeading
        eyebrow="FINANCING"
        title="Apply for a loan"
        description="Choose the funding type and see how much coffee will cover repayment at the selected grade price."
      />
      {submitted ? (
        <section className="farmer-panel farmer-form-confirmation">
          <span className="farmer-metric-icon moss"><FontAwesomeIcon icon={faCheck} /></span>
          <h2>Application submitted</h2>
          <p>
            You requested {formatUgx(submitted.amount_requested)} as a {getLoanTypeLabel(submitted.loan_type).toLowerCase()}.
            Estimated repayment is {formatUgx(submitted.repayment_amount)} or {Number(submitted.repayment_coffee_kg).toLocaleString('en-US', { maximumFractionDigits: 2 })} kg of {submitted.coffee_grade} coffee.
            Your application is {submitted.status}.
          </p>
          <button className="farmer-heading-link" onClick={() => setSubmitted(null)}>Start another application</button>
        </section>
      ) : (
        <form className="farmer-panel farmer-loan-form" onSubmit={submit}>
          <div className="farmer-form-heading">
            <span className="farmer-section-label">FARM FINANCING</span>
            <h2>Seasonal loan application</h2>
            <p>Choose the funding type, amount, coffee grade, and application date.</p>
          </div>

          <div className="farmer-loan-grid">
            <label>
              Loan type
              <select value={loanType} onChange={event => setLoanType(event.target.value)}>
                <option value="cash">Cash loan</option>
                <option value="fertilizer">Fertilizer loan</option>
              </select>
            </label>

            <label>
              Amount requested (UGX)
              <input
                type="number"
                min="100000"
                step="50000"
                required
                value={amount}
                onChange={event => setAmount(event.target.value)}
                placeholder="e.g. 2,000,000"
              />
            </label>

            <label>
              Coffee type
              <select required value={coffeeType || selectedCoffee?.grade || ''} onChange={event => setCoffeeType(event.target.value)}>
                {coffeePrices.map(grade => (
                  <option key={grade.grade} value={grade.grade}>{grade.grade}</option>
                ))}
              </select>
            </label>

            <label>
              Application date
              <input type="date" required value={applicationDate} onChange={event => setApplicationDate(event.target.value)} />
            </label>
          </div>

          <section className="farmer-loan-details" aria-live="polite">
            <div className="farmer-loan-detail-card highlight">
              <span><FontAwesomeIcon icon={faCoins} /> Loan amount</span>
              <strong>{formatUgx(repayment.principal)}</strong>
            </div>
            <div className="farmer-loan-detail-card">
              <span><FontAwesomeIcon icon={faPercent} /> Interest rate</span>
              <strong>{data.interest_rate}%</strong>
            </div>
            <div className="farmer-loan-detail-card">
              <span><FontAwesomeIcon icon={faCalendarDays} /> Next harvest</span>
              <strong>{applicationDate}</strong>
            </div>
          </section>

          <section className="farmer-loan-repayment">
            <div>
              <span className="farmer-section-label">REPAYMENT SUMMARY</span>
              <h3>Estimated repayment</h3>
              <strong>{formatUgx(repayment.totalRepayment)}</strong>
              <p>{formatUgx(repayment.interestAmount)} interest added</p>
            </div>
            <div className="farmer-loan-coffee">
              <span><FontAwesomeIcon icon={faSeedling} /> Coffee repayment</span>
              <strong>{repayment.coffeeKg.toLocaleString('en-US', { maximumFractionDigits: 2 })} kg</strong>
              <small>At {formatUgx(selectedCoffee?.price_per_kg)} per kg</small>
            </div>
          </section>

          {formError && <p className="farmer-auth-inline-error" role="alert">{formError}</p>}
          <button type="submit" className="farmer-primary-button" disabled={saving || !selectedCoffee}>
            {saving ? 'Submitting...' : 'Submit application'} <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </form>
      )}
      {!!data.applications.length && <section className="farmer-panel"><div className="farmer-panel-heading"><div><span className="farmer-section-label">YOUR REQUESTS</span><h2>Loan applications</h2></div></div><div className="farmer-table-wrap"><table className="farmer-table"><thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead><tbody>{data.applications.map(application => <tr key={application.id}><td>{new Date(`${application.application_date}T00:00:00`).toLocaleDateString()}</td><td>{getLoanTypeLabel(application.loan_type)}</td><td>{formatUgx(application.amount_requested)}</td><td>{application.status}</td></tr>)}</tbody></table></div></section>}
    </div>
  )
}