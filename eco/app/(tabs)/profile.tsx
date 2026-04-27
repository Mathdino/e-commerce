import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS, PROFILE_MENU } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useClerk } from "@clerk/expo";

export default function Profile() {
  const { user, signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header
        titleImage={require("@/assets/images/perfil-text.png")}
        showBack
      />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={
          !user
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : { paddingTop: 16 }
        }
      >
        {!user ? (
          <View className="items-center w-full">
            <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-6">
              <Ionicons name="person" size={40} color={COLORS.secondary} />
            </View>
            <Text className="text-primary font-bold text-xl mb-2">
              Usuário não logado
            </Text>
            <Text className="text-secondary text-base mb-8 text-center w-80% px-4">
              Faça login para visualizar seu perfil, pedidos e endereços.
            </Text>
            <TouchableOpacity
              className="bg-primary w-[80%] py-3 rounded-full items-center shadow-lg"
              onPress={() => router.push("/sign-in")}
            >
              <Text className="text-white font-bold text-lg">
                Login / Cadastro
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Perfil do usuário */}
            <View className="items-center mb-8">
              <View className="mb-3">
                <Image
                  source={{ uri: user.imageUrl }}
                  className="size-20 border-2 border-white shadow-sm rounded-full"
                />
              </View>
              <Text className="text-xl font-bold text-primary">
                {user.firstName + " " + user.lastName}
              </Text>
              <Text className="text-secondary text-sm">
                {user.emailAddresses[0].emailAddress}
              </Text>

              {/* Painel ADMIN */}
              {user.publicMetadata?.role === "admin" && (
                <TouchableOpacity
                  onPress={() => router.push("/admin")}
                  className="mt-4 bg-primary text-white px-6 py-2 rounded-full"
                >
                  <Text className="text-white font-bold text-lg">
                    Painel Admin
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {/* Menu */}
            <View className="bg-white rounded-xl border border-gray-100/75 p-2 mb-4">
              {PROFILE_MENU.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  className={`flex-row items-center p-4 ${index !== PROFILE_MENU.length - 1 ? "border-b border-gray-100" : ""}`}
                  onPress={() => router.push(item.route as any)}
                >
                  <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-4">
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>
                  <Text className="text-primary font-medium flex-1">
                    {item.title}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.secondary}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Button Sair */}
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center justify-center p-4"
            >
              <Text className="text-red-500 font-bold ml-2">Sair</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
