export interface Advertisement {
  id: string;
  imageUrl: string;
  title: string;
  link?: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  tag?: string;
  description?: string;
  isFeatured?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    bankAccountLast4: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
  createdAt: any; // Firestore Timestamp
}
