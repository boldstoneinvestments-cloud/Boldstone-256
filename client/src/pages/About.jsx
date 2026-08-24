import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBullhorn, faShieldHalved, faPeopleGroup, faHeart, faComments, faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'

const tickerItem = (
  <span className="advert-ticker-item">
    <span className="tk-badge"><FontAwesomeIcon icon={faBullhorn} /> News</span>
    <span className="tk-text">
      Boldstone Announces UGX 500 Million (US $140,000) Equity &amp; Debt Financing Plan to Build
      Coffee Processing Infrastructure and Empower Smallholder Farmers in Uganda.
    </span>
    <a className="tk-link" href="https://www.boldstoneinvestments.com/blog">
      Read More →
    </a>
  </span>
)

const aboutCards = [
  {
    title: 'The Data and Market Insight Gap',
    body: [
      'Our farmer first approach brought us into conversation with hundreds of smallholder coffee farmers who organise themselves into co-operative societies. Most often, they told us, they miss information on government programs, prevailing coffee prices, prevention and control of pests and diseases and sustainable coffee farming methods.',
      "In the end, they wanted to work with partners who can support them beyond buying coffee beans. That's what Boldstone's digital platform does — bringing farmers closer to markets, support and the knowledge they need to make their coffee farms more productive.",
    ],
  },
  {
    title: 'Coffee Value Addition at Source',
    body: [
      'Backed by 7+ years as coffee farmers, co-founders Patrick and Jonathan knew that coffee farmers no longer needed just machines that can hull their coffee beans. They need transparent humans, the right equipment and a 360 degree understanding of what they go through to get coffee beans to the market.',
      'Boldstone establishes processing machines at the source and puts the right humans and systems to make sure the farmers get the most out of their coffee beans.',
    ],
  },
  {
    title: 'Our Name',
    body: [
      'BOLD in our name exemplifies our bold commitment to pursuing the mission of the company and STONE exemplifies the strength and rigidity of the team similar to that of a stone.',
      'Prior to founding Boldstone, Moses had developed a passion for alternative asset investments inspired by watching a series of interviews and talk shows by Carlyle Group co-founder and co-chairman David Rubenstein.',
      'The closeness of the name to BLACKSTONE, one of the biggest players in the private wealth and alternatives market meant that it was worth keeping so there is always a motivation and inspiration to grow the company to the same or more in AUM.',
      'Moses and team hope that they will in future build an asset backed and scalable Pan-African equity investment fund capable of developing and backing impactful enterprises on the African continent.',
    ],
  },
  {
    title: 'Our Colors',
    body: [
      'Green and Black are a reflection of our love for the environment, what grows on it and our commitment to safeguarding it for the current and the future generation. Black reflects our African origins and those of the land where we live and serve.',
    ],
  },
]

const values = [
  {
    icon: faShieldHalved,
    title: 'Trust Above Everything',
    desc: "Boldstone only works if farmers, investors and trade partners trust it. That means being honest about what we can and can't do, delivering real results, and never prioritizing short term revenue over long term relationships.",
  },
  {
    icon: faPeopleGroup,
    title: 'Collective Growth',
    desc: 'Boldstone is not here to extract value from smallholder farmers, investors and partners alike, we are here to create it. When our partners win, we win — that alignment shapes everything we do from pricing, infrastructure and the systems we build to run this business.',
  },
  {
    icon: faHeart,
    title: 'Empathy',
    desc: 'Boldstone strives to put itself in the shoes of everyone it works with. Understanding the needs of farmers, investors and partners helps us to ensure that we serve the needs of those we serve satisfactorily.',
  },
  {
    icon: faComments,
    title: 'Open, Honest and Constructive',
    desc: 'We continuously seek the truth and keep it real, which makes us more likely to find new solutions and approaches to complex problems. We welcome and seek constructive feedback so we can learn and grow.',
  },
]

