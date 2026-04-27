import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { BANNERS, ESTILOS, F_BUTTON } from "@/assets/assets";
import { useRouter } from "expo-router";
import { CATEGORIES, COLORS } from "@/constants";
import CategoryItem from "@/components/CategoryItem";
import { Product } from "@/constants/types";
import ProductCart from "@/components/ProductCart";
import api from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const DEPOIMENTOS = [
  {
    id: "1",
    nome: "Ana Paula",
    avaliacao: 5,
    texto:
      "Adorei a qualidade das peças! Chegou antes do prazo e o atendimento foi incrível. Com certeza vou comprar de novo.",
    avatar: "https://i.pravatar.cc/80?img=1",
  },
  {
    id: "2",
    nome: "Carlos Mendes",
    avaliacao: 5,
    texto:
      "Melhor e-commerce de moda que já usei. Os produtos são exatamente como nas fotos e a entrega foi super rápida.",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    id: "3",
    nome: "Fernanda Lima",
    avaliacao: 4,
    texto:
      "Ótima experiência de compra! Roupas com ótimo caimento e material de qualidade. Recomendo para todos.",
    avatar: "https://i.pravatar.cc/80?img=5",
  },
  {
    id: "4",
    nome: "Ricardo Souza",
    avaliacao: 5,
    texto:
      "Fiz minha primeira compra e fiquei impressionado. Tudo perfeito, desde o app até a embalagem. Parabéns!",
    avatar: "https://i.pravatar.cc/80?img=8",
  },
  {
    id: "5",
    nome: "Juliana Costa",
    avaliacao: 5,
    texto:
      "Compro sempre aqui. Os estilos são modernos e o preço é justo. A entrega sempre chega bem antes do prazo.",
    avatar: "https://i.pravatar.cc/80?img=9",
  },
];

