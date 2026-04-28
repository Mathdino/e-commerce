import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Product, WishlistContextType } from "@/constants/types";
import { useAuth } from "@clerk/expo";
import api from "@/constants/api";

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await api.get("/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(data.data);
    } catch (error) {
      console.log("[Wishlist] Erro ao buscar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product: Product) => {
    // Optimistic update
    setWishlist((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      return exists ? prev.filter((p) => p._id !== product._id) : [...prev, product];
    });

    try {
      const token = await getToken();
      const { data } = await api.post(
        `/wishlist/toggle/${product._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setWishlist(data.data);
    } catch (error) {
      console.log("[Wishlist] Erro ao atualizar favorito:", error);
      // Reverte em caso de erro
      fetchWishlist();
    }
  };

  const isInWishlist = (productId: string) =>
    wishlist.some((p) => p._id === productId);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isLoaded, isSignedIn]);

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
