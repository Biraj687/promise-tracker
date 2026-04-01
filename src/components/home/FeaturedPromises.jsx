import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Calendar, Building2, MapPin } from 'lucide-react';

const FeaturedPromises = ({ promises }) => {
  // Show first 3 promises as "Featured" or maybe filter by featured flag if it existed
  const featured = promises.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-4 border border-primary/20">
              भर्खरका प्रतिबद्धताहरू
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight font-display mb-4">
              मुख्य प्रतिबद्धता र <span className="text-primary">प्रगति अवस्था</span>
            </h2>
            <p className="text-slate-600 font-medium">
              आम नागरिकको चासो र सरोकारका मुख्य योजनाहरूको वास्तविक प्रगति यहाँ हेर्न सकिन्छ।
            </p>
          </div>
          <Link to="/balen-tracker" className="group flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:text-primary/80 transition-all">
             सबै हेर्नुहोस्
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight size={16} />
             </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((promise, index) => (
            <motion.div
              key={promise.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-premium border border-outline-variant/30 hover:shadow-2xl transition-all duration-500"
            >
              {/* Image Container */}
              <div className="h-56 relative overflow-hidden">
                {promise.hero_image_url ? (
                  <img 
                    src={promise.hero_image_url} 
                    alt={promise.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center text-slate-400">
                    <Building2 size={48} />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md shadow-lg ${
                    promise.status === 'Completed' ? 'bg-emerald-500/80' : 
                    promise.status === 'In Progress' ? 'bg-amber-500/80' : 
                    'bg-slate-400/80'
                  }`}>
                    {promise.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {promise.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                     <Building2 size={12} />
                     <span>{promise.responsible_ministry || 'मन्त्रालय तोकिन बाँकी'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {promise.title}
                  </h3>
                </div>

                {/* Progress Mini Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>प्रगति</span>
                    <span className="text-primary">{promise.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${promise.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary rounded-full" 
                     />
                  </div>
                </div>

                <Link 
                  to={`/promise/${promise.id}`} 
                  className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-800 rounded-2xl font-bold text-sm group-hover:bg-primary group-hover:text-white transition-all shadow-sm group-hover:shadow-premium"
                >
                  थप जानकारी हेर्नुहोस्
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPromises;
