-- Categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon_url text,
  image_url text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subcategories table
CREATE TABLE subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id uuid REFERENCES subcategories(id) ON DELETE SET NULL,
  short_description text,
  full_description text,
  specifications jsonb DEFAULT '{}',
  images text[] DEFAULT '{}',
  cover_image_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enquiries table
CREATE TABLE enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  city text,
  state text,
  product_category text,
  product_name text,
  message text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Gallery table
CREATE TABLE gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  category text,
  image_url text NOT NULL,
  project_name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Catalogues/PDFs table
CREATE TABLE catalogues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  pdf_url text NOT NULL,
  thumbnail_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Testimonials table
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  company_name text,
  testimonial_text text NOT NULL,
  star_rating int DEFAULT 5 CHECK (star_rating >= 1 AND star_rating <= 5),
  photo_url text,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- FAQs table
CREATE TABLE faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Sectors table
CREATE TABLE sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  full_description text,
  icon_url text,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Team members table
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL,
  bio text,
  photo_url text,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Company settings table
CREATE TABLE settings (
  id int PRIMARY KEY DEFAULT 1,
  company_name text DEFAULT 'RELED',
  tagline text,
  address text,
  phone_1 text,
  phone_2 text,
  whatsapp_number text,
  email text,
  google_maps_url text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  linkedin_url text,
  hero_slides jsonb DEFAULT '[]',
  about_text text,
  about_image_url text,
  years_experience int DEFAULT 10,
  projects_completed int DEFAULT 500,
  iso_certified boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton_setting CHECK (id = 1)
);

-- Insert default settings
INSERT INTO settings (id, company_name, tagline, address, phone_1, whatsapp_number, email)
VALUES (1, 'RELED', 'Illuminating Excellence', '123 Industrial Area, New Delhi, India', '+91-9876543210', '+919876543210', 'info@reled.com');

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogues ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_subcategories" ON subcategories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_products" ON products FOR SELECT TO anon, authenticated USING (status = 'active');
CREATE POLICY "public_read_gallery" ON gallery FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "public_read_catalogues" ON catalogues FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "public_read_faqs" ON faqs FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "public_read_sectors" ON sectors FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "public_read_team" ON team_members FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "public_read_settings" ON settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_enquiries" ON enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admin (authenticated) write policies
CREATE POLICY "admin_write_categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_write_subcategories" ON subcategories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_write_products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_write_enquiries" ON enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_write_gallery" ON gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_write_catalogues" ON catalogues FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_write_testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_write_faqs" ON faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_write_sectors" ON sectors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_write_team" ON team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_write_settings" ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_subcategories_category ON subcategories(category_id);