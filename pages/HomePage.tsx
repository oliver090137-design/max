
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface HomePageProps {
  onNavigate: (page: 'home' | 'detail' | 'live') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [customMasterImage, setCustomMasterImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        // Use Gemini API to perform the image editing
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: file.type,
                },
              },
              {
                text: "Keep this cat's face and unique features. Place its head onto a professional chef's body. The cat should be wearing a tall, crisp white chef's hat. The setting should be a sophisticated, dark-toned restaurant kitchen with warm amber lighting. The style should be cinematic and high-detail, matching the existing brand aesthetic of 'Neko Master'.",
              },
            ],
          },
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setCustomMasterImage(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to customize master:", error);
      alert("客製化失敗，請稍後再試。");
    } finally {
      setIsGenerating(false);
    }
  };

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
                onClick={() => onNavigate('detail')}
                className="group px-12 py-5 bg-gradient-to-br from-primary to-[#b88a56] text-background-dark font-bold rounded-sm flex items-center gap-3 transition-all hover:scale-105 shadow-2xl"
              >
                <span className="font-calligraphy text-2xl tracking-widest">立即選購</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <button 
                onClick={() => onNavigate('live')}
                className="px-12 py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold rounded-sm flex items-center gap-3 hover:bg-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-red-500 fill-1">sensors</span>
                <span className="font-calligraphy text-2xl tracking-widest">觀看直播</span>
              </button>
            </div>
          </div>
        </div>
        <div className="kanji-bg top-20 -right-20 font-calligraphy opacity-20">匠</div>
      </section>

      {/* Product Selection & Sidebar Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row gap-16">
        <div className="flex-1">
          <div className="flex items-end justify-between mb-12 border-b border-primary/20 pb-6">
            <div>
              <h2 className="font-calligraphy text-5xl font-normal mb-2 text-primary">職人精選 • 經典滷味</h2>
              <p className="text-primary/40 text-xs tracking-[0.4em] uppercase font-brand">Artisan Selection</p>
            </div>
            <button className="text-primary hover:text-white flex items-center gap-1 text-sm font-bold tracking-widest transition-colors">
              完整菜單 <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <ProductCard 
              title="琥珀豬腱心" 
              price="580" 
              rating="482" 
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuCkCGEphu3VXt8gTjvqOAXEpRWyk7FopK6Hgkg_gaoiyWSiVZ2_lHyONfJnVHs5EAyARaaTpqiy7pOFcCiHAyjGyHAgZ1-ryzr-TfpGllhVD98YRJ301zTTD5d5jlYsCn9arHaPTLPbdyMm8hBqOBnUM6NyBs0xIrfxQLTu7aXqqnUqeFiH_OacYcMsELtbD4VajiTipaMA545EkS86c1pvZub6D10P4mEvL2TXf5SUDblrfZ0s-m78n7o-xn8KW_nkNTKvduUtdSE" 
              tag="人氣首選"
              onClick={() => onNavigate('detail')}
            />
            <ProductCard 
              title="黑金雞腿排" 
              price="380" 
              rating="156" 
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuDk-yf0gR2D1XrWGSsTQN_gdC2d4hkGGvok5_mXT43eUj1-QMF084-4GP3ySuT9Gvizr1RwnkTEuKgq3PGRWEO2t3FA0nYNrQN1AgZ7zGD1RAzkowwP2UmqRQPS96gOynUDLyK8vAKDpRbn2TSsgZjfhMGMKiY6TsQtVSTxq_y05teBXDQIrUByRBNYzwomlY22nnugZ9QigJ5KbilFlkq-SMQNWHStV8UhZVOTuawO1L8jAvn2Drt9hoB-gYPqQsxxEuOdopcY3UE"
              onClick={() => onNavigate('detail')}
            />
            <ProductCard 
              title="職人豆干" 
              price="180" 
              rating="293" 
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuBRegSGoAj2A_IMkjJTFMMd0hCYtfN-jhZFxo8HJKrNQbs0nCgkvt0mG0fyKLv5DluZ5Cj4Hq8ztBpHOPy5j2PUHGF0h3fMeTb-yYEyCkOqzB3Ghdql_WJ6YxLYR61ASiVM60E6TIhYidSKkrcBZVm5Y4UICu1l_xibWX7GPczOCanuRbnS27WkZCBEHcNbytW8sdhYF8KCpxlB0NeDulHRJJ5wwUlztQ7ayxmxNdwdEdW7f8XHQyOq48LX4OVB416HFUXiSTUUaVI"
              onClick={() => onNavigate('detail')}
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-8">
          <div className="bg-ink-black border border-primary/30 rounded-sm p-6 relative overflow-hidden wood-texture brush-texture">
            <div className="flex flex-col gap-4 mb-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-bold tracking-widest text-red-500">🔴 直播中</span>
                </div>
                <div className="flex items-center gap-1 text-primary/80">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span className="text-xs font-bold font-brand">1,284</span>
                </div>
              </div>
              <p className="text-xs font-bold text-primary/90 leading-relaxed">下次直播: <br/>週五 20:00 台中夜市巡禮</p>
            </div>
            <div 
              className="relative rounded-sm overflow-hidden aspect-video mb-6 border border-white/10 group cursor-pointer z-10"
              onClick={() => onNavigate('live')}
            >
              <img 
                alt="夜市巡禮" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvjtW1pBNSmwKRgMR7YP4Xe0NS8WMh9pNaZLbQ6K1LeZ8-zizBF6ZmV73EgQcnwao3Rt7triXxA0aUXLfy2v6Te4bxDjtrA91NkQoDbGWEIEVk0mvc--U1SdIqMP7MDufYFgwsfCaB_nB4vIY_bKSr8uRDltFPXwVFtezW8GfwfzJB88bhAyDKcicQMKDKF-j-m-of0J1wIn9VkLf3-BU_sp97Wf7sFyHCoCOgW_AAqqrm2-sJeD2Yq4nqYqRxP_3qzoatWn9BtgY" 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-5xl text-primary">play_circle</span>
              </div>
            </div>
            <h4 className="font-serif text-lg font-bold mb-2 relative z-10">台中夜市現場直播</h4>
            <p className="text-xs text-gray-400 mb-6 relative z-10">跟隨貓掌櫃的腳步，直擊深夜琥珀色滷味的製作過程。</p>
            <div className="border-t border-primary/20 pt-6 relative z-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-3 font-bold">新品上架倒數</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-white/5 rounded-sm py-2 text-center border border-white/5">
                  <span className="block text-lg font-brand font-bold">02</span>
                  <span className="text-[8px] uppercase text-gray-500">小時</span>
                </div>
                <div className="flex-1 bg-white/5 rounded-sm py-2 text-center border border-white/5">
                  <span className="block text-lg font-brand font-bold">45</span>
                  <span className="text-[8px] uppercase text-gray-500">分鐘</span>
                </div>
                <div className="flex-1 bg-white/5 rounded-sm py-2 text-center border border-white/5">
                  <span className="block text-lg font-brand font-bold">12</span>
                  <span className="text-[8px] uppercase text-gray-500">秒</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary text-background-dark rounded-sm p-6 relative overflow-hidden brush-texture shadow-xl">
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <span className="material-symbols-outlined">location_on</span>
              <h4 className="font-bold tracking-widest text-sm uppercase">尋找實體攤位</h4>
            </div>
            <div className="rounded-sm h-32 bg-background-dark/20 overflow-hidden mb-4 relative z-10 border border-background-dark/10">
              <img 
                alt="地圖" 
                className="w-full h-full object-cover opacity-40 grayscale" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZHS9qhtcao4QPm7__6lhVBqiI3AUBmWrRjpUZ_K8g7tC7qxygy9FJCP7IH2Y1tLeimcCi7eod3OMLn88H5axr4BfhvFNcwzvJRQy1zJQJzvCe_GyM50lruXWDSjJhQHD2quN-HrF_W1owDRPS9Ej4WOSSCywKhvSoxswrn_v7fkxtBi2PLcy2rtNzySsnXYFlWR33cJSaTXPMK1WFtHM1SG46A35Gs7FDxZmSz-9lQDbF9sfC6nHCxUuHo_gzq0pnVgTPBZtWcWc" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs font-serif font-bold tracking-[0.2em] border-b border-background-dark/30">查看全台巡迴路線</p>
              </div>
            </div>
            <button className="w-full py-3 border-2 border-background-dark text-background-dark font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-background-dark hover:text-white transition-colors relative z-10">
              門市地點查詢
            </button>
          </div>
        </aside>
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
            
            <div className="relative inline-block group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                id="cat-upload"
              />
              <label 
                htmlFor="cat-upload" 
                className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-primary/40 rounded-full cursor-pointer hover:bg-primary/20 hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined text-primary">auto_fix_high</span>
                <span className="text-sm font-bold tracking-widest text-white uppercase">換成我家的貓</span>
              </label>
              <div className="absolute -bottom-12 left-0 w-full text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">AI 職人換臉技術 • 保持背景服飾</p>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 relative group">
            <div className="relative z-10 rounded-sm overflow-hidden border border-primary/20 p-3 bg-background-dark/50 backdrop-blur-sm brush-texture">
              {isGenerating && (
                <div className="absolute inset-3 z-20 bg-background-dark/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 rounded-sm">
                  <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-calligraphy text-2xl text-primary animate-pulse">職人正在精修影像...</p>
                  <p className="text-xs text-gray-400 mt-2 font-serif">請稍候，貓掌櫃正在施展琥珀魔法</p>
                </div>
              )}
              <img 
                alt="貓掌櫃 職人概念圖" 
                className={`rounded-sm w-full h-[400px] sm:h-[600px] object-cover transition-all duration-1000 ${isGenerating ? 'opacity-30' : 'opacity-100'}`} 
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
