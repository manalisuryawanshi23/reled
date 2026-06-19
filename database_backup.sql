-- =====================================================
-- RELED Database Complete Backup
-- Generated: 2026-06-19
-- =====================================================

-- =====================================================
-- TABLE STRUCTURES
-- =====================================================

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    company_name TEXT DEFAULT 'LedPrisha',
    tagline TEXT DEFAULT 'Illuminating Excellence',
    address TEXT,
    phone_1 TEXT,
    phone_2 TEXT,
    whatsapp_number TEXT,
    email TEXT,
    google_maps_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    linkedin_url TEXT,
    hero_slides JSONB DEFAULT '[]',
    about_text TEXT,
    about_image_url TEXT,
    years_experience INTEGER DEFAULT 10,
    projects_completed INTEGER DEFAULT 500,
    iso_certified BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subcategories Table
CREATE TABLE IF NOT EXISTS subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    parent_id UUID REFERENCES subcategories(id) ON DELETE CASCADE,
    image_url TEXT
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    short_description TEXT,
    full_description TEXT,
    specifications JSONB DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    cover_image_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sectors Table
CREATE TABLE IF NOT EXISTS sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    icon_url TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT,
    image_url TEXT,
    project_name TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    company_name TEXT,
    testimonial_text TEXT NOT NULL,
    star_rating INTEGER DEFAULT 5 CHECK (star_rating >= 1 AND star_rating <= 5),
    photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Catalogues Table
CREATE TABLE IF NOT EXISTS catalogues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enquiries Table (matches actual INSERT columns: full_name, phone, email, city, state, product_category, product_name, message, status)
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    city TEXT,
    state TEXT,
    product_category TEXT,
    product_name TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT,
    bio TEXT,
    photo_url TEXT,
    email TEXT,
    linkedin_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_parent ON subcategories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- =====================================================
-- DATA
-- =====================================================

-- Settings Data
DELETE FROM settings;
INSERT INTO settings (id, company_name, tagline, address, phone_1, phone_2, whatsapp_number, email, google_maps_url, facebook_url, instagram_url, youtube_url, linkedin_url, hero_slides, about_text, about_image_url, years_experience, projects_completed, iso_certified, updated_at) VALUES (
    1, 'RELED', '', 'Bengoli Sq indore', '+91-8770905099', NULL, '+918770905099', 'info@reled.in',
    NULL, 'https://www.facebook.com/techwithmanali', 'https://www.instagram.com/techwithmanali/', NULL, NULL,
    '[{"headline":"Illuminate Your World","subheadline":"Premium LED lighting solutions for every space","image_url":"https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=1920","cta_text":"Explore Products","cta_link":"/products"},{"headline":"Architectural Excellence","subheadline":"Transform buildings into stunning visual experiences","image_url":"https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920","cta_text":"View Solutions","cta_link":"/products/category/architectural"},{"headline":"Industrial Strength","subheadline":"Reliable lighting for demanding environments","image_url":"https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=1920","cta_text":"Learn More","cta_link":"/sectors"}]',
    'Reled is a leading manufacturer and supplier of premium LED lighting solutions. We specialize in indoor, outdoor, architectural, and industrial lighting systems designed to meet the highest standards of quality, efficiency, and aesthetics. Our products are trusted by businesses across India for their reliability, energy efficiency, and superior performance.',
    NULL, 10, 500, true, '2026-06-17T10:25:44.301Z'
);

-- Users Data
DELETE FROM users;
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('00000000-0000-0000-0000-000000000000', 'admin@ledprisha.com', '$2a$10$2aemcFYBXLn2l9F3NH6TQeKW.20VT5DWWi7m11A5StR6g3EGku5de', 'admin', '2026-06-19T14:16:10.969Z');
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('21074759-f61a-49ca-8174-ec5d9086f778', 'manali@gmail.com', '$2a$10$IRSbQ5y2LGzNxiXqaNyBNujmA/x6WgZKr16cHEzf4BkTEXdWCyen6', 'admin', '2026-06-19T14:21:03.145Z');
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('eb2b8923-4d90-4450-b551-42e2b25fbddf', 'deergh@gmail.com', '$2a$10$E6zQzYcNgGUOi1pvtwmcuO/S.e5fyQPh9Fkr9YphKdpKUr3AvqlvG', 'editor', '2026-06-19T14:21:34.599Z');

