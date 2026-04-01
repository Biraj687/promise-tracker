import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { ToastProvider } from './context/ToastContext';
import PromiseOverview from './pages/PromiseOverview';
import BalenTracker from './pages/BalenTracker';
import Tracker from './pages/Tracker';
// Public dashboard if exists, if not we will just map public pages to standard layouts
import Login from './pages/Login';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManagePromises from './pages/admin/ManagePromises';
import ManageNews from './pages/admin/ManageNews';
import ManageUsers from './pages/admin/ManageUsers';
import ContentManager from './pages/admin/ContentManager';
import PromiseDetail from './pages/PromiseDetail';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <>
      {/* Scroll to Top */}
      <ScrollToTop />
      
      <div className={`min-h-screen ${!isAdminRoute ? 'bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed flex flex-col' : ''}`}>
        <Routes>
          {/* Public Routes wrapped in MainLayout */}
          <Route path="/" element={<MainLayout><PromiseOverview /></MainLayout>} />
          <Route path="/balen-tracker" element={<MainLayout><BalenTracker /></MainLayout>} />
          <Route path="/tracker" element={<MainLayout><Tracker /></MainLayout>} />
          <Route path="/category/:id" element={<MainLayout><Tracker /></MainLayout>} />
          <Route path="/promise/:id" element={<MainLayout><PromiseDetail /></MainLayout>} />
          
          {/* Automatically redirect old legacy Dashboard links to Admin */}
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

          {/* Login Route (standalone, no Navbar/Footer) */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="promises" element={<ManagePromises />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="news" element={<ManageNews />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <ConfigProvider>
        <AuthProvider>
          <DataProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </DataProvider>
        </AuthProvider>
      </ConfigProvider>
    </Router>
  );
}

export default App;
