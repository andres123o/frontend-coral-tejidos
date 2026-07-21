import { API_URL } from "./api";
import { supabase } from "./supabase";
import type {
  AdminProduct,
  Category,
  CategoryInput,
  ProductInput,
  StoreSettings,
  StoreSettingsInput,
} from "../types/product";

async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No hay sesión activa");
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Error ${res.status} al consultar ${path}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function jsonBody(payload: unknown): RequestInit {
  return { headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) };
}

// Productos
export function listAllProducts(): Promise<AdminProduct[]> {
  return request("/api/admin/products");
}

export function getProduct(id: string): Promise<AdminProduct> {
  return request(`/api/admin/products/${id}`);
}

export function createProduct(payload: ProductInput): Promise<AdminProduct> {
  return request("/api/admin/products", { method: "POST", ...jsonBody(payload) });
}

export function updateProduct(id: string, payload: Partial<ProductInput>): Promise<AdminProduct> {
  return request(`/api/admin/products/${id}`, { method: "PATCH", ...jsonBody(payload) });
}

export function archiveProduct(id: string): Promise<AdminProduct> {
  return request(`/api/admin/products/${id}`, { method: "DELETE" });
}

// Categorías
export function listAllCategoriesAdmin(): Promise<Category[]> {
  return request("/api/admin/categories");
}

export function createCategory(payload: CategoryInput): Promise<Category> {
  return request("/api/admin/categories", { method: "POST", ...jsonBody(payload) });
}

export function updateCategory(id: string, payload: CategoryInput): Promise<Category> {
  return request(`/api/admin/categories/${id}`, { method: "PATCH", ...jsonBody(payload) });
}

export function deleteCategory(id: string): Promise<void> {
  return request(`/api/admin/categories/${id}`, { method: "DELETE" });
}

// Settings
export function updateStoreSettings(payload: StoreSettingsInput): Promise<StoreSettings> {
  return request("/api/admin/settings", { method: "PATCH", ...jsonBody(payload) });
}

// Subida de imágenes
export async function uploadImage(file: Blob, filename: string): Promise<string> {
  const headers = await authHeaders();
  const formData = new FormData();
  formData.append("file", file, filename);

  const res = await fetch(`${API_URL}/api/admin/uploads`, {
    method: "POST",
    headers, // sin Content-Type: el navegador arma el boundary del multipart solo
    body: formData,
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status} subiendo la imagen`);
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}
