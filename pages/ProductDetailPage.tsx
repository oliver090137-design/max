
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Product } from "../types";
import { useCart } from "../contexts/CartContext";

interface ProductDetailPageProps {
  onNavigate: (page: 'home' | 'detail' | 'menu' | 'admin', productId?: string) => void;
  productId: string | null;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onNavigate, productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('single');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "menu", productId), (doc) => {
      if (doc.exists()) {
        setProduct({ id: doc.id, ...doc.data() } as Product);
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  const getPrice = () => {
    if (!product) return 0;
    switch (selectedSize) {
      case 'family':
        return product.price * 3;
      case 'bulk':
        return product.price * 5;
      default:
        return product.price;
    }
  };

  const currentPrice = getPrice();

  const handleAddToCart = () => {
    if (product) {
      // Pass the calculated price for the bundle to the cart
      // Note: The cart logic might need to be adjusted if it recalculates price based on unit price.
      // For now, assuming addToCart takes the product and we might need to handle the price difference there or here.
      // If addToCart uses product.price, then adding a 'family' item will just add 3 items at unit price?
      // Or is 'family' a separate SKU?
      // Based on previous CartContext, it stores product + quantity + size.
      // Let's check CartContext. 
      // CartContext calculates total based on item.price * quantity.
      // If we add a 'family' item, is quantity 1 (package) or 3 (units)?
      // Usually quantity is number of packages.
      // So we should probably override the price in the cart item if it differs from unit price, 
      // OR CartContext should know how to calculate price based on size.
      // But for this specific request "price didn't change with spec", I will update the displayed price.
      // And for the cart, I will create a modified product object with the correct price for the pack.
      
      const productWithPrice = {
        ...product,
        price: currentPrice
      };
      
      addToCart(productWithPrice, quantity, selectedSize);
      alert("已加入購物車！");
    }
  };

  if (loading) return <div className="pt-32 text-center text-white">載入中...</div>;
  if (!product) return <div className="pt-32 text-center text-white">找不到商品</div>;

  return (
    <div className="pt-24 max-w-7xl mx-auto px-6 pb-24">
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8 font-serif">
        <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors">首頁</button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <button onClick={() => onNavigate('menu')} className="hover:text-primary transition-colors">精選菜單</button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-200">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative group aspect-[4/5] rounded-xl overflow-hidden bg-slate-800 shadow-2xl">
            <img 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              src={product.imageUrl} 
            />
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            {product.tag && (
              <div className="border-2 border-[#b22222] text-[#b22222] px-2 py-0.5 rounded-sm font-black text-xs rotate-[-3deg] shadow-inner bg-[#b22222]/5">
                🔥 {product.tag}
              </div>
            )}
            <div className="flex items-center gap-1 text-primary">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-sm fill-1">star</span>
              ))}
              <span className="text-slate-300 text-xs font-medium ml-1">{product.rating || 5.0} ({product.reviewCount || 0} 則評價)</span>
            </div>
          </div>

          <h1 className="text-5xl lg:text-7xl font-calligraphy mb-4 leading-tight text-white drop-shadow-[0_2px_10px_rgba(213,167,118,0.2)]">{product.name}</h1>
          <p className="text-slate-400 text-lg mb-6 leading-relaxed border-l-2 border-primary/30 pl-4 italic font-serif">
            {product.description || "職人手作，經典美味。"}
          </p>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl font-bold text-white">NT$ {currentPrice}</span>
          </div>

          <div className="space-y-6 mb-10">
            <div>
              <h3 className="text-sm font-semibold tracking-widest text-slate-400 mb-4 uppercase">選擇包裝規格</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'single', name: '單包裝', desc: '1入' },
                  { id: 'family', name: '家庭包', desc: '3入' },
                  { id: 'bulk', name: '囤貨包', desc: '5入' },
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
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-primary hover:bg-primary/90 text-background-dark h-14 rounded-lg shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined text-xl">bolt</span>
                  <span className="font-calligraphy text-2xl tracking-widest pt-1">立即購買</span>
                </button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full border-2 border-primary text-primary hover:bg-primary/10 h-14 rounded-lg transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              <span className="font-calligraphy text-2xl tracking-widest pt-1">加入購物車</span>
            </button>
          </div>
        </div>
      </div>
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
