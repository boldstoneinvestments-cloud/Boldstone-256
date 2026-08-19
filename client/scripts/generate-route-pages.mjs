import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const clientDirectory = dirname(scriptDirectory)
const distDirectory = join(clientDirectory, 'dist')
const indexPath = join(distDirectory, 'index.html')
const siteUrl = 'https://www.boldstoneinvestments.com'
const shareImage = 'https://address-restaurant2.odoo.com/web/image/1918-fe8aa66d/cfe.webp'

const pages = {
  '/': {
    title: 'Boldstone Investments | Coffee Investment in Uganda',
    description: "Invest in Uganda's coffee economy with Boldstone Investments. Partner in commercial coffee farming, processing, trade, and sustainable agricultural value creation.",
    image: 'https://address-restaurant2.odoo.com/web/image/1918-fe8aa66d/cfe.webp',
  },
  '/about': {
    title: 'About Boldstone Investments | Coffee Farming in Uganda',
    description: "Learn how Boldstone is building sustainable coffee farming in Uganda through commercial agriculture, farmer partnerships, coffee processing, agronomy, technology, and global market access.",
    image: 'https://address-restaurant2.odoo.com/web/image/1761-7d0fecc0/coffe.webp',
  },
  '/lease-a-coffee-farm': {
    title: 'Lease a Coffee Farm in Uganda | Boldstone Investments',
    description: 'Lease a coffee farm in Uganda with Boldstone. Start with 1 acre through a professionally managed, sustainable single-origin coffee estate with agronomy support and farm management.',
    image: 'https://address-restaurant2.odoo.com/web/image/1948-db6cb14d/Land%20aerial%20view.webp',
  },
  '/farmers': {
    title: 'Coffee Farming Support in Uganda | Boldstone Farmers',
    description: 'Get coffee farming support in Uganda with Boldstone. Access live market prices, agronomy advice, farmer training, direct market access, farm tips, rewards, and growth opportunities.',
    image: 'https://address-restaurant2.odoo.com/web/image/1906-689c8b1f/coffee%20man.webp',
  },
  '/partnership': {
    title: 'Coffee Partnership Opportunities in Uganda | Boldstone',
    description: "Partner with Boldstone to grow Uganda's coffee ecosystem. Explore partnership opportunities for coffee cooperatives, SACCOs, banks, fintechs, insurers, NGOs, and influencers.",
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
  },
  '/contact': {
    title: 'Contact Boldstone Investments | Coffee & Agriculture Uganda',
    description: 'Contact Boldstone Investments in Fort Portal, Uganda for coffee farming, investment, partnerships, coffee opportunities, farmer support and general enquiries.',
    socialDescription: 'Get in touch with Boldstone Investments in Fort Portal, Uganda for coffee farming, investment, partnerships, agricultural opportunities, farmer support and general enquiries.',
    image: 'https://address-restaurant2.odoo.com/web/image/1984-0a7897c7/Image%20plant.webp',
    keywords: 'Boldstone contact, contact Boldstone Investments, Boldstone Investments contact, Boldstone Uganda contact, Boldstone Investments Uganda, Boldstone Fort Portal, Boldstone Fort Portal Uganda, coffee company Fort Portal, coffee investment Uganda, coffee farming Uganda, coffee investment company Uganda, agricultural investment Uganda, agribusiness Uganda, coffee farming opportunities Uganda, coffee investment opportunities Uganda, coffee partnerships Uganda, coffee partnership opportunities Uganda, coffee farmer support Uganda, coffee farming support, agricultural partnerships Uganda, agricultural business Uganda, coffee business Uganda, Uganda coffee industry, Uganda coffee company, coffee companies Uganda, coffee investors Uganda, coffee investment firm Uganda, agricultural investment company Uganda, coffee farm investment Uganda, coffee farm leasing Uganda, lease a coffee farm Uganda, coffee estate Uganda, coffee plantation Uganda, commercial coffee farming Uganda, sustainable coffee farming Uganda, coffee processing Uganda, coffee value addition Uganda, coffee value chain Uganda, coffee market Uganda, Uganda coffee market, coffee trade Uganda, coffee export Uganda, farmer partnerships Uganda, landowner partnerships Uganda, investment partnerships Uganda, business partnerships Uganda, coffee opportunities Uganda, farming opportunities Uganda, coffee farmer network Uganda, coffee farming technology Uganda, digital agriculture Uganda, coffee agronomy Uganda, coffee farm management Uganda, coffee investor enquiries, coffee farming enquiries Uganda, coffee investment enquiries Uganda, business enquiry Uganda, investment enquiry Uganda, partnership enquiry Uganda, coffee partnership enquiry, farmer support enquiry, Boldstone office Uganda, Boldstone phone number, Boldstone email, Boldstone contact information',
  },
  '/blog': {
    title: 'Boldstone Blog | Uganda Coffee Industry News & Insights',
    description: "Read Boldstone news, insights and updates on Uganda's coffee industry, coffee farming, investment, processing, agriculture, markets and the future of African coffee.",
    image: 'https://address-restaurant2.odoo.com/web/image/1948-db6cb14d/Land%20aerial%20view.webp',
  },
  '/team': {
    title: 'Boldstone Team | Meet Our Leadership & Coffee Experts',
    description: 'Meet the Boldstone team of coffee experts, entrepreneurs, and strategists dedicated to building sustainable coffee farming and value chains in Uganda.',
    image: 'https://address-restaurant2.odoo.com/web/image/1918-fe8aa66d/cfe.webp',
  },
}

const escapeHtml = value => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const indexHtml = await readFile(indexPath, 'utf8')
const body = indexHtml.slice(indexHtml.indexOf('<body>'))
const assetTags = [...indexHtml.matchAll(/    <(?:script type="module"[^>]*><\/script>|link rel="stylesheet"[^>]*>)/g)]
  .map(([tag]) => tag)
  .join('\n')

for (const [route, page] of Object.entries(pages)) {
  const description = page.socialDescription || page.description
  const canonical = `${siteUrl}${route === '/' ? '/' : route}`
  const routeHtml = `<!doctype html>
<html lang="en">
  <head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-TCN7P6FCC4"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-TCN7P6FCC4');
    </script>
    <meta charset="UTF-8" />
    <meta name="google-site-verification" content="5OxFLuia7aYYU9w85jmk7NHlvu9I_aE0S-e0597q6nQ" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
  ${page.keywords ? `    <meta name="keywords" content="${escapeHtml(page.keywords)}" />\n` : ''}    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Boldstone Investments" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${page.image || shareImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${page.image || shareImage}" />
    <link rel="icon" type="image/webp" href="https://address-restaurant2.odoo.com/web/image/1976-7689f755/Boldstone%20Favicon.webp" sizes="64x64" />
    <link rel="apple-touch-icon" href="https://address-restaurant2.odoo.com/web/image/1976-7689f755/Boldstone%20Favicon.webp" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet" />
${assetTags}
  </head>
  ${body}`

  const outputPath = route === '/' ? indexPath : join(distDirectory, route.slice(1), 'index.html')
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, routeHtml)
}
