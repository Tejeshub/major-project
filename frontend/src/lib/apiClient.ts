import { supabase } from "./supabase";

const API_URL = "/api/v1";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Only set application/json if we're not sending FormData (e.g. for image uploads later)
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "API Request Failed";
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorDetail;
    } catch (e) {
      // JSON parse failed
    }
    throw new Error(errorDetail);
  }

  // Handle empty responses (like 204 No Content)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return null;
}
