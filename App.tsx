
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import MenuPage from './pages/MenuPage';
import AdminPage from './pages/AdminPage';
import CheckoutPage from './pages/CheckoutPage';
import ContentPage from './pages/ContentPage';
import { CartProvider } from './contexts/CartContext';
import CartDrawer from './components/CartDrawer';

type Page = 'home' | 'detail' | 'menu' | 'admin' | 'checkout' | 'content';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedContentKey, setSelectedContentKey] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Simple scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedContentKey, selectedCategory]);

  const handleNavigate = (page: Page, idOrKey?: string) => {
    setCurrentPage(page);
    if (page === 'detail' && idOrKey) {
      setSelectedProductId(idOrKey);
    } else if (page === 'content' && idOrKey) {
      setSelectedContentKey(idOrKey);
    } else if (page === 'menu') {
      setSelectedCategory(idOrKey || 'all');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'detail':
        return <ProductDetailPage onNavigate={handleNavigate} productId={selectedProductId} />;
      case 'menu':
        return <MenuPage onNavigate={handleNavigate} initialCategory={selectedCategory || 'all'} />;
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case 'content':
        return <ContentPage onNavigate={handleNavigate} contentKey={selectedContentKey} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col relative">
        <Header 
          onNavigate={handleNavigate} 
          activePage={currentPage} 
        />
        
        <main className="flex-grow">
          {renderPage()}
        </main>

        <Footer onNavigate={handleNavigate} />
        
        <CartDrawer onNavigate={handleNavigate} />
      </div>
    </CartProvider>
  );
};

export default App;
