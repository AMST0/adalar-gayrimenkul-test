import React, { useState, useEffect } from 'react';
import { DataProvider } from './contexts/DataContext';
import { AdminProvider } from './contexts/AdminContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Agents from './pages/Agents';
import Contact from './pages/Contact';
import Properties from './pages/Properties';
import Admin from './pages/Admin';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Simple router based on pathname
  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <Home />;
      case '/biz-kimiz':
        return <About />;
      case '/danismanlar':
        return <Agents />;
      case '/arsalar':
        return <Properties />;
      case '/iletisim':
        return <Contact />;
      case '/admin':
        return <Admin />;
      default:
        if (currentPath.startsWith('/danismanlar/')) {
          return <Agents />;
        }
        return <Home />;
    }
  };

  // Handle navigation
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const newPath = new URL(target.href).pathname;
        window.history.pushState({}, '', newPath);
        setCurrentPath(newPath);
        window.scrollTo(0, 0);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <AdminProvider>
      <DataProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            {renderPage()}
          </main>
          <Footer />
        </div>
      </DataProvider>
    </AdminProvider>
  );
}

export default App;