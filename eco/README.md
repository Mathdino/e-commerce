# Eco App 📱 - E-commerce Mobile

Bem-vindo ao **Eco**, o aplicativo mobile do nosso ecossistema de e-commerce. Desenvolvido com **Expo** e **React Native**, o app oferece uma experiência de compra fluida, moderna e segura.

## 🚀 Tecnologias Utilizadas

O projeto utiliza as tecnologias mais modernas do ecossistema React Native:

- **[Expo](https://expo.dev/)** - Framework para desenvolvimento React Native.
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - Roteamento baseado em arquivos.
- **[NativeWind](https://www.nativewind.dev/)** - Estilização com Tailwind CSS para React Native.
- **[Clerk](https://clerk.com/)** - Gerenciamento de autenticação completo e seguro.
- **[Lucide React Native](https://lucide.dev/)** - Biblioteca de ícones elegantes.
- **[Axios](https://axios-http.com/)** - Cliente HTTP para consumo de API.
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** - Animações de alta performance.

## ✨ Funcionalidades

### 👤 Cliente
- **Autenticação:** Cadastro e login seguros via Clerk.
- **Catálogo de Produtos:** Navegação por categorias e busca de produtos.
- **Favoritos:** Salve seus produtos desejados em uma lista personalizada.
- **Carrinho:** Gerenciamento completo de itens para compra.
- **Endereços:** Cadastro e gestão de múltiplos endereços de entrega.
- **Pedidos:** Histórico detalhado e acompanhamento de pedidos realizados.

### 🛡️ Admin
- **Dashboard:** Visão geral do sistema.
- **Gestão de Produtos:** Adicionar, editar e remover produtos do catálogo.
- **Gestão de Pedidos:** Visualização e controle de todos os pedidos da plataforma.

## 🛠️ Como Iniciar

### Pré-requisitos
- Node.js instalado.
- Expo Go instalado no seu dispositivo móvel (ou um emulador configurado).

### Instalação

1. Entre na pasta do projeto:
   ```bash
   cd eco
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz da pasta `eco` e adicione sua chave do Clerk:
   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=sua_chave_aqui
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npx expo start
   ```

Agora é só escanear o QR Code com o app **Expo Go** ou pressionar `a` para Android ou `i` para iOS se tiver os emuladores configurados.

## 📂 Estrutura de Pastas

```text
eco/
├── app/                # Rotas e telas (Expo Router)
│   ├── (auth)/         # Telas de Autenticação
│   ├── (tabs)/         # Navegação por Abas (Home, Cart, etc)
│   ├── admin/          # Funcionalidades Administrativas
│   └── ...             # Outras rotas (Pedidos, Produtos, etc)
├── assets/             # Imagens, fontes e ícones
├── components/         # Componentes reutilizáveis
├── constants/          # Constantes, temas e tipos
├── context/            # Contextos da aplicação (Cart, Wishlist)
└── plugins/            # Plugins customizados do Expo
```
