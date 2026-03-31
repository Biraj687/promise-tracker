import Hero from '../components/home/Hero';
import StatsBar from '../components/home/StatsBar';
import CategoryGrid from '../components/home/CategoryGrid';
import RecentUpdates from '../components/home/RecentUpdates';
import { useData } from '../context/DataContext';

const BalenTracker = () => {
  const { categories, promises } = useData();
  
  // Calculate total stats with safe division
  const total = promises?.length || 0;
  const completed = promises?.filter(p => p.status === 'Completed')?.length || 0;
  const implementation = promises?.filter(p => p.status === 'In Progress')?.length || 0;
  const planning = promises?.filter(p => p.status === 'Planning' || p.status === 'Pending')?.length || 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = { total, completed, implementation, planning, percentage };

  return (
    <div className="flex flex-col">
      <Hero />
      <StatsBar stats={stats} />
      <CategoryGrid categories={categories} promises={promises} />
      <RecentUpdates limit={4} />
    </div>
  );
};

export default BalenTracker;
