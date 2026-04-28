import { View, TouchableOpacity, Text, Image, Animated } from "react-native";
import React, { useRef, useState } from "react";
import { HeaderProps } from "@/constants/types";
import { COLORS } from "@/constants";
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartContext";
import Icon from "@/components/Icon";
import DrawerMenu from "@/components/DrawerMenu";

const BAR_W = 22;
const BAR_H = 2;
const BAR_GAP = 6;

export default function Header({
  title,
  titleImage,
  showBack,
  showSearch,
  showCart,
  showMenu,
  showLogo,
}: HeaderProps) {
  const router = useRouter();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  /* Hamburger animation values */
  const anim = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    setMenuOpen(true);
    Animated.spring(anim, { toValue: 1, damping: 14, stiffness: 160, useNativeDriver: true }).start();
  };

  const closeMenu = () => {
    Animated.spring(anim, { toValue: 0, damping: 14, stiffness: 160, useNativeDriver: true }).start();
    setMenuOpen(false);
  };

  const toggleMenu = () => (menuOpen ? closeMenu() : openMenu());

  /* Top bar: rotate 45° + slide down to center */
  const topRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "45deg"] });
  const topY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_GAP + BAR_H] });

  /* Middle bar: fade out */
  const midOpacity = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [1, 0, 0] });

  /* Bottom bar: rotate -45° + slide up to center */
  const botRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "-45deg"] });
  const botY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -(BAR_GAP + BAR_H)] });

  return (
    <>
      <View style={{ backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12 }}>
        {/* Título absoluto — sempre centralizado */}
        {titleImage && (
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Image
              source={titleImage}
              style={{ height: 28, width: 180 }}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {/* Left */}
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            {showBack && (
              <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
                <Icon name="arrow-back" color={COLORS.primary} size={24} />
              </TouchableOpacity>
            )}

            {showMenu && (
              <TouchableOpacity onPress={toggleMenu} style={{ marginRight: 12 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <View style={{ width: BAR_W, height: BAR_H * 2 + BAR_GAP * 2, justifyContent: "center" }}>
                  <Animated.View style={{ width: BAR_W, height: BAR_H, backgroundColor: COLORS.primary, borderRadius: 2, position: "absolute", top: 0, transform: [{ translateY: topY }, { rotate: topRotate }] }} />
                  <Animated.View style={{ width: BAR_W, height: BAR_H, backgroundColor: COLORS.primary, borderRadius: 2, opacity: midOpacity, alignSelf: "center" }} />
                  <Animated.View style={{ width: BAR_W, height: BAR_H, backgroundColor: COLORS.primary, borderRadius: 2, position: "absolute", bottom: 0, transform: [{ translateY: botY }, { rotate: botRotate }] }} />
                </View>
              </TouchableOpacity>
            )}

            {!titleImage && (
              showLogo ? (
                <View style={{ flex: 1 }}>
                  <Image source={require("@/assets/logo.png")} style={{ width: "100%", height: 24 }} resizeMode="contain" />
                </View>
              ) : title ? (
                <Text className="text-xl font-bold text-primary text-center flex-1 mr-8">{title}</Text>
              ) : (
                <View style={{ flex: 1 }} />
              )
            )}
          </View>

          {/* Right */}
          <View>
            {showSearch && (
              <TouchableOpacity style={{ marginRight: 12 }}>
                <Icon name="search-outline" color={COLORS.primary} size={24} />
              </TouchableOpacity>
            )}
            {showCart && (
              <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
                <View style={{ position: "relative" }}>
                  <Icon name="bag-outline" color={COLORS.primary} size={24} />
                  <View style={{ position: "absolute", top: -4, right: -4, backgroundColor: COLORS.accent, width: 16, height: 16, borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{itemCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <DrawerMenu visible={menuOpen} onClose={closeMenu} />
    </>
  );
}
