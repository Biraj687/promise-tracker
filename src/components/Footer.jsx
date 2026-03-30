import { Share2, Mail, Globe, Database, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

const Footer = () => {
  const { config } = useConfig();
  const footerConfig = config.footer || {};

  return (
    <footer className="w-full pt-20 pb-10 bg-surface-container border-t border-outline-variant">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Globe size={18} />
            </div>
            <span className="font-headline font-black text-primary text-2xl tracking-tight">
              {footerConfig.title || 'नेपाल ट्रयाकर'}
            </span>
          </div>
          <p className="font-body text-base text-on-surface-variant max-w-sm leading-relaxed">
            {footerConfig.description || 'शासनमा पारदर्शिता र जवाफदेहिताका लागि समर्पित। वास्तविक समय डेटा र प्रमाणित प्रगतिका माध्यमबाट नागरिकहरूलाई सशक्त बनाउँदै।'}
          </p>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-white border border-outline-variant flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm">
              <Share2 size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-outline-variant flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm">
              <Mail size={18} />
            </button>
          </div>
        </div>

        {/* Resources Section */}
        <div className="flex flex-col gap-6">
          <h5 className="font-headline font-bold text-on-surface text-lg">{footerConfig.resourcesTitle || 'स्रोतहरू'}</h5>
          <ul className="flex flex-col gap-4">
            <li>
              <Link to="#" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium group">
                <Globe size={14} className="opacity-50 group-hover:opacity-100" />
                {footerConfig.officialPortal || 'आधिकारिक पोर्टल'}
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium group">
                <Database size={14} className="opacity-50 group-hover:opacity-100" />
                {footerConfig.dataSources || 'डेटा स्रोतहरू'}
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium group">
                <Shield size={14} className="opacity-50 group-hover:opacity-100" />
                {footerConfig.privacyPolicy || 'गोपनीयता नीति'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories Section */}
        <div className="flex flex-col gap-6">
          <h5 className="font-headline font-bold text-on-surface text-lg">{footerConfig.trackersTitle || 'ट्रयाकरहरू'}</h5>
          <ul className="flex flex-col gap-4">
            <li>
              <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">{footerConfig.newCommitments || 'नयाँ प्रतिशृङ्खला'}</Link>
            </li>
            <li>
              <Link to="/balen-tracker" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">{footerConfig.balenTracker || 'बालेन साह ट्रयाकर'}</Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">{footerConfig.adminPanel || 'व्यवस्थापन प्यानल'}</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="font-body text-sm text-on-surface-variant opacity-70">
            {footerConfig.copyright || '© २०२४ नेपाल सरकार। सबै अधिकार सुरक्षित। पारदर्शिताको लागि प्रगति।'}
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-on-surface-variant opacity-50 uppercase tracking-widest font-bold">{footerConfig.verifiedData || 'सत्यता परीक्षण गरिएको'}</span>
            <span className="text-xs text-on-surface-variant opacity-50 uppercase tracking-widest font-bold">{footerConfig.transparentGovernance || 'पारदर्शी शासन'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

