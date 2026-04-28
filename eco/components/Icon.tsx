/**
 * Componente de ícone unificado — mapeia nomes Ionicons → Lucide React Native.
 * Use exatamente como usava <Ionicons name="..." size={...} color="..." />
 */
import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Box,
  Briefcase,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Circle,
  CloudUpload,
  CreditCard,
  Eye,
  EyeOff,
  Filter,
  Footprints,
  Heart,
  Home,
  Image as ImageIcon,
  LayoutGrid,
  LogOut,
  Mail,
  MapPin,
  Minus,
  PenLine,
  Pencil,
  Plus,
  Receipt,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Smile,
  Star,
  Store,
  Trash2,
  Upload,
  User,
  X,
  XCircle,
  Shirt,
  Rose,
} from "lucide-react-native";

type IconName =
  | "add"
  | "arrow-back"
  | "arrow-forward"
  | "bag-outline"
  | "briefcase-outline"
  | "card-outline"
  | "cart"
  | "cart-outline"
  | "cash-outline"
  | "checkmark"
  | "checkmark-circle"
  | "chevron-down"
  | "chevron-forward"
  | "close"
  | "close-circle"
  | "close-circle-outline"
  | "cloud-upload-outline"
  | "create-outline"
  | "cube-outline"
  | "ellipse"
  | "eye-off-outline"
  | "eye-outline"
  | "filter"
  | "footsteps-outline"
  | "grid-outline"
  | "happy-outline"
  | "heart"
  | "heart-outline"
  | "home"
  | "home-outline"
  | "image-outline"
  | "location-outline"
  | "log-out-outline"
  | "mail-outline"
  | "man-outline"
  | "pencil"
  | "pencil-outline"
  | "person"
  | "person-outline"
  | "receipt-outline"
  | "remove"
  | "search"
  | "search-outline"
  | "settings-outline"
  | "shopping-cart"
  | "star"
  | "star-outline"
  | "storefront-outline"
  | "trash-outline"
  | "woman-outline"
  | (string & {});

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: object;
  strokeWidth?: number;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  add: Plus,
  "arrow-back": ArrowLeft,
  "arrow-forward": ArrowRight,
  "bag-outline": ShoppingBag,
  "briefcase-outline": Briefcase,
  "card-outline": CreditCard,
  cart: ShoppingCart,
  "cart-outline": ShoppingCart,
  "cash-outline": Banknote,
  checkmark: Check,
  "checkmark-circle": CheckCircle,
  "chevron-down": ChevronDown,
  "chevron-forward": ChevronRight,
  close: X,
  "close-circle": XCircle,
  "close-circle-outline": XCircle,
  "cloud-upload-outline": CloudUpload,
  "create-outline": PenLine,
  "cube-outline": Box,
  ellipse: Circle,
  "eye-off-outline": EyeOff,
  "eye-outline": Eye,
  filter: Filter,
  "footsteps-outline": Footprints,
  "grid-outline": LayoutGrid,
  "happy-outline": Smile,
  heart: Heart,
  "heart-outline": Heart,
  home: Home,
  "home-outline": Home,
  "image-outline": ImageIcon,
  "location-outline": MapPin,
  "log-out-outline": LogOut,
  "mail-outline": Mail,
  "man-outline": User,
  pencil: Pencil,
  "pencil-outline": Pencil,
  person: User,
  "person-outline": User,
  "receipt-outline": Receipt,
  remove: Minus,
  search: Search,
  "search-outline": Search,
  "settings-outline": Settings,
  "shopping-cart": ShoppingCart,
  star: Star,
  "star-outline": Star,
  "storefront-outline": Store,
  "trash-outline": Trash2,
  "woman-outline": Rose,
  "shirt-outline": Shirt,
};

// Ícones que devem ser exibidos preenchidos (solid)
const FILLED_ICONS = new Set([
  "heart",
  "star",
  "ellipse",
  "person",
  "home",
  "cart",
]);

export default function Icon({
  name,
  size = 24,
  color = "#000",
  style,
  strokeWidth,
}: IconProps) {
  const LucideIcon = ICON_MAP[name];

  if (!LucideIcon) {
    if (__DEV__) console.warn(`[Icon] Ícone desconhecido: "${name}"`);
    return null;
  }

  const fill = FILLED_ICONS.has(name) ? color : "none";

  return (
    <LucideIcon
      size={size}
      color={color}
      fill={fill}
      strokeWidth={strokeWidth ?? 2}
    />
  );
}
