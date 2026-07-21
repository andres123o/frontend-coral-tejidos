import type { Category, Product, StoreSettings } from "../types/product";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Error ${res.status} al consultar ${path}`);
  }
  return res.json() as Promise<T>;
}

export interface ListProductsParams {
  category?: string;
  q?: string;
  featured?: boolean;
}

export function listProducts(params: ListProductsParams = {}): Promise<Product[]> {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.q) search.set("q", params.q);
  if (params.featured !== undefined) search.set("featured", String(params.featured));

  const qs = search.toString();
  return request<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
}

export function getProduct(slug: string): Promise<Product> {
  return request<Product>(`/api/products/${slug}`);
}

export function listCategories(): Promise<Category[]> {
  return request<Category[]>("/api/categories");
}

export function getStoreSettings(): Promise<StoreSettings> {
  return request<StoreSettings>("/api/settings");
}
