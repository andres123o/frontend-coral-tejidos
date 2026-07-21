export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string;
  price: number;
  promo_price: number | null;
  is_on_promo: boolean;
  images: string[];
  colors: string[];
  scarcity_label: string | null;
  is_available: boolean;
  is_featured: boolean;
  category: Category | null;
}

/** Igual que Product, más is_active, que solo ve el admin (incluye archivados). */
export interface AdminProduct extends Product {
  is_active: boolean;
}

export interface ProductInput {
  name: string;
  subtitle?: string | null;
  description?: string;
  price: number;
  promo_price?: number | null;
  is_on_promo?: boolean;
  category_id?: string | null;
  images?: string[];
  colors?: string[];
  scarcity_label?: string | null;
  is_available?: boolean;
  is_featured?: boolean;
  is_active?: boolean;
}

export interface CategoryInput {
  name?: string;
  slug?: string;
}

export interface StoreSettings {
  featured_image_desktop_url: string | null;
  featured_image_mobile_url: string | null;
  shipping_info: string | null;
}

export interface StoreSettingsInput {
  featured_image_desktop_url?: string | null;
  featured_image_mobile_url?: string | null;
  shipping_info?: string | null;
}
