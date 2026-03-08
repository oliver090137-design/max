import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Product, Order } from "../types";
import QRCode from "react-qr-code";

interface AdminPageProps {
  onNavigate: (page: 'home' | 'detail' | 'menu' | 'admin') => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'settings'>('menu');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [advertisements, setAdvertisements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  
  // Advertisement Form State
  const [adFormData, setAdFormData] = useState({
    imageUrl: '',
    title: '',
    link: '',
    order: 0
  });
  const [isUploadingAd, setIsUploadingAd] = useState(false);
  
  // Master Image State
  const [masterImage, setMasterImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Payment Image State
  const [paymentImage, setPaymentImage] = useState<string | null>(null);
  const [isUploadingPayment, setIsUploadingPayment] = useState(false);

  // Options State
  const [categories, setCategories] = useState<string[]>(["秘傳禽饌", "豚肉逸品", "金玉良緣", "禪風蔬食"]);
  const [tags, setTags] = useState<string[]>(["人氣首選", "店長推薦", "新品上市", "季節限定", "素食可食", "售完"]);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  // Content State
  const [siteContent, setSiteContent] = useState<Record<string, string>>({
    about: '',
    story: '',
    franchise: '',
    contact: '',
    delivery: '',
    faq: '',
    terms: ''
  });

  // Form State
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    category: '秘傳禽饌',
    imageUrl: '',
    description: '',
    tag: '',
    rating: 5.0,
    reviewCount: 0,
    isFeatured: false
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    // Fetch Menu
    const unsubscribeMenu = onSnapshot(collection(db, "menu"), (snapshot) => {
      const menuData: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(menuData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching menu:", error);
      setLoading(false);
    });

    // Fetch Orders
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribeOrders = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setOrders(ordersData);
    }, (error) => {
      console.error("Error fetching orders:", error);
    });

    // Fetch Master Image
    const fetchMasterImage = async () => {
      try {
        const docRef = doc(db, "settings", "master");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMasterImage(docSnap.data().imageUrl);
        }
      } catch (error) {
        console.error("Error fetching master image:", error);
      }
    };
    fetchMasterImage();

    // Fetch Payment Image
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

