import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { useConfig } from '../../context/ConfigContext';

const StatsBar = ({ stats }) => {
  const { config } = useConfig();
  const { total, completed, implementation, planning, percentage } = stats;

  return (
    <section className="bg-surface py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white p-8 lg:p-12 rounded-3xl border border-outline-variant shadow-premium relative overflow-hidden">
          {/* Decorative background icon */}
          <div className="absolute -right-8 -bottom-8 text-primary/5 -rotate-12 pointer-events-none">
             <TrendingUp size={240} />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-8">
              <div className="text-center md:text-left">
                <h2 className="font-headline text-3xl lg:text-4xl font-black text-primary mb-3">{config.stats_title || 'समग्र प्रगति समीक्षा'}</h2>
                <p className="text-on-surface-variant font-medium max-w-md">{config.stats_description || 'काठमाडौंको दिगो विकास र सुशासनका लागि गरिएका प्रतिबद्धताहरूको वास्तविक अवस्था।'}</p>
              </div>
              <div className="text-center md:text-right bg-primary/5 px-6 py-4 rounded-2xl border border-primary/10">
                <span className="text-5xl lg:text-6xl font-black text-primary font-headline block leading-none">{percentage}%</span>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest mt-2">{config.stats_progress_label || 'कुल सम्पन्नता दर'}</p>
              </div>
            </div>
            
            {/* Multi-segment Progress Bar */}
            <div className="mb-16">
               <div className="flex justify-between mb-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 px-1">
                  <span>{config.stats_tracker_label || 'प्रगति ट्रयाकर'}</span>
                  <span>{statsConfig.total_label || 'कुल'} {total} {statsConfig.commitment_text || 'प्रतिबद्धताहरू'}</span>
               </div>
               <div className="h-4 w-full bg-surface-container rounded-full overflow-hidden flex shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(completed / total) * 100}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-accent-emerald shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(implementation / total) * 100}%` }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    className="h-full bg-accent-amber shadow-[0_0_20px_rgba(245,158,11,0.3)]" 
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(planning / total) * 100}%` }}
                    transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                    className="h-full bg-outline-variant" 
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="flex items-center gap-5 p-6 rounded-2xl bg-accent-emerald/[0.03] border border-accent-emerald/10 group transition-all"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-accent-emerald group-hover:bg-accent-emerald group-hover:text-white transition-all duration-300">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <span className="text-3xl font-black text-primary block leading-none mb-1">{completed}</span>
                  <span className="text-on-surface-variant text-sm font-bold opacity-80 uppercase tracking-tight">{config.stats_completed_label || 'सम्पन्न'}</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="flex items-center gap-5 p-6 rounded-2xl bg-accent-amber/[0.03] border border-accent-amber/10 group transition-all"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-accent-amber group-hover:bg-accent-amber group-hover:text-white transition-all duration-300">
                  <Clock size={24} />
                </div>
                <div>
                  <span className="text-3xl font-black text-primary block leading-none mb-1">{implementation}</span>
                  <span className="text-on-surface-variant text-sm font-bold opacity-80 uppercase tracking-tight">{config.stats_implementation_label || 'कार्यान्वयनमा'}</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="flex items-center gap-5 p-6 rounded-2xl bg-surface-container border border-outline-variant group transition-all"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-on-surface-variant group-hover:bg-on-surface-variant group-hover:text-white transition-all duration-300">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <span className="text-3xl font-black text-primary block leading-none mb-1">{planning}</span>
                  <span className="text-on-surface-variant text-sm font-bold opacity-80 uppercase tracking-tight">{config.stats_planning_label || 'प्रतिक्षामा'}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsBar;

