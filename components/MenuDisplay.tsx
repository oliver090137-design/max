import React from 'react';
import { useMenu } from '../hooks/useMenu';

const MenuDisplay: React.FC = () => {
  const { products, loading, error } = useMenu();

  if (loading) return <div className="text-white p-4">載入中...</div>;
  if (error) return <div className="text-red-500 p-4">發生錯誤: {error.message}</div>;

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">菜單列表 (範例元件)</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="border border-white/20 p-4 rounded shadow bg-white/5">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-400 text-sm mb-2">{product.description}</p>
            <p className="text-primary font-bold mt-2">NT$ {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuDisplay;
