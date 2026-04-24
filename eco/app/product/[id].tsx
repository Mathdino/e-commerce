import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Product } from "@/constants/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import api from "@/constants/api";

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { cartItems, addToCart, itemCount } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data);
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Erro ao buscar produto",
        text2: error.response?.data?.message || "Erro ao buscar produto",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Product não encontrado</Text>
      </SafeAreaView>
    );
  }

  const isLiked = isInWishlist(product._id);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      Toast.show({
        type: "info",
        text1: "Nenhum tamanho selecionado",
        text2: "Por favor, selecione um tamanho",
      });
      return;
    }
    await addToCart(product, selectedSize || "");
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/*Carrossel de Imagens */}
        <View className="relative h-[450px] bg-gray-100 mb-6">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const slide = Math.ceil(
                e.nativeEvent.contentOffset.x /
                  e.nativeEvent.layoutMeasurement.width,
              );
              setActiveImageIndex(slide);
            }}
          >
            {product.images?.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={{
                  width: width,
                  height: 450,
                }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {/* Button voltar e coração */}
          <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center z-10">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-white rounded-full items-center justify-center p-1"
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleWishlist(product)}
              className="w-10 h-10 bg-white rounded-full items-center justify-center p-1"
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? COLORS.accent : COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Paginação DOTS */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
            {product.images?.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full ${index === activeImageIndex ? "w-6 bg-primary" : "w-2 bg-gray-300"}`}
              ></View>
            ))}
          </View>
        </View>

        {/* Informações do Produto */}
        <View className="px-5">
          {/* Titulo e Raking */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl font-bold text-primary flex-1 mr-4">
              {product.name}
            </Text>
            <View className="flex-row justify-between items-center mb-2">
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text className="text-sm font-bold ml-1">4.6</Text>
              <Text className="text-sm text-secondary ml-1">(85)</Text>
            </View>
          </View>

          {/* Preço */}
          <Text className="text-2xl font-bold text-primary">
            R${product.price.toFixed(2).replace(".", ",")}
          </Text>
          {/* Descrição */}
          {product.sizes && product.sizes.length > 0 && (
            <>
              <Text className="text-base font-bold text-primary mb-2 mt-3">
                Tamanhos disponíveis:
              </Text>
              <View className="flex-row gap-3 mb-6 flex-wrap">
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => {
                      setSelectedSize(size);
                    }}
                    className={`w-12 h-12 rounded-full items-center justify-center border ${size === selectedSize ? "bg-primary border-primary" : "bg-white border-gray-100"} 
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${size === selectedSize ? "text-white" : "text-primary"}`}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Descrição do Produto */}
          <Text className="text-base font-bold text-primary mb-2">
            Descrição
          </Text>
          <Text className="text-secondary leading-6 mb-6">
            {product.description}
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 flex-row right-0 p-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          onPress={handleAddToCart}
          className="w-[80%] bg-primary py-4 rounded-full items-center shadow-lg flex-row justify-center m-auto"
        >
          <Ionicons name="bag-outline" size={20} color="white" />
          <Text className="text-base font-bold text-white ml-2">
            Adicionar ao carrinho
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/cart")}
          className="w-[20%] py-3 flex-row justify-center relative"
        >
          <Ionicons name="cart-outline" size={24} />
          <View className="absolute top-2 right-4 size-4 z-10 bg-black rounded-full justify-center items-center">
            <Text className="text-white text-[9px]">{itemCount}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
