<div align="center">

<img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />

<br/><br/>

# 🛍️ Fitto — E-commerce App

> Aplicativo mobile de e-commerce full-stack construído com **React Native + Expo**,
> com backend em **Node.js/Express** e banco de dados **MongoDB**.

<br/>

[![Expo](https://img.shields.io/badge/Expo-SDK_54-blue?logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-blue?logo=typescript)](https://www.typescriptlang.org)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-blueviolet?logo=clerk)](https://clerk.dev)
[![NativeWind](https://img.shields.io/badge/Styling-NativeWind_v4-38bdf8?logo=tailwindcss)](https://www.nativewind.dev)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)](https://www.mongodb.com)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tech Stack](#-tech-stack)
- [Arquitetura](#-arquitetura)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Telas e Navegação](#-telas-e-navegação)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Endpoints da API](#-endpoints-da-api)
- [Gerenciamento de Estado](#-gerenciamento-de-estado)
- [Design System](#-design-system)

---

## 🧭 Sobre o Projeto

**Fitto** é um e-commerce mobile completo desenvolvido com React Native e Expo. O app oferece uma experiência de compra fluida com sistema de autenticação seguro, carrinho de compras em tempo real, lista de desejos, gestão de pedidos e um painel administrativo completo.

O projeto é dividido em dois módulos:

- **`/eco`** — Frontend mobile (React Native + Expo)
- **`/server`** — Backend REST API (Node.js + Express + MongoDB)

---

## ✨ Funcionalidades

### 👤 Usuário

| Funcionalidade      | Descrição                                                   |
| ------------------- | ----------------------------------------------------------- |
| 🔐 **Autenticação** | Login e cadastro via e-mail/senha com Clerk                 |
| 🏠 **Home**         | Banners, carrossel de produtos e filtro por categorias      |
| 🔍 **Loja**         | Navegação e filtragem de produtos por categoria             |
| 📦 **Produto**      | Galeria de imagens, seleção de tamanho e adição ao carrinho |
| 🛒 **Carrinho**     | Gerenciamento de itens, atualização de quantidades e total  |
| ❤️ **Favoritos**    | Lista de desejos com toggle rápido                          |
| 📍 **Endereços**    | Cadastro e seleção de endereços de entrega                  |
| 💳 **Checkout**     | Seleção de endereço e método de pagamento                   |
| 📜 **Pedidos**      | Histórico e detalhes de cada pedido com status              |
| 👤 **Perfil**       | Informações do usuário e acesso ao painel admin             |

### 🛡️ Administrador

| Funcionalidade   | Descrição                                          |
| ---------------- | -------------------------------------------------- |
| 📊 **Dashboard** | Receita total, quantidade de pedidos e produtos    |
| 📦 **Produtos**  | Listagem, criação e edição de produtos             |
| 🧾 **Pedidos**   | Gestão e atualização de status de todos os pedidos |

---

## 🛠️ Tech Stack

### 📱 Frontend — `/eco`

| Categoria     | Tecnologia                                               |
| ------------- | -------------------------------------------------------- |
| Framework     | React Native `0.81.5` + Expo `~54.0.33`                  |
| Linguagem     | TypeScript (modo estrito)                                |
| Roteamento    | Expo Router `~6.0.23` (file-based)                       |
| Estilização   | NativeWind `v4` + TailwindCSS                            |
| Autenticação  | Clerk `@clerk/expo ^3.2.0`                               |
| HTTP Client   | Axios `^1.15.2`                                          |
| Estado Global | Context API (Cart + Wishlist)                            |
| Ícones        | `@expo/vector-icons` (Ionicons, Feather)                 |
| Feedback      | `react-native-toast-message`                             |
| Utilitários   | `expo-image-picker`, `expo-secure-store`, `expo-haptics` |

### 🖥️ Backend — `/server`

| Categoria         | Tecnologia                            |
| ----------------- | ------------------------------------- |
| Runtime           | Node.js + TypeScript                  |
| Framework         | Express.js `^5.2.1`                   |
| Banco de Dados    | MongoDB + Mongoose `^9.5.0`           |
| Autenticação      | Clerk `@clerk/express ^2.1.5`         |
| Upload de Imagens | Multer `^2.1.1` + Cloudinary `^2.9.0` |
| Dev Tools         | Nodemon + tsx                         |

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                   EXPO APP (eco/)                    │
│                                                      │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────┐ │
│  │   Clerk  │   │  Context │   │  Expo Router     │ │
│  │   Auth   │   │   API    │   │  (File-based)    │ │
│  └──────────┘   └──────────┘   └──────────────────┘ │
│                      │                               │
│               ┌──────┴──────┐                        │
│               │    Axios    │                        │
│               └──────┬──────┘                        │
└──────────────────────│──────────────────────────────┘
                        │  REST API
┌──────────────────────│──────────────────────────────┐
│                       ▼        SERVER (server/)      │
│  ┌────────────────────────────────────────────────┐  │
│  │            Express.js + Clerk Middleware        │  │
│  └────────────────────────────────────────────────┘  │
│       │           │           │           │           │
│  ┌────▼───┐  ┌────▼──┐  ┌────▼──┐  ┌────▼──────┐   │
│  │Products│  │ Cart  │  │Orders │  │ Addresses │   │
│  │ Routes │  │Routes │  │Routes │  │  Routes   │   │
│  └────────┘  └───────┘  └───────┘  └───────────┘   │
│                      │                               │
│               ┌──────▼──────┐                        │
│               │   MongoDB   │  +  Cloudinary CDN     │
│               └─────────────┘                        │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Pastas

```
e-commerce/
│
├── 📱 eco/                          # Frontend React Native
│   │
│   ├── app/                         # Rotas (Expo Router)
│   │   ├── (tabs)/                  # Navegação por abas
│   │   │   ├── index.tsx            # 🏠 Home
│   │   │   ├── cart.tsx             # 🛒 Carrinho
│   │   │   ├── favorites.tsx        # ❤️  Favoritos
│   │   │   ├── profile.tsx          # 👤 Perfil
│   │   │   └── _layout.tsx          # Layout das tabs
│   │   │
│   │   ├── (auth)/                  # Fluxo de autenticação
│   │   │   ├── sign-in.tsx          # 🔑 Login
│   │   │   ├── sign-up.tsx          # 📝 Cadastro
│   │   │   └── _layout.tsx
│   │   │
│   │   ├── admin/                   # Painel Administrativo
│   │   │   ├── index.tsx            # 📊 Dashboard
│   │   │   ├── orders.tsx           # 🧾 Pedidos (admin)
│   │   │   ├── products/
│   │   │   │   ├── index.tsx        # 📦 Lista de produtos
│   │   │   │   ├── add.tsx          # ➕ Adicionar produto
│   │   │   │   └── edit/[id].tsx    # ✏️  Editar produto
│   │   │   └── _layout.tsx
│   │   │
│   │   ├── orders/
│   │   │   ├── index.tsx            # 📜 Meus pedidos
│   │   │   └── [id].tsx             # 🔎 Detalhes do pedido
│   │   │
│   │   ├── addresses/
│   │   │   └── index.tsx            # 📍 Meus endereços
│   │   │
│   │   ├── product/[id].tsx         # 🛍️  Detalhes do produto
│   │   ├── shop.tsx                 # 🏪 Loja
│   │   ├── checkout.tsx             # 💳 Checkout
│   │   └── _layout.tsx              # Root layout + providers
│   │
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── Header.tsx
│   │   ├── ProductCart.tsx
│   │   ├── CartItem.tsx
│   │   └── CategoryItem.tsx
│   │
│   ├── context/                     # Estado Global
│   │   ├── CartContext.tsx          # 🛒 Estado do carrinho
│   │   └── WishlistContext.tsx      # ❤️  Estado dos favoritos
│   │
│   ├── constants/                   # Configurações e tipos
│   │   ├── api.ts                   # Instância do Axios
│   │   ├── types.ts                 # Interfaces TypeScript
│   │   └── index.ts                 # Cores, categorias, menus
│   │
│   ├── assets/                      # Imagens e banners
│   ├── tailwind.config.js           # Cores customizadas (NativeWind)
│   ├── app.json                     # Configuração do Expo
│   └── package.json
│
└── 🖥️ server/                       # Backend Node.js
    │
    ├── routes/                      # Rotas da API
    │   ├── productsRoutes.ts
    │   ├── cartRoutes.ts
    │   ├── ordersRoute.ts
    │   ├── addressRoutes.ts
    │   └── adminRoutes.ts
    │
    ├── controllers/                 # Lógica de negócio
    │   ├── productController.ts
    │   ├── cartController.ts
    │   ├── orderController.ts
    │   ├── addressController.ts
    │   ├── adminController.ts
    │   └── webhooks.ts
    │
    ├── models/                      # Schemas do MongoDB
    │   ├── Products.ts
    │   ├── Cart.ts
    │   ├── Order.ts
    │   ├── Address.ts
    │   └── User.ts
    │
    ├── config/                      # Configuração de serviços
    │   ├── db.ts                    # Conexão MongoDB
    │   └── cloudinary.ts            # Configuração Cloudinary
    │
    └── server.ts                    # Entry point do Express
```

---

## 🗺️ Telas e Navegação

```
App (Root Layout)
│
├── (auth)                    ← Não autenticado
│   ├── /sign-in              🔑 Tela de Login
│   └── /sign-up              📝 Tela de Cadastro
│
└── (tabs)                    ← Autenticado
    ├── / (Home)              🏠 Banners + Produtos em destaque
    ├── /cart                 🛒 Carrinho de compras
    ├── /favorites            ❤️  Lista de desejos
    ├── /profile              👤 Perfil do usuário
    │
    ├── /shop                 🏪 Navegar produtos + filtros
    ├── /product/[id]         🛍️  Detalhes do produto
    ├── /checkout             💳 Finalizar compra
    ├── /addresses            📍 Gerenciar endereços
    ├── /orders               📜 Histórico de pedidos
    ├── /orders/[id]          🔎 Detalhes de um pedido
    │
    └── /admin                🛡️  Área administrativa
        ├── /admin            📊 Dashboard (stats)
        ├── /admin/orders     🧾 Gerenciar pedidos
        ├── /admin/products   📦 Listar produtos
        ├── /admin/products/add       ➕ Criar produto
        └── /admin/products/edit/[id] ✏️  Editar produto
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- [Node.js](https://nodejs.org/) `>= 18`
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [MongoDB](https://www.mongodb.com/) (local ou Atlas)
- Conta no [Clerk](https://clerk.dev/)
- Conta no [Cloudinary](https://cloudinary.com/)

---

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/e-commerce.git
cd e-commerce
```

---

### 2. Backend — `/server`

```bash
# Acesse a pasta do servidor
cd server

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais (ver seção abaixo)

# Inicie em modo desenvolvimento
npm run server

# Ou em produção
npm start
```

---

### 3. Frontend — `/eco`

```bash
# Em outro terminal, acesse a pasta do app
cd eco

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Inicie o servidor de desenvolvimento
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

---

## 🔐 Variáveis de Ambiente

### Backend — `server/.env`

```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/eco

# Clerk
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# Servidor
PORT=3000
```

### Frontend — `eco/.env`

```env
# Clerk
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx

# API — use o IP local da máquina ao testar em dispositivo físico
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/api
```

> ⚠️ **Atenção:** Ao testar no dispositivo físico Android/iOS, substitua `localhost` pelo IP local da sua máquina na rede Wi-Fi.

---

## 📡 Endpoints da API

### 🔓 Rotas Públicas

| Método | Endpoint            | Descrição                |
| ------ | ------------------- | ------------------------ |
| `GET`  | `/api/products`     | Listar todos os produtos |
| `GET`  | `/api/products/:id` | Detalhes de um produto   |

### 🔐 Rotas Autenticadas (Usuário)

| Método   | Endpoint             | Descrição                    |
| -------- | -------------------- | ---------------------------- |
| `GET`    | `/api/cart`          | Obter carrinho do usuário    |
| `POST`   | `/api/cart/add`      | Adicionar item ao carrinho   |
| `PUT`    | `/api/cart/item/:id` | Atualizar quantidade do item |
| `DELETE` | `/api/cart/item/:id` | Remover item do carrinho     |
| `DELETE` | `/api/cart`          | Limpar carrinho              |
| `GET`    | `/api/orders`        | Listar pedidos do usuário    |
| `POST`   | `/api/orders`        | Criar novo pedido            |
| `GET`    | `/api/orders/:id`    | Detalhes de um pedido        |
| `GET`    | `/api/addresses`     | Listar endereços             |
| `POST`   | `/api/addresses`     | Cadastrar endereço           |
| `DELETE` | `/api/addresses/:id` | Remover endereço             |

### 🛡️ Rotas Administrativas

| Método   | Endpoint                  | Descrição                  |
| -------- | ------------------------- | -------------------------- |
| `GET`    | `/api/admin/stats`        | Estatísticas do dashboard  |
| `GET`    | `/api/admin/orders`       | Todos os pedidos           |
| `PUT`    | `/api/admin/orders/:id`   | Atualizar status de pedido |
| `POST`   | `/api/admin/products`     | Criar produto              |
| `PUT`    | `/api/admin/products/:id` | Editar produto             |
| `DELETE` | `/api/admin/products/:id` | Remover produto            |

---

## 🗂️ Gerenciamento de Estado

O app utiliza **Context API** nativa do React para o estado global:

### 🛒 CartContext

```tsx
const {
  cartItems,
  cartTotal,
  itemCount,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = useCart();
```

| Propriedade / Método            | Tipo         | Descrição                            |
| ------------------------------- | ------------ | ------------------------------------ |
| `cartItems`                     | `CartItem[]` | Lista de itens no carrinho           |
| `cartTotal`                     | `number`     | Valor total do carrinho              |
| `itemCount`                     | `number`     | Quantidade total de itens            |
| `addToCart(product, size)`      | `Function`   | Adiciona produto ao carrinho via API |
| `removeFromCart(id, size)`      | `Function`   | Remove item do carrinho              |
| `updateQuantity(id, size, qty)` | `Function`   | Atualiza quantidade                  |
| `clearCart()`                   | `Function`   | Esvazia o carrinho                   |

### ❤️ WishlistContext

```tsx
const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
```

| Propriedade / Método      | Tipo        | Descrição                      |
| ------------------------- | ----------- | ------------------------------ |
| `wishlist`                | `Product[]` | Lista de produtos favoritos    |
| `toggleWishlist(product)` | `Function`  | Adiciona/remove dos favoritos  |
| `isInWishlist(productId)` | `Function`  | Verifica se produto é favorito |

---

## 🎨 Design System

O app usa **NativeWind v4** (TailwindCSS para React Native) com um tema personalizado:

```js
// tailwind.config.js
colors: {
  primary: '#111111',   // Cor principal (fundo escuro)
  accent:  '#FF4C3B',   // Cor de destaque (vermelho)
  // + surface, border e error
}
```

---

<div align="center">

**Desenvolvido por Matheus Bernardino**

</div>
