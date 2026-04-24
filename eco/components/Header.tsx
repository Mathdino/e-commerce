import { View, TouchableOpacity, Text, Image } from "react-native";
import React from "react";
import { HeaderProps } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartContext";

export default function Header({
  title,
  showBack,
  showSearch,
  showCart,
  showMenu,
  showLogo,
}: HeaderProps) {
  const router = useRouter();

  const { itemCount } = useCart();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white">
      {/* left */}
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" color={COLORS.primary} size={24} />
          </TouchableOpacity>
        )}

        {showMenu && (
          <TouchableOpacity className="mr-3">
            <Ionicons name="menu-outline" color={COLORS.primary} size={28} />
          </TouchableOpacity>
        )}

        {showLogo ? (
          <View className="flex-1">
            <Image
              source={require("@/assets/logo.png")}
              style={{ width: "100%", height: 24 }}
              resizeMode="contain"
            />
          </View>
        ) : (
          title && (
            <Text className="text-xl font-bold text-primary text-center flex-1 mr-8">
              {title}
            </Text>
          )
        )}

        {!title && !showSearch && <View className="flex-1"></View>}
      </View>

      {/* right */}
      <View>
        {showSearch && (
          <TouchableOpacity className="mr-3">
            <Ionicons name="search-outline" color={COLORS.primary} size={24} />
          </TouchableOpacity>
        )}

        {showCart && (
          <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
            <View className="relative">
              <Ionicons name="bag-outline" color={COLORS.primary} size={24} />
              <View className="absolute -top-1 -right-1 bg-accent w-4 h-4 rounded-full items-center justify-center">
                <Text className="text-white text-[10px] font-bold">
                  {itemCount}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
