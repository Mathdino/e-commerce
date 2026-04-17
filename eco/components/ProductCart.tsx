import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { ProductCardProps } from "@/constants/types";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCart({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product._id);

  return (
    <Link href={`/product/${product._id}`} asChild>
      <TouchableOpacity className="w-[48%] mb-4 bg-white rounded-lg overflow-hidden">
        <View className="relative h-56 w-full bg-gray-100">
          <Image
            source={{ uri: product.images?.[0] ?? "" }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/*Favoritos */}
          <TouchableOpacity
            className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-sm"
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={isLiked ? COLORS.accent : COLORS.primary}
            />
          </TouchableOpacity>

          {/* Features */}
          {product.isFeatured && (
            <View className="absolute top-2 left-2 bg-black py-1 px-2 rounded">
              <Text className="text-white text-xs font-bold uppercase">
                Promoção
              </Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View className="p-3">
          <View className="flex-row items-center mb-1">
            <Ionicons name="star" size={14} color="#Ffd700" />
            <Text className="text-xs ml-1 text-secondary">4.6</Text>
          </View>
          <Text
            className="text-sm font-medium text-primary mb-1"
            numberOfLines={1}
          >
            {product.name}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-base font-bold text-primary">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
