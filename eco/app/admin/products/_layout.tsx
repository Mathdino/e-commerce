import { Stack } from "expo-router";
import { COLORS } from "@/constants";

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: COLORS.primary,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Produtos", headerShown: false }}
      />
      <Stack.Screen name="add" options={{ title: "Adicionar Produto" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Editar Produto" }} />
    </Stack>
  );
}
