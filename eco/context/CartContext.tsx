import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Product } from "@/constants/types";
import { useAuth } from "@clerk/expo";
import api from "@/constants/api";
import Toast from "react-native-toast-message";

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
  updateQuantity: (
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
  const { getToken, isSignedIn } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success && data.data) {
        const serverCart = data.data;
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
      }
    } catch (error) {
      console.error("Erro ao obter carrinho:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product, size: string) => {
    if (!isSignedIn) {
      return Toast.show({
        type: "error",
        text1: "Por favor, faça login para adicionar ao carrinho",
      });
    }
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await api.post(
        "/cart/add",
        {
          productId: product._id,
          size,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Erro ao adicionar ao carrinho",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string, size: string = "M") => {
    if (!isSignedIn) {
      return;
    }
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await api.delete(
        `/cart/item/${productId}?size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Erro ao remover do carrinho",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (
    productId: string,
    size: string = "M",
    quantity: number,
  ) => {
    if (!isSignedIn) return;
    if (quantity < 1) return;

    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await api.put(
        `/cart/item/${productId}`,
        {
          quantity,
          size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Erro ao atualizar quantidade do carrinho",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isSignedIn) {
      return;
    }
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await api.delete("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setCartItems([]);
        setCartTotal(0);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Erro ao limpar carrinho",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = cartItems.reduce((acc, cur) => acc + cur.quantity, 0);

  useEffect(() => {
    if (isSignedIn) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotal(0);
    }
  }, [isSignedIn]);

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
