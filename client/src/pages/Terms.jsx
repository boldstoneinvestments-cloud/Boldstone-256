import { Helmet } from 'react-helmet-async'

const sections = [
  {
    title: '1. Definitions and Interpretation',
    content: `In these Terms, unless the context otherwise requires:

"Account" means the account or profile created by a User to access certain features of the Website or Services.

"Boldstone", "we", "us" or "our" means Boldstone Property Investments LLC, and where applicable any affiliated or related entity through which the relevant Service is provided.

"Content" means all text, graphics, photographs, videos, maps, illustrations, software, data, documents, logos, trademarks and other materials appearing on or forming part of the Website.

"Farm" means the agricultural land, coffee plantation, agroforestry estate or designated farming area operated or managed by Boldstone for the purposes of providing the Services.

"Farming Plan" means a subscription or service package offered by Boldstone under which a User may access land and/or receive coffee seedlings, planting, farm management, agronomy, maintenance, monitoring or other agricultural services as specified in the applicable plan.

"Lease" means the separate written agreement between Boldstone, the relevant landowner and/or the User governing the User's lease or use of a specified portion of agricultural land. Where applicable, the Lease shall take precedence over these Terms in relation to rights and obligations concerning the leased land.

"Payment Information" means information required to process a payment, including relevant card, billing and transaction information. Boldstone may use third-party payment processors to process payments and may not directly store complete payment-card information.

"Services" means the land leasing, coffee farming, seedlings, farm management, agronomy, subscription and related services offered by Boldstone through the Website.

"Subscription" means a recurring payment arrangement under which a User pays for a selected Farming Plan on a monthly or annual basis.

"User", "you" or "your" means any individual, company, organisation or other person who accesses the Website or uses or purchases the Services.

"Website" means the Boldstone website and any associated subdomains through which the Services are made available.`,
  },
  {
    title: '2. About the Service',
    content: `Boldstone provides access to agricultural land and professionally managed coffee-farming services designed to enable individuals, businesses and other customers to participate in coffee farming without necessarily purchasing agricultural land themselves.

Depending on the Farming Plan selected, the Services may include:

• access to a designated agricultural acre or other area of land;
• coffee seedlings;
• land preparation and planting;
• farm establishment and maintenance;
• agronomic and farm-management services;
• crop monitoring;
• sustainable and climate-resilient farming practices;
• agroforestry and environmental management;
• coffee harvesting and post-harvest support; and
• other services expressly identified in the applicable Farming Plan.

The specific services included in each plan, the applicable fees, payment schedule, establishment timeline and other conditions will be stated on the Website, subscription checkout page, order confirmation or applicable agreement.`,
  },
  {
    title: '3. Land Leasing',
    content: `A subscription or payment made through the Website does not, by itself, constitute a transfer of ownership of land to the User.

Where a Farming Plan includes access to or leasing of agricultural land, the User's rights to the relevant land shall be governed by a separate Lease or other written land-use agreement.

The Lease shall identify, where applicable, the leased area, location, term, rent, permitted use, rights of access, obligations of the parties, termination provisions and other material conditions.

The User acknowledges that agricultural land remains subject to applicable Ugandan land laws and the rights of the registered proprietor or other lawful landowner. The Registration of Titles Act provides for the registration of qualifying leases, and the applicable requirements will depend on the nature and term of the Lease.

Nothing on this Website should be interpreted as granting the User ownership, title or an interest in land beyond that expressly provided in a valid written agreement.`,
  },
  {
    title: '4. Farming Plans and Subscriptions',
    content: `Boldstone may offer Farming Plans on a monthly or annual basis.

The Monthly Plan may allow a User to spread the cost of establishing a coffee farm over a defined subscription period, subject to the terms displayed at the time of purchase.

The Annual Plan may require the User to pay the applicable annual subscription, seedling and farm-management charges upfront, in accordance with the selected plan.

Unless otherwise stated, subscriptions automatically renew only where the User has expressly agreed to recurring payments and the applicable payment method remains valid.

Boldstone reserves the right to change Farming Plans, pricing, included services or subscription structures for future subscriptions. Any change affecting an existing paid subscription will be communicated in accordance with these Terms and any applicable subscription agreement.`,
  },
  {
    title: '5. Farm Establishment and Agricultural Services',
    content: `Coffee is a perennial crop and requires time to establish before reaching commercial production. The timing of planting, growth, maturity and harvest depends on factors including weather, rainfall, soil conditions, altitude, disease pressure, agronomic practices and other circumstances beyond Boldstone's reasonable control.

Where a Farming Plan provides for the establishment of a User's acre, Boldstone will undertake the relevant activities according to the applicable plan and its agronomic schedule.

Boldstone will use reasonable professional efforts to manage the farm in accordance with appropriate agronomic and environmental practices. However, agricultural production is inherently subject to biological, climatic and market risks, and Boldstone does not guarantee a particular yield, harvest volume, coffee price or financial return.`,
  },
  {
    title: '6. Sustainability and Agroforestry',
    content: `Boldstone is developing its coffee farming operations around principles of sustainable agriculture and agroforestry.

The Farm may incorporate native shade-tree species alongside coffee in an integrated agroforestry system designed to support soil health, biodiversity, microclimate regulation and long-term farm productivity.

Boldstone may also implement water conservation, soil management, integrated pest management, climate-smart agriculture and other sustainable farming practices as appropriate to the Farm.

The sustainability information presented on the Website describes Boldstone's intended farming approach and should not be interpreted as a guarantee that every environmental outcome will be achieved in every season or on every acre.`,
  },
  {
    title: '7. User Eligibility and Information',
    content: `Users must provide accurate, current and complete information when creating an Account, making a purchase, subscribing to a Farming Plan or entering into a Lease.

You are responsible for ensuring that information provided to Boldstone, including your name, contact details, billing information and identification information where required, remains accurate.

Where a Service or Lease requires identification, verification or additional documentation, Boldstone may request such information before confirming the transaction.

Boldstone reserves the right to decline or suspend a transaction where information provided is materially inaccurate, incomplete, fraudulent or cannot reasonably be verified.`,
  },
  {
    title: '8. Payments',
    content: `Payments for Services may be made using the payment methods displayed on the Website, which may include credit cards, debit cards and other electronic payment methods supported by Boldstone's payment processors.

You authorise Boldstone and/or its designated payment processor to charge the applicable amount for the Service, Subscription or Farming Plan selected by you.

Prices displayed on the Website will be stated in the applicable currency and may be subject to applicable taxes, transaction charges, bank charges or other costs where expressly stated.

Where payments are processed by a third-party payment provider, the processing of payment information may also be subject to that provider's terms and privacy policy.

Electronic transactions and electronic records used through the Website are subject to applicable Ugandan laws governing electronic transactions and electronic signatures.`,
  },
  {
    title: '9. Invoices and Receipts',
    content: `Where applicable, Boldstone will provide an electronic invoice, receipt or payment confirmation for payments made through the Website.

Users are responsible for providing accurate billing information required for invoicing.

An invoice or payment receipt confirms the relevant payment transaction but does not, by itself, constitute a land title, Lease or evidence of ownership of the Farm.`,
  },
  {
    title: '10. Cancellation, Suspension and Termination',
    content: `The cancellation and refund rights applicable to a Farming Plan or Subscription shall be those stated in the applicable Subscription Terms, checkout page, refund policy or Lease.

Where a User fails to make a required payment, Boldstone may suspend or terminate the relevant Services in accordance with the applicable agreement.

Termination of a Website Account does not automatically terminate an existing Lease or other contractual arrangement unless the applicable agreement expressly provides otherwise.

Where a User has entered into a separate Lease, termination, surrender or expiry of that Lease shall be governed by the terms of the Lease and applicable Ugandan law.`,
  },
  {
    title: '11. Agricultural and Market Risk',
    content: `Users acknowledge that agriculture is subject to risks that cannot be fully controlled by Boldstone.

These risks may include drought, excessive rainfall, flooding, pests, diseases, fire, extreme temperatures, climate variability, natural disasters, changes in agricultural regulations, labour disruptions, input shortages and other events beyond Boldstone's reasonable control.

Coffee prices may also fluctuate due to local and international market conditions, exchange rates, supply and demand and other factors.

Accordingly, Boldstone does not guarantee that a User will receive a specific harvest volume, revenue, profit, return on investment or coffee price.

Nothing on this Website constitutes a promise or representation of guaranteed financial returns.`,
  },
  {
    title: '12. Website Content and Information',
    content: `Boldstone seeks to ensure that information published on the Website is accurate and current. However, agricultural, pricing, operational and other information may change from time to time.

Information concerning projected yields, timelines, savings, agricultural performance or other estimates is provided for informational purposes and should not be treated as a guarantee.

Maps, photographs, illustrations and farm-development plans may be representative and may not accurately depict the exact condition or location of every individual acre at every point in time.`,
  },
  {
    title: '13. Intellectual Property',
    content: `Unless otherwise stated, all Content appearing on the Website, including Boldstone's name, logo, trademarks, photographs, graphics, text, software, designs, farm maps and other materials, is owned by or licensed to Boldstone.

You may access and use the Website for personal or legitimate business purposes in accordance with these Terms.

You may not reproduce, modify, distribute, publish, sell, licence or commercially exploit Boldstone's Content without our prior written permission.

Nothing in these Terms grants you ownership of Boldstone's intellectual property.`,
  },
  {
    title: '14. User Conduct',
    content: `You agree to use the Website and Services only for lawful purposes.

You must not:

a. use the Website for fraudulent, unlawful or unauthorised purposes;
b. attempt to gain unauthorised access to the Website, Accounts, systems or databases;
c. interfere with the security, operation or availability of the Website;
d. introduce malicious code, viruses or other harmful material;
e. impersonate another person or provide false information;
f. misuse payment systems or attempt to conduct fraudulent transactions; or
g. use the Website or its Content in a manner that infringes the rights of Boldstone or any third party.`,
  },
  {
    title: '15. Third-Party Services and Links',
    content: `The Website may contain links to third-party websites, payment providers, mapping services, financial institutions or other external services.

These links are provided for convenience and do not necessarily constitute an endorsement by Boldstone.

Boldstone is not responsible for the availability, content, security, privacy practices or performance of third-party websites or services.

Your use of third-party services may be subject to additional terms imposed by the relevant provider.`,
  },
  {
    title: '16. Privacy and Personal Data',
    content: `Boldstone may collect and process personal information necessary to provide the Website and Services, process payments, manage subscriptions, communicate with Users, verify identity, provide customer support and comply with applicable legal obligations.

Boldstone will process personal data in accordance with its Privacy Policy and applicable Ugandan data-protection laws, including the Data Protection and Privacy Act, 2019.

Users should review the Privacy Policy to understand how their personal information is collected, used, stored and disclosed.`,
  },
  {
    title: '17. Communications',
    content: `By creating an Account or purchasing a Service, you may receive communications from Boldstone relating to your Account, payments, subscription, Farm, agricultural activities, service updates and other matters relevant to your relationship with Boldstone.

Where legally required, marketing communications will be subject to applicable consent and opt-out requirements.

You may contact Boldstone to update your communication preferences.`,
  },
  {
    title: '18. Disclaimer of Warranties',
    content: `The Website and its Content are provided on an "as is" and "as available" basis to the extent permitted by applicable law.

Boldstone does not warrant that the Website will always be available, uninterrupted, secure or free from errors.

Boldstone does not warrant that agricultural activities will produce a particular yield, harvest, revenue, profit or financial return.

Nothing in these Terms excludes or limits any liability that cannot lawfully be excluded or limited under applicable law.`,
  },
  {
    title: '19. Limitation of Liability',
    content: `To the maximum extent permitted by applicable law, Boldstone shall not be liable for indirect, incidental, special, consequential or punitive loss arising from your use of the Website or Services, including loss of profits, loss of business opportunity or loss of anticipated agricultural production.

Boldstone's liability in relation to a particular Service shall, to the extent permitted by law, be limited to the amount paid by the User for the relevant Service giving rise to the claim.

This limitation does not apply to liability that cannot lawfully be limited or excluded under applicable Ugandan law.`,
  },
  {
    title: '20. Force Majeure',
    content: `Boldstone shall not be responsible for delay, interruption or failure to perform its obligations where such delay or failure results from circumstances beyond its reasonable control.

Such circumstances may include natural disasters, extreme weather, drought, flooding, fire, epidemic or pandemic events, war, civil unrest, government action, changes in law, labour disputes, utility failures, infrastructure failures or other events beyond reasonable control.

Where reasonably practicable, Boldstone will notify affected Users and take reasonable steps to mitigate the impact.`,
  },
  {
    title: '21. Changes to the Website and Services',
    content: `Boldstone may modify, suspend or discontinue any part of the Website or Services where reasonably necessary, including for operational, technical, legal or commercial reasons.

Where a change materially affects an existing contractual arrangement, the applicable Lease, Subscription Terms or other agreement shall govern the rights of the parties.`,
  },
  {
    title: '22. Changes to These Terms',
    content: `Boldstone may amend these Terms from time to time.

The updated Terms will be published on the Website together with the effective date.

Your continued use of the Website after updated Terms have been published constitutes acceptance of the revised Terms, except where applicable law requires a different form of notice or consent.`,
  },
  {
    title: '23. Governing Law and Dispute Resolution',
    content: `These Terms shall be governed by and construed in accordance with the laws of the Republic of Uganda.

The parties shall endeavour to resolve any dispute arising from these Terms through good-faith negotiation before commencing formal proceedings.

Where a dispute cannot be resolved amicably, it shall be submitted to the courts of competent jurisdiction in Uganda, unless the applicable Lease or other written agreement provides for an alternative dispute-resolution mechanism.

Nothing in this clause prevents a party from seeking urgent or interim relief where legally available.`,
  },
  {
    title: '24. Severability',
    content: `If any provision of these Terms is determined to be invalid, unlawful or unenforceable, that provision shall be modified or severed to the extent necessary, and the remaining provisions shall continue in full force and effect.`,
  },
  {
    title: '25. Entire Agreement',
    content: `These Terms, together with the applicable Lease, Subscription Terms, Privacy Policy, Refund Policy and any other agreement expressly incorporated by reference, constitute the agreement governing your use of the Website and Services.

Where there is a conflict between these Terms and a specific written Lease or Service Agreement, the specific agreement shall prevail in relation to the subject matter of that agreement.`,
  },
  {
    title: '26. Contact Us',
    content: `If you have questions regarding these Terms, your Subscription, Lease or Services, please contact:

Boldstone Property Investments LLC
Fort Portal, Uganda
Email: boldstone.investments@gmail.com
Website: https://www.boldstoneinvestments.com`,
  },
]

