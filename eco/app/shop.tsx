import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Product } from "@/constants/types";
import { dummyProducts } from "@/assets/assets";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import ProductCart from "@/components/ProductCart";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const start = (pageNumber - 1) * 10;
      const end = start + 10;
      const paginatedData = dummyProducts.slice(start, end);
      if (pageNumber === 1) {
        setProducts(paginatedData);
      } else {
        setProducts((prev) => [...prev, ...paginatedData]);
      }

      setHasMore(end < dummyProducts.length);
      setPage(pageNumber);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && !loading && hasMore) {
      fetchProducts(page + 1);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-surface">
      <Header title="Loja" showBack showCart />

      <View className="flex-row gap-2 mb-3 mx-4 my-2">
        {/* Buscar Produtos */}
        <View className="flex-1 flex-row items-center bg-white rounded-xl border border-gray-100">
          <Ionicons
            name="search"
            className="ml-4"
            size={20}
            color={COLORS.secondary}
          />
          <TextInput
            className="flex-1 ml-2 text-primary px-4 py-3"
            placeholder="Buscar produtos..."
            returnKeyType="search"
            placeholderTextColor={COLORS.secondary}
          />
        </View>
        {/* Filtro */}
        <TouchableOpacity className="w-12 h-12 bg-gray-800 rounded-xl items-center justify-center">
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => <ProductCart product={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View className="py-4">
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-secondary">
                  Nenhum produto encontrado
                </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}
