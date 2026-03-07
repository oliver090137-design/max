import React, { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useMenu } from "../hooks/useMenu";

interface MenuPageProps {
  onNavigate: (page: any, idOrKey?: string) => void;
  initialCategory?: string;
}

const MenuPage: React.FC<MenuPageProps> = ({ onNavigate, initialCategory = 'all' }) => {
  const { products, loading } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [categories, setCategories] = useState<string[]>(['all']);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const docRef = doc(db, "settings", "options");
        const docSnap = await getDoc(docRef);
        
        let fetchedCategories: string[] = [];
        if (docSnap.exists() && docSnap.data().categories && Array.isArray(docSnap.data().categories) && docSnap.data().categories.length > 0) {
          fetchedCategories = docSnap.data().categories;
        } else {
          // Default fallback if no settings found or empty
          fetchedCategories = ["秘傳禽饌", "豚肉逸品", "金玉良緣", "禪風蔬食"];
        }

        // Get categories from products that might not be in the settings
        const productCategories = new Set<string>(products.map(p => p.category || '其他'));
        
        // Combine: 'all' + configured categories + any extra categories from products
        const uniqueCategories: string[] = ['all', ...fetchedCategories];
        
        // Add any product categories that are not in the configured list
        productCategories.forEach((cat: string) => {
          if (!uniqueCategories.includes(cat) && cat !== 'all') {
            uniqueCategories.push(cat);
          }
        });

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to product-derived categories
        setCategories(['all', ...Array.from(new Set(products.map(p => p.category || '其他')))]);
      }
    };

    if (!loading) {
      fetchCategories();
    }
  }, [products, loading]);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => {
        const cat = p.category || '其他';
        if (cat === activeCategory) return true;
        
        // Mapping for backward compatibility or user preference
        if (activeCategory === '秘傳禽饌' && (cat === '雞肉類' || cat === '雞肉')) return true;
        if (activeCategory === '豚肉逸品' && (cat === '豬肉類' || cat === '豬肉')) return true;
        if (activeCategory === '金玉良緣' && (cat === '蛋類' || cat === '蛋' || cat === '雞蛋')) return true;
        if (activeCategory === '禪風蔬食' && (cat === '蔬菜類' || cat === '蔬菜')) return true;
        
        return false;
      });

  return (
    <div className="pt-24 min-h-screen bg-background-dark pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-[0.4em] text-sm uppercase mb-4 block">Artisan Menu</span>
          <h1 className="font-calligraphy text-5xl md:text-6xl text-white mb-6">職人菜單</h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full border transition-all duration-300 text-sm tracking-widest ${
                activeCategory === category
                  ? 'bg-primary text-background-dark border-primary font-bold'
                  : 'bg-transparent text-gray-400 border-white/10 hover:border-primary/50 hover:text-white'
              }`}
            >
              {category === 'all' ? '全部' : category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                onClick={() => onNavigate('detail', product.id)}
                className="group bg-ink-black/40 border border-white/5 rounded-sm overflow-hidden hover:shadow-[0_0_20px_rgba(213,167,118,0.2)] hover:border-primary transition-all duration-500 relative cursor-pointer flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    src={product.imageUrl} 
                  />
                  {product.tag && (
                    <div className="absolute top-4 right-4 bg-primary text-background-dark px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest">
                      {product.tag}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-calligraphy text-2xl font-normal group-hover:text-primary transition-colors">{product.name}</h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-serif flex-1">
                    {product.description || "職人手作，經典美味。"}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-brand text-xl text-primary font-bold">NT$ {product.price}</span>
                    <button className="size-10 rounded-full border border-primary/40 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all">
                      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