    // Fetch Site Content
    const fetchSiteContent = async () => {
      try {
        const docRef = doc(db, "settings", "content");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSiteContent(docSnap.data() as Record<string, string>);
        }
      } catch (error) {
        console.error("Error fetching site content:", error);
      }
    };
    fetchSiteContent();

    // Fetch Options (Categories & Tags)
    const fetchOptions = async () => {
      try {
        const docRef = doc(db, "settings", "options");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.categories && Array.isArray(data.categories)) setCategories(data.categories);
          if (data.tags && Array.isArray(data.tags)) setTags(data.tags);
        } else {
          // Initialize if not exists
          await setDoc(docRef, {
            categories: ["經典牛饌", "豚肉逸品", "禪風蔬食", "掌櫃大拼盤"],
            tags: ["人氣首選", "店長推薦", "新品上市", "季節限定", "素食可食", "售完"]
          });
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();

    // Fetch Advertisements
    const unsubscribeAds = onSnapshot(query(collection(db, "advertisements"), orderBy("order", "asc")), (snapshot) => {
      const adsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAdvertisements(adsData);
    });

    return () => {
      unsubscribeMenu();
      unsubscribeOrders();
      unsubscribeAds();
    };
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '888888') {
      setIsAuthenticated(true);
    } else {
      alert('密碼錯誤');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-24 min-h-screen bg-background-dark pb-24 text-white flex items-center justify-center">
        <div className="bg-white/5 p-8 rounded-lg border border-white/10 w-full max-w-md">
          <h1 className="font-calligraphy text-3xl text-primary text-center mb-8">後台登入</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">請輸入管理員密碼</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded px-4 py-3 text-white focus:border-primary outline-none text-center tracking-widest text-xl"
                placeholder="******"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-background-dark font-bold py-3 rounded hover:bg-white transition-colors"
            >
              登入
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full text-gray-400 hover:text-white text-sm"
            >
              返回首頁
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        
        setMasterImage(base64Data);
        
        // Save to Firestore
        await setDoc(doc(db, "settings", "master"), {
          imageUrl: base64Data,
          updatedAt: new Date().toISOString()
        });
        
        alert("職人形象更新成功！");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to update master image:", error);
      alert("更新失敗，請稍後再試。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePaymentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPayment(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        
        setPaymentImage(base64Data);
        
        // Save to Firestore
        await setDoc(doc(db, "settings", "payment"), {
          imageUrl: base64Data,
          updatedAt: new Date().toISOString()
        });
        
        alert("收款 QR Code 更新成功！");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to update payment image:", error);
      alert("更新失敗，請稍後再試。");
    } finally {
      setIsUploadingPayment(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) {
      alert("此分類已存在");
      return;
    }
    const updatedCategories = [...categories, newCategory.trim()];
    setCategories(updatedCategories);
    setNewCategory('');
    await setDoc(doc(db, "settings", "options"), { categories: updatedCategories }, { merge: true });
  };

  const handleRemoveCategory = async (category: string) => {
    if (!window.confirm(`確定要刪除分類「${category}」嗎？`)) return;
    const updatedCategories = categories.filter(c => c !== category);
    setCategories(updatedCategories);
    await setDoc(doc(db, "settings", "options"), { categories: updatedCategories }, { merge: true });
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    if (tags.includes(newTag.trim())) {
      alert("此標籤已存在");
      return;
    }
    const updatedTags = [...tags, newTag.trim()];
    setTags(updatedTags);
    setNewTag('');
    await setDoc(doc(db, "settings", "options"), { tags: updatedTags }, { merge: true });
  };

  const handleAddAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adFormData.imageUrl) {
      alert("請上傳廣告圖片");
      return;
    }
    try {
      if (editingAdId) {
        await updateDoc(doc(db, "advertisements", editingAdId), {
          ...adFormData,
          updatedAt: new Date().toISOString()
        });
        setEditingAdId(null);
        alert("廣告更新成功！");
      } else {
        await addDoc(collection(db, "advertisements"), {
          ...adFormData,
          createdAt: new Date().toISOString()
        });
        alert("廣告新增成功！");
      }
      setAdFormData({ imageUrl: '', title: '', link: '', order: advertisements.length + 1 });
    } catch (error) {
      console.error("Error saving advertisement:", error);
      alert("儲存失敗");
    }
  };

  const handleEditAd = (ad: any) => {
    setEditingAdId(ad.id);
    setAdFormData({
      imageUrl: ad.imageUrl,
      title: ad.title || '',
      link: ad.link || '',
      order: ad.order || 0
    });
    // Scroll to the ad form
    const adForm = document.getElementById('ad-management-form');
    if (adForm) {
      adForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelAdEdit = () => {
    setEditingAdId(null);
    setAdFormData({ imageUrl: '', title: '', link: '', order: advertisements.length + 1 });
  };

  const handleDeleteAd = async (id: string) => {
    if (window.confirm("確定要刪除此廣告嗎？")) {
      try {
        await deleteDoc(doc(db, "advertisements", id));
        alert("廣告已刪除");
      } catch (error) {
        console.error("Error deleting advertisement:", error);
        alert("刪除失敗，請稍後再試");
      }
    }
  };

  const handleAdImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!window.confirm(`確定要刪除標籤「${tag}」嗎？`)) return;
    const updatedTags = tags.filter(t => t !== tag);
    setTags(updatedTags);
    await setDoc(doc(db, "settings", "options"), { tags: updatedTags }, { merge: true });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
      const newData = {
        ...prev,
        [name]: name === 'price' || name === 'rating' || name === 'reviewCount' ? Number(val) : val
      };
      
      return newData;
    });
  };

  const handleContentChange = (key: string, value: string) => {
    setSiteContent(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveContent = async () => {
    try {
      await setDoc(doc(db, "settings", "content"), siteContent);
      alert("內容更新成功！");
    } catch (error) {
      console.error("Error saving content:", error);
      alert("儲存失敗");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, "menu", editingId), formData);
        alert("更新成功！");
        setEditingId(null);
      } else {
        await addDoc(collection(db, "menu"), formData);
        alert("新增成功！");
      }
      // Reset form
      setFormData({
        name: '',
        price: 0,
        category: categories[0] || '秘傳禽饌',
        imageUrl: '',
        description: '',
        tag: '',
        rating: 5.0,
        reviewCount: 0,
        isFeatured: false
      });
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("儲存失敗");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      description: product.description || '',
      tag: product.tag || '',
      rating: product.rating || 5.0,
      reviewCount: product.reviewCount || 0,
      isFeatured: product.isFeatured || false
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("確定要刪除這個品項嗎？")) {
      try {
        await deleteDoc(doc(db, "menu", id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("刪除失敗");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: 0,
      category: categories[0] || '經典牛饌',
      imageUrl: '',
      description: '',
      tag: '',
      rating: 5.0,
      reviewCount: 0,
      isFeatured: false
    });
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus
      });
      alert(`訂單狀態已更新為：${getStatusText(newStatus)}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("更新失敗");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("確定要刪除這筆訂單嗎？此操作無法復原。")) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        alert("訂單已刪除");
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("刪除失敗");
      }
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待處理';
      case 'confirmed': return '已確認';
      case 'shipped': return '已出貨';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'confirmed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'shipped': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-background-dark pb-24 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-calligraphy text-4xl text-primary">後台管理系統</h1>
          <button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-white">
            返回首頁
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-4 px-4 font-bold transition-colors relative ${activeTab === 'menu' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
          >
            菜單管理
            {activeTab === 'menu' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-4 font-bold transition-colors relative ${activeTab === 'orders' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
          >
            訂單管理
            {activeTab === 'orders' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-4 font-bold transition-colors relative ${activeTab === 'settings' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
          >
            商店設定
            {activeTab === 'settings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
          </button>
        </div>

        {activeTab === 'menu' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Forms */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Master Image Management */}
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h2 className="text-xl font-bold mb-6 text-primary border-b border-primary/20 pb-2">
                  職人形象管理
                </h2>
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] w-full bg-black/20 rounded-lg overflow-hidden border border-white/10">
                    {isGenerating && (
                      <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                        <div className="size-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-xs text-primary animate-pulse">上傳中...</p>
                      </div>
                    )}
                    <img 
                      src={masterImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB9pC1fIZYbIjdHhri0i0csCqBT-iBS4alBa_Pk61HWbgr-mgGiQD7k-iOeDqgYzsY7OVdgNPJJNpY1zMeaqLPLF_CAyvpAa-A1zbD_H3YwgCa-DKqRVBlo90Jbjt89FGTCBW_XLZeX_1gLSobGqIL6_qBeuKbG18lnNOh7TLQKKJcQ98RpnxvGvtGpSlHtdVkaUyUBJasUA2f8su-mRDU0vmZsywwr_0wHdtL14ZFkwQN_ZfiLgshc0gly2YLSftp0FlRkVOpm378"} 
                      alt="Master" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      id="admin-cat-upload"
                      disabled={isGenerating}
                    />
                    <label 
                      htmlFor="admin-cat-upload" 
                      className={`flex items-center justify-center gap-2 w-full py-3 border border-primary/40 rounded hover:bg-primary/10 transition-colors cursor-pointer ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <span className="material-symbols-outlined text-primary">upload</span>
                      <span className="text-sm font-bold text-primary">更換職人形象照</span>
                    </label>
                    <p className="text-[10px] text-gray-500 text-center mt-2">
                      上傳照片將直接更新至首頁
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Form */}
              <div className="bg-white/5 p-6 rounded-lg border border-white/10 sticky top-24">
                <h2 className="text-xl font-bold mb-6 text-primary border-b border-primary/20 pb-2">
                  {editingId ? '編輯品項' : '新增品項'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">品名</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">價格</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">分類</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">圖片</label>
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleInputChange}
                          required
                          placeholder="輸入圖片網址 或 拖拉圖片至此"
                          className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const file = e.dataTransfer.files?.[0];
                            if (file && file.type.startsWith('image/')) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const base64Data = reader.result as string;
                                setFormData(prev => ({ ...prev, imageUrl: base64Data }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                           <label htmlFor="product-image-upload" className="cursor-pointer text-gray-400 hover:text-primary p-1">
                              <span className="material-symbols-outlined text-lg">upload_file</span>
                           </label>
                           <input 
                              type="file" 
                              id="product-image-upload" 
                              accept="image/*" 
                              className="hidden"
                              onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                          const base64Data = reader.result as string;
                                          setFormData(prev => ({ ...prev, imageUrl: base64Data }));
                                      };
                                      reader.readAsDataURL(file);
                                  }
                              }}
                           />
                        </div>
                      </div>
                      {formData.imageUrl && (
                          <div className="relative w-full h-32 bg-black/20 rounded overflow-hidden border border-white/10 group">
                              <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                              <button 
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                              >
                                  <span className="material-symbols-outlined text-sm">close</span>
                              </button>
                          </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">描述</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">標籤 (選填)</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="tag"
                          value={formData.tag}
                          onChange={handleInputChange}
                          placeholder="例如：人氣首選"
                          className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                        />
                        {formData.tag && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tag: '' }))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                            title="清除標籤"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tag }))}
                            className={`text-xs px-2 py-1 rounded border transition-colors ${
                              formData.tag === tag 
                                ? 'bg-primary text-background-dark border-primary font-bold' 
                                : 'border-white/20 text-gray-400 hover:border-primary/50 hover:text-white'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">評分 (預設 5.0)</label>
                        <input
                          type="number"
                          step="0.1"
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-3 bg-black/20 border border-white/10 rounded px-3 py-2">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          name="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleInputChange}
                          className="size-4 rounded border-white/10 text-primary focus:ring-primary bg-black/40"
                        />
                        <label htmlFor="isFeatured" className="text-sm font-bold text-primary cursor-pointer">
                          職人精選 (顯示於首頁)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-background-dark font-bold py-3 rounded hover:bg-white transition-colors"
                    >
                      {editingId ? '更新品項' : '新增品項'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 border border-white/20 rounded hover:bg-white/10 transition-colors"
                      >
                        取消
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-2">
                目前菜單 ({products.length})
              </h2>
              
              {loading ? (
                <div className="text-center py-12">載入中...</div>
              ) : (
                <div className="space-y-4">
                  {products.map(product => (
                    <div key={product.id} className="bg-white/5 border border-white/5 rounded-lg p-4 flex gap-4 items-center hover:border-primary/30 transition-colors">
                      <div className="size-20 rounded bg-black/50 shrink-0 overflow-hidden">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{product.category}</span>
                          {product.tag && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">{product.tag}</span>}
                        </div>
                        <h3 className="font-bold text-lg truncate flex items-center gap-2">
                          {product.name}
                          {product.isFeatured && (
                            <span className="material-symbols-outlined text-primary text-sm fill-1">star</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">{product.description}</p>
                        <div className="text-primary font-bold mt-1">NT$ {product.price}</div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-white/10 rounded text-blue-400 transition-colors"
                          title="編輯"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-white/10 rounded text-red-400 transition-colors"
                          title="刪除"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'orders' ? (
          /* Orders Tab */
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-2">
              訂單列表 ({orders.length})
            </h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                目前沒有訂單
              </div>
            ) : (
              <div className="grid gap-6">
                {orders.map(order => (
                  <div key={order.id} className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-primary/30 transition-colors">
                    <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded text-xs font-bold border ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <span className="text-gray-400 text-sm">
                            訂單編號: {order.id.slice(0, 8)}...
                          </span>
                          <span className="text-gray-400 text-sm">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : '剛剛'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{order.customer.name}</h3>
                        <p className="text-gray-400 text-sm mb-1">{order.customer.phone}</p>
                        <p className="text-gray-400 text-sm">{order.customer.address}</p>
                        <p className="text-primary text-sm mt-2 font-bold">匯款後四碼: {order.customer.bankAccountLast4}</p>
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <label className="text-xs text-gray-500 uppercase tracking-widest">更新狀態</label>
                        <div className="flex gap-2">
                          <select 
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-primary outline-none flex-1"
                          >
                            <option value="pending">待處理</option>
                            <option value="confirmed">已確認</option>
                            <option value="shipped">已出貨</option>
                            <option value="completed">已完成</option>
                            <option value="cancelled">已取消</option>
                          </select>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors flex items-center justify-center"
                            title="刪除訂單"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-sm font-bold text-gray-400 mb-3">訂購商品</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 bg-black/20 p-3 rounded">
                            <div className="size-12 rounded bg-black/50 overflow-hidden shrink-0">
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="text-white font-bold text-sm">{item.name}</span>
                                <span className="text-white font-bold text-sm">NT$ {item.price * item.quantity}</span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>規格: {item.selectedSize === 'single' ? '單包裝' : item.selectedSize === 'family' ? '家庭包' : '囤貨包'}</span>
                                <span>x {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-4 pt-4 border-t border-white/10">
                        <span className="text-lg font-bold text-white mr-4">總金額</span>
                        <span className="text-2xl font-bold text-primary">NT$ {order.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Settings Tab */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Store QR Code */}
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <h2 className="text-xl font-bold mb-6 text-primary border-b border-primary/20 pb-2">
                商店 QR Code
              </h2>
              <div className="flex flex-col items-center gap-6">
                <div className="bg-white p-4 rounded-lg">
                  <QRCode value={window.location.origin} size={200} />
                </div>
                <div className="text-center">
                  <p className="text-gray-400 mb-2">掃描此 QR Code 即可進入商店首頁</p>
                  <p className="text-xs text-gray-500 break-all">{window.location.origin}</p>
                </div>
              </div>
            </div>

            {/* Payment QR Code */}
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <h2 className="text-xl font-bold mb-6 text-primary border-b border-primary/20 pb-2">
                收款 QR Code 設定
              </h2>
              <div className="space-y-4">
                <div className="relative aspect-square w-full max-w-sm mx-auto bg-black/20 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                  {isUploadingPayment && (
                    <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                      <div className="size-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-xs text-primary animate-pulse">上傳中...</p>
                    </div>
                  )}
                  {paymentImage ? (
                    <img 
                      src={paymentImage} 
                      alt="Payment QR" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-500 flex flex-col items-center">
                      <span className="material-symbols-outlined text-4xl mb-2">qr_code_scanner</span>
                      <p>尚未設定收款 QR Code</p>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePaymentImageUpload} 
                    className="hidden" 
                    id="payment-qr-upload"
                    disabled={isUploadingPayment}
                  />
                  <label 
                    htmlFor="payment-qr-upload" 
                    className={`flex items-center justify-center gap-2 w-full py-3 border border-primary/40 rounded hover:bg-primary/10 transition-colors cursor-pointer ${isUploadingPayment ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <span className="material-symbols-outlined text-primary">upload</span>
                    <span className="text-sm font-bold text-primary">
                      {paymentImage ? '更換收款 QR Code' : '上傳收款 QR Code'}
                    </span>
                  </label>
                  <p className="text-[10px] text-gray-500 text-center mt-2">
                    此 QR Code 將顯示於結帳頁面供客人掃描付款
                  </p>
                </div>
              </div>
            </div>

            {/* Category Management */}
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <h2 className="text-xl font-bold mb-6 text-primary border-b border-primary/20 pb-2 flex justify-between items-center">
                <span>分類管理</span>
                <button 
                  onClick={async () => {
                    if (window.confirm("確定要重置分類與標籤為預設值嗎？這將覆蓋目前的設定。")) {
                      const defaultCategories = ["經典牛饌", "豚肉逸品", "禪風蔬食", "掌櫃大拼盤"];
                      const defaultTags = ["人氣首選", "店長推薦", "新品上市", "季節限定", "素食可食", "售完"];
                      await setDoc(doc(db, "settings", "options"), {
                        categories: defaultCategories,
                        tags: defaultTags
                      });
                      setCategories(defaultCategories);
                      setTags(defaultTags);
                      alert("已重置為預設值");
                    }
                  }}
                  className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/30 transition-colors"
                >
                  重置預設
                </button>
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="輸入新分類名稱"
                    className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                  />
                  <button
                    onClick={handleAddCategory}
                    disabled={!newCategory.trim()}
                    className="bg-primary text-background-dark font-bold px-4 rounded hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    新增
                  </button>
                </div>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat} className="flex items-center justify-between bg-black/20 p-3 rounded border border-white/5">
                      <span>{cat}</span>
                      <button
                        onClick={() => handleRemoveCategory(cat)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="刪除分類"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Management */}
            <div className="bg-white/5 p-6 rounded-lg border border-white/10 lg:col-span-2">
              <h2 className="text-xl font-bold mb-6 text-primary border-b border-primary/20 pb-2 flex justify-between items-center">
                <span>內容管理 (關於我們 / 服務條款)</span>
                <button 
                  onClick={handleSaveContent}
                  className="bg-primary text-background-dark font-bold px-6 py-2 rounded hover:bg-white transition-colors"
                >
                  儲存所有內容
                </button>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">關於我們 / 品牌故事</label>
                    <textarea
                      value={siteContent.story}
                      onChange={(e) => handleContentChange('story', e.target.value)}
                      rows={6}
                      placeholder="輸入品牌故事內容..."
                      className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">浪愛回甘計畫</label>
                    <textarea
                      value={siteContent.franchise}
                      onChange={(e) => handleContentChange('franchise', e.target.value)}
                      rows={4}
                      placeholder="輸入浪愛回甘計畫資訊..."
                      className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">聯絡我們</label>
                    <textarea
                      value={siteContent.contact}
                      onChange={(e) => handleContentChange('contact', e.target.value)}
                      rows={4}
                      placeholder="輸入聯絡資訊..."
                      className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">配送資訊</label>
                    <textarea
                      value={siteContent.delivery}
                      onChange={(e) => handleContentChange('delivery', e.target.value)}
                      rows={4}
                      placeholder="輸入配送說明..."
                      className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">常見問題 (FAQ)</label>
                    <textarea
                      value={siteContent.faq}
                      onChange={(e) => handleContentChange('faq', e.target.value)}
                      rows={6}
                      placeholder="輸入常見問題解答..."
                      className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">服務條款</label>
                    <textarea
                      value={siteContent.terms}
                      onChange={(e) => handleContentChange('terms', e.target.value)}
                      rows={4}
                      placeholder="輸入服務條款內容..."
                      className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tag Management */}
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <h2 className="text-xl font-bold mb-6 text-primary border-b border-primary/20 pb-2">
                標籤管理
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="輸入新標籤名稱"
                    className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                  />
                  <button
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    className="bg-primary text-background-dark font-bold px-4 rounded hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    新增
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <div key={tag} className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded border border-white/5">
                      <span className="text-sm">{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-red-400 hover:text-red-300 flex items-center"
                        title="刪除標籤"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Advertisement Management */}
            <div id="ad-management-form" className="bg-white/5 p-6 rounded-lg border border-white/10 lg:col-span-2">
              <h2 className="text-xl font-bold mb-6 text-primary border-b border-primary/20 pb-2">
                首頁廣告管理 (3D 旋轉廣告)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={handleAddAd} className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-500">
                      {editingAdId ? '編輯廣告' : '新增廣告'}
                    </label>
                    {editingAdId && (
                      <button 
                        type="button" 
                        onClick={handleCancelAdEdit}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        取消編輯
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">廣告圖片 (可拖拉)</label>
                    <div 
                      className="relative aspect-video w-full bg-black/40 rounded-lg overflow-hidden border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors flex items-center justify-center group"
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAdFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    >
                      {adFormData.imageUrl ? (
                        <>
                          <img src={adFormData.imageUrl} alt="Ad Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setAdFormData(prev => ({ ...prev, imageUrl: '' }))}
                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">add_photo_alternate</span>
                          <p className="text-xs text-gray-500">拖拉圖片至此 或 點擊上傳</p>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleAdImageUpload} 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">廣告標題</label>
                    <input
                      type="text"
                      value={adFormData.title}
                      onChange={(e) => setAdFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="例如：新品上市"
                      className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">連結 (選填)</label>
                    <input
                      type="text"
                      value={adFormData.link}
                      onChange={(e) => setAdFormData(prev => ({ ...prev, link: e.target.value }))}
                      placeholder="點擊廣告後跳轉的網址"
                      className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">排序</label>
                      <input
                        type="number"
                        value={adFormData.order}
                        onChange={(e) => setAdFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
                      />
                    </div>
                    <div className="flex items-end gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-primary text-background-dark font-bold px-8 py-2 rounded hover:bg-white transition-colors"
                      >
                        {editingAdId ? '更新廣告' : '新增廣告'}
                      </button>
                      {editingAdId && (
                        <button
                          type="button"
                          onClick={handleCancelAdEdit}
                          className="px-4 py-2 border border-white/20 rounded hover:bg-white/10 transition-colors"
                        >
                          取消
                        </button>
                      )}
                    </div>
                  </div>
                </form>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400">目前廣告列表 ({advertisements.length})</h3>
                  <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                    {advertisements.map((ad) => (
                      <div key={ad.id} className="bg-black/20 border border-white/5 p-3 rounded flex gap-4 items-center group">
                        <div className="size-16 rounded overflow-hidden bg-black/40 shrink-0">
                          <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">#{ad.order}</span>
                            <h4 className="font-bold truncate text-sm">{ad.title || '未命名廣告'}</h4>
                          </div>
                          <p className="text-[10px] text-gray-500 truncate">{ad.link || '無連結'}</p>
                        </div>
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditAd(ad)}
                            className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded"
                            title="編輯廣告"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteAd(ad.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"
                            title="刪除廣告"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    {advertisements.length === 0 && (
                      <div className="text-center py-8 text-gray-600 border border-dashed border-white/5 rounded">
                        目前尚無廣告
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 italic">
                    * 廣告將以 3D 旋轉方式顯示於首頁。建議上傳 3:4 或 2:3 比例的圖片效果最佳。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
