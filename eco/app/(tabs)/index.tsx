import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { BANNERS } from "@/assets/assets";
import { useRouter } from "expo-router";
import { CATEGORIES } from "@/constants";
import CategoryItem from "@/components/CategoryItem";
import { Product } from "@/constants/types";
import ProductCart from "@/components/ProductCart";
import api from "@/constants/api";

const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("products");
      setProducts(data.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Falha ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    {
      id: "all",
      name: "Todos",
      icon: "grid",
    },
    ...CATEGORIES,
  ];

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <Header title="Forever" showMenu showCart showLogo />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View className="mb-6">
          <ScrollView
            onScroll={(e) => {
              const slide = Math.ceil(
                e.nativeEvent.contentOffset.x /
                  e.nativeEvent.layoutMeasurement.width,
              );
              if (slide !== activeBannerIndex) {
                setActiveBannerIndex(slide);
              }
            }}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            className="w-full h-40 rounded-xl"
            scrollEventThrottle={16}
          >
            {BANNERS.map((banner, index) => (
              <View
                key={index}
                className="relative w-full h-40 bg-gray-200 overflow-hidden"
                style={{ width: width - 28 }}
              >
                <Image
                  source={banner.image}
                  className="w-full h-40"
                  resizeMode="cover"
                />

                <View className="absolute inset-0 bg-black/40" />

                {/* <View className="absolute bottom-4 left-4 z-10">
                  <Text className="text-white text-2xl font-bold">
                    {banner.title}
                  </Text>
                  <Text className="text-white text-sm font-medium">
                    {banner.subtitle}
                  </Text>
                  <TouchableOpacity className="mt-2 bg-white px-4 py-2 rounded-full self-start">
                    <Text className="text-primary font-bold text-xs">
                      Get Now
                    </Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            ))}
          </ScrollView>
          {/*Paginação */}
          <View className="flex-row justify-center mt-3 gap-2">
            {BANNERS.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full ${index === activeBannerIndex ? "w-6 bg-primary" : "w-2 bg-gray-300"}`}
              />
            ))}
          </View>
        </View>

        {/* Categorias */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-primary">Categorias</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat: any) => (
              <CategoryItem
                key={cat.id}
                item={cat}
                isSelected={false}
                onPress={() =>
                  router.push({
                    pathname: "/shop",
                    params: { category: cat.id === "all" ? "" : cat.name },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* Produtos */}
        <View className="mb-8 mt-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-primary">Popular</Text>
            <TouchableOpacity onPress={() => router.push("/shop")}>
              <Text className="text-sm font-medium text-secondary">
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {products.slice(0, 4).map((product) => (
                <ProductCart key={product._id} product={product} />
              ))}
            </View>
          )}
        </View>

        {/* Noticias */}
        <View className="bg-gray-100 p-6 rounded-2xl mb-20 items-center">
          <Text className="text-2xl font-bold text-primary mb-2 text-center">
            Eleve Seu Estilo
          </Text>
          <Text className="text-secondary text-center mb-4">
            Siga nosso Instagram e ganhe 10% de desconto na sua primeira compra.
          </Text>
          <TouchableOpacity className="bg-primary w-4/5 py-3 rounded-full items-center">
            <Text className="text-white font-medium text-base">Siga Agora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
