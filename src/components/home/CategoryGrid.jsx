import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Layout, Shield, Heart, Zap, Coffee, Briefcase, GraduationCap, Building2, Car, Phone } from 'lucide-react';

const CategoryGrid = ({ categories, promises }) => {
  // Map icons to categories if available, otherwise use a default
  const getIcon = (catName) => {
    const iconMap = {
      'स्वास्थ्य': Heart,
      'शिक्षा': GraduationCap,
      'सुशासन': Shield,
      'यातायात': Car,
      'पूर्वाधार': Building2,
      'प्रविधि': Zap,
      'रोजगारी': Briefcase,
      'कृषि': Coffee,
      'वातावरण': Layout,
    };
    const key = Object.keys(iconMap).find(k => catName.includes(k));
    return iconMap[key] || Layers;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-24 px-6 bg-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-4 border border-primary/10">
              योजना वर्गीकरण
            </div>
            <h2 className="font-headline text-4xl md:text-5xl font-black text-primary mb-4 tracking-tight">
              विषगत क्षेत्रहरू
            </h2>
            <p className="text-on-surface-variant font-medium max-w-xl">
              १००-बुँदे नागरिक प्रतिवद्धतालाई १२ मुख्य विधामा विभाजन गरी गहन अनुगमन गरिएको छ।
            </p>
          </div>
          <Link 
            to="/tracker" 
            className="group flex items-center gap-2 bg-primary/5 text-primary px-6 py-3 rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all duration-300"
          >
            सबै सूची हेर्नुहोस् 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {categories.map((cat) => {
            const catPromises = promises.filter(p => p.categoryId === cat.id);
            const totalPromises = catPromises.length;
            const completedPromises = catPromises.filter(p => p.status === 'Completed').length;
            const inProgressPromises = catPromises.filter(p => p.status === 'In Progress').length;
            const pendingPromises = catPromises.filter(p => p.status === 'Pending').length;
            const progress = totalPromises > 0 ? Math.round((completedPromises / totalPromises) * 100) : 0;
            const Icon = getIcon(cat.name);

            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group"
              >
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="h-full bg-white p-8 rounded-3xl border border-outline-variant shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-primary/10">
                        <Icon size={28} />
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-2xl font-black text-primary leading-none">{totalPromises}</span>
                         <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mt-1">योजना</span>
                      </div>
                    </div>
                    <h3 className="font-headline text-xl font-bold text-primary group-hover:text-secondary transition-colors leading-snug mb-2">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="mt-8">
                    {/* Status Stats */}
                    <div className="flex items-center gap-3 mb-6 p-3 bg-surface rounded-2xl border border-outline-variant/50">
                      <div className="flex-1 text-center">
                        <div className="text-xs font-black text-accent-emerald">{completedPromises}</div>
                        <div className="text-[9px] font-bold text-on-surface-variant/60 uppercase">पूरा</div>
                      </div>
                      <div className="w-px h-6 bg-outline-variant" />
                      <div className="flex-1 text-center">
                        <div className="text-xs font-black text-accent-amber">{inProgressPromises}</div>
                        <div className="text-[9px] font-bold text-on-surface-variant/60 uppercase">प्रगति</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tight">
                        <span className="text-on-surface-variant/70">प्रगति प्रतिशत</span>
                        <span className="text-primary">{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress}%` }}
                          transition={{ duration: 1.2, delay: 0.3 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGrid;

