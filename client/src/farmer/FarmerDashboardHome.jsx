import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowTrendUp, faAward, faCalendarCheck, faChartLine, faCircleExclamation, faCoins, faHeartPulse, faSeedling, faTree } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import FarmAdviceCarousel from './FarmAdviceCarousel'
import { useFarmerResource } from './farmerApi'

function Metric({ icon, label, value, detail, tone }) {
  return (
    <article className="farmer-metric">
      <span className={`farmer-metric-icon ${tone}`}><FontAwesomeIcon icon={icon} /></span>
      <span className="farmer-metric-label">{label}</span>
      <strong>{value}</strong>
      <span className="farmer-metric-detail">{detail}</span>
    </article>
  )
}

export default function FarmerDashboardHome() {
  const { data, error, loading } = useFarmerResource('dashboard')

  if (loading) return <div className="farmer-page-message" role="status">Loading your farm dashboard...</div>
  if (error) return <div className="farmer-page-message" role="alert">{error}</div>

  const metrics = data.metrics
  const farm = data.farm
  const yieldTonnes = Number(metrics.expected_yield_tonnes || 0)
  const coffeePrice = Number(metrics.coffee_price_per_kg || 0)

  return (
    <div className="farmer-subpage">
      <div className="farmer-page-heading">
        <div>
          <div className="farmer-heading-kicker"><span className="farmer-live-dot" /> FARMER DASHBOARD</div>
          <h1>My farm</h1>
          <p>{farm.name} at a glance.</p>
        </div>
        <Link to="/farmers/opportunities" className="farmer-heading-link">Explore opportunities <FontAwesomeIcon icon={faArrowRight} /></Link>
      </div>

      <section className="farmer-alert-strip" aria-label="Priority farm alert">
        <span><FontAwesomeIcon icon={faCircleExclamation} /></span>
        <p><strong>{data.priority_task?.title || data.settings.dashboard_notice || 'Your farm records are up to date.'}</strong>{data.priority_task?.detail ? ` ${data.priority_task.detail}` : ''}</p>
        {data.priority_task && <Link to="/farmers/agronomy">Review task <FontAwesomeIcon icon={faArrowRight} /></Link>}
      </section>

      <section className="farmer-metrics" aria-label="Farm overview metrics">
        <Metric icon={faTree} label="Farm size" value={`${Number(farm.acres).toLocaleString()} acres`} detail={`${farm.district} District`} tone="moss" />
        <Metric icon={faSeedling} label="Coffee trees" value={Number(farm.tree_count || 0).toLocaleString()} detail={farm.coffee_types.join(' · ') || 'Coffee types not recorded'} tone="ochre" />
        <Metric icon={faChartLine} label="Expected yield" value={`${yieldTonnes.toLocaleString()} tonnes`} detail="Current season forecast" tone="blue" />
        <Metric icon={faHeartPulse} label="Crop health" value={`${metrics.crop_health_score} / 100`} detail="Latest admin record" tone="coral" />
      </section>

      <FarmAdviceCarousel />

      <div className="farmer-dashboard-grid farmer-dashboard-home-grid">
        <Link to="/farmers/performance" className="farmer-panel farmer-home-link performance">
          <div className="farmer-home-card-head"><span className="farmer-home-icon"><FontAwesomeIcon icon={faChartLine} /></span><span className="farmer-section-label">FARM PERFORMANCE</span><FontAwesomeIcon className="farmer-home-arrow" icon={faArrowRight} /></div>
          <div className="farmer-home-card-value"><strong>{yieldTonnes.toLocaleString()}</strong><span>tonnes forecast</span></div>
          <p>{farm.acres} acres · production history</p>
          <div className="farmer-home-card-foot"><span><FontAwesomeIcon icon={faSeedling} /> Crop health <strong>{metrics.crop_health_score} / 100</strong></span><span>View details <FontAwesomeIcon icon={faArrowRight} /></span></div>
        </Link>
        <Link to="/farmers/prices" className="farmer-panel farmer-home-link prices">
          <div className="farmer-home-card-head"><span className="farmer-home-icon"><FontAwesomeIcon icon={faCoins} /></span><span className="farmer-section-label">MARKET PRICES</span><FontAwesomeIcon className="farmer-home-arrow" icon={faArrowRight} /></div>
          <div className="farmer-home-card-value"><strong>{coffeePrice.toLocaleString()}</strong><span>UGX / kg</span></div>
          <p>{metrics.coffee_price_grade || 'No price published'} · indicative farmgate price</p>
          <div className="farmer-home-card-foot"><span>Admin-published reference price</span><span>View details <FontAwesomeIcon icon={faArrowRight} /></span></div>
        </Link>
        <Link to="/farmers/harvest" className="farmer-panel farmer-home-link harvest">
          <div className="farmer-home-card-head"><span className="farmer-home-icon"><FontAwesomeIcon icon={faCalendarCheck} /></span><span className="farmer-section-label">HARVEST & SALES</span><FontAwesomeIcon className="farmer-home-arrow" icon={faArrowRight} /></div>
          <div className="farmer-home-card-value"><strong>{data.priority_task ? metrics.open_task_count : '—'}</strong><span>open farm tasks</span></div>
          <p>Harvest estimates and recorded sales</p>
          <div className="farmer-home-card-foot"><span>View your farm records</span><span>View details <FontAwesomeIcon icon={faArrowRight} /></span></div>
        </Link>
        <Link to="/farmers/rewards" className="farmer-panel farmer-home-link rewards">
          <div className="farmer-home-card-head"><span className="farmer-home-icon"><FontAwesomeIcon icon={faAward} /></span><span className="farmer-section-label">FARMER REWARDS</span><FontAwesomeIcon className="farmer-home-arrow" icon={faArrowRight} /></div>
          <div className="farmer-home-card-value"><strong>→</strong><span>Rewards balance</span></div>
          <p>View current points and available rewards</p>
          <div className="farmer-home-card-foot"><span>Redeem for farm benefits</span><span>View details <FontAwesomeIcon icon={faArrowRight} /></span></div>
        </Link>
      </div>

      <div className="farmer-dashboard-footer">
        <span><FontAwesomeIcon icon={faSeedling} /> Boldstone Farmer Portal</span>
        <span>Farm data is maintained by Boldstone and your submissions.</span>
        <Link to="/contact">Contact farmer support</Link>
      </div>
    </div>
  )
}