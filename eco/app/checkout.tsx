import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { Address } from "@/constants/types";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import api from "@/constants/api";

export default function Checkout() {
  const { getToken } = useAuth();

  const { cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash");

  const shipping = 2.0;
  const tax = 0;
  const total = cartTotal + shipping + tax;

  const fetchAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const addrList = data.data;
      if (addrList.length > 0) {
        const defAddress =
          addrList.find((a: Address) => a.isDefault) || addrList[0];
        setSelectedAddress(defAddress);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Erro ao obter endereços",
      });
    } finally {
      setPageLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Por favor, adicione um endereço de entrega.",
      });
      return;
    }

    if (paymentMethod === "stripe")
      return Toast.show({
        type: "error",
        text1: "Info",
        text2: "Stripe não está disponível no momento.",
      });

    setLoading(true);
    try {
      const payload = {
        shippingAddress: selectedAddress,
        notes: "Nenhuma observação",
        paymentMethod: "cash",
      };

      const token = await getToken();
      const { data } = await api.post("/orders", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        await clearCart();
        Toast.show({
          type: "success",
          text1: "Pedido realizado com sucesso!",
        });
        router.replace("/orders");
      }
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Erro ao realizar pedido",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (pageLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Checkout" showBack />

      <ScrollView className="flex-1 px-4 mt-4">
        {/** Endereço de entrega */}
        <Text className="text-lg font-bold text-primary mb-4">
          Endereço de entrega
        </Text>
        {selectedAddress ? (
          <View className="bg-white p-4 rounded-xl mb-6 shadow-md">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-bold">
                {selectedAddress.type}
              </Text>
              <TouchableOpacity onPress={() => router.push("/addresses")}>
                <Text className="text-accent text-sm">Mudar</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center py-3 gap-2">
              <Ionicons
                name="location-outline"
                size={20}
                color={COLORS.secondary}
              />
              <View>
                <Text className="text-secondary leading-5">
                  {selectedAddress.street}, {selectedAddress.city} {"\n"}
                  {selectedAddress.state}, {selectedAddress.zipCode} -{" "}
                  {selectedAddress.country}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/addresses")}
            className="bg-white p-6 rounded-xl mb-6 items-center justify-center border-dashed border-2 border-gray-100"
          >
            <Text className="text-primary font-bold">
              Adicione um endereço de entrega
            </Text>
          </TouchableOpacity>
        )}
        {/** Forma de pagamento */}
        <Text className="text-lg font-bold text-primary mb-4">
          Forma de pagamento
        </Text>

        <TouchableOpacity
          onPress={() => setPaymentMethod("cash")}
          className={`bg-white p-4 rounded-xl mb-4 shadow-sm flex-row items-center border-2 ${paymentMethod === "cash" ? "border-primary" : "border-transparent"}`}
        >
          <Ionicons
            name="cash-outline"
            size={24}
            color={COLORS.secondary}
            className="mr-3"
          />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-primary">
              Pagamento na Entrega
            </Text>
            <Text className="text-secondary text-xs mt-1">
              Pague ao receber o pedido.
            </Text>
          </View>
          {paymentMethod === "cash" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setPaymentMethod("stripe")}
          className={`bg-white p-4 rounded-xl mb-4 shadow-sm flex-row items-center border-2 ${paymentMethod === "stripe" ? "border-primary" : "border-transparent"}`}
        >
          <Ionicons
            name="card-outline"
            size={24}
            color={COLORS.secondary}
            className="mr-3"
          />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-primary">
              Pagamento com cartão
            </Text>
            <Text className="text-secondary text-xs mt-1">
              Pague com crédito ou débito.
            </Text>
          </View>
          {paymentMethod === "stripe" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
      </ScrollView>
      {/** Resumo do pedido */}
      <View className="p-4 bg-white shadow-lg border-t border-gray-100">
        <Text className="text-lg font-bold text-primary mb-4">
          Resumo do pedido
        </Text>

        {/* Subtotal */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-secondary">Subtotal</Text>
          <Text className="font-bold">
            R$ {cartTotal.toFixed(2).replace(".", ",")}
          </Text>
        </View>

        {/* Frete */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-secondary">Frete</Text>
          <Text className="font-bold">
            R$ {shipping.toFixed(2).replace(".", ",")}
          </Text>
        </View>

        {/* Taxa */}
        <View className="flex-row justify-between mb-4">
          <Text className="text-secondary">Taxa</Text>
          <Text className="font-bold">
            R$ {tax.toFixed(2).replace(".", ",")}
          </Text>
        </View>
        {/* Border */}
        <View className="h-[1px] bg-border mb-4" />
        {/* Total */}
        <View className="flex-row justify-between mb-6">
          <Text className="text-primary text-xl font-bold">Total</Text>
          <Text className="ext-primary text-xl font-bold">
            R$ {total.toFixed(2).replace(".", ",")}
          </Text>
        </View>
        {/* Button */}
        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={loading}
          className={`p-4 rounded-xl items-center ${loading ? "bg-gray-400" : "bg-primary"}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Fazer Pedido</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
