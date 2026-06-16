export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Subcategory[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id?: string;
  subcategory_id?: string;
  short_description?: string;
  full_description?: string;
  specifications: Record<string, string>;
  images: string[];
  cover_image_url?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  category?: Category;
  subcategory?: Subcategory;
}

export interface Enquiry {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  product_category?: string;
  product_name?: string;
  message?: string;
  status: 'new' | 'in_progress' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  category?: string;
  image_url: string;
  project_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface Catalogue {
  id: string;
  title: string;
  description?: string;
  category?: string;
  pdf_url: string;
  thumbnail_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  company_name?: string;
  testimonial_text: string;
  star_rating: number;
  photo_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Sector {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  full_description?: string;
  icon_url?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  bio?: string;
  photo_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Settings {
  id: number;
  company_name: string;
  tagline?: string;
  address?: string;
  phone_1?: string;
  phone_2?: string;
  whatsapp_number?: string;
  email?: string;
  google_maps_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  hero_slides: HeroSlide[];
  about_text?: string;
  about_image_url?: string;
  years_experience: number;
  projects_completed: number;
  iso_certified: boolean;
  updated_at: string;
}

export interface HeroSlide {
  image_url: string;
  headline: string;
  subheadline: string;
  cta_text: string;
  cta_link: string;
}
