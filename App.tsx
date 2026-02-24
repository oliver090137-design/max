
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LivePage from './pages/LivePage';

type Page = 'home' | 'detail' | 'live';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Simple scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'detail':
        return <ProductDetailPage onNavigate={setCurrentPage} />;
      case 'live':
        return <LivePage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onNavigate={setCurrentPage} 
        activePage={currentPage} 
      />
      
      <main className="flex-grow">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
};

export default App;
