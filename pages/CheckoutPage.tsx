import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

interface CheckoutPageProps {
  onNavigate: (page: 'home' | 'detail' | 'menu' | 'admin' | 'checkout', productId?: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    bankAccountLast4: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentImage, setPaymentImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentImage = async () => {
      try {
        const docRef = doc(db, "settings", "payment");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPaymentImage(docSnap.data().imageUrl);
        }
      } catch (error) {
        console.error("Error fetching payment image:", error);
      }
    };
    fetchPaymentImage();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert("購物車是空的，無法結帳");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order object
      const order = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          bankAccountLast4: formData.bankAccountLast4,
        },
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          imageUrl: item.imageUrl,
        })),
        totalPrice: totalPrice,
        status: 'pending', // pending, confirmed, shipped, completed, cancelled
        createdAt: serverTimestamp(),
      };

      // Save to Firestore
      await addDoc(collection(db, "orders"), order);

      // Clear cart
      clearCart();

      // Show success message
      alert("訂單已送出！我們會盡快與您聯繫確認匯款資訊。");
      
      // Navigate to home
      onNavigate('home');
    } catch (error) {
      console.error("Error submitting order: ", error);
      alert("訂單送出失敗，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-calligraphy text-white mb-6">購物車是空的</h2>
        <button 
          onClick={() => onNavigate('menu')}
          className="px-8 py-3 bg-primary text-background-dark font-bold rounded hover:bg-white transition-colors"
        >
          前往選購
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      <h1 className="text-4xl font-calligraphy text-white mb-12 text-center">結帳資訊</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="bg-white/5 p-6 rounded-lg border border-white/10 h-fit">
          <h2 className="text-xl font-bold text-primary mb-6 border-b border-white/10 pb-4">訂單摘要</h2>
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                <div className="w-16 h-16 rounded bg-black/50 overflow-hidden shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-400">規格: {item.selectedSize === 'single' ? '單包裝' : item.selectedSize === 'family' ? '家庭包' : '囤貨包'}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-300">x {item.quantity}</span>
                    <span className="text-sm font-bold text-primary">NT$ {item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-white">總計</span>
            <span className="text-2xl font-bold text-primary">NT$ {totalPrice}</span>
          </div>
        </div>

        {/* Checkout Form */}
        <div>
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-8">
            <h3 className="text-primary font-bold text-lg mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined">info</span>
              匯款與出貨說明
            </h3>
            <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
              <li>請於下單後 24 小時內完成匯款，逾期將取消訂單。</li>
              <li><span className="text-white font-bold">匯款銀行：</span>貓掌櫃銀行 (888)</li>
              <li><span className="text-white font-bold">匯款帳號：</span>1234-5678-9012-3456</li>
              <li className="text-primary font-bold">我們將於收到訂單後，透過電話與您確認匯款資訊，確認無誤後即刻安排發貨。</li>
            </ul>
            {paymentImage && (
              <div className="mt-4 pt-4 border-t border-primary/20">
                <p className="text-white font-bold mb-2 text-sm">或掃描 QR Code 付款：</p>
                <div className="w-48 h-48 bg-white rounded-lg p-2 mx-auto md:mx-0">
                  <img src={paymentImage} alt="Payment QR Code" className="w-full h-full object-contain" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-300 mb-2">收件人姓名</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-ink-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                placeholder="請輸入真實姓名"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-300 mb-2">聯絡電話</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-ink-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                placeholder="09xx-xxx-xxx"
              />
              <p className="text-xs text-primary mt-1">* 電話確認完匯款發貨</p>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-bold text-gray-300 mb-2">寄送地址</label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-ink-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                placeholder="請輸入完整地址"
              />
            </div>

            <div>
              <label htmlFor="bankAccountLast4" className="block text-sm font-bold text-gray-300 mb-2">匯款帳號後四碼</label>
              <input
                type="text"
                id="bankAccountLast4"
                name="bankAccountLast4"
                required
                maxLength={4}
                pattern="\d{4}"
                value={formData.bankAccountLast4}
                onChange={handleInputChange}
                className="w-full bg-ink-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                placeholder="例如：1234"
              />
              <p className="text-xs text-gray-400 mt-1">請填寫您匯款帳戶的後四碼以便對帳</p>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-br from-primary to-[#b88a56] text-background-dark font-bold py-4 rounded shadow-lg hover:shadow-primary/20 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '處理中...' : '確認送出訂單'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
