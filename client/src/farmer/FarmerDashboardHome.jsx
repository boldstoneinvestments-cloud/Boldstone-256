import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowTrendUp, faAward, faCalendarCheck, faChartLine, faCircleExclamation, faCoins, faHeartPulse, faSeedling, faTree } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import FarmAdviceCarousel from './FarmAdviceCarousel'

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
  return (
    <div className="farmer-subpage">
      <div className="farmer-page-heading">
        <div>
          <div className="farmer-heading-kicker"><span className="farmer-live-dot" /> FARMER DASHBOARD <span className="farmer-demo-badge">SAMPLE DATA</span></div>
          <h1>My farm</h1>
          <p>Your farm at a glance. Last updated today, 08:40 EAT.</p>
        </div>
        <Link to="/farmer/opportunities" className="farmer-heading-link">Explore opportunities <FontAwesomeIcon icon={faArrowRight} /></Link>
      </div>

      <section className="farmer-alert-strip" aria-label="Priority farm alert">
        <span><FontAwesomeIcon icon={faCircleExclamation} /></span>
        <p><strong>One crop health alert needs attention.</strong> Check the north block for coffee twig borer today.</p>
        <Link to="/farmer/agronomy">Review alert <FontAwesomeIcon icon={faArrowRight} /></Link>
      </section>

      <section className="farmer-metrics" aria-label="Farm overview metrics">
        <Metric icon={faTree} label="Farm size" value="12.4 acres" detail="Kyenjojo District" tone="moss" />
        <Metric icon={faSeedling} label="Coffee trees" value="8,240" detail="Robusta · Arabica" tone="ochre" />
        <Metric icon={faChartLine} label="Expected yield" value="4.8 tonnes" detail="+14% vs last season" tone="blue" />
        <Metric icon={faHeartPulse} label="Crop health" value="87 / 100" detail="Good · checked Sep 28" tone="coral" />
      </section>

      <FarmAdviceCarousel />

      <div className="farmer-dashboard-grid farmer-dashboard-home-grid">
        <Link to="/farmer/performance" className="farmer-panel farmer-home-link performance">
          <div className="farmer-home-card-head"><span className="farmer-home-icon"><FontAwesomeIcon icon={faChartLine} /></span><span className="farmer-section-label">FARM PERFORMANCE</span><FontAwesomeIcon className="farmer-home-arrow" icon={faArrowRight} /></div>
          <div className="farmer-home-card-value"><strong>+14%</strong><span>this season</span></div>
          <p>4.8 tonnes forecast · five-season yield history</p>
          <div className="farmer-home-card-foot"><span><FontAwesomeIcon icon={faSeedling} /> Crop health <strong>87 / 100</strong></span><span>View details <FontAwesomeIcon icon={faArrowRight} /></span></div>
        </Link>
        <Link to="/farmer/prices" className="farmer-panel farmer-home-link prices">
          <div className="farmer-home-card-head"><span className="farmer-home-icon"><FontAwesomeIcon icon={faCoins} /></span><span className="farmer-section-label">MARKET PRICES</span><FontAwesomeIcon className="farmer-home-arrow" icon={faArrowRight} /></div>
          <div className="farmer-home-card-value"><strong>8,750</strong><span>UGX / kg</span></div>
          <p>Robusta FAQ · indicative farmgate price</p>
          <div className="farmer-home-card-foot"><span className="farmer-quick-trend"><FontAwesomeIcon icon={faArrowTrendUp} /> 3.2% <small>this month</small></span><span>View details <FontAwesomeIcon icon={faArrowRight} /></span></div>
        </Link>
        <Link to="/farmer/harvest" className="farmer-panel farmer-home-link harvest">
          <div className="farmer-home-card-head"><span className="farmer-home-icon"><FontAwesomeIcon icon={faCalendarCheck} /></span><span className="farmer-section-label">HARVEST & SALES</span><FontAwesomeIcon className="farmer-home-arrow" icon={faArrowRight} /></div>
          <div className="farmer-home-card-value"><strong>Dec 20</strong><span>next harvest</span></div>
          <p>Robusta main season · 4.8 tonnes forecast</p>
          <div className="farmer-home-card-foot"><span className="farmer-quick-pending">UGX 4.2M <small>payment pending</small></span><span>View details <FontAwesomeIcon icon={faArrowRight} /></span></div>
        </Link>
        <Link to="/farmer/rewards" className="farmer-panel farmer-home-link rewards">
          <div className="farmer-home-card-head"><span className="farmer-home-icon"><FontAwesomeIcon icon={faAward} /></span><span className="farmer-section-label">FARMER REWARDS</span><FontAwesomeIcon className="farmer-home-arrow" icon={faArrowRight} /></div>
          <div className="farmer-home-card-value"><strong>180</strong><span>points available</span></div>
          <p>Quality 84 / 100 · Sustainability 76 / 100</p>
          <div className="farmer-home-card-foot"><span>Redeem for farm benefits</span><span>View details <FontAwesomeIcon icon={faArrowRight} /></span></div>
        </Link>
      </div>

      <div className="farmer-dashboard-footer">
        <span><FontAwesomeIcon icon={faSeedling} /> Boldstone Farmer Portal</span>
        <span>Dashboard values shown are sample data.</span>
        <Link to="/contact">Contact farmer support</Link>
      </div>
    </div>
  )
}