const team = [
  { id: 'moses', name: 'Moses Alicwamu', position: 'Founder & Managing Director', img: 'https://address-restaurant2.odoo.com/web/image/1571-51dfbae5/Moses%20Photo%20-%20up%20to%20date.webp', imgStyle: { objectPosition: 'center 20%' } },
  { id: 'patrick', name: 'Patrick Muhereza', position: 'Head of Coffee Business', img: 'https://address-restaurant2.odoo.com/web/image/1808-671600b8/Pato1.webp' },
  { id: 'nelson', name: 'Nelson Gumisiriza', position: 'Investor', img: 'https://photo.odoo.com/web/image/1148-8abdf1ec/nel.webp', imgStyle: { objectPosition: 'center top' } },
  { id: 'jonathan', name: 'Jonathan Byaruhanga', position: 'Head of Agronomy', img: 'https://address-restaurant2.odoo.com/web/image/1884-ccb07d63/ChatGPT%20Image%20Jul%2010%2C%202026%2C%2001_35_24%20PM.webp' },
  { id: 'okwiri', name: 'Okwiiri Expedito', position: 'Head of International Partnerships', img: 'https://boldstone.odoo.com/web/image/429-43daa88a/Screenshot%202025-12-02%20095443.webp' },
  { id: 'sabira', name: 'Sabira Ssemata', position: 'Backend Software Engineer', img: 'https://address-restaurant2.odoo.com/web/image/1888-df4ef49b/Sabira.webp' },
  { id: 'habib', name: 'Habib Tumwesige', position: 'Frontend Software Engineer', img: 'https://address-restaurant2.odoo.com/web/image/1982-2595a3af/Habib%20Salah.webp' },
]

const profiles = {
  moses: {
    name: 'Moses Alicwamu',
    role: 'Founder & Managing Director',
    img: 'https://address-restaurant2.odoo.com/web/image/1571-51dfbae5/Moses%20Photo%20-%20up%20to%20date.webp',
    bio: ["Moses is an engineer, passionate coffee farmer, investor and entrepreneur with over six years of experience working across startups, engineering and education. Moses' experience and business knowledge obtained across Y Combinator, Harvard Innovation Labs and UNSW Founders now guides Boldstone's mission of connecting coffee farmers to premium markets while bringing scalable digital tools into Africa's coffee industry."],
    linkedin: 'https://www.linkedin.com/in/moses-alicwamu/',
  },
  patrick: {
    name: 'Patrick Muhereza',
    role: 'Co-Founder & Head of Coffee Business',
    img: 'https://address-restaurant2.odoo.com/web/image/1808-671600b8/Pato1.webp',
    bio: ["Patrick has dedicated the past seven years to helping farmers unlock the full potential of Uganda's coffee industry. As a founder of Legacy Coffee, he transformed a vision into a successful 20-acre commercial coffee farm, built a single-origin coffee brand, and united local coffee growers through the creation of a coffee farmers' cooperative. By fostering strategic partnerships and promoting sustainable agronomic practices, he has enabled farmers to improve productivity, quality, and market access. At Boldstone Investments, Patrick combines practical farming expertise with deep industry knowledge to build resilient coffee value chains that benefit both producers and global buyers."],
    linkedin: 'https://www.linkedin.com/in/patrick-muhereza-b4151a332/',
  },
  jonathan: {
    name: 'Jonathan Byaruhanga',
    role: 'Co-Founder & Agronomist',
    img: 'https://address-restaurant2.odoo.com/web/image/1884-ccb07d63/ChatGPT%20Image%20Jul%2010%2C%202026%2C%2001_35_24%20PM.webp',
    bio: ['Jonathan is an experienced coffee farmer with educational training in Agri-entrepreneurship from Makerere University, Uganda. His practical knowledge of coffee agronomy enables Boldstone to support farmers in adopting best practices that improve productivity, quality, and long-term farm resilience. At Boldstone Investments, Jonathan provides technical leadership on farm management, extension services, and quality assurance, helping ensure that the company\'s coffee is produced to the highest standards while promoting sustainable farming practices.'],
  },
  nelson: {
    name: 'Nelson Gumisiriza',
    role: 'Co-Founder & Non-Executive Director',
    img: 'https://photo.odoo.com/web/image/1148-8abdf1ec/nel.webp',
    imgStyle: { objectPosition: 'center 20%' },
    bio: ['Nelson brings experience in marketing, trade, and financial markets, providing strategic insight into Boldstone\'s commercial growth and investment direction. As an early investor in the company, he played a key role in the initial market research, asset assessment, and validation of Boldstone\'s business model. Nelson serves as a Non-Executive Director, investor, and strategic advisor, supporting the company\'s governance, business development, and long-term growth strategy.'],
  },
  okwiri: {
    name: 'Okwiiri Expedito',
    role: 'Co-Founder & Head of International Partnerships',
    img: 'https://boldstone.odoo.com/web/image/429-43daa88a/Screenshot%202025-12-02%20095443.webp',
    imgStyle: { objectPosition: 'center top' },
    bio: ["Expedito leads Boldstone's trade partnerships, building strategic relationships with coffee traders, exporters, roasters, and market players who connect Ugandan coffee with international markets. With a strong understanding of coffee supply chains, trade dynamics, and buyer requirements, he works to create reliable partnerships that enhance market access for our coffee. Expedito focuses on connecting Boldstone's locally grown and sourced coffee with local and global coffee networks, strengthening direct trade opportunities, and positioning Boldstone as a source of quality, traceable coffee."],
    linkedin: 'https://www.linkedin.com/in/okwiiri-expedito-9b7726259/',
  },
  habib: {
    name: 'Habib Tumwesige',
    role: 'Frontend Software Engineer',
    img: 'https://address-restaurant2.odoo.com/web/image/1982-2595a3af/Habib%20Salah.webp',
    bio: ["Habib is a frontend software engineer responsible for building and maintaining Boldstone's user-facing digital experiences."],
    linkedin: 'https://www.linkedin.com/in/habib-tumwesige-17a931351/',
  },
  sabira: {
    name: 'Sabira Ssemata',
    role: 'Backend Software Engineer',
    img: 'https://address-restaurant2.odoo.com/web/image/1888-df4ef49b/Sabira.webp',
    bio: ['Sabira is a backend software engineer contributing to Boldstone\'s technology infrastructure and digital solutions.'],
    linkedin: 'https://www.linkedin.com/in/sabira-ssemata/',
  },
}

