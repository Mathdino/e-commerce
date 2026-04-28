import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import ProductCart from "@/components/ProductCart";
import Icon from "@/components/Icon";
import { COLORS } from "@/constants";
import { F_BUTTON } from "@/assets/assets";

export default function Favorites() {
  const { wishlist, loading, toggleWishlist } = useWishlist();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Aguarda 600ms para dar feedback visual (a lista já é reativa)
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
        <Header
          titleImage={require("@/assets/images/favoritos-text.png")}
          showMenu
          showCart
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header
        titleImage={require("@/assets/images/favoritos-text.png")}
        showMenu
        showCart
      />

      {wishlist.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-6">
            <Icon name="heart-outline" size={44} color={COLORS.secondary} />
          </View>
          <Text className="text-primary font-bold text-xl mb-2 text-center">
            Nenhum favorito ainda
          </Text>
          <Text className="text-secondary text-center mb-8 leading-5">
            Toque no coração de qualquer produto para salvá-lo aqui e
            encontrá-lo rapidamente depois.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/shop")}
            className="bg-white px-8 py-3 rounded-full"
          >
            {/* Botão branco pill — F | Confira */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 50,
                paddingVertical: 6,
                paddingHorizontal: 14,
                gap: 6,
              }}
            >
              <Image
                source={F_BUTTON}
                style={{ width: 18, height: 18 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: "#111",
                  fontSize: 12,
                  fontWeight: "500",
                  letterSpacing: 0.3,
                }}
              >
                | Explorar Produtos
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListHeaderComponent={
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-secondary text-sm">
                {wishlist.length} {wishlist.length === 1 ? "item" : "itens"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  wishlist.forEach((p) => toggleWishlist(p));
                }}
                className="flex-row items-center gap-1"
              >
                <Icon name="trash-outline" size={14} color={COLORS.secondary} />
                <Text className="text-secondary text-sm">Limpar tudo</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => <ProductCart product={item} />}
        />
      )}
    </SafeAreaView>
  );
}
