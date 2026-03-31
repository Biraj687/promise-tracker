import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { useData } from '../../context/DataContext';

const RecentUpdates = ({ limit = 4, categoryId = null }) => {
  const { newsUpdates, categories } = useData();
  const [displayUpdates, setDisplayUpdates] = useState([]);

  useEffect(() => {
    let filtered = newsUpdates.filter(n => n.is_published);

    if (categoryId) {
      filtered = filtered.filter(n => n.category_id === categoryId);
    }

    // Sort by created_at and limit
    const sorted = filtered
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);

    setDisplayUpdates(sorted);
  }, [newsUpdates, categoryId, limit]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name.split(' ')[0] : 'साधारण';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const daysAgo = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    
    if (daysAgo === 0) return 'आज';
    if (daysAgo === 1) return 'हिजो';
    if (daysAgo < 7) return `${daysAgo} दिन अगाडि`;
    
    return date.toLocaleDateString('ne-NP', { month: 'short', day: 'numeric' });
  };

  const getThumbnail = (update) => {
    if (update.thumbnail_url) return update.thumbnail_url;
    if (update.image_url) return update.image_url;
    return 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop';
  };

  if (displayUpdates.length === 0) {
    return (
      <section className="bg-surface py-24 border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-on-surface-variant font-medium">कुनै अपडेट उपलब्ध छैन</p>
        </div>
      </section>
    );
  }

  const featuredUpdate = displayUpdates[0];
  const listUpdates = displayUpdates.slice(1);

  return (
    <section className="bg-surface py-24 lg:py-32 overflow-hidden border-b border-outline-variant">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Header & Feature Image */}
          <div className="lg:col-span-5">
            <div className="inline-block px-3 py-1 rounded-full bg-accent-emerald/10 text-accent-emerald text-xs font-bold uppercase tracking-widest mb-4 border border-accent-emerald/10">
              भर्खरैका उपलब्धिहरू
            </div>
            <h2 className="font-headline text-4xl lg:text-5xl font-black text-primary mb-6 tracking-tight">
              हालैका <span className="text-secondary">प्रगति अपडेटहरू</span>
            </h2>
            <p className="text-on-surface-variant font-medium text-lg mb-12 leading-relaxed">
              विगत ३० दिनभित्र हासिल गरिएका मुख्य उपलब्धिहरू। हामी हरेक योजनाको प्रगतिको निरन्तर अनुगमन र प्रमाणीकरण गर्दछौं।
            </p>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-premium border border-outline-variant relative group cursor-pointer"
            >
              <img 
                alt={featuredUpdate.title} 
                className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-1000" 
                src={getThumbnail(featuredUpdate)}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute top-4 right-4">
                {featuredUpdate.source_url && (
                  <a 
                    href={featuredUpdate.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white bg-black/40 p-2 rounded-full hover:bg-black/60 transition-all"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-all">
                <div className="flex items-center gap-2 mb-2">
                   <span className="bg-accent-emerald text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                     {featuredUpdate.news_type === 'update' ? 'अपडेट' : featuredUpdate.news_type === 'news' ? 'समाचार' : 'प्रगति'}
                   </span>
                   <span className="text-xs font-bold opacity-80 uppercase tracking-widest">{getCategoryName(featuredUpdate.category_id)}</span>
                </div>
                <h4 className="text-2xl font-bold font-headline mb-2 leading-tight">{featuredUpdate.title}</h4>
                <p className="text-sm opacity-80 line-clamp-2">{featuredUpdate.description}</p>
              </div>
            </motion.div>
          </div>

          {/* Updates List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-headline text-xl font-bold text-primary mb-6 flex items-center gap-3">
               <Calendar size={20} className="text-secondary" />
               टाइमलाइन अपडेटहरू
            </h3>
            
            <div className="space-y-4">
              {listUpdates.map((update, i) => (
                <motion.div 
                  key={update.id} 
                  initial={{ x: 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-2xl flex gap-6 items-center group cursor-pointer border border-outline-variant hover:border-primary/20 hover:shadow-premium transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-surface-container flex flex-col items-center justify-center border border-outline-variant group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <span className="text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 leading-none mb-1">
                      {formatDate(update.created_at).split(' ')[0]}
                    </span>
                    <span className="text-sm font-black leading-none">{formatDate(update.created_at).split(' ').slice(1).join(' ')}</span>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/5">
                        {getCategoryName(update.category_id)}
                      </span>
                      {update.news_type === 'progress' && (
                        <div className="flex items-center gap-1.5 text-accent-emerald">
                          <Check size={14} className="stroke-[3]" />
                          <span className="text-[10px] font-black uppercase tracking-widest">सत्यापित</span>
                        </div>
                      )}
                    </div>
                    <h4 className="font-headline text-lg font-bold text-primary group-hover:text-secondary transition-colors leading-snug">
                       {update.title}
                    </h4>
                  </div>
                  
                  {update.source_url && (
                    <a 
                      href={update.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-white group-hover:rotate-45 transition-all duration-500"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
            
            <button className="w-full py-4 border-2 border-dashed border-outline-variant rounded-2xl text-on-surface-variant font-bold text-sm hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300 mt-8">
               थप अपडेटहरू हेर्नुहोस्
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentUpdates;

