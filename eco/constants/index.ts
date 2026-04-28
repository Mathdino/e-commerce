export const COLORS = {
  primary: "#111111",
  secondary: "#666666",
  background: "#FFFFFF",
  surface: "#F7F7F7",
  accent: "#FF4C3B",
  border: "#EEEEEE",
  error: "#FF4444",
};

export const CATEGORIES = [
  { id: 1, name: "Men", icon: "man-outline" },
  { id: 2, name: "Women", icon: "woman-outline" },
  { id: 3, name: "Kids", icon: "happy-outline" },
  { id: 4, name: "Shoes", icon: "footsteps-outline" },
  { id: 5, name: "Bags", icon: "briefcase-outline" },
  { id: 6, name: "Other", icon: "grid-outline" },
];

export const PROFILE_MENU = [
  { id: 1, title: "Meus Pedidos", icon: "receipt-outline", route: "/orders" },
  {
    id: 2,
    title: "Endereços",
    icon: "location-outline",
    route: "/addresses",
  },
  { id: 4, title: "Minhas Avaliações", icon: "star-outline", route: "/" },
  { id: 5, title: "Configurações", icon: "settings-outline", route: "/" },
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case "separado":
      return "bg-yellow-50 text-yellow-900";
    case "processando":
      return "bg-indigo-50 text-indigo-900";
    case "enviado":
      return "bg-purple-50 text-purple-900";
    case "entregue":
      return "bg-green-50 text-green-900";
    case "cancelado":
      return "bg-red-50 text-red-900";
    default:
      return "bg-gray-50 text-gray-900";
  }
};
