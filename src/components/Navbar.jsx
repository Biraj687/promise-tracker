import { Link, useLocation } from 'react-router-dom';
import { Search, BarChart3, Menu } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const Navbar = () => {
  const location = useLocation();
  const { config } = useConfig();

  const navLinks = [
    { name: config.nav_home_label || 'नयाँ', path: '/' },
    { name: config.nav_balen_label || 'बालेन साह', path: '/balen-tracker' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-xl border border-white/20 shadow-glass rounded-2xl px-6 py-3 pointer-events-auto">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          {config.site_logo_url ? (
            <img 
              src={config.site_logo_url} 
              alt="Logo" 
              className="w-10 h-10 rounded-xl object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform duration-300">
              <BarChart3 size={24} />
            </div>
          )}
          <span className="text-xl font-black text-primary font-headline tracking-tight hidden sm:block">
            {config.site_name || 'नेपाल ट्रयाकर'}
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-container/50 p-1 rounded-xl border border-outline-variant">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg font-headline font-semibold text-sm transition-all duration-200 ${
                location.pathname === link.path
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Search & Action Section */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center bg-surface-container/80 border border-outline-variant px-3 py-2 rounded-xl focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300 group">
            <Search size={18} className="text-on-surface-variant group-focus-within:text-primary transition-colors" />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-40 font-body outline-none px-2 text-on-surface placeholder:text-on-surface-variant/60"
              placeholder={config.nav_search_placeholder || 'खोज्नुहोस्...'}
              type="text"
            />
          </div>

          <button className="md:hidden p-2 text-on-surface hover:bg-surface-container rounded-lg transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

