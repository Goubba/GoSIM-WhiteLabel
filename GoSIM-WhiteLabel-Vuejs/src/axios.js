import axios from "axios";
import { useIndexStore } from "@/stores/index";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const indexStore = useIndexStore();

  const publicKey = indexStore.publicKey || import.meta.env.VITE_PUBLIC_KEY;
  if (publicKey) {
    config.headers["api-key"] = publicKey;
  }

  if (indexStore.host) {
    config.baseURL = indexStore.host;
  }

  if (config.url && (config.url.includes("locations") || config.url.includes("packages"))) {
    config.params = config.params || {};
    config.params.language = indexStore.lang || 'fr';
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
