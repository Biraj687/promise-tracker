import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  Home, ChevronRight, Search, SearchX, LayoutGrid, Info, 
  Calendar, Layers, ExternalLink, Filter, CheckCircle2, Clock, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useData } from '../context/DataContext';

const getStatusDisplay = (status) => {
  const statusMap = {
    'Completed': 'सम्पन्न',
    'In Progress': 'कार्यान्वयनमा',
    'Pending': 'प्रतिक्षामा',
    'All': 'सबै'
  };
  return statusMap[status] || status;
};

const Tracker = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const { categories, promises } = useData();
  
  // Filter state
  const activeCategoryId = id ? parseInt(id) : (searchParams.get('category') ? parseInt(searchParams.get('category')) : null);
  const activeStatus = searchParams.get('status') || 'All';

  const filteredPromises = useMemo(() => {
    return promises.filter(p => {
      const matchesCategory = activeCategoryId ? p.categoryId === activeCategoryId : true;
      const matchesStatus = activeStatus !== 'All' ? p.status === activeStatus : true;
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [activeCategoryId, activeStatus, searchTerm, promises]);

  const activeCategory = categories.find(c => c.id === activeCategoryId);

  const setStatus = (status) => {
    if (status === 'All') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
  };

  const setCategory = (catId) => {
    if (catId === null) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumbs & Header */}
        <div className="mb-12">
           <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 mb-6">
              <Link to="/" className="hover:text-primary transition-colors">गृहपृष्ठ</Link>
              <ChevronRight size={12} />
              <span className="text-primary">प्रतिबद्धता ट्र्याकर</span>
              {activeCategory && (
                <>
                  <ChevronRight size={12} />
                  <span className="text-primary">{activeCategory.name}</span>
                </>
              )}
           </nav>

           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-3xl">
                 <h1 className="font-headline text-4xl md:text-5xl font-black text-primary tracking-tight mb-4">
                    {activeCategory ? activeCategory.name : 'सबै योजना तथा प्रतिबद्धताहरू'}
                 </h1>
                 <p className="text-on-surface-variant text-lg font-medium leading-relaxed">
                    काठमाडौं महानगरपालिकाको सुशासन र विकासका लागि गरिएका वाचाहरूको प्रत्यक्ष अनुगमन।
                 </p>
              </div>
              <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-outline-variant shadow-sm self-start">
                 <div className="px-4 py-2 border-r border-outline-variant">
                    <span className="block text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest leading-none mb-1">कुल</span>
                    <span className="text-xl font-black text-primary font-headline">{filteredPromises.length}</span>
                 </div>
                 <div className="px-4 py-2">
                    <span className="block text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest leading-none mb-1">सम्पन्न</span>
                    <span className="text-xl font-black text-accent-emerald font-headline">
                       {filteredPromises.filter(p => p.status === 'Completed').length}
                    </span>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            {/* Status Filters */}
            <div className="bg-white p-8 rounded-[2rem] border border-outline-variant shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                 <Filter size={18} className="text-primary" />
                 <h3 className="font-headline font-black text-xs uppercase tracking-widest text-primary">अवस्था अनुसार</h3>
              </div>
              <div className="flex flex-col gap-2">
                {['All', 'Completed', 'In Progress', 'Pending'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatus(status)}
                    className={`px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-left flex items-center justify-between group ${
                      activeStatus === status 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary border border-transparent'
                    }`}
                  >
                    <span>{getStatusDisplay(status)}</span>
                    <span className={`text-[10px] ${activeStatus === status ? 'bg-white/20' : 'bg-surface-container'} px-2 py-0.5 rounded-full`}>
                      {promises.filter(p => {
                        const matchesCategory = activeCategoryId ? p.categoryId === activeCategoryId : true;
                        return (status === 'All' || p.status === status) && matchesCategory;
                      }).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Search/Filter */}
            <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
              <div className="flex items-center gap-2 mb-6">
                 <Layers size={18} className="text-primary" />
                 <h3 className="font-headline font-black text-xs uppercase tracking-widest text-primary">विषयगत विधा</h3>
              </div>
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                <button 
                  onClick={() => setCategory(null)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    !activeCategoryId 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <LayoutGrid size={16} />
                   सबै विधाहरू
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-left ${
                      activeCategoryId === cat.id 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${activeCategoryId === cat.id ? 'bg-white' : 'bg-primary'}`} />
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transparency Note */}
            <div className="p-8 bg-surface rounded-[2rem] border border-outline-variant relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Info size={80} />
               </div>
               <h4 className="font-headline font-black text-sm text-primary mb-3">पारदर्शिता नोट</h4>
               <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                  सयवटा प्रतिबद्धताहरूको यो सूची आधिकारिक स्रोतहरूबाट संकलन गरिएको हो। प्रत्येक अपडेटलाई प्रमाणिकरण गरिएको छ।
               </p>
            </div>
          </aside>

          {/* Promises List Area */}
          <main className="lg:col-span-9 space-y-8">
            {/* Search Top Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search size={24} className="text-on-surface-variant group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="योजनाको शीर्षक वा विवरण खोज्नुहोस्..."
                className="w-full h-20 bg-white border border-outline-variant rounded-[1.5rem] pl-16 pr-8 text-lg font-medium shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all overflow-hidden"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Promise Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredPromises.map((promise) => {
                  const category = categories.find(c => c.id === promise.categoryId);
                  
                  return (
                    <motion.div
                      layout
                      key={promise.id}
                      variants={itemVariants}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white p-10 rounded-[2.5rem] flex flex-col justify-between shadow-sm border border-outline-variant hover:shadow-premium hover:border-primary/20 transition-all group relative overflow-hidden"
                    >
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                             promise.status === 'Completed' ? 'bg-accent-emerald text-white' :
                             promise.status === 'In Progress' ? 'bg-accent-amber text-white' :
                             'bg-slate-400 text-white'
                           }`}>
                             {getStatusDisplay(promise.status)}
                           </div>
                           <span className="text-[10px] font-black text-on-surface-variant/30 tracking-widest uppercase">
                             क्र. सं. #{promise.id}
                           </span>
                        </div>

                        <h3 className="font-headline font-bold text-2xl text-primary mb-4 leading-tight group-hover:text-secondary transition-colors">
                           {promise.title}
                        </h3>
                        <p className="text-on-surface-variant font-medium leading-relaxed mb-8 line-clamp-3">
                           {promise.description}
                        </p>
                      </div>

                      <div className="pt-8 border-t border-outline-variant/50 space-y-8 relative z-10">
                         {/* Meta Info */}
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-primary font-bold text-xs">
                               <Layers size={14} className="text-secondary" />
                               {category?.name}
                            </div>
                            <div className="flex items-center gap-2 text-on-surface-variant/40 font-bold text-[10px] uppercase tracking-widest">
                               <Calendar size={14} />
                               {promise.updatedAt || 'हालै'}
                            </div>
                         </div>

                         {/* Progress Visual */}
                         <div className="space-y-3">
                            <div className="flex justify-between items-end">
                               <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">कार्य प्रगति</span>
                               <span className={`text-2xl font-black font-headline ${
                                 promise.status === 'Completed' ? 'text-accent-emerald' : 'text-primary'
                               }`}>
                                 {promise.progress}%
                               </span>
                            </div>
                            <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden p-0.5">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${promise.progress}%` }}
                                 transition={{ duration: 1, ease: "easeOut" }}
                                 className={`h-full rounded-full ${
                                   promise.status === 'Completed' ? 'bg-accent-emerald' : 'bg-primary'
                                 }`}
                               />
                            </div>
                         </div>

                         {/* Tags & Action */}
                         <div className="flex items-center justify-between pt-4">
                            <div className="flex gap-2">
                               {promise.tags?.slice(0, 2).map((tag, idx) => (
                                 <span key={idx} className="text-[9px] font-black px-3 py-1 bg-surface-container text-on-surface-variant rounded-full uppercase tracking-tighter">
                                   {tag}
                                 </span>
                               ))}
                            </div>
                            <button className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                               <ExternalLink size={18} />
                            </button>
                         </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Empty State */}
              {filteredPromises.length === 0 && (
                <div className="col-span-full py-32 text-center flex flex-col items-center bg-white rounded-[2.5rem] border border-dashed border-outline-variant">
                  <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 text-on-surface-variant/20">
                     <SearchX size={56} />
                  </div>
                  <h3 className="font-headline font-black text-3xl text-primary mb-3">कुनै नतिजा भेटिएन</h3>
                  <p className="text-on-surface-variant font-medium mb-10 max-w-md">
                     तपाईको छनौट अनुसार कुनै पनि प्रतिबद्धता फेला परेन। कृपया फिल्टर परिमार्जन गर्नुहोस्।
                  </p>
                  <button 
                    onClick={() => {setSearchTerm(''); setCategory(null); setStatus('All');}}
                    className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-3"
                  >
                    <ArrowLeft size={20} />
                    सबै फिल्टर रिसेट गर्नुहोस्
                  </button>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Tracker;

