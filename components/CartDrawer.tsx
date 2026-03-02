import React from 'react';
import { useCart } from '../contexts/CartContext';

interface CartDrawerProps {
  onNavigate: (page: 'home' | 'detail' | 'menu' | 'admin' | 'checkout', productId?: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    onNavigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-background-dark border-l border-white/10 shadow-2xl flex flex-col h-full transform transition-transform duration-300">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-calligraphy text-2xl text-white">購物車</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <span className="material-symbols-outlined text-4xl mb-2">shopping_cart_off</span>
              <p>購物車是空的</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 bg-white/5 p-4 rounded-lg border border-white/5">
                <div className="w-20 h-20 rounded bg-black/50 overflow-hidden shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white truncate">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">規格: {item.selectedSize === 'single' ? '單包裝' : item.selectedSize === 'family' ? '家庭包' : '囤貨包'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">NT$ {item.price}</span>
                    <div className="flex items-center border border-white/10 rounded bg-black/20 h-8">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                        className="w-8 h-full flex items-center justify-center hover:text-white text-gray-400 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                        className="w-8 h-full flex items-center justify-center hover:text-white text-gray-400 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-white/10 bg-black/20">
          <div className="flex justify-between items-center mb-4 text-lg font-bold text-white">
            <span>總計</span>
            <span className="text-primary">NT$ {totalPrice}</span>
          </div>
          <button 
            className="w-full bg-primary text-background-dark font-bold py-4 rounded hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
          >
            前往結帳
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