-- Categories Data
DELETE FROM categories;
INSERT INTO categories (id, name, slug, description, icon_url, image_url, sort_order, is_active, created_at, updated_at) VALUES ('3bfd3420-656d-4e61-95f8-a8faac558653', 'Indoor Lighting', 'indoor-lighting', NULL, NULL, '/uploads/indoor_lighting_1781880234381.png', 1, true, '2026-06-19T14:46:25.777Z', '2026-06-19T14:46:25.777Z');
INSERT INTO categories (id, name, slug, description, icon_url, image_url, sort_order, is_active, created_at, updated_at) VALUES ('3f309009-946b-4ed6-b360-d532f62b9ccf', 'Outdoor Lighting', 'outdoor-lighting', NULL, NULL, '/uploads/outdoor_lighting_1781880246488.png', 2, true, '2026-06-19T14:46:25.785Z', '2026-06-19T14:46:25.785Z');
INSERT INTO categories (id, name, slug, description, icon_url, image_url, sort_order, is_active, created_at, updated_at) VALUES ('2e12107a-5e66-4f39-97f6-268c521ddd47', 'Architectural Lighting', 'architectural-lighting', NULL, NULL, '/uploads/architectural_lighting_1781880260327.png', 3, true, '2026-06-19T14:46:25.787Z', '2026-06-19T14:46:25.787Z');
INSERT INTO categories (id, name, slug, description, icon_url, image_url, sort_order, is_active, created_at, updated_at) VALUES ('ac69dd9b-c2ff-41bd-b435-cbf5648764c8', 'Decorative Pole', 'decorative-pole', NULL, NULL, '/uploads/decorative_pole_1781880276468.png', 4, true, '2026-06-19T14:46:25.791Z', '2026-06-19T14:46:25.791Z');
INSERT INTO categories (id, name, slug, description, icon_url, image_url, sort_order, is_active, created_at, updated_at) VALUES ('46b38567-e6bf-4345-ad07-08d5663be11d', 'Underwater Light', 'underwater-light', NULL, NULL, '/uploads/underwater_light_1781880291711.png', 5, true, '2026-06-19T14:46:25.792Z', '2026-06-19T14:46:25.792Z');
INSERT INTO categories (id, name, slug, description, icon_url, image_url, sort_order, is_active, created_at, updated_at) VALUES ('1c0f594f-0c80-49b7-a75f-6b86ef2a7118', 'EV Charger', 'ev-charger', NULL, NULL, '/uploads/ev_charger_1781880304776.png', 6, true, '2026-06-19T14:46:25.794Z', '2026-06-19T14:46:25.794Z');

