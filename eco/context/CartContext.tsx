import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Product } from "@/constants/types";
import { dummyCart } from "@/assets/assets";

export type CartItem = {
  id: string;
  product: Product;
  productId: string;
  quantity: number;
  size: string;
  price: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string) => Promise<void>;
  removeFromCart: (itemId: string, size: string) => Promise<void>;
  updateCartQuantity: (
    itemId: string,
    size: string,
    quantity: number,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  itemCount: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  const fetchCart = async () => {
    setIsLoading(true);
    const serverCart = dummyCart;
    const mappedItems: CartItem[] = serverCart.items.map((item: any) => ({
      id: item.product._id,
      product: item.product,
      productId: item.product._id,
      quantity: item.quantity,
      size: item.size || "M",
      price: item.price,
    }));
    setCartItems(mappedItems);
    setCartTotal(serverCart.totalAmount);
    setIsLoading(false);
  };

  const addToCart = async (product: Product, size: string) => {};

  const removeFromCart = async (productId: string, size: string = "M") => {};

  const updateQuantity = async (
    productId: string,
    size: string,
    quantity: number,
  ) => {};

  const clearCart = async () => {};

  const itemCount = cartItems.reduce((acc, cur) => acc + cur.quantity, 0);

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
