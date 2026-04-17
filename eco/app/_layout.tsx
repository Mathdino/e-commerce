import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import "@/global.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CartProvider>
          <WishlistProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </WishlistProvider>
        </CartProvider>
      </GestureHandlerRootView>
      {/* Toast fora do GestureHandlerRootView e do Stack para ficar na camada mais alta */}
      <Toast topOffset={60} />
    </ClerkProvider>
  );
}
