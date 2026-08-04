import { cookies } from "next/headers";

export type AuthConfig = {
  email: string;
  password: string;
  resetEmail: string;
};

function getEnvValue(key: string, fallback: string) {
  const value = process.env[key];
  return value && value.trim() ? value.trim() : fallback;
}

export function getAuthConfig(): AuthConfig {
  return {
    email: getEnvValue("AUTH_EMAIL", "admin@paymenthub.com"),
    password: getEnvValue("AUTH_PASSWORD", "admin123"),
    resetEmail: getEnvValue("AUTH_RESET_EMAIL", "support@paymenthub.com"),
  };
}

export function isValidCredentials(email: string, password: string) {
  const { email: expectedEmail, password: expectedPassword } = getAuthConfig();

  return (
    email.trim().toLowerCase() === expectedEmail.toLowerCase() &&
    password === expectedPassword
  );
}

export async function createSession(email: string, token?: string) {
  const cookieStore = await cookies();

  cookieStore.set("auth_session", "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("auth_user", email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  if (token) {
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}

export async function clearSession() {
  const cookieStore = await cookies();

  cookieStore.delete("auth_session");
  cookieStore.delete("auth_user");
  cookieStore.delete("auth_token");
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_session")?.value === "true";
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_user")?.value ?? null;
}