export default function About() {
  const [activeProfile, setActiveProfile] = useState(null)

  const teamRef = useRef(null)
  const profileRef = useRef(null)
  const scrollPosRef = useRef(0)

  const showProfile = (id) => {
    scrollPosRef.current = window.scrollY
    setActiveProfile(id)
    setTimeout(() => profileRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const hideProfile = () => {
    setActiveProfile(null)
    setTimeout(() => window.scrollTo({ top: scrollPosRef.current, behavior: 'smooth' }), 50)
  }

  const profile = activeProfile ? profiles[activeProfile] : null

  return (
    <div>
      <Helmet>
        <title>About Boldstone Investments | Coffee Farming in Uganda</title>
        <meta name="description" content="Learn how Boldstone is building sustainable coffee farming in Uganda through commercial agriculture, farmer partnerships, coffee processing, agronomy, technology, and global market access." />
        <meta name="keywords" content="Boldstone Investments, Boldstone Uganda, Boldstone Investments Uganda, about Boldstone, Boldstone story, Boldstone coffee, coffee company Uganda, coffee farming company Uganda, coffee investment company Uganda, coffee agriculture Uganda, coffee farming Uganda, commercial coffee farming Uganda, large scale coffee farming Uganda, commercial agriculture Uganda, agricultural company Uganda, agribusiness Uganda, agribusiness company Uganda, agricultural investment Uganda, coffee industry Uganda, Uganda coffee industry, Uganda coffee sector, Uganda coffee market, Uganda coffee production, coffee production Uganda, coffee farmers Uganda, coffee farmer partnerships Uganda, coffee farming partnerships, coffee farmer support Uganda, smallholder coffee farmers Uganda, smallholder coffee farming Uganda, coffee cooperatives Uganda, coffee cooperative societies Uganda, coffee farmer cooperatives, coffee farming challenges Uganda, coffee land Uganda, agricultural land Uganda, farmland Uganda, coffee farm development Uganda, coffee estate Uganda, coffee estates Uganda, coffee plantation Uganda, coffee plantation development Uganda, coffee farm management Uganda, professional coffee farm management, sustainable coffee farming Uganda, sustainable agriculture Uganda, sustainable coffee production Uganda, regenerative agriculture Uganda, coffee agroforestry Uganda, coffee farming technology Uganda, digital agriculture Uganda, digital farming Uganda, agricultural technology Uganda, farmer digital platform Uganda, coffee farmer digital platform, coffee farming information Uganda, coffee farming knowledge, coffee market information Uganda, coffee market prices Uganda, coffee price information Uganda, coffee pest management Uganda, coffee disease management Uganda, coffee farming best practices Uganda, coffee agronomy Uganda, coffee agronomy support, coffee farmer education Uganda, coffee farmer training Uganda, coffee farming advisory services, agricultural advisory services Uganda, coffee value addition Uganda, coffee value chain Uganda, Uganda coffee value chain, coffee processing Uganda, coffee processing at source, coffee processing facilities Uganda, coffee hulling Uganda, coffee drying Uganda, coffee processing infrastructure, coffee value addition at source, coffee supply chain Uganda, coffee trade Uganda, coffee export Uganda, Uganda coffee exports, African coffee, African coffee production, African coffee exports, African coffee markets, coffee market access Uganda, local coffee markets, global coffee markets, coffee export market, coffee business Uganda, coffee enterprise Uganda, agricultural enterprise Uganda, sustainable agribusiness Uganda, agricultural innovation Uganda, coffee innovation Uganda, coffee technology company Uganda, agricultural technology company Uganda, farmer-first agriculture, farmer-first approach, farmer support platform, coffee ecosystem Uganda, coffee industry development Uganda, agricultural development Uganda, coffee farming opportunities Uganda, coffee investment opportunities Uganda, coffee farming investment Uganda, coffee estate investment Uganda, coffee land leasing Uganda, coffee farm leasing Uganda, agricultural land leasing Uganda, coffee farm partnership opportunities, coffee investor partnerships, coffee farmer investor partnerships, coffee industry partnerships Uganda, coffee business partnerships Uganda, coffee value chain partnerships, coffee market access partnerships, sustainable coffee business, sustainable coffee enterprise, professionally managed coffee farms, traceable coffee Uganda, single-origin coffee Uganda, single-origin coffee estate Uganda, traceable coffee farming, coffee sustainability Uganda, coffee quality Uganda, coffee production systems, coffee farm productivity, coffee yield improvement Uganda, coffee quality improvement, coffee farmer income Uganda, coffee farmer livelihoods, agricultural livelihoods Uganda, coffee farming profitability, coffee farming business Uganda, coffee farming for commercial production, African agricultural investment, Pan-African investment, African investment company, alternative asset investment Africa, asset backed investment Africa, African investment fund, Pan-African investment fund, sustainable investment Africa, impact investment Africa, agricultural investment Africa, coffee investment Africa, coffee industry investment Africa, coffee value chain investment Africa" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.boldstoneinvestments.com/about" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Boldstone Investments" />
        <meta property="og:title" content="Our Story | Boldstone Investments | Coffee Farming in Uganda" />
        <meta property="og:description" content="Discover Boldstone's journey to build sustainable coffee farms, support smallholder farmers, add value at source, and connect African-grown coffee with local and global markets." />
        <meta property="og:url" content="https://www.boldstoneinvestments.com/about" />
        <meta property="og:image" content="https://address-restaurant2.odoo.com/web/image/1761-7d0fecc0/coffe.webp" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Story | Boldstone Investments | Coffee Farming in Uganda" />
        <meta name="twitter:description" content="Discover Boldstone's journey to build sustainable coffee farms, support smallholder farmers, add value at source, and connect African-grown coffee with local and global markets." />
        <meta name="twitter:image" content="https://address-restaurant2.odoo.com/web/image/1761-7d0fecc0/coffe.webp" />
      </Helmet>

      {/* ADVERT TICKER */}
      <div className="advert-banner">
        <div className="advert-ticker">
          {tickerItem}<span className="advert-sep">●</span>
          {tickerItem}<span className="advert-sep">●</span>
          {tickerItem}<span className="advert-sep">●</span>
          {tickerItem}<span className="advert-sep">●</span>
        </div>
      </div>

      {/* ABOUT / OUR STORY */}
      <section className="about-section">
        <div className="bs-wrap">
          <div className="about-hero">
            <p className="about-heading-center">Our Story</p>
            <div className="about-story">
              <p>After developing a passion for coffee, we started to explore how we could venture into large scale commercial coffee farming. In pursuit of the goal; we always ran into the same problems; Most land was small, expensive and scattered with a lot of unresolved ownership issues.</p>
              <p>Arable land big enough for coffee farming was very expensive. In the end, we opted to lease institutional land that would allow people like us to own and operate coffee farms without necessarily having to buy and own land.</p>
              <p>Through this approach, we discovered that there were individuals who owned land and had passion for coffee farming but did not have the resources and time to venture into commercial coffee farming.</p>
            </div>
          </div>

          <div className="about-cards">
            {aboutCards.map((card, i) => (
              <div key={i} style={{ position: 'relative', display: 'grid' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '18px', background: '#0f8972', transform: i % 2 === 0 ? 'translate(5px, 5px)' : 'translate(-5px, 5px)', zIndex: 1 }} />
                <div className="offer-card-inner" style={{ position: 'relative', inset: 'unset', height: 'auto', zIndex: 2 }}>
                  <div className="offer-card-content" style={{ paddingBottom: '28px' }}>
                    <h4>{card.title}</h4>
                    {card.body.map((p, j) => <p key={j}>{p}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="mission-section">
        <div className="bs-wrap">
          <div className="offer-card" style={{ maxWidth: '860px', margin: '0 auto' }}>
            <div className="offer-card-back" />
            <div className="offer-card-inner" style={{ height: 'auto' }}>
              <div className="offer-card-content" style={{ paddingBottom: '28px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.6rem', color: '#0f8972' }}>Our Mission</h4>
                <p style={{ marginTop: '12px', fontSize: '1rem' }}>To farm and help bring African grown coffee to local and global markets</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="values-section">
        <div className="bs-wrap">
          <p className="values-label">WHAT WE STAND FOR</p>
          <p className="values-quote">
            At Boldstone, culture is not just what we say, it's the collective personality of everyone within our team. It's the energy we bring to our work, the compassion we extend to each other and the mindset we carry as we grow, learn and lead in the ever evolving world.
          </p>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <FontAwesomeIcon icon={v.icon} className="value-icon" />
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM GRID */}
      {!activeProfile && (
        <section className="team-section" ref={teamRef}>
          <div className="bs-wrap">
            <p className="team-label">Our Team</p>
            <h2 className="team-heading">
              The Boldstone team is united by a common belief that through hard work and relentless innovation; it is possible to build a world class company that makes its people, clients and the planet a better place.
            </h2>
            <div className="team-grid">
              {team.map((member) => (
                <div key={member.id} className="offer-card" style={{ height: 'auto', minHeight: '320px', cursor: 'pointer' }} onClick={() => showProfile(member.id)}>
                  <div className="offer-card-back" style={{ transform: team.indexOf(member) % 2 === 0 ? 'translate(-5px, 5px)' : 'translate(5px, 5px)' }} />
                  <div className="offer-card-inner" style={{ position: 'relative', inset: 'unset', height: 'auto', borderRadius: '18px', border: '1px solid rgba(15,137,114,0.35)', boxShadow: '0 2px 8px rgba(17,31,27,0.06)', overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                    <div className="team-img">
                      <img src={member.img} alt={member.name} loading="lazy" style={member.imgStyle} />
                    </div>
                    <div className="team-card-body">
                      <h4><span className="team-name">{member.name}</span></h4>
                      <p className="team-position">{member.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROFILE VIEW */}
      {activeProfile && profile && (
        <section className="profile-section" ref={profileRef}>
          <div className="bs-wrap">
            <button className="back-link" onClick={hideProfile}>
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Team
            </button>
            <div className="profile-card">
              <div className="profile-img">
                <img src={profile.img} alt={profile.name} loading="lazy" style={profile.imgStyle} />
              </div>
              <div className="profile-info">
                <h1 className="profile-name">{profile.name}</h1>
                <p className="profile-role">{profile.role}</p>
                <div className="profile-bio">
                  {profile.bio.map((p, i) => <p key={i}>{p}</p>)}
                  {profile.linkedin && (
                    <a href={profile.linkedin} className="linkedin-link" target="_blank" rel="noreferrer">
                      <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