-- Subcategories Data
DELETE FROM subcategories;
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('c05731c9-de7e-44aa-9bae-550b2d7703d6', '3bfd3420-656d-4e61-95f8-a8faac558653', 'LED Panel Light', 'led-panel-light', NULL, 1, true, '2026-06-19T14:46:25.780Z', '2026-06-19T14:46:25.780Z', NULL, '/uploads/indoor_lighting_1781880234381.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('be498ec6-cc7c-42ca-bf5d-2549cc806573', '3bfd3420-656d-4e61-95f8-a8faac558653', 'LED COB Light', 'led-cob-light', NULL, 2, true, '2026-06-19T14:46:25.783Z', '2026-06-19T14:46:25.783Z', NULL, '/uploads/indoor_lighting_1781880234381.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('eae5eec6-6309-48b6-be97-bb4998338752', '3bfd3420-656d-4e61-95f8-a8faac558653', 'LED Bulb / Tube Light', 'led-bulb-tube-light', NULL, 3, true, '2026-06-19T14:46:25.783Z', '2026-06-19T14:46:25.783Z', NULL, '/uploads/indoor_lighting_1781880234381.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('3faaf121-211a-4dfa-9748-2c0f4cb5c52f', '3bfd3420-656d-4e61-95f8-a8faac558653', 'LED Track Light', 'led-track-light', NULL, 4, true, '2026-06-19T14:46:25.784Z', '2026-06-19T14:46:25.784Z', NULL, '/uploads/indoor_lighting_1781880234381.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('24eca157-3978-42c0-9428-74013710865c', '3bfd3420-656d-4e61-95f8-a8faac558653', 'LED Cylinder Light', 'led-cylinder-light', NULL, 5, true, '2026-06-19T14:46:25.784Z', '2026-06-19T14:46:25.784Z', NULL, '/uploads/indoor_lighting_1781880234381.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('8079ac33-731f-4cf9-a305-fd707b96200f', '3f309009-946b-4ed6-b360-d532f62b9ccf', 'LED Street Light', 'led-street-light', NULL, 1, true, '2026-06-19T14:46:25.785Z', '2026-06-19T14:46:25.785Z', NULL, '/uploads/outdoor_lighting_1781880246488.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('0ab4fe42-b253-4860-b1e4-76fe2a242800', '3f309009-946b-4ed6-b360-d532f62b9ccf', 'LED Flood Light', 'led-flood-light', NULL, 2, true, '2026-06-19T14:46:25.786Z', '2026-06-19T14:46:25.786Z', NULL, '/uploads/outdoor_lighting_1781880246488.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('f6522db6-4420-4d3d-925f-e391b6bcfc56', '3f309009-946b-4ed6-b360-d532f62b9ccf', 'LED Stadium Light', 'led-stadium-light', NULL, 3, true, '2026-06-19T14:46:25.786Z', '2026-06-19T14:46:25.786Z', NULL, '/uploads/outdoor_lighting_1781880246488.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('70ef590e-7842-4b5d-9449-858878668af5', '3f309009-946b-4ed6-b360-d532f62b9ccf', 'LED Highway Light', 'led-highway-light', NULL, 4, true, '2026-06-19T14:46:25.786Z', '2026-06-19T14:46:25.786Z', NULL, '/uploads/outdoor_lighting_1781880246488.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('141f5214-a9cc-4f3a-b89d-0ebb26d7aaba', '3f309009-946b-4ed6-b360-d532f62b9ccf', 'LED Solar Light', 'led-solar-light', NULL, 5, true, '2026-06-19T14:46:25.787Z', '2026-06-19T14:46:25.787Z', NULL, '/uploads/outdoor_lighting_1781880246488.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('501552dc-9960-4b89-bbb7-fc67e6cf7a1c', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'COB Light', 'cob-light', NULL, 1, true, '2026-06-19T14:46:25.788Z', '2026-06-19T14:46:25.788Z', NULL, '/uploads/architectural_lighting_1781880260327.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('f55c9264-a3ea-45b0-b1c2-601d535bff36', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'Magnetic Light', 'magnetic-light', NULL, 2, true, '2026-06-19T14:46:25.789Z', '2026-06-19T14:46:25.789Z', NULL, '/uploads/architectural_lighting_1781880260327.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('68758cfa-c88f-4ab7-8366-0b64c8735fb0', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'Strip Light / SMPS', 'strip-light-smps', NULL, 3, true, '2026-06-19T14:46:25.789Z', '2026-06-19T14:46:25.789Z', NULL, '/uploads/architectural_lighting_1781880260327.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('676e5878-0c36-4f43-8eee-063accde7b3a', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'LED Foot Lamp', 'led-foot-lamp', NULL, 4, true, '2026-06-19T14:46:25.789Z', '2026-06-19T14:46:25.789Z', NULL, '/uploads/architectural_lighting_1781880260327.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('9230f5a8-1fbf-4b97-8b5b-55b9ac81f932', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'Profile Light', 'profile-light', NULL, 5, true, '2026-06-19T14:46:25.790Z', '2026-06-19T14:46:25.790Z', NULL, '/uploads/architectural_lighting_1781880260327.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('ce74d64f-fe02-44ee-b7a9-d687dec73c14', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'Hanging Profile Light', 'hanging-profile-light', NULL, 6, true, '2026-06-19T14:46:25.790Z', '2026-06-19T14:46:25.790Z', NULL, '/uploads/architectural_lighting_1781880260327.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('80dba48a-a37c-4a3c-abf5-01fff832d950', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'Gimble Lighting', 'gimble-lighting', NULL, 7, true, '2026-06-19T14:46:25.790Z', '2026-06-19T14:46:25.790Z', NULL, '/uploads/architectural_lighting_1781880260327.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('08c47831-bc23-4b8f-a11a-bd133152ee9a', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'Facade Lighting', 'facade-lighting', NULL, 8, true, '2026-06-19T14:46:25.791Z', '2026-06-19T14:46:25.791Z', NULL, '/uploads/architectural_lighting_1781880260327.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('75381d1e-cedb-498e-9018-5264bec0f9b3', 'ac69dd9b-c2ff-41bd-b435-cbf5648764c8', 'Pole Light', 'pole-light', NULL, 1, true, '2026-06-19T14:46:25.791Z', '2026-06-19T14:46:25.791Z', NULL, '/uploads/decorative_pole_1781880276468.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('5ffb9abb-c9e5-4c13-91e0-790e86044888', 'ac69dd9b-c2ff-41bd-b435-cbf5648764c8', 'Bollard Light', 'bollard-light', NULL, 2, true, '2026-06-19T14:46:25.792Z', '2026-06-19T14:46:25.792Z', NULL, '/uploads/decorative_pole_1781880276468.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('14fdd7b5-dcee-4e93-82df-ca6dacce3a33', '46b38567-e6bf-4345-ad07-08d5663be11d', 'Inground Light', 'inground-light', NULL, 1, true, '2026-06-19T14:46:25.792Z', '2026-06-19T14:46:25.792Z', NULL, '/uploads/underwater_light_1781880291711.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('a8ca30dc-1dc0-4f76-8af0-e98bbd56a80d', '46b38567-e6bf-4345-ad07-08d5663be11d', 'Nozzle Light', 'nozzle-light', NULL, 2, true, '2026-06-19T14:46:25.793Z', '2026-06-19T14:46:25.793Z', NULL, '/uploads/underwater_light_1781880291711.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('80a9598c-e30c-4016-bf8f-75ae2409217e', '46b38567-e6bf-4345-ad07-08d5663be11d', 'Garden Light', 'garden-light', NULL, 3, true, '2026-06-19T14:46:25.793Z', '2026-06-19T14:46:25.793Z', NULL, '/uploads/underwater_light_1781880291711.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('c5197bc7-8287-475c-a932-e001b552ddce', '46b38567-e6bf-4345-ad07-08d5663be11d', 'Fiber Optic Light', 'fiber-optic-light', NULL, 4, true, '2026-06-19T14:46:25.793Z', '2026-06-19T14:46:25.793Z', NULL, '/uploads/underwater_light_1781880291711.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('20832115-2e9d-4ee4-8de4-3bbb923a3240', '46b38567-e6bf-4345-ad07-08d5663be11d', 'Wall Washer Light', 'wall-washer-light', NULL, 5, true, '2026-06-19T14:46:25.794Z', '2026-06-19T14:46:25.794Z', NULL, '/uploads/underwater_light_1781880291711.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('01f64642-de8a-46e1-9c98-0f39854c71c0', '46b38567-e6bf-4345-ad07-08d5663be11d', 'DMX Flood Light', 'dmx-flood-light', NULL, 6, true, '2026-06-19T14:46:25.794Z', '2026-06-19T14:46:25.794Z', NULL, '/uploads/underwater_light_1781880291711.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('af284254-1338-43a5-aa78-afb2ef622317', '1c0f594f-0c80-49b7-a75f-6b86ef2a7118', 'AC EV Charger', 'ac-ev-charger', NULL, 1, true, '2026-06-19T14:46:25.795Z', '2026-06-19T14:46:25.795Z', NULL, '/uploads/ev_charger_1781880304776.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('98d44bd5-b8e8-4142-b84b-f14430c64378', '1c0f594f-0c80-49b7-a75f-6b86ef2a7118', 'DC Fast Charger', 'dc-fast-charger', NULL, 2, true, '2026-06-19T14:46:25.795Z', '2026-06-19T14:46:25.795Z', NULL, '/uploads/ev_charger_1781880304776.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('c9d1a911-9281-4e12-a7c6-aa4b2cbcfaf9', '1c0f594f-0c80-49b7-a75f-6b86ef2a7118', 'Home EV Charger', 'home-ev-charger', NULL, 3, true, '2026-06-19T14:46:25.795Z', '2026-06-19T14:46:25.795Z', NULL, '/uploads/ev_charger_1781880304776.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('f5416811-aa61-4806-be7c-b97edb4b3c53', '1c0f594f-0c80-49b7-a75f-6b86ef2a7118', 'Commercial EV Charger', 'commercial-ev-charger', NULL, 4, true, '2026-06-19T14:46:25.796Z', '2026-06-19T14:46:25.796Z', NULL, '/uploads/ev_charger_1781880304776.png');
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active, created_at, updated_at, parent_id, image_url) VALUES ('09f4af24-3536-40ce-b8e8-ef1dc2a6235e', '1c0f594f-0c80-49b7-a75f-6b86ef2a7118', 'EV Charging Station', 'ev-charging-station', NULL, 5, true, '2026-06-19T14:46:25.796Z', '2026-06-19T14:46:25.796Z', NULL, '/uploads/ev_charger_1781880304776.png');

-- Sectors Data
DELETE FROM sectors;
INSERT INTO sectors (id, name, slug, short_description, full_description, icon_url, image_url, is_active, sort_order, created_at) VALUES ('024f9139-da90-4816-a0b0-115bd95824bd', 'Industrial', 'industrial', 'High-performance lighting for factories, warehouses, and manufacturing facilities.', 'Our industrial LED solutions are designed for demanding environments including factories, warehouses, and manufacturing plants. With high lumen output, excellent heat dissipation, and IP65+ ratings, our industrial lights ensure maximum productivity and safety.', NULL, 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800', true, 0, '2026-06-17T10:25:44.301Z');
INSERT INTO sectors (id, name, slug, short_description, full_description, icon_url, image_url, is_active, sort_order, created_at) VALUES ('1c492b79-2f38-4765-bd30-513930944dd4', 'Commercial', 'commercial', 'Modern lighting solutions for offices, malls, and commercial spaces.', 'Transform your commercial spaces with our energy-efficient LED lighting. Perfect for offices, shopping malls, and corporate buildings, our solutions enhance aesthetics while reducing operational costs.', NULL, 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800', true, 1, '2026-06-17T10:25:44.301Z');
INSERT INTO sectors (id, name, slug, short_description, full_description, icon_url, image_url, is_active, sort_order, created_at) VALUES ('69848d38-8239-4667-8e11-f520ecf5e6b5', 'Retail', 'retail', 'Eye-catching displays and ambient lighting for retail environments.', 'Create compelling shopping experiences with our retail lighting solutions. From accent lighting for product displays to ambient illumination for the entire store.', NULL, 'https://images.pexels.com/photos/264942/pexels-photo-264942.jpeg?auto=compress&cs=tinysrgb&w=800', true, 2, '2026-06-17T10:25:44.301Z');
INSERT INTO sectors (id, name, slug, short_description, full_description, icon_url, image_url, is_active, sort_order, created_at) VALUES ('3a7e454f-2dda-4303-beeb-77d35e5f444e', 'Sports', 'sports', 'Professional-grade lighting for stadiums, arenas, and sports complexes.', 'Illuminate sports venues with broadcast-quality lighting. Our sports lighting solutions meet international standards for television broadcasting.', NULL, 'https://images.pexels.com/photos/315866/pexels-photo-315866.jpeg?auto=compress&cs=tinysrgb&w=800', true, 3, '2026-06-17T10:25:44.301Z');
INSERT INTO sectors (id, name, slug, short_description, full_description, icon_url, image_url, is_active, sort_order, created_at) VALUES ('4eaa99b7-e363-44b1-ad05-cad9ae02f184', 'Infrastructure', 'infrastructure', 'Reliable lighting for roads, bridges, and public infrastructure.', 'Our infrastructure lighting solutions provide safe and efficient illumination for roads, bridges, tunnels, and public spaces.', NULL, 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4, '2026-06-17T10:25:44.301Z');
INSERT INTO sectors (id, name, slug, short_description, full_description, icon_url, image_url, is_active, sort_order, created_at) VALUES ('4e22e010-3e40-41b6-a20d-b8e464947251', 'Hospitality', 'hospitality', 'Warm, inviting lighting for hotels, restaurants, and resorts.', 'Create memorable experiences with our hospitality lighting solutions. Perfect for hotels, restaurants, and resorts.', NULL, 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800', true, 5, '2026-06-17T10:25:44.301Z');

-- Gallery Data
DELETE FROM gallery;
INSERT INTO gallery (id, title, category, image_url, project_name, is_active, created_at) VALUES ('420fa365-2957-4e53-99b0-c2a325bca923', 'City Mall Project', 'Indoor Projects', 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800', 'City Mall Delhi', true, '2026-06-17T10:25:44.301Z');
INSERT INTO gallery (id, title, category, image_url, project_name, is_active, created_at) VALUES ('1f903681-2dc9-4143-99fa-376bfdb01153', 'Factory Lighting', 'Industrial Projects', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800', 'TechPark Manufacturing', true, '2026-06-17T10:25:44.301Z');
INSERT INTO gallery (id, title, category, image_url, project_name, is_active, created_at) VALUES ('58b07ea3-b07b-4f2e-b2f4-4150fdeaadbb', 'Hotel Lobby', 'Hospitality Projects', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800', 'Grand Palace Hotel', true, '2026-06-17T10:25:44.301Z');
INSERT INTO gallery (id, title, category, image_url, project_name, is_active, created_at) VALUES ('4df3b8ab-cc0b-4606-9853-0bddeea9bb01', 'Street Lighting', 'Infrastructure Projects', 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800', 'Smart City Initiative', true, '2026-06-17T10:25:44.301Z');

-- Testimonials Data
DELETE FROM testimonials;
INSERT INTO testimonials (id, customer_name, company_name, testimonial_text, star_rating, photo_url, is_active, sort_order, created_at) VALUES ('a644281a-426a-491c-bac6-9f5ae6034d12', 'Rajesh Kumar', 'Modern Industries Pvt Ltd', 'RELED transformed our factory with their industrial lighting solutions. Energy savings exceeded our expectations and the quality is outstanding.', 5, NULL, true, 0, '2026-06-17T10:25:44.301Z');
INSERT INTO testimonials (id, customer_name, company_name, testimonial_text, star_rating, photo_url, is_active, sort_order, created_at) VALUES ('679a87d4-5bae-40b4-9e8e-13f772d3921f', 'Priya Sharma', 'Urban Mall Development', 'Outstanding quality and service. The architectural lighting brought our mall to life. Highly recommended for any commercial project.', 5, NULL, true, 1, '2026-06-17T10:25:44.301Z');
INSERT INTO testimonials (id, customer_name, company_name, testimonial_text, star_rating, photo_url, is_active, sort_order, created_at) VALUES ('e6d02dd2-e67f-47de-9afd-b34ffa75a89a', 'Amit Patel', 'GreenTech Infrastructure', 'Professional team, premium products. Our street lighting project was delivered on time and within budget. Great after-sales support.', 5, NULL, true, 2, '2026-06-17T10:25:44.301Z');
INSERT INTO testimonials (id, customer_name, company_name, testimonial_text, star_rating, photo_url, is_active, sort_order, created_at) VALUES ('7da94aa7-f409-436c-ab53-91b0f6567e97', 'Sneha Gupta', 'Hotel Grand Palace', 'The perfect lighting for our hotel. RELED understood our vision and delivered beyond expectations. Our guests love the ambiance.', 5, NULL, true, 3, '2026-06-17T10:25:44.301Z');

-- FAQs Data
DELETE FROM faqs;
INSERT INTO faqs (id, question, answer, sort_order, is_active, created_at) VALUES ('a54107b6-9d8d-4e28-9e97-232d97923061', 'What warranty do you offer on your LED products?', 'We offer a comprehensive warranty ranging from 2 to 5 years depending on the product category. All our products come with guaranteed performance and dedicated after-sales support.', 0, true, '2026-06-17T10:25:44.301Z');
INSERT INTO faqs (id, question, answer, sort_order, is_active, created_at) VALUES ('6657355e-e046-4837-8681-0abe16044e80', 'Do you provide installation services?', 'Yes, we have a network of certified installation partners across the country. We can provide end-to-end solutions from product selection to installation and commissioning.', 1, true, '2026-06-17T10:25:44.301Z');
INSERT INTO faqs (id, question, answer, sort_order, is_active, created_at) VALUES ('681d74bf-d124-479e-824b-2ce71761ce23', 'What is the typical lifespan of your LED lights?', 'Our LED products are designed to last 50,000 to 100,000 hours depending on the product type. This translates to approximately 10-15 years of normal usage with minimal maintenance.', 2, true, '2026-06-17T10:25:44.301Z');
INSERT INTO faqs (id, question, answer, sort_order, is_active, created_at) VALUES ('38f46e21-1bff-465b-bf31-815f3c30eaa6', 'Can I get custom lighting solutions for my project?', 'Absolutely! We specialize in custom lighting solutions. Our team of engineers can design and manufacture products tailored to your specific requirements, including custom specifications, colors, and form factors.', 3, true, '2026-06-17T10:25:44.301Z');

-- Enquiries Data
DELETE FROM enquiries;
INSERT INTO enquiries (id, full_name, phone, email, city, state, product_category, product_name, message, status, created_at, updated_at) VALUES ('f4c3699d-89b5-4972-b5a3-22afb7b3bcdd', 'John Doe', '9876543210', 'john@example.com', 'Indore', 'Madhya Pradesh', NULL, 'Premium LED Panel 60x60', 'Interested in bulk order.', 'new', '2026-06-17T10:31:44.097Z', '2026-06-17T10:31:44.097Z');
INSERT INTO enquiries (id, full_name, phone, email, city, state, product_category, product_name, message, status, created_at, updated_at) VALUES ('4e5a78d7-05db-4f93-8ebe-2f3d32088ca5', 'test', '9754027339', 'manali.suryawanshi23@gmail.com', 'Indore', 'Madhya Pradesh', NULL, 'LED light', 'hghfghgfhfg', 'new', '2026-06-18T14:57:45.600Z', '2026-06-18T14:57:45.600Z');

-- =====================================================
-- END OF BACKUP
-- =====================================================
