import Hero from '../components/home/Hero';
import StatsBar from '../components/home/StatsBar';
import CategoryGrid from '../components/home/CategoryGrid';
import RecentUpdates from '../components/home/RecentUpdates';
import { categories, promises } from '../data/promises';

const Home = () => {
  // Calculate total stats
  const total = promises.length;
  const completed = promises.filter(p => p.status === 'Completed').length;
  const implementation = promises.filter(p => p.status === 'In Progress').length;
  const planning = promises.filter(p => p.status === 'Pending').length;
  const percentage = Math.round((completed / total) * 100);

  const stats = { total, completed, implementation, planning, percentage };

  // Prepare recent updates
  const recentUpdates = promises
    .filter(p => p.status === 'Completed')
    .slice(0, 4)
    .map((p, i) => {
      const cat = categories.find(c => c.id === p.categoryId);
      return {
        date: `SEP ${12 - i}`,
        category: cat ? cat.name.split(' ')[0] : 'General',
        title: p.title.split(': ')[1] || p.title,
      };
    });

  return (
    <div className="flex flex-col">
      <Hero />
      <StatsBar stats={stats} />
      <CategoryGrid categories={categories} promises={promises} />
      <RecentUpdates updates={recentUpdates} />
    </div>
  );
};

export default Home;
