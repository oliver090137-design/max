
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface ContentPageProps {
  contentKey: string | null;
  onNavigate: (page: any) => void;
}

const ContentPage: React.FC<ContentPageProps> = ({ contentKey, onNavigate }) => {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const keyToTitle: Record<string, string> = {
    'story': '品牌故事',
    'franchise': '浪愛回甘計畫',
    'contact': '聯絡我們',
    'delivery': '配送資訊',
    'faq': '常見問題',
    'terms': '服務條款',
    'about': '關於我們'
  };

  useEffect(() => {
    if (!contentKey) return;
    
    setTitle(keyToTitle[contentKey] || '內容詳情');
    setLoading(true);

    const unsubscribe = onSnapshot(doc(db, "settings", "content"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setContent(data[contentKey] || '目前尚無內容。');
      } else {
        setContent('目前尚無內容。');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [contentKey]);

  if (!contentKey) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="text-gray-500">無效的內容路徑</p>
        <button onClick={() => onNavigate('home')} className="mt-4 text-primary underline">返回首頁</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background-dark">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h1 className="font-calligraphy text-5xl text-primary mb-4">{title}</h1>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 sm:p-12 shadow-2xl">
            <div className="font-serif text-gray-300 leading-loose whitespace-pre-wrap text-lg">
              {content}
            </div>
            
            <div className="mt-16 pt-8 border-t border-white/10 flex justify-center">
              <button 
                onClick={() => onNavigate('home')}
                className="px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-background-dark transition-all rounded-sm font-bold"
              >
                返回首頁
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPage;
