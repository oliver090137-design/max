
import React from 'react';

interface HeaderProps {
  onNavigate: (page: 'home' | 'detail' | 'live') => void;
  activePage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, activePage }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background-dark/90 backdrop-blur-md border-b border-primary/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="size-10 text-primary group-hover:scale-110 transition-transform">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"></path>
              </svg>
            </div>
            <h1 className="font-calligraphy text-2xl sm:text-3xl font-bold tracking-widest text-primary pt-1">貓掌櫃</h1>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-[0.2em]">
            <button 
              onClick={() => onNavigate('home')} 
              className={`hover:text-primary transition-colors ${activePage === 'home' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-300'}`}
            >
              首頁
            </button>
            <button className="hover:text-primary transition-colors text-gray-300">商店</button>
            <button 
              onClick={() => onNavigate('live')} 
              className={`hover:text-primary transition-colors ${activePage === 'live' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-300'}`}
            >
              直播中心
            </button>
            <button className="hover:text-primary transition-colors text-gray-300">巡迴地圖</button>
          </nav>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 text-lg">search</span>
            <input 
              className="bg-ink-black/50 border border-primary/20 rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none w-32 md:w-40 transition-all focus:w-48 lg:focus:w-56 text-white" 
              placeholder="搜尋美味..." 
              type="text" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-primary text-background-dark font-bold rounded-full hover:bg-white transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-xl">account_circle</span>
            <span className="text-xs tracking-tighter hidden sm:inline">會員登入</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
