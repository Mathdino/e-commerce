import axios from "axios";
import { Platform } from "react-native";

const LOCAL_API_URL = Platform.select({
  android: "http://192.168.10.23:3000/api",
  ios: "http://192.168.10.23:3000/api",
  default: "http://localhost:3000/api", // web: mesma máquina, sem PNA
});

//PROJETO NO LOCAL
const api = axios.create({
  baseURL: LOCAL_API_URL,
});

// console.log("📡 Platform.OS:", Platform.OS);
// console.log("📡 API_BASE_URL:", API_BASE_URL);

//PROJETO NO AR
// const api = axios.create({
//   baseURL: "https://e-commerce-native-app-server-inky.vercel.app/api",
// });

api.interceptors.request.use((config) => {
  console.log(
    "➡️ REQUEST:",
    config.method?.toUpperCase(),
    config.baseURL,
    config.url,
  );
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(
      "❌ AXIOS ERROR:",
      error?.config?.url,
      "| code:",
      error?.code,
      "| message:",
      error?.message,
    );
    return Promise.reject(error);
  },
);

export default api;
