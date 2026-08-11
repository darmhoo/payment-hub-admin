import axios from "axios";
import { cookies } from "next/headers";
import crypto from "crypto";

const apiClient = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    config.headers.set("Authorization", token);
    config.headers.set("X-Auth-Key", token);
  }

  const method = config.method?.toLowerCase();

  if (["post", "put", "patch"].includes(method ?? "")) {
    console.log("Request Data:", config.data);
    const secret = process.env.HMAC_SECRET!;
    const header = process.env.HMAC_HEADER!;

    const bodyString =
      typeof config.data === "string"
        ? config.data
        : JSON.stringify(config.data ?? {});

    console.log("Body String:", bodyString);

    config.data = bodyString;
    // config.headers.set("Content-Type", "application/json");

    const bucket = Math.floor(Date.now() / 1000 / 30).toString();

    const signature = crypto
      .createHmac("sha256", secret)
      .update(bodyString + bucket)
      .digest("hex");

    config.headers.set(header, signature);
  }
  return config;
});

apiClient.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error.code === 401) {
      return Promise.reject(new Error("Unauthorized: Please log in again."));
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
