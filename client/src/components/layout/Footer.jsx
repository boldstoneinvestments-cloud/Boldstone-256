import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#0d1f1c] text-white pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="text-2xl font-black mb-3">
              Bold<span className="text-[#0f8972]">stone</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Uganda's #1 coffee investment firm. Built by farmers, for farmers.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Pages</h4>
            <div className="flex flex-col gap-2">
              {[['/', 'Home'], ['/about', 'About'], ['/investors', 'Investors'], ['/farmers', 'Farmers']].map(([to, label]) => (
                <NavLink key={to} to={to} className="text-sm text-gray-300 hover:text-[#0f8972] transition-colors">{label}</NavLink>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Contact</h4>
            <p className="text-sm text-gray-400">Kyenjojo District, Uganda</p>
            <p className="text-sm text-gray-400 mt-1">info@boldstone.co</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Boldstone. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
