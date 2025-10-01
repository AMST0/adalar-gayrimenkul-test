import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AdminProvider } from './contexts/AdminContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Agents from './pages/Agents';
import Contact from './pages/Contact';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Admin from './pages/Admin';
import SahibindenFloatingButton from './components/common/SahibindenFloatingButton';
const AppShell: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const showHeader = !isAdminRoute; // Her admin route'ta navbar gizli
  const showFooter = !isAdminRoute; // İstersen footer'ı da gizlemek için bunu değiştirebilirsin
  return (
    <div className="min-h-screen bg-white">
      {showHeader && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/biz-kimiz" element={<About />} />
          <Route path="/danismanlar" element={<Agents />} />
          <Route path="/arsalar" element={<Properties />} />
          <Route path="/arsalar/:id" element={<PropertyDetail />} />
          <Route path="/iletisim" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
      <SahibindenFloatingButton />
    </div>
  );
};

function App() {
  return (
    <AdminProvider>
      <DataProvider>
        <Router>
          <ScrollToTop />
          <AppShell />
        </Router>
      </DataProvider>
    </AdminProvider>
  );
}

export default App;