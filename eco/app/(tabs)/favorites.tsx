import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import ProductCart from "@/components/ProductCart";

export default function Favorites() {
  const { wishlist } = useWishlist();

  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Favoritos" showMenu showCart />

      {wishlist.length > 0 ? (
        <ScrollView
          className="flex-1 px-4 mt-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap justify-between">
            {wishlist.map((product) => (
              <ProductCart key={product._id} product={product} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-secondary text-lg mb-4">
            Você não tem nenhum item favoritado.
          </Text>
          <TouchableOpacity onPress={() => router.push("/")} className="mt-4">
            <View className="bg-primary text-white px-4 py-2 rounded-md">
              <Text className="text-white font-bold">Ir para a loja</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
