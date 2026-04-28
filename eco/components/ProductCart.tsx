import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { ProductCardProps } from "@/constants/types";
import { Link } from "expo-router";
import Icon from "@/components/Icon";
import { COLORS } from "@/constants";
import { useWishlist } from "@/context/WishlistContext";

const PIX_DISCOUNT = 0.05;

function getCategoryName(category: ProductCardProps["product"]["category"]): string {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category.name ?? "";
}

function formatBRL(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export default function ProductCart({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product._id);

  const originalPrice = product.price;
  const pixPrice = originalPrice * (1 - PIX_DISCOUNT);
  const categoryName = getCategoryName(product.category);

  return (
    <Link href={`/product/${product._id}`} asChild>
      <TouchableOpacity
        className="w-[48%] mb-4 bg-white rounded-xl overflow-hidden"
        style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}
      >
        {/* Imagem */}
        <View className="relative w-full bg-gray-100" style={{ aspectRatio: 3 / 4 }}>
          <Image
            source={{ uri: product.images?.[0] ?? "" }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Favorito */}
          <TouchableOpacity
            className="absolute top-2 right-2 z-10"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
          >
            <Icon
              name={isLiked ? "heart" : "heart-outline"}
              size={22}
              color={isLiked ? COLORS.accent : "#fff"}
            />
          </TouchableOpacity>

          {/* Badge Promoção */}
          {product.isFeatured && (
            <View className="absolute top-2 left-2 bg-black py-0.5 px-2 rounded">
              <Text className="text-white text-xs font-bold uppercase">
                Promoção
              </Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View className="p-3">
          {/* Nome */}
          <Text className="text-sm font-bold text-primary mb-0.5" numberOfLines={2}>
            {product.name}
          </Text>

          {/* Categoria */}
          {categoryName !== "" && (
            <Text className="text-xs text-secondary mb-2">{categoryName}</Text>
          )}

          {/* Preço PIX */}
          <Text className="text-base font-bold text-primary leading-tight">
            R$ {formatBRL(pixPrice)}{" "}
            <Text className="text-xs font-normal text-secondary">no Pix</Text>
          </Text>

          {/* Preço original + badge */}
          <View className="flex-row items-center gap-2 mt-0.5">
            <Text className="text-xs text-secondary line-through">
              R$ {formatBRL(originalPrice)}
            </Text>
            <View className="bg-green-100 rounded px-1.5 py-0.5">
              <Text className="text-xs font-bold text-green-700">5% off</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