export default function Terms() {
  return (
    <div>
      <Helmet>
        <title>Terms of Use | Boldstone Property Investments</title>
        <meta name="description" content="Read the Terms of Use governing your access to and use of the Boldstone Property Investments website and services." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.boldstoneinvestments.com/terms/" />
      </Helmet>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#000', margin: '0 0 16px' }}>
            Terms of Use
          </h1>
          <p style={{ fontSize: 14, color: '#000', margin: 0 }}>Effective Date: August 1, 2026</p>
        </div>

        {/* Intro */}
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '24px 28px', marginBottom: 48 }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#000', margin: '0 0 16px' }}>
            These Terms of Use ("Terms") govern your access to and use of the Boldstone Property Investments website (<a href="https://www.boldstoneinvestments.com" style={{ color: '#0f8972', textDecoration: 'underline' }}>https://www.boldstoneinvestments.com</a>), including the information, subscription services, land-leasing services, coffee farming services, payment facilities and other services made available through the website (collectively, the "Service").
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#000', margin: '0 0 16px' }}>
            By accessing, browsing or using this Website, creating an account, submitting an enquiry, subscribing to a farming plan, making a payment or otherwise using the Service, you acknowledge that you have read, understood and agree to be bound by these Terms. If you do not agree to these Terms, you should not use the Website or purchase any Services through it.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#000', margin: 0 }}>
            These Terms should be read together with any applicable Lease Agreement, Privacy Policy, Refund Policy, Payment Terms or other agreement provided to you by Boldstone Property Investments LLC.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {sections.map((section, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', paddingBottom: 40 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#000', marginBottom: 16 }}>
                {section.title}
              </h2>
              <div style={{ fontSize: 15, lineHeight: 1.9, color: '#000', whiteSpace: 'pre-line' }}>
                {section.content.split('\n').map((line, j) => {
                  if (line.includes('boldstone.investments@gmail.com')) {
                    const parts = line.split('boldstone.investments@gmail.com')
                    return <p key={j} style={{ margin: '0 0 4px' }}>{parts[0]}<a href="mailto:boldstone.investments@gmail.com" style={{ color: '#0f8972', textDecoration: 'underline' }}>boldstone.investments@gmail.com</a>{parts[1]}</p>
                  }
                  if (line.includes('https://www.boldstoneinvestments.com')) {
                    const parts = line.split('https://www.boldstoneinvestments.com')
                    return <p key={j} style={{ margin: '0 0 4px' }}>{parts[0]}<a href="https://www.boldstoneinvestments.com" target="_blank" rel="noreferrer" style={{ color: '#0f8972', textDecoration: 'underline' }}>https://www.boldstoneinvestments.com</a>{parts[1]}</p>
                  }
                  return <p key={j} style={{ margin: '0 0 4px' }}>{line}</p>
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: 48, padding: '20px 28px', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12 }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#000', margin: 0 }}>
            By accessing or using the Website, creating an Account, subscribing to a Farming Plan or purchasing Services, you acknowledge that you have read, understood and agree to these Terms of Use.
          </p>
          <p style={{ fontSize: 15, color: '#000', margin: '12px 0 0', fontWeight: 700 }}>Last Updated: August 1, 2026</p>
        </div>

      </div>
    </div>
  )
}
