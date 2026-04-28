import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef } from "react";
import Icon from "@/components/Icon";
import { COLORS, CATEGORIES } from "@/constants";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/expo";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.78;

const MENU_ITEMS = [
  { label: "Início", icon: "home-outline", route: "/(tabs)" },
  { label: "Loja", icon: "storefront-outline", route: "/shop" },
  { label: "Pedidos", icon: "receipt-outline", route: "/orders" },
  { label: "Endereços", icon: "location-outline", route: "/addresses" },
  { label: "Favoritos", icon: "heart-outline", route: "/(tabs)/favorites" },
  { label: "Perfil", icon: "person-outline", route: "/(tabs)/profile" },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function DrawerMenu({ visible, onClose }: Props) {
  const router = useRouter();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 120,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const navigate = (route: string, params?: Record<string, string>) => {
    onClose();
    setTimeout(() => {
      if (params) {
        router.push({ pathname: route as any, params });
      } else {
        router.push(route as any);
      }
    }, 240);
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Overlay */}
      <Animated.View
        style={{ flex: 1, opacity: overlayAnim }}
        className="absolute inset-0 bg-black/50"
      >
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: DRAWER_WIDTH,
          transform: [{ translateX: slideAnim }],
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 4, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 16,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

          {/* Cabeçalho do drawer — usuário */}
          <View className="pt-14 pb-6 px-6 bg-primary">
            {isSignedIn && user ? (
              <View className="flex-row items-center gap-4">
                {user.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    style={{ width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: "#fff" }}
                  />
                ) : (
                  <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center">
                    <Icon name="person" size={28} color="#fff" />
                  </View>
                )}
                <View className="flex-1">
                  <Text className="text-white font-bold text-lg" numberOfLines={1}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text className="text-white/70 text-xs mt-0.5" numberOfLines={1}>
                    {user.emailAddresses[0]?.emailAddress}
                  </Text>
                </View>
              </View>
            ) : (
              <View>
                <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center mb-3">
                  <Icon name="person-outline" size={28} color="#fff" />
                </View>
                <Text className="text-white font-bold text-lg mb-1">Bem-vindo!</Text>
                <TouchableOpacity
                  onPress={() => navigate("/(auth)/sign-in")}
                  className="mt-2 self-start"
                >
                  <View className="flex-row items-center gap-1.5 bg-white/20 rounded-full px-4 py-1.5">
                    <Text className="text-white font-medium text-sm">Fazer login</Text>
                    <Icon name="arrow-forward" size={14} color="#fff" />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Navegação */}
          <View className="px-4 pt-4">
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.route}
                onPress={() => navigate(item.route)}
                activeOpacity={0.7}
                className="flex-row items-center gap-4 py-3.5 px-2 rounded-xl mb-0.5"
              >
                <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center">
                  <Icon name={item.icon as any} size={18} color={COLORS.primary} />
                </View>
                <Text className="text-primary font-medium text-base">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Divisor */}
          <View className="mx-6 my-3 h-px bg-gray-100" />

          {/* Categorias */}
          <View className="px-6 mb-4">
            <Text className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">
              Categorias
            </Text>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => navigate("/shop", { category: cat.name })}
                activeOpacity={0.7}
                className="flex-row items-center gap-3 py-2.5"
              >
                <Icon name={cat.icon as any} size={16} color={COLORS.secondary} />
                <Text className="text-secondary text-sm">{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Divisor */}
          <View className="mx-6 my-3 h-px bg-gray-100" />

          {/* Sair */}
          {isSignedIn && (
            <TouchableOpacity
              onPress={() => { onClose(); signOut(); }}
              activeOpacity={0.7}
              className="flex-row items-center gap-4 px-6 py-4 mb-6"
            >
              <Icon name="log-out-outline" size={20} color={COLORS.error} />
              <Text style={{ color: COLORS.error }} className="font-medium text-base">
                Sair
              </Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
