
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Product } from "../types";
import { useMenu } from "../hooks/useMenu";

interface HomePageProps {
  onNavigate: (page: 'home' | 'detail' | 'menu' | 'admin', productId?: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [customMasterImage, setCustomMasterImage] = useState<string | null>(null);
  const { products, loading } = useMenu();

  useEffect(() => {
    // Fetch Master Image
    const unsubscribeMaster = onSnapshot(doc(db, "settings", "master"), (doc) => {
      if (doc.exists()) {
        setCustomMasterImage(doc.data().imageUrl);
      }
    });

    return () => {
      unsubscribeMaster();
    };
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 to-transparent z-10"></div>
          <img 
            alt="職人滷味盛合" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1Fjmnj7jjEchx0Cf6NWCFwK5hXI5-vuq-B1BGpn75CA88SlEUVSEqedYB9sfjIGyIAsH55FClk6ouww1vP-h_1sJDx-ZrsXAdAJSsTQhm-i6Xc6id-73GQ5RNHLii9IKnyydrYWAzPKiqSXF_V7gFsR6adMyl9dnOMt1yaEAbdNc4u4ZnRD-imtmA2308pHxPygkFcnQvFpSrwPYSaJTFqM3_n7P978D-IrfHGgOdmJ6l6t69FxmRR9BjyrjL6GtDe2eWD1dcAGU" 
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-20">
          <div className="max-w-3xl">
            <span className="font-serif text-primary text-xl mb-6 block tracking-[0.6em] font-bold">貓掌櫃 職人魂</span>
            <h1 className="font-calligraphy text-5xl md:text-8xl font-normal mb-8 leading-[1.2] amber-glow">「深夜的琥珀色慰藉，<br/>獻給懂吃的你」</h1>
            <p className="font-serif text-lg md:text-xl text-gray-300 mb-10 leading-relaxed border-l-2 border-primary pl-6">
              月光下的職人堅持，慢火細熬出極致醇香。<br/>
              由貓掌櫃親手打造，每一口都是對味蕾的溫柔致敬。
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => onNavigate('menu')}
                className="group px-12 py-5 bg-gradient-to-br from-primary to-[#b88a56] text-background-dark font-bold rounded-sm flex items-center gap-3 transition-all hover:scale-105 shadow-2xl"
              >
                <span className="font-calligraphy text-2xl tracking-widest">立即選購</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
        <div className="kanji-bg top-20 -right-20 font-calligraphy opacity-20">匠</div>
      </section>

      {/* Product Selection Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12 border-b border-primary/20 pb-6">
          <div>
            <h2 className="font-calligraphy text-5xl font-normal mb-2 text-primary">職人精選 • 經典滷味</h2>
            <p className="text-primary/40 text-xs tracking-[0.4em] uppercase font-brand">Artisan Selection</p>
          </div>
          <button 
            onClick={() => onNavigate('menu')}
            className="text-primary hover:text-white flex items-center gap-1 text-sm font-bold tracking-widest transition-colors"
          >
            完整菜單 <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <ProductCard 
                key={product.id}
                title={product.name} 
                price={product.price.toString()} 
                rating={product.rating?.toString() || "0"} 
                img={product.imageUrl} 
                tag={product.tag}
                onClick={() => onNavigate('detail', product.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Brand Story Section */}
      <section className="bg-ink-black py-24 sm:py-32 relative overflow-hidden">
        <div className="kanji-bg -left-24 bottom-0 font-calligraphy opacity-10">貓</div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 md:order-1 relative z-10">
            <h2 className="font-serif text-4xl sm:text-5xl font-black mb-8 leading-tight">職人之心<br/><span className="text-primary font-calligraphy text-6xl sm:text-7xl mt-2 block">Neko Master</span></h2>
            <p className="text-gray-400 mb-6 leading-relaxed text-lg font-serif">
              在蒸騰的熱氣與深琥珀色的滷汁背後，藏著傳承數代的美味秘辛。我們的品牌精神「貓掌櫃」，象徵著如貓般的優雅、精準與耐心。
            </p>
            <p className="text-gray-400 mb-12 leading-relaxed text-lg font-serif">
              每一份食材都在12種傳統辛香料調製的秘滷中慢火細熬 48 小時，確保每一口都能捕捉到深夜夜市的靈魂。這不僅僅是食物，更是一種深夜的療癒儀式。
            </p>
            <div className="flex flex-wrap items-center gap-8 sm:gap-12 mb-10">
              <div className="text-center">
                <span className="block text-4xl font-brand text-primary font-bold mb-1">48h</span>
                <span className="text-[10px] uppercase text-gray-500 tracking-[0.3em] font-bold">慢火細熬</span>
              </div>
              <div className="hidden sm:block w-px h-12 bg-primary/20"></div>
              <div className="text-center">
                <span className="block text-4xl font-brand text-primary font-bold mb-1">12+</span>
                <span className="text-[10px] uppercase text-gray-500 tracking-[0.3em] font-bold">秘製香料</span>
              </div>
              <div className="hidden sm:block w-px h-12 bg-primary/20"></div>
              <div className="text-center">
                <span className="block text-4xl font-brand text-primary font-bold mb-1">100%</span>
                <span className="text-[10px] uppercase text-gray-500 tracking-[0.3em] font-bold">職人手作</span>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 relative group">
            <div className="relative z-10 rounded-sm overflow-hidden border border-primary/20 p-3 bg-background-dark/50 backdrop-blur-sm brush-texture">
              <img 
                alt="貓掌櫃 職人概念圖" 
                className="rounded-sm w-full h-[400px] sm:h-[600px] object-cover" 
                src={customMasterImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB9pC1fIZYbIjdHhri0i0csCqBT-iBS4alBa_Pk61HWbgr-mgGiQD7k-iOeDqgYzsY7OVdgNPJJNpY1zMeaqLPLF_CAyvpAa-A1zbD_H3YwgCa-DKqRVBlo90Jbjt89FGTCBW_XLZeX_1gLSobGqIL6_qBeuKbG18lnNOh7TLQKKJcQ98RpnxvGvtGpSlHtdVkaUyUBJasUA2f8su-mRDU0vmZsywwr_0wHdtL14ZFkwQN_ZfiLgshc0gly2YLSftp0FlRkVOpm378"} 
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface ProductCardProps {
  title: string;
  price: string;
  rating: string;
  img: string;
  tag?: string;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, price, rating, img, tag, onClick }) => (
  <div 
    className="group bg-ink-black/40 border border-white/5 rounded-sm overflow-hidden hover:shadow-[0_0_20px_rgba(213,167,118,0.2)] hover:border-primary transition-all duration-500 relative cursor-pointer"
    onClick={onClick}
  >
    <div className="relative h-72 overflow-hidden">
      <img alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={img} />
      {tag && <div className="absolute top-4 right-4 bg-primary text-background-dark px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest">{tag}</div>}
    </div>
    <div className="p-8">
      <h3 className="font-calligraphy text-3xl font-normal mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <div className="flex items-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="material-symbols-outlined text-primary text-xs fill-1">star</span>
        ))}
        <span className="text-[10px] text-gray-500 ml-2 tracking-widest">({rating} 則評論)</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-brand text-2xl text-primary font-bold">NT$ {price}</span>
        <button className="size-11 rounded-full border border-primary/40 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all">
          <span className="material-symbols-outlined">add_shopping_cart</span>
        </button>
      </div>
    </div>
  </div>
);

export default HomePage;
