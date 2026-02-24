
import React, { useState } from 'react';

interface LivePageProps {
  onNavigate: (page: 'home' | 'detail' | 'live') => void;
}

const LivePage: React.FC<LivePageProps> = () => {
  const [messages, setMessages] = useState([
    { user: 'Diner_San_99', text: '這鴨翅的成色也太美了吧！', type: 'user' },
    { user: '職人貓掌櫃', text: '秘訣在於我們自家釀造的小量生產黑豆醬油。', type: 'host' },
    { user: 'Tofu_Lover_Tokyo', text: '請問下一波什麼時候可以下單？', type: 'user' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { user: 'Guest_User', text: input, type: 'user' }]);
    setInput('');
  };

  return (
    <div className="pt-24 max-w-[1440px] mx-auto px-6 pb-24 space-y-12">
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto lg:h-[600px]">
        {/* Stream Area */}
        <div className="lg:col-span-3 relative bg-black rounded-xl overflow-hidden shadow-2xl border border-white/5 group">
          <img 
            alt="Live Stream" 
            className="w-full h-full object-cover opacity-80" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxoMa_SQPeCRtweJCyttwYCasH4NK3wH6Ibu5dbH2OwxqA-Efe7txW0_bNp3RIySe0I8wkfabk-VPG4bVQVRtMfyAy6PKP_cbYpA2x2YpBtZJG9UgAMkjoBpJodqtXxcaJP23MOgrsztpQcg76qb-QTxWIDpM9S4t0XVW3jwqoZTLrxV-KHP1sPfXzgqYw7CCbowzQ8W4QaolULO2vSUm1B56zR7j30fe_eGrkY4VY6lxfVnC4-qiCh3LDYsr8UFO6RcyFRPjd9rY" 
          />
          <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
            <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-1 rounded flex items-center gap-1 tracking-wider animate-pulse">
              <span className="size-1.5 bg-white rounded-full"></span> 🔴 直播中
            </span>
            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">visibility</span> 2,456 觀看
            </span>
          </div>
          
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <div className="flex items-end justify-between">
              <div className="space-y-4 max-w-lg">
                <h2 className="text-4xl md:text-6xl font-normal drop-shadow-2xl text-primary font-calligraphy leading-tight">貓店長實境直播</h2>
                <div className="bg-black/40 backdrop-blur-sm p-3 rounded-lg border-l-4 border-primary">
                  <h3 className="text-xl font-bold text-white mb-1">深夜琥珀滷味的職人秘辛</h3>
                  <p className="text-white/80 text-sm">貓掌櫃正在為您展示招牌鴨翅的 48 小時慢火收汁工藝。</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-red-500/20 group-hover:border-red-500 transition-all">
                    <span className="material-symbols-outlined text-primary group-hover:text-red-500 transition-colors">favorite</span>
                  </div>
                  <span className="text-[10px] font-bold">12.8k</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className="size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">share</span>
                  </div>
                  <span className="text-[10px] font-bold">分享</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col bg-background-dark border border-white/10 rounded-xl overflow-hidden h-[500px] lg:h-full">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">forum</span> 即時互動
            </h3>
            <span className="material-symbols-outlined text-white/40 text-sm cursor-pointer">settings</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.type === 'host' ? 'items-end' : 'items-start'}`}>
                <span className={`text-[10px] font-bold mb-1 uppercase ${m.type === 'host' ? 'text-primary flex items-center gap-1' : 'text-white/40'}`}>
                  {m.type === 'host' && <span className="material-symbols-outlined text-[12px]">verified</span>}
                  {m.user}
                </span>
                <p className={`text-sm rounded-lg p-2 border ${m.type === 'host' ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/20 text-white'}`}>
                  {m.text}
                </p>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white/5 border-t border-white/10">
            <div className="relative">
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-sm focus:border-primary focus:ring-0 text-white" 
                placeholder="發送訊息..." 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                onClick={sendMessage}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="space-y-6">
        <h3 className="text-2xl font-normal border-b border-primary/20 pb-2 font-calligraphy text-primary tracking-widest">直播推薦商品</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <LiveProduct 
            name="招牌琥珀鴨翅" 
            price="480" 
            img="https://picsum.photos/200/200?random=21" 
            desc="12入分享包 • 經典香辣" 
          />
          <LiveProduct 
            name="極上絲綢滷豆腐" 
            price="220" 
            img="https://picsum.photos/200/200?random=22" 
            desc="500g 盒裝 • 鮮甜入味" 
          />
          <LiveProduct 
            name="職人手切牛腱心" 
            price="650" 
            img="https://picsum.photos/200/200?random=23" 
            desc="手工厚切 • 限量供應" 
          />
        </div>
      </section>

      {/* Schedule */}
      <section className="space-y-6">
        <h3 className="text-2xl font-normal border-b border-primary/20 pb-2 font-calligraphy text-primary tracking-widest">本週直播預告</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <ScheduleCard day="週三 20:00" title="台中夜市：傳統美味的新詮釋" active />
          <ScheduleCard day="週五 21:00" title="新品試吃：琥珀系列第二彈" />
          <ScheduleCard day="週日 15:00" title="大坑健行：山林間的午后食刻" />
          <ScheduleCard day="10/31 20:00" title="萬聖節深夜食堂：驚喜限定版" />
          <ScheduleCard day="11/01 19:00" title="暖冬系列：職人手作滷牛尾" />
        </div>
      </section>
    </div>
  );
};

const LiveProduct: React.FC<{ name: string; price: string; img: string; desc: string }> = ({ name, price, img, desc }) => (
  <div className="min-w-[300px] bg-[#1a1612] border border-white/5 rounded-xl overflow-hidden p-3 flex gap-4 hover:border-primary/50 transition-all group">
    <div className="size-24 rounded-lg overflow-hidden bg-white/5 shrink-0">
      <img alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={img} />
    </div>
    <div className="flex flex-col justify-between flex-1 py-1">
      <div>
        <h4 className="text-sm font-bold truncate">{name}</h4>
        <p className="text-[11px] text-white/40">{desc}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-primary font-bold text-sm">NT$ {price}</span>
        <button className="font-calligraphy bg-primary text-background-dark text-lg px-4 py-0.5 rounded-sm hover:brightness-110 transition-all shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          立即下單
        </button>
      </div>
    </div>
  </div>
);

const ScheduleCard: React.FC<{ day: string; title: string; active?: boolean }> = ({ day, title, active }) => (
  <div className="bg-[#1a1612] border border-white/5 rounded-xl p-5 space-y-4 hover:border-primary/30 transition-all relative overflow-hidden">
    <div className={`absolute -right-4 -top-4 opacity-5 rotate-12`}>
      <span className="material-symbols-outlined text-8xl">calendar_today</span>
    </div>
    <span className={`text-xs font-bold tracking-widest border-b pb-1 ${active ? 'text-primary border-primary/20' : 'text-white/40 border-white/10'}`}>
      {day}
    </span>
    <h4 className="font-bold text-sm h-10 line-clamp-2">{title}</h4>
    <div className="flex items-center justify-between pt-2">
      <div className="flex -space-x-2">
        <div className="size-6 rounded-full border border-background-dark bg-white/20"></div>
        <div className="size-6 rounded-full border border-background-dark bg-white/30"></div>
      </div>
      <button className="font-calligraphy flex items-center gap-1 px-4 py-1.5 rounded-full border border-primary/30 hover:bg-primary hover:text-background-dark transition-all text-sm">
        提醒我
      </button>
    </div>
  </div>
);

export default LivePage;
