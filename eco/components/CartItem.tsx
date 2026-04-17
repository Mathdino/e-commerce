import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { CartItemProps } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";

export default function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  const imageUrl = item.product.images[0];

  return (
    <View className="flex-row mb-4 bg-white p-3 rounded-xl">
      <View className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-3">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="flex-1 justify-between">
        {/* Nome do produto e tamanho */}
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-primary text-sm font-medium mb-1">
              {item.product.name}
            </Text>
            <Text className="text-secondary text-xs">Tamanho: {item.size}</Text>
          </View>
          {/* Botão de remover */}
          <TouchableOpacity onPress={onRemove}>
            <Ionicons name="close-circle-outline" size={20} color="#ff4c3b" />
          </TouchableOpacity>
        </View>

        {/* Quantidade e preço */}
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-primary text-base font-bold">
            R$ {item.product.price.toFixed(2).replace(".", ",")}
          </Text>

          <View className="flex-row items-center bg-surface rounded-full px-2 py-1">
            <TouchableOpacity
              className="p-1"
              onPress={() =>
                onUpdateQuantity && onUpdateQuantity(item.quantity - 1)
              }
            >
              <Ionicons name="remove" size={16} color={COLORS.primary} />
            </TouchableOpacity>

            <Text className="text-primary mx-3 font-medium">
              {item.quantity}
            </Text>

            <TouchableOpacity
              className="p-1"
              onPress={() =>
                onUpdateQuantity && onUpdateQuantity(item.quantity + 1)
              }
            >
              <Ionicons name="add" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
