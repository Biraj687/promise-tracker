import { motion } from 'framer-motion';
import { ArrowRight, Play, Info } from 'lucide-react';
import { useConfig } from '../../context/ConfigContext';
import { useState } from 'react';

const Hero = () => {
  const { config } = useConfig();
  const hero = config.balenHero || {};
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-white">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-150 h-150 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-100 h-100 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-8 border border-primary/10">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary font-bold text-xs uppercase tracking-widest font-headline">
                {hero.badge || 'नागरिक ट्रयाकर : काठमाडौं महानगर'}
              </span>
            </div>
            
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black text-primary leading-[1.05] tracking-tight mb-8">
              {hero.title1 || 'काठमाडौंको'} <br/>
              <span className="text-secondary drop-shadow-sm">{hero.title2 || 'नयाँ युगको'}</span> <br/>
              <span className="relative inline-block mt-2">
                {hero.title3 || 'प्रतिबद्धता।'}
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-accent-amber/20 -z-10 rounded-full" />
              </span>
            </h1>

            <p className="text-on-surface-variant text-xl leading-relaxed max-w-xl mb-12 font-body mx-auto lg:mx-0">
              {hero.description || 'सरकारी जवाफदेहिताको लागि एक क्रान्तिकारी दृष्टिकोण।'}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="premium-gradient text-white px-8 py-4 rounded-2xl font-headline font-bold text-lg hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group"
              >
                {hero.startButton || 'सुरु गरौं'}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('category-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-primary border border-outline-variant px-8 py-4 rounded-2xl font-headline font-bold text-lg hover:bg-surface-container transition-all flex items-center gap-2 shadow-sm"
              >
                <Play size={18} fill="currentColor" />
                {hero.howItWorksButton || 'कार्यप्रणाली'}
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-black text-primary">१००+</span>
                  <span className="text-xs uppercase font-bold tracking-widest text-on-surface-variant">प्रतिबद्धताहरू</span>
               </div>
               <div className="w-px h-8 bg-outline-variant hidden sm:block" />
               <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-black text-primary">३०+</span>
                  <span className="text-xs uppercase font-bold tracking-widest text-on-surface-variant">योजना पूरा</span>
               </div>
            </div>
          </motion.div>
          
          {/* Visual Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 relative"
          >
            <div className="aspect-4/5 w-full max-w-125 mx-auto rounded-3xl overflow-hidden shadow-2xl border-12 border-white glass-card">
              <img 
                alt="Kathmandu Drone View" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000" 
                src={hero.heroImageUrl || "https://images.unsplash.com/photo-1544216717-3bbf52512659?w=800&auto=format&fit=crop"}
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary/40 to-transparent pointer-events-none" />
              
              {/* Floating Stat Card */}
              <div className="absolute bottom-8 left-8 right-8 glass-card p-6 rounded-2xl border border-white/40 shadow-premium">
                 <div className="flex items-center justify-between mb-4">
                    <span className="font-headline font-bold text-primary">कुल प्रगति</span>
                    <span className="bg-accent-emerald/10 text-accent-emerald text-sm font-bold px-3 py-1 rounded-full">+५.२%</span>
                 </div>
                 <div className="h-3 w-full bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full w-[35%] bg-primary rounded-full" />
                 </div>
                 <div className="flex justify-between mt-3 text-xs font-bold text-on-surface-variant/70 uppercase">
                    <span>सुरुवात</span>
                    <span>३५% सम्पन्न</span>
                 </div>
              </div>
            </div>
            
            {/* Small floating detail image */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-48 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white hidden md:block"
            >
              <img 
                alt="Detail" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1610448721566-473ce9da81d3?w=400&auto=format&fit=crop"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

