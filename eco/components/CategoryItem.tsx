import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { CategoryItemProps } from "@/constants/types";
import Icon from "@/components/Icon";
import { COLORS } from "@/constants";

export default function CategoryItem({
  item,
  isSelected,
  onPress,
}: CategoryItemProps) {
  return (
    <TouchableOpacity className="mr-4 items-center" onPress={onPress}>
      <View
        className={`w-14 h-14 items-center rounded-full justify-center mb-2 ${isSelected ? "bg-primary" : "bg-surface"}`}
      >
        <Icon
          name={item.icon as any}
          size={24}
          color={isSelected ? "#fff" : COLORS.primary}
        />
      </View>
      <Text
        className={`text-xs font-medium ${isSelected ? "text-primary" : "text-secondary"}`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}
