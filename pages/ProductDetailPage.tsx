
import React, { useState } from 'react';

interface ProductDetailPageProps {
  onNavigate: (page: 'home' | 'detail' | 'live') => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onNavigate }) => {
  const [selectedSize, setSelectedSize] = useState('single');
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="pt-24 max-w-7xl mx-auto px-6 pb-24">
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8 font-serif">
        <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors">首頁</button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <button className="hover:text-primary transition-colors">精選菜單</button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-200">琥珀豬腱心</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative group aspect-[4/5] rounded-xl overflow-hidden bg-slate-800 shadow-2xl">
            <img 
              alt="琥珀豬腱心" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoyROK-7MyhlsBFUI76Pzw_RM4gyPHBWUpHNVB5_WmpjgbljQGnj7MvgL1bVldHZJjjVrJuOCuUJ3_B14eo041SJG0qTszEK11T5-2Y_FRfHWJ6mr1gFkZhpKBx-deyB4JTj0eF4vhMZe2ymf40NGArPofCAXSy2fE5_VvEykoDIghacVP-rYMq99-NRciN5-4cKr1piH9wVOv9-94pQ086Z5AuA2SS2eLkxoFODPebVCnyx5-PzyrHd6gD8l9A3sDk7GU9VEZYdM" 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/10 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <img 
                  alt="產品細節" 
                  className="w-full h-full object-cover" 
                  src={`https://picsum.photos/400/400?random=${i + 10}`} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="border-2 border-[#b22222] text-[#b22222] px-2 py-0.5 rounded-sm font-black text-xs rotate-[-3deg] shadow-inner bg-[#b22222]/5">
              🔥 本週熱銷 NO.1
            </div>
            <div className="flex items-center gap-1 text-primary">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-sm fill-1">star</span>
              ))}
              <span className="text-slate-300 text-xs font-medium ml-1">4.9 (1,240 則評價)</span>
            </div>
          </div>

          <h1 className="text-5xl lg:text-7xl font-calligraphy mb-4 leading-tight text-white drop-shadow-[0_2px_10px_rgba(213,167,118,0.2)]">琥珀豬腱心</h1>
          <p className="text-slate-400 text-lg mb-6 leading-relaxed border-l-2 border-primary/30 pl-4 italic font-serif">
            職人手作豬腱心，採用貓掌櫃傳承 12 小時「深夜琥珀」密製滷汁，低溫慢火入味。
          </p>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl font-bold text-white">NT$ 80 <span className="text-lg font-normal text-slate-400">/ 150g</span></span>
            <span className="text-slate-500 line-through">NT$110</span>
          </div>

          <div className="space-y-6 mb-10">
            <div>
              <h3 className="text-sm font-semibold tracking-widest text-slate-400 mb-4 uppercase">選擇包裝規格</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'single', name: '單包裝', desc: 'NT$80/份' },
                  { id: 'family', name: '家庭包 (3入)', desc: '省$12' },
                  { id: 'bulk', name: '囤貨包 (5入)', desc: '省$40' },
                ].map(size => (
                  <button 
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`p-4 border rounded-xl bg-white/5 transition-all text-left ${selectedSize === size.id ? 'border-primary bg-primary/10' : 'border-white/10 hover:bg-white/10'}`}
                  >
                    <div className="text-sm font-bold mb-1">{size.name}</div>
                    <div className={`text-xs ${selectedSize === size.id ? 'text-primary font-medium' : 'text-slate-400'}`}>{size.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="space-y-2">
                <h3 className="text-xs font-semibold tracking-widest text-slate-400 uppercase">數量</h3>
                <div className="flex items-center border border-white/10 rounded-lg bg-white/5 h-12">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="w-10 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-full flex items-center justify-center hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 space-y-2 pt-6">
                <button className="w-full bg-primary hover:bg-primary/90 text-background-dark h-14 rounded-lg shadow-xl transition-all flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-xl">bolt</span>
                  <span className="font-calligraphy text-2xl tracking-widest pt-1">立即購買</span>
                </button>
              </div>
            </div>

            <button className="w-full border-2 border-primary text-primary hover:bg-primary/10 h-14 rounded-lg transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              <span className="font-calligraphy text-2xl tracking-widest pt-1">加入購物車</span>
            </button>
          </div>

          <div className="border-t border-white/10 pt-8 space-y-6">
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
              <div className="flex items-center gap-1.5 text-sm text-primary">
                <span className="material-symbols-outlined text-lg">redeem</span>
                <span className="font-medium">💝 滿$800免運</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-primary">
                <span className="material-symbols-outlined text-lg">verified_user</span>
                <span className="font-medium">🔒 7天鑑賞期</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <h4 className="font-bold">職人靈魂與獨門醬汁</h4>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-serif">
                「深夜琥珀」由 18 種漢方藥材與私房老抽調配而成。貓掌櫃親自監督，透過獨家真空熟成技術，確保每一塊豬腱心都達到完美的「鮮嫩 Q 彈」比例。
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommended Section */}
      <section className="mt-24">
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
          <h2 className="text-2xl font-serif flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            掌櫃推薦搭配
          </h2>
          <button className="text-primary text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
            查看完整菜單 <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <RecommendedItem title="黃金滷鵪鶉蛋" price="45" img="https://picsum.photos/400/533?random=5" />
          <RecommendedItem title="越光純米吟釀" price="180" img="https://picsum.photos/400/533?random=6" />
          <RecommendedItem title="絲路滷牛筋" price="120" img="https://picsum.photos/400/533?random=7" />
          <RecommendedItem title="辛口山葵漬黃瓜" price="35" img="https://picsum.photos/400/533?random=8" />
        </div>
      </section>
    </div>
  );
};

const RecommendedItem: React.FC<{ title: string; price: string; img: string }> = ({ title, price, img }) => (
  <div className="group cursor-pointer">
    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-800 mb-4 relative">
      <img alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={img} />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
      <button className="absolute bottom-4 right-4 bg-white text-background-dark p-2 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform">
        <span className="material-symbols-outlined">add_shopping_cart</span>
      </button>
    </div>
    <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors font-serif">{title}</h3>
    <p className="text-primary text-sm font-bold">NT${price}</p>
  </div>
);

export default ProductDetailPage;
