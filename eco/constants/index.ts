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
  { id: 7, name: "Camisa", value: "Camisa", icon: "shirt-outline" },
  { id: 4, name: "Chuteira", value: "Chuteira", icon: "footsteps-outline" },
  { id: 1, name: "Homem", value: "Homem", icon: "man-outline" },
  { id: 2, name: "Mulher", value: "Mulher", icon: "woman-outline" },
  { id: 3, name: "Infantil", value: "Infantil", icon: "happy-outline" },
  { id: 5, name: "Mochila", value: "Mochila", icon: "briefcase-outline" },
  { id: 6, name: "Outros", value: "Outros", icon: "grid-outline" },
];

/** Retorna o rótulo em português para um valor de categoria do backend */
export const getCategoryLabel = (value: string): string => {
  const cat = CATEGORIES.find((c) => c.value === value);
  return cat ? cat.name : value;
};

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
    case "processando":
      return "bg-yellow-50 text-yellow-900";
    case "separado":
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
