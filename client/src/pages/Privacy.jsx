import { Helmet } from 'react-helmet-async'

const sections = [
  {
    title: '1. Information We Collect',
    content: `We may collect personal information to provide, improve, market, and legally administer our Services.

"Personal Information" refers to information that identifies you directly or indirectly.

You may not be required to provide all requested Personal Information; however, failure to provide certain information may limit our ability to offer certain services.

Categories of Personal Information We May Collect

A. Identifiers
• Full name
• National ID number / Passport number
• Tax Identification Number (TIN)
• Physical and postal address
• Email address
• Phone number
• Date of birth
• IP address
• Device identifiers

B. Financial Information
• Bank account details
• Source of funds
• Income verification
• Investment experience
• Risk tolerance
• Transaction history
• Capital contributions

C. Professional Information
• Employment details
• Business ownership information

D. Website & Technical Data
• Browsing activity
• Session data
• Device type
• Browser type
• Location data (where permitted by law)

We may also generate anonymized or aggregated data that does not identify any individual.`,
  },
  {
    title: '2. Sources of Information and Purpose of Collection',
    content: `We collect Personal Information from the following sources:

A. Directly From You
Partnership application forms, subscription agreements, email correspondence, investor onboarding processes, and Know Your Customer (KYC) compliance documentation.

Purpose:
• Provide and administer farming and trade services
• Conduct due diligence and compliance checks
• Prevent fraud and financial crime
• Communicate activity updates
• Fulfill legal obligations

B. Third Parties
Financial institutions, regulatory authorities, credit reference bureaus, and professional advisors.

Purpose:
• Regulatory compliance
• Identity verification
• Anti-money laundering compliance

C. Website Interactions
When you visit our website, we may collect technical information through cookies and analytics tools.

Purpose:
• Improve user experience
• Enhance platform security
• Analyze performance
• Market our services`,
  },
  {
    title: '3. How We Share Information',
    content: `We do not sell your Personal Information.

We may share your information with:

A. Operational Service Providers
Legal advisors, auditors, fund administrators, agricultural operators, and payment processors.

B. Regulatory and Government Authorities
Where required under Ugandan law or international regulations.

C. Professional Advisors
Accountants, compliance consultants, and legal counsel.

D. Business Transfers
In the event of restructuring, merger, or acquisition.

All third parties are contractually required to protect your data.`,
  },
  {
    title: '4. Cookies and Tracking Technologies',
    content: `We use cookies and similar technologies to:

• Improve website performance
• Analyze traffic
• Enhance security
• Remember user preferences

You may disable cookies in your browser settings. Some website functions may be limited if cookies are disabled.`,
  },
  {
    title: '5. Data Security',
    content: `We implement administrative, technical, and physical safeguards to protect Personal Information against unauthorized access, loss, misuse, or alteration.

However, no digital transmission or storage system can be guaranteed 100% secure.`,
  },
  {
    title: '6. Data Retention',
    content: `We retain Personal Information only as long as necessary to:

• Fulfill service obligations
• Comply with legal and tax requirements
• Resolve disputes
• Enforce agreements

Retention periods are guided by Ugandan regulatory requirements.`,
  },
  {
    title: '7. Your Rights Under Ugandan Law',
    content: `Under the Data Protection and Privacy Act, 2019 (Uganda), you have the right to:

• Access your Personal Information
• Request correction of inaccurate information
• Request deletion where legally permissible
• Withdraw consent (where processing is based on consent)
• Object to certain types of processing

Requests may require identity verification.`,
  },
  {
    title: '8. International Data Transfers',
    content: `If you are located outside Uganda, your information may be processed in Uganda or other jurisdictions where our service providers operate, subject to appropriate safeguards.`,
  },
  {
    title: '9. Updates to This Policy',
    content: `We may update this Policy periodically. Updates will be posted on our website with a revised "Last Updated" date.`,
  },
  {
    title: '10. Contact Us',
    content: `If you have questions about this Privacy Policy or wish to exercise your rights, please contact us via boldstone.investments@gmail.com`,
  },
]

export default function Privacy() {
  return (
    <div>
      <Helmet>
        <title>Privacy Policy | Boldstone Property Investments</title>
        <meta name="description" content="Read the Boldstone Property Investments Privacy Policy to understand how we collect, use, and protect your personal information." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.boldstoneinvestments.com/privacy" />
      </Helmet>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#000', margin: '0 0 16px' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: '#000', margin: 0 }}>Last Updated: August 1, 2026</p>
        </div>

        {/* Intro */}
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '24px 28px', marginBottom: 48 }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#000', margin: '0 0 16px' }}>
            Boldstone Property Investments LLC, its subsidiaries and affiliates ("Boldstone," "we," "us," or "our") respects your privacy. This Privacy Policy ("Policy") describes how we collect, use, process, disclose, and safeguard your information when you engage with our coffee farming and trade platform and related services (collectively, the "Services").
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#000', margin: '0 0 16px' }}>
            This Policy applies to all services offered by Boldstone Property Investments in Uganda and internationally where expressly adopted.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#000', margin: 0 }}>
            We are committed to complying with the Data Protection and Privacy Act, 2019 (Uganda) and applicable regulations.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {sections.map((section, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', paddingBottom: 40 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#000', marginBottom: 16 }}>
                {section.title}
              </h2>
              <div style={{ fontSize: 15, lineHeight: 1.9, color: '#000' }}>
                {section.content.split('\n').map((line, j) => (
                  <p key={j} style={{ margin: '0 0 4px' }}>
                    {/^[A-D]\. /.test(line) || line === 'Purpose:'
                      ? <strong>{line}</strong>
                      : line.includes('boldstone.investments@gmail.com')
                        ? <>{line.replace('boldstone.investments@gmail.com', '')}<a href="mailto:boldstone.investments@gmail.com" style={{ color: '#0f8972', textDecoration: 'underline' }}>boldstone.investments@gmail.com</a></>
                        : line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
