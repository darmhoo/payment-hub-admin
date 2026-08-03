export function getApiBaseUrl() {
  return (process.env.NEXT_API_URL ?? "http://localhost:8080").replace(/\/$/, "");
}

export function getApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
