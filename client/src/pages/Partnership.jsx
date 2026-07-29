import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBullhorn, faTractor, faLandmark, faArrowRight,
  faCircleQuestion, faGears, faPlus,
} from '@fortawesome/free-solid-svg-icons'

const tickerItem = (
  <span className="advert-ticker-item">
    <span className="tk-badge"><FontAwesomeIcon icon={faBullhorn} /> News</span>
    <span className="tk-text">
      Boldstone Announces UGX 500 Million (US $140,000) Equity &amp; Debt Financing Plan to Build
      Coffee Processing Infrastructure and Empower Smallholder Farmers in Uganda.
    </span>
    <a className="tk-link" href="https://www.boldstoneinvestments.com/blog/news-2/boldstone-to-raise-us-140-000-pre-seed-investment-6">
      Read More →
    </a>
  </span>
)

const partnerTypes = [
  {
    num: '01',
    icon: <img src="https://habib11.odoo.com/web/image/361-51dd7123/influencer.webp" alt="Influencer" style={{ width: 28, height: 28, objectFit: 'contain' }} loading="lazy" />,
    title: 'Influencers',
    desc: 'Share Boldstone with your audience online through videos, posts and creative content. Tag us on Tiktok, Instagram and LinkedIn.',
    link: 'Apply as an Influencer',
  },
  {
    num: '02',
    icon: <FontAwesomeIcon icon={faTractor} />,
    title: 'Coffee Co-operatives',
    desc: 'Give your co-operative or group members access to a digital tool that improves farming output through a coffee knowledge base and a dedicated community.',
    link: 'Apply as a Coffee farm co-operative',
  },
  {
    num: '03',
    icon: <FontAwesomeIcon icon={faLandmark} />,
    title: 'Institutions',
    desc: 'Are you a Bank, SACCO, Fintech, Insurance Company, or Non Profit? Partner with Boldstone to extend your services to our community of coffee farmers.',
    link: 'Apply as a Brand',
  },
]

const howCards = [
  {
    icon: faCircleQuestion,
    title: 'Who Can Become a Boldstone Partner?',
    body: "We partner with anyone who has an audience that has an interest in coffee. Whether you are creating content, leading a SACCO or Farmers' group and care about accessing the right support, let's talk.",
  },
  {
    icon: faGears,
    title: 'How Do Partnerships Work?',
    body: 'It depends on what makes sense for you and your audience or community. We pay influencers per referral with a budget allocated to resources. For institutions we work for custom benefits and revenue share. We will find the right structure during our conversation and process.',
  },
]

const faqs = [
  {
    q: 'How do you work with NGOs or Non-Profits?',
    a: 'Coffee farms guarantee revenue compared to humanitarian challenges that NGOs solve. We help them set up coffee farms that generate revenue to sustain their operations in the middle of cuts in international development.',
  },
  {
    q: 'How do you work with influencers?',
    a: 'Influencers help promote our coffee farming and trade business to their audiences on social media. By educating their following on social media on the work of Boldstone, they help grow our business reach and impact.',
  },
  {
    q: 'Which part of Uganda are your operations based?',
    a: 'We are primarily located in Fort Portal, Uganda with farming and trade operations extending to the districts of Kabarole, Kyegegwa, Kyenjojo and Kamwenge.',
  },
  {
    q: 'What do I need to become a partner?',
    a: 'You need proof of identification as a business or individual and the value you would like to create with Boldstone.',
  },
]

export default function Partnership() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div>
      {/* ADVERT TICKER */}
      <div className="advert-banner">
        <div className="advert-ticker">
          {tickerItem}<span className="advert-sep">●</span>
          {tickerItem}<span className="advert-sep">●</span>
          {tickerItem}<span className="advert-sep">●</span>
          {tickerItem}<span className="advert-sep">●</span>
        </div>
      </div>

      {/* HERO */}
      <section className="p-hero">
        <img
          className="p-hero-bg"
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
          alt="Coffee farmers"
          loading="lazy"
        />
        <div className="p-hero-overlay" />
        <div className="p-hero-content">
          <h1>Partner With Boldstone</h1>
          <p>
            Coffee in Uganda is more than a crop — it's a high-value export asset bringing in $2.2B
            annually into the Ugandan economy. Are you a coffee co-operative, SACCO, Bank, NGO, or
            just an influencer? There's a place for you in our ecosystem.
          </p>
          <a href="https://forms.gle/amtu1ouEKpt2kNYP7" className="btn-primary">
            Explore Opportunities
          </a>
        </div>
      </section>

      {/* PARTNERSHIP TYPES */}
      <section className="p-types-section">
        <div className="bs-wrap">
          <p className="p-section-label">→ PARTNERSHIP TYPES</p>
          <div className="p-types">
            {partnerTypes.map((pt, i) => (
              <div key={i} className="p-type">
                <span className="pt-num">{pt.num}</span>
                <div className="pt-icon">{pt.icon}</div>
                <div className="pt-body">
                  <h4>{pt.title}</h4>
                  <p>{pt.desc}</p>
                  <a href="https://forms.gle/amtu1ouEKpt2kNYP7">
                    {pt.link} <FontAwesomeIcon icon={faArrowRight} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="p-how-section">
        <div className="bs-wrap">
          <p className="p-section-label">HOW IT WORKS</p>
          <div className="p-how-grid">
            {howCards.map((c, i) => (
              <div key={i} className="p-how-card">
                <h4><FontAwesomeIcon icon={c.icon} /> {c.title}</h4>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="p-faqs-section">
        <div className="bs-wrap">
          <div className="p-faq-layout">
            <div className="p-faq-left">
              <p className="p-faq-big-label">FAQs</p>
              <p className="p-faq-heading">Got Questions? We've Got Answers.</p>
              <p className="p-faq-sub">Everything you need to know about partnering with Boldstone.</p>
            </div>
            <div className="p-faq-right">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`p-faq-item${openFaq === i ? ' open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="p-faq-q">
                    <span>{faq.q}</span>
                    <div className="p-faq-icon"><FontAwesomeIcon icon={faPlus} /></div>
                  </div>
                  <div className="p-faq-a">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
