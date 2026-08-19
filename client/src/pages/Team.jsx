import { Helmet } from 'react-helmet-async'

export default function Team() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Helmet>
        <title>Boldstone Team | Meet Our Leadership & Coffee Experts</title>
        <meta name="description" content="Meet the Boldstone team of coffee experts, entrepreneurs, and strategists dedicated to building sustainable coffee farming and value chains in Uganda." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.boldstoneinvestments.com/team" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Boldstone Investments" />
        <meta property="og:title" content="Boldstone Team | Meet Our Leadership & Coffee Experts" />
        <meta property="og:description" content="Meet the Boldstone team of coffee experts, entrepreneurs, and strategists dedicated to building sustainable coffee farming and value chains in Uganda." />
        <meta property="og:url" content="https://www.boldstoneinvestments.com/team" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Boldstone Team | Meet Our Leadership & Coffee Experts" />
        <meta name="twitter:description" content="Meet the Boldstone team of coffee experts, entrepreneurs, and strategists dedicated to building sustainable coffee farming and value chains in Uganda." />
      </Helmet>
      <p className="text-gray-400 text-sm">Team page — coming soon</p>
    </div>
  )
