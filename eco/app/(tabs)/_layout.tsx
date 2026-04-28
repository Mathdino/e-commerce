import { View, Text } from "react-native";
import React from "react";
import { Redirect, Tabs } from "expo-router";
import Icon from "@/components/Icon";
import { COLORS } from "@/constants";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@clerk/expo";

export default function TabLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { cartItems } = useCart();

  if (!isLoaded) return null;
  if (!isSignedIn && !__DEV__) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          //height: 56,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? "home" : "home-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="relative">
              <Icon
                name="cart-outline"
                color={color}
                size={26}
              />
              {cartItems?.length > 0 && (
                <View className="absolute -top-2 -right-2 bg-accent size-3 rounded-full" />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? "person" : "person-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}
