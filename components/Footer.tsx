
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-dark border-t border-primary/20 py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12 sm:gap-16 relative z-10">
        <div className="max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-10 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="font-calligraphy text-3xl font-bold tracking-widest text-primary pt-1">貓掌櫃</h2>
          </div>
          <p className="text-sm text-gray-500 leading-loose mb-8 font-serif">傳承職人靈魂的琥珀色滷味。品質、工藝，以及深夜裡最真摯的暖心慰藉。每一口慢火細熬，都是對生活的溫柔禮讚。</p>
          <div className="flex gap-4">
            <button className="size-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all border border-white/10">
              <span className="material-symbols-outlined text-xl">share</span>
            </button>
            <button className="size-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all border border-white/10">
              <span className="material-symbols-outlined text-xl">camera_alt</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-16 w-full md:w-auto">
          <div>
            <h5 className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-6 sm:mb-8">產品菜單</h5>
            <ul className="space-y-4 text-sm text-gray-500 font-serif">
              <li><button className="hover:text-white transition-colors">經典牛饌</button></li>
              <li><button className="hover:text-white transition-colors">豚肉逸品</button></li>
              <li><button className="hover:text-white transition-colors">禪風蔬食</button></li>
              <li><button className="hover:text-white transition-colors">掌櫃大拼盤</button></li>
            </ul>
          </div>
          <div>
            <h5 className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-6 sm:mb-8">關於我們</h5>
            <ul className="space-y-4 text-sm text-gray-500 font-serif">
              <li><button className="hover:text-white transition-colors">品牌故事</button></li>
              <li><button className="hover:text-white transition-colors">直播現場</button></li>
              <li><button className="hover:text-white transition-colors">加盟合作</button></li>
              <li><button className="hover:text-white transition-colors">聯絡我們</button></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h5 className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-6 sm:mb-8">顧客服務</h5>
            <ul className="space-y-4 text-sm text-gray-500 font-serif">
              <li><button className="hover:text-white transition-colors">訂單查詢</button></li>
              <li><button className="hover:text-white transition-colors">配送資訊</button></li>
              <li><button className="hover:text-white transition-colors">常見問題</button></li>
              <li><button className="hover:text-white transition-colors">服務條款</button></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 sm:mt-24 pt-10 border-t border-white/5 text-center text-[10px] text-gray-600 uppercase tracking-[0.3em]">
        © 2024 NEKO MASTER (貓掌櫃). ALL RIGHTS RESERVED. CRAFTED WITH AMBER SOUL & ARTISAN PRIDE.
      </div>
    </footer>
  );
};

export default Footer;
