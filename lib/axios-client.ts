import axios from "axios";
import { cookies } from "next/headers";

const apiClient = axios.create({
  baseURL: process.env.NEXT_API_URL ?? "http://localhost:8080",
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

export default apiClient;
