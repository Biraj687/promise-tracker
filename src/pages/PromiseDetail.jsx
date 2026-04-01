import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Share2, 
  ExternalLink,
  MessageSquare,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useData } from '../context/DataContext';

const PromiseDetail = () => {
  const { id } = useParams();
  const { fetchPromiseById, getNewsByPromise, loading: globalLoading } = useData();
  const [promise, setPromise] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchPromiseById(id);
      if (data) {
        setPromise(data);
        const relatedNews = getNewsByPromise(id);
        setNews(relatedNews || []);
      }
      setLoading(false);
    };
    loadData();
  }, [id, fetchPromiseById, getNewsByPromise]);

  if (loading || globalLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-primary animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse">लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (!promise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
            <AlertCircle size={48} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 font-display">माफ गर्नुहोस्!</h1>
          <p className="text-slate-600 font-body">हामीले खोज्नुभएको प्रतिबद्धता फेला पार्न सकेनौं वा यो मेटाइएको हुन सक्छ।</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:shadow-premium transition-all"
          >
            <ChevronLeft size={20} />
            मुख्य पृष्ठमा फर्कनुहोस्
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500';
      case 'In Progress': return 'bg-amber-500';
      case 'Planning': return 'bg-blue-500';
      default: return 'bg-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={18} />;
      case 'In Progress': return <Clock size={18} />;
      case 'Planning': return <Calendar size={18} />;
      default: return <AlertCircle size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Premium Hero Header */}
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        {/* Background Overlay & Image */}
        <div className="absolute inset-0 z-0">
          {promise.hero_image_url ? (
            <img 
              src={promise.hero_image_url} 
              alt={promise.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20" />
          )}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold text-sm bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
            >
              <ChevronLeft size={16} />
              प्रतिबद्धताहरूमा फर्कनुहोस्
            </Link>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-widest ${getStatusColor(promise.status)} shadow-lg`}>
                  {getStatusIcon(promise.status)}
                  {promise.status}
                </span>
                {promise.categories && (
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wide">
                    {promise.categories.name}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight font-display drop-shadow-xl max-w-4xl">
                {promise.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-8 text-white/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                  <Building2 size={20} className="text-primary-fixed" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">जिम्मेवार निकाय</p>
                  <p className="text-sm font-bold">{promise.responsible_ministry || 'मन्त्रालय तोकिन बाँकी'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                  <Calendar size={20} className="text-primary-fixed" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">लक्ष्य मिति</p>
                  <p className="text-sm font-bold">{promise.target_date || 'तय हुन बाँकी'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details & Progress */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface p-8 md:p-10 rounded-[2.5rem] shadow-premium border border-outline/10"
            >
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3 font-display">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <ExternalLink size={20} />
                </div>
                विस्तृत विवरण
              </h2>
              <div className="prose prose-slate max-w-none prose-p:font-body prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-600">
                <p>{promise.description}</p>
              </div>
            </motion.div>

            {/* Progress Timeline or Updates */}
            {news.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 px-4 font-display">
                  <MessageSquare size={24} className="text-primary" />
                  हालसम्मका अपडेटहरू
                </h2>
                
                <div className="space-y-4">
                  {news.map((item, idx) => (
                    <div key={item.id} className="bg-surface p-6 rounded-3xl shadow-sm border border-outline/5 hover:border-primary/20 transition-all group">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                            <CheckCircle2 size={24} />
                          </div>
                          {idx < news.length - 1 && <div className="w-0.5 flex-1 bg-slate-100" />}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <p className="text-xs font-black text-primary uppercase tracking-widest">
                              {new Date(item.published_at).toLocaleDateString('ne-NP', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            {item.source_url && (
                              <a href={item.source_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                          <h4 className="text-xl font-bold text-slate-800">{item.title}</h4>
                          <p className="text-slate-600 font-body leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Sidebar Stats */}
          <div className="space-y-6">
            
            {/* Progress Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-[2rem] shadow-premium border border-outline/10 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Clock size={80} />
              </div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">प्रगति अवस्था</h3>
              
              <div className="relative w-40 h-40 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80" cy="80" r="70"
                    stroke="currentColor" strokeWidth="12" fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="80" cy="80" r="70"
                    stroke="currentColor" strokeWidth="12" fill="transparent"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * promise.progress) / 100}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-800">{promise.progress}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">सम्पन्न</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600 px-1">
                  <span>प्रारम्भ</span>
                  <span>पूर्ण</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                   <div className="h-full bg-primary rounded-full shadow-lg" style={{ width: `${promise.progress}%` }} />
                </div>
              </div>
            </motion.div>

            {/* Share & Actions */}
            <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white space-y-6">
              <h3 className="text-xs font-black text-white/40 uppercase tracking-widest">साझा गर्नुहोस्</h3>
              <p className="text-sm font-medium text-white/80">यस कार्यको प्रगतिबारे जनचेतना फैलाउन सहयोग गर्नुहोस्।</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                  <Share2 size={18} />
                  <span className="text-xs font-bold uppercase tracking-tight">Share</span>
                </button>
                <button className="flex items-center justify-center gap-2 p-3 bg-primary hover:bg-primary/80 rounded-xl transition-all shadow-lg">
                  <ExternalLink size={18} />
                  <span className="text-xs font-bold uppercase tracking-tight">Link</span>
                </button>
              </div>
            </div>

            {/* Help / Feedback */}
            <div className="p-8 rounded-[2rem] border-2 border-dashed border-outline/20 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                <MessageSquare size={24} />
              </div>
              <p className="text-xs font-bold text-slate-500">के तपाईंसँग यस कार्यबारे थप जानकारी छ?</p>
              <button className="text-sm font-black text-primary hover:underline flex items-center gap-2">
                जानकारी पठाउनुहोस्
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default PromiseDetail;
