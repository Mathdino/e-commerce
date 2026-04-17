import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { ScrollView } from "react-native-gesture-handler";
import CartItem from "@/components/CartItem";

export default function Cart() {
  const { cartItems, cartTotal, removeFromCart, updateCartQuantity } =
    useCart();

  const router = useRouter();

  const shipping = 2.0;
  const total = cartTotal + shipping;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Meu carrinho" showBack />

      {cartItems.length > 0 ? (
        <>
          <ScrollView
            className="flex-1 px-4 mt-4"
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                onRemove={() => removeFromCart(item.id, item.size)}
                onUpdateQuantity={(q) =>
                  updateCartQuantity(item.id, item.size, q)
                }
              />
            ))}
          </ScrollView>

          {/* Total */}
          <View className="p-4 bg-white rounded-t-3xl shadow-sm">
            {/* Subtotal */}
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary">Subtotal</Text>
              <Text className="text-primary font-bold">
                R$ {cartTotal.toFixed(2).replace(".", ",")}
              </Text>
            </View>
            {/* Frete */}
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary">Frete</Text>
              <Text className="text-primary font-bold">
                R$ {shipping.toFixed(2).replace(".", ",")}
              </Text>
            </View>
            {/* Border */}
            <View className="h-[1px] bg-border mb-4" />
            {/* Total */}
            <View className="flex-row justify-between mb-6">
              <Text className="text-primary font-bold text-lg">Total</Text>
              <Text className="text-primary font-bold text-lg">
                R$ {total.toFixed(2).replace(".", ",")}
              </Text>
            </View>

            {/* Botão de comprar */}
            <TouchableOpacity
              className="bg-primary py-4 rounded-full items-center"
              onPress={() => router.push("/checkout")}
            >
              <Text className="text-white font-bold text-base">Comprar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-secondary text-lg mb-4">
            Você não tem nenhum item no carrinho.
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