export default function Home() {
  const router = useRouter();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const depoimentoRef = useRef<FlatList>(null);
  const depoimentoIndex = useRef(0);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("products");
      setProducts(data.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Falha ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* Auto-scroll depoimentos */
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (depoimentoIndex.current + 1) % DEPOIMENTOS.length;
      depoimentoIndex.current = next;
      depoimentoRef.current?.scrollToIndex({ index: next, animated: true });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    router.push({ pathname: "/shop", params: { search: searchText.trim() } });
  };

  const categories = [
    { id: "all", name: "Todos", icon: "grid" },
    ...CATEGORIES,
  ];

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <Header title="Forever" showMenu showCart showLogo />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Barra de Pesquisa */}
        <View className="mt-2 mb-1">
          <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4 h-12">
            <TextInput
              className="flex-1 text-sm text-gray-800"
              placeholder="Pesquisar produtos..."
              placeholderTextColor={COLORS.secondary}
              returnKeyType="search"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText("")}
                className="mr-2"
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={COLORS.secondary}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleSearch} className="ml-1">
              <Ionicons name="search" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner */}
        <View className="mb-6 mt-4">
          <ScrollView
            onScroll={(e) => {
              const slide = Math.ceil(
                e.nativeEvent.contentOffset.x /
                  e.nativeEvent.layoutMeasurement.width,
              );
              if (slide !== activeBannerIndex) {
                setActiveBannerIndex(slide);
              }
            }}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            className="w-full h-40 rounded-xl"
            scrollEventThrottle={16}
          >
            {BANNERS.map((banner, index) => (
              <View
                key={index}
                className="relative w-full h-40 bg-gray-200 overflow-hidden"
                style={{ width: width - 28 }}
              >
                <Image
                  source={banner.image}
                  className="w-full h-40"
                  resizeMode="cover"
                />
                <View className="absolute inset-0" />
              </View>
            ))}
          </ScrollView>
          {/* Paginação */}
          <View className="flex-row justify-center mt-3 gap-2">
            {BANNERS.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full ${index === activeBannerIndex ? "w-6 bg-primary" : "w-2 bg-gray-300"}`}
              />
            ))}
          </View>
        </View>

        {/* Categorias */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-primary">Categorias</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat: any) => (
              <CategoryItem
                key={cat.id}
                item={cat}
                isSelected={false}
                onPress={() =>
                  router.push({
                    pathname: "/shop",
                    params: { category: cat.id === "all" ? "" : cat.name },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* Produtos */}
        <View className="mb-8 mt-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-primary">Popular</Text>
            <TouchableOpacity onPress={() => router.push("/shop")}>
              <Text className="text-sm font-medium text-secondary">
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {products.slice(0, 4).map((product) => (
                <ProductCart key={product._id} product={product} />
              ))}
            </View>
          )}
        </View>

        {/* Estilos */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-primary">Estilos</Text>
            <TouchableOpacity onPress={() => router.push("/shop")}>
              <Text className="text-sm font-medium text-secondary">
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingRight: 4 }}
          >
            {ESTILOS.map((estilo) => (
              <TouchableOpacity
                key={estilo.id}
                activeOpacity={0.88}
                onPress={() =>
                  router.push({
                    pathname: "/shop",
                    params: { category: estilo.name },
                  })
                }
                style={{
                  width: 158,
                  height: 272,
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                {/* Imagem de fundo */}
                <Image
                  source={estilo.image}
                  style={{ position: "absolute", width: 158, height: 272 }}
                  resizeMode="cover"
                />

                {/* ✅ Película preta sobre a imagem */}
                <View
                  style={{
                    position: "absolute",
                    width: 158,
                    height: 272,
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                />

                {/* Nome + botão centrado na base */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 18,
                    left: 0,
                    right: 0,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: "700",
                      marginBottom: 10,
                      letterSpacing: 0.2,
                    }}
                  >
                    {estilo.name}
                  </Text>

                  {/* Botão branco pill — F | Confira */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      borderRadius: 50,
                      paddingVertical: 6,
                      paddingHorizontal: 14,
                      gap: 6,
                    }}
                  >
                    <Image
                      source={F_BUTTON}
                      style={{ width: 18, height: 18 }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        color: "#111",
                        fontSize: 12,
                        fontWeight: "500",
                        letterSpacing: 0.3,
                      }}
                    >
                      | Confira
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Depoimentos */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-primary mb-4">
            O que dizem nossos clientes
          </Text>
          <FlatList
            ref={depoimentoRef}
            data={DEPOIMENTOS}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            onScrollToIndexFailed={() => {}}
            getItemLayout={(_, index) => ({
              length: width - 32,
              offset: (width - 32) * index,
              index,
            })}
            renderItem={({ item }) => (
              <View
                style={{ width: width - 32 }}
                className="bg-white rounded-2xl p-5 border border-gray-100"
              >
                {/* Estrelas */}
                <View className="flex-row mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < item.avaliacao ? "star" : "star-outline"}
                      size={16}
                      color="#FFB800"
                    />
                  ))}
                </View>
                {/* Texto */}
                <Text className="text-gray-700 text-sm leading-5 mb-4 italic">
                  {item.texto}
                </Text>
                {/* Avatar + nome */}
                <View className="flex-row items-center gap-3">
                  <Image
                    source={{ uri: item.avatar }}
                    className="w-10 h-10 rounded-full"
                  />
                  <Text className="font-semibold text-primary">
                    {item.nome}
                  </Text>
                </View>
              </View>
            )}
          />
          {/* Indicadores */}
          <View className="flex-row justify-center mt-3 gap-2">
            {DEPOIMENTOS.map((_, i) => (
              <View
                key={i}
                className="h-2 rounded-full bg-gray-300"
                style={{ width: 8 }}
              />
            ))}
          </View>
        </View>

        {/* Newsletter */}
        <View className="bg-gray-100 p-6 rounded-2xl mb-20 items-center">
          <Text className="text-2xl font-bold text-primary mb-2 text-center">
            Eleve Seu Estilo
          </Text>
          <Text className="text-secondary text-center mb-4">
            Siga nosso Instagram e ganhe 10% de desconto na sua primeira compra.
          </Text>
          <TouchableOpacity className="bg-primary w-4/5 py-3 rounded-full items-center">
            <Text className="text-white font-medium text-base">Siga Agora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
