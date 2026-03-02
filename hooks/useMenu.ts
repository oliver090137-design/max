import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';

export const useMenu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 建立查詢，可以加入排序條件，例如依照價格排序
    // const q = query(collection(db, 'menu'), orderBy('price'));
    const q = collection(db, 'menu');

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const menuData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(menuData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching menu:', err);
        setError(err);
        setLoading(false);
      }
    );

    // 清除監聽器
    return () => unsubscribe();
  }, []);

  return { products, loading, error };
};
