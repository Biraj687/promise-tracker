import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, User, MapPin, CheckCircle2, Clock, Globe, ShieldCheck } from 'lucide-react';

const PromiseOverview = () => {
  const promises = [
    {
      id: 1,
      name: 'बालेन साह',
      title: '१००-विन्दु नागरिक प्रतिबद्धता',
      platform: 'काठमाडौं महानगरपालिका',
      description: 'काठमाडौंको विकास र सुशासनका लागि घोषणा गरिएका १०० प्रमुख प्रतिवद्धताहरू।',
      totalPromises: 100,
      completed: 35,
      inProgress: 42,
      pending: 23,
      image: 'https://images.unsplash.com/photo-1544216717-3bbf52512659?w=800&auto=format&fit=crop',
      color: 'bg-primary',
      link: '/balen-tracker'
    },
    {
      id: 2,
      name: 'गण्डकी प्रदेश सरकार',
      title: '२० सुधार योजना',
      platform: 'मुख्यमन्त्री कार्यालय, गण्डकी',
      description: 'गण्डकी प्रदेशको विकास र जनकल्याणका लागि २० मुख्य योजनाहरूको कार्यान्वयन अवस्था।',
      totalPromises: 20,
      completed: 8,
      inProgress: 7,
      pending: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop',
      color: 'bg-accent-emerald',
      link: '/tracker?leader=sharma'
    },
    {
      id: 3,
      name: 'स्वास्थ्य मन्त्रालय',
      title: 'स्वास्थ्य क्षेत्र सुधार: ५० प्रमुख कदम',
      platform: 'संघीय सरकार',
      description: 'स्वास्थ्य सेवा र जनस्वास्थ्य सुधारका लागि मन्त्रालयले लिएका ५० प्रमुख पहलहरू।',
      totalPromises: 50,
      completed: 12,
      inProgress: 28,
      pending: 10,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop',
      color: 'bg-accent-rose',
      link: '/tracker?leader=ghimire'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Premium Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-outline-variant shadow-sm mb-8">
              <ShieldCheck size={18} className="text-secondary" />
              <span className="text-primary font-bold text-xs uppercase tracking-widest font-headline">प्रमाणित डेटा • पारदर्शी शासन</span>
            </div>
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black text-primary mb-8 tracking-tight">
              नेपाल <span className="text-secondary">ट्रयाकर।</span>
            </h1>
            <p className="text-on-surface-variant font-medium text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12">
              नेपालका जननिर्वाचित प्रतिनिधि र सरकारी निकायहरूले गरेका सार्वजनिक प्रतिबद्धताहरूको वास्तविक समय अनुगमन केन्द्र।
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/tracker" className="premium-gradient text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-premium hover:-translate-y-1 transition-all">
                सबै ट्रयाकरहरू
              </Link>
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-outline-variant">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-surface-container overflow-hidden">
                         <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                      </div>
                    ))}
                 </div>
                 <span className="text-sm font-bold text-primary">१२,०००+ सक्रिय नागरिक</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Portals Section */}
      <section className="py-24 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="font-headline text-4xl font-black text-primary mb-4 tracking-tight">प्रमुख ट्रयाकरहरू</h2>
              <p className="text-on-surface-variant font-medium max-w-md">अहिले सक्रिय रूपमा अनुगमन भइरहेका प्रमुख सार्वजनिक योजना र व्यक्तित्वहरू।</p>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {promises.map((portal) => (
              <motion.div
                key={portal.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-outline-variant shadow-sm hover:shadow-premium transition-all duration-500"
              >
                <Link to={portal.link} className="block relative h-64 overflow-hidden">
                  <img
                    src={portal.image}
                    alt={portal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                      <MapPin size={14} className="text-secondary" />
                      {portal.platform}
                    </div>
                    <h3 className="text-3xl font-black text-white font-headline leading-none">
                      {portal.name}
                    </h3>
                  </div>
                </Link>

                <div className="p-8">
                  <h4 className="font-headline text-xl font-bold text-primary mb-3 leading-snug group-hover:text-secondary transition-colors">
                    {portal.title}
                  </h4>
                  <p className="text-on-surface-variant text-sm font-medium mb-8 leading-relaxed line-clamp-2">
                    {portal.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center p-3 bg-surface rounded-2xl border border-outline-variant/50">
                      <div className="text-lg font-black text-primary">{portal.totalPromises}</div>
                      <div className="text-[10px] font-bold text-on-surface-variant/60 uppercase">कुल</div>
                    </div>
                    <div className="text-center p-3 bg-accent-emerald/5 rounded-2xl border border-accent-emerald/10">
                      <div className="text-lg font-black text-accent-emerald">{portal.completed}</div>
                      <div className="text-[10px] font-bold text-accent-emerald/60 uppercase">पूरा</div>
                    </div>
                    <div className="text-center p-3 bg-accent-amber/5 rounded-2xl border border-accent-amber/10">
                      <div className="text-lg font-black text-accent-amber">{portal.inProgress}</div>
                      <div className="text-[10px] font-bold text-accent-amber/60 uppercase">प्रगति</div>
                    </div>
                  </div>

                  <Link 
                    to={portal.link}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 group/btn hover:bg-secondary transition-all"
                  >
                    विस्तृत विवरण
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modern Newsletter/CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 className="font-headline text-4xl lg:text-5xl font-black text-white mb-6">हाम्रो अभियानमा जोड्नुहोस्</h2>
              <p className="text-white/70 text-lg mb-12 font-medium">
                तपाईंको क्षेत्रको प्रतिवद्धता ट्रयाक गर्न चाहनुहुन्छ वा डेटा प्रमाणित गर्न मद्दत गर्न चाहनुहुन्छ? आजै हाम्रो स्वयंसेवी टोलीमा सहभागी हुनुहोस्।
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary px-10 py-5 rounded-2xl font-black hover:bg-secondary hover:text-white transition-all shadow-xl">
                  अनुरोध पठाउनुहोस्
                </button>
                <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-black hover:bg-white/20 transition-all">
                  डेटा प्रमाणित गर्नुहोस्
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PromiseOverview;

