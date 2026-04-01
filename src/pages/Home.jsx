import Hero from '../components/home/Hero';
import StatsBar from '../components/home/StatsBar';
import FeaturedPromises from '../components/home/FeaturedPromises';
import CategoryGrid from '../components/home/CategoryGrid';
import RecentUpdates from '../components/home/RecentUpdates';
import { useData } from '../context/DataContext';

const Home = () => {
  const { categories, promises, newsUpdates, getStats, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="flex flex-col">
      <Hero />
      <StatsBar stats={stats} />
      <FeaturedPromises promises={promises} />
      <CategoryGrid categories={categories} promises={promises} />
      <RecentUpdates updates={newsUpdates} />
    </div>
  );
};

export default Home;
