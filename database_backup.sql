-- =====================================================
-- RELED Database Complete Backup
-- Generated: 2026-06-16
-- =====================================================

-- =====================================================
-- TABLE STRUCTURES
-- =====================================================

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    company_name TEXT DEFAULT 'RELED',
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

-- Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
-- DATA
-- =====================================================

-- Settings Data
INSERT INTO settings (id, company_name, tagline, address, phone_1, whatsapp_number, email, hero_slides, about_text, years_experience, projects_completed, iso_certified) VALUES
(1, 'RELED', 'Illuminating Excellence', '123 Industrial Area, New Delhi, India', '+91-9876543210', '+919876543210', 'info@reled.com',
'[{"headline":"Illuminate Your World","subheadline":"Premium LED lighting solutions for every space","image_url":"https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=1920","cta_text":"Explore Products","cta_link":"/products"},{"headline":"Architectural Excellence","subheadline":"Transform buildings into stunning visual experiences","image_url":"https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920","cta_text":"View Solutions","cta_link":"/products/category/architectural"},{"headline":"Industrial Strength","subheadline":"Reliable lighting for demanding environments","image_url":"https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=1920","cta_text":"Learn More","cta_link":"/sectors"}]',
'RELED is a leading manufacturer and supplier of premium LED lighting solutions. We specialize in indoor, outdoor, architectural, and industrial lighting systems designed to meet the highest standards of quality, efficiency, and aesthetics. Our products are trusted by businesses across India for their reliability, energy efficiency, and superior performance.',
10, 500, true)
ON CONFLICT (id) DO NOTHING;

-- Categories Data
INSERT INTO categories (id, name, slug, description, image_url, sort_order, is_active) VALUES
('6cf1d935-a59b-4c1c-a4e9-e260356213b5', 'Indoor Lights', 'indoor-lights', 'Premium LED solutions for homes, offices, and commercial interiors', 'https://images.pexels.com/photos/1112580/pexels-photo-1112580.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
('4a2af03e-9a16-49f4-a1de-db34c2db4c7c', 'Magnetic Lights', 'magnetic-lights', 'Modern magnetic track lighting systems for flexible illumination', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800', 2, true),
('b0da26f0-868f-4e0f-839b-f60587d689fb', 'Profile Lights', 'profile-lights', 'LED aluminum profile lights for architectural applications', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800', 3, true),
('8eb720a2-8bf3-4697-9882-18edf97ce41b', 'Outdoor Lights', 'outdoor-lights', 'Weather-resistant lighting for landscapes, streets, and facades', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800', 4, true),
('78dec9b1-8355-44f1-8c61-d9d9fa5a4426', 'Industrial', 'industrial', 'High-performance lighting for factories, warehouses, and manufacturing', 'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=800', 5, true),
('ca5732f6-13e0-4c2b-a61e-6ee9c81dfc64', 'Facade Lights', 'facade-lights', 'Architectural facade and wall washer lighting solutions', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800', 6, true),
('26317183-57e3-443f-bde1-3d3b453a3fb6', 'Under Water Light', 'under-water-light', 'Waterproof lighting solutions for pools, fountains, and water features', 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800', 7, true),
('d67dbe2c-085d-41a4-9ea3-2f153765ef37', 'EV Chargers', 'ev-chargers', 'Electric vehicle charging solutions', 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800', 8, true)
ON CONFLICT (id) DO NOTHING;

-- Subcategories Data
INSERT INTO subcategories (id, category_id, name, slug, sort_order, is_active, parent_id, image_url) VALUES
-- Indoor Lights subcategories
('bc98254d-eaee-4229-90ad-d50264e74393', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', 'Spark Series', 'spark-series', 1, true, NULL, 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400'),
('132d8aa3-68ee-4833-9845-82c98d28fde8', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', 'Surface Light', 'surface-light', 2, true, NULL, 'https://images.pexels.com/photos/1014774/pexels-photo-1014774.jpeg?auto=compress&cs=tinysrgb&w=400'),
('20201746-fabb-4cec-a5b9-9a376a3c8310', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', 'Altima Series', 'altima-series', 3, true, NULL, 'https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=400'),
('b168b0a5-87da-4533-9133-c900384dab41', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', 'COB', 'cob', 4, true, NULL, 'https://images.pexels.com/photos/1031506/pexels-photo-1031506.jpeg?auto=compress&cs=tinysrgb&w=400'),
('54bc3115-a1c1-4168-98b5-2c6c2f523c4f', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', 'Sonic Series', 'sonic-series', 5, true, NULL, 'https://images.pexels.com/photos/1009628/pexels-photo-1009628.jpeg?auto=compress&cs=tinysrgb&w=400'),
('9a6e679f-801c-4f36-8aee-7d82c5ab041b', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', 'Downlight Series', 'downlight-series', 6, true, NULL, 'https://images.pexels.com/photos/1112580/pexels-photo-1112580.jpeg?auto=compress&cs=tinysrgb&w=400'),
('1edf0ab5-0888-42b2-933d-df15620d97d9', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', 'Slim', 'slim', 7, true, NULL, 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400'),
('3738c3c6-e390-4eff-93aa-e4f7bd57625c', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', 'Track Light', 'track-light', 8, true, NULL, 'https://images.pexels.com/photos/1159102/pexels-photo-1159102.jpeg?auto=compress&cs=tinysrgb&w=400'),
('12b09ba9-e0a3-42f0-af5c-b37d1da30d41', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', 'Tube Light', 'tube-light', 9, true, NULL, 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400'),
('e29244ec-3c4f-4570-81a5-532a45a7dd80', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', 'Zoom Light', 'zoom-light', 10, true, NULL, 'https://images.pexels.com/photos/356968/pexels-photo-356968.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Magnetic Lights subcategories (top level)
('5b8f6279-91f5-481c-9203-331b02b1c39f', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', 'Magnetic Lighting 10mm Sleek', 'magnetic-lighting-10mm-sleek', 1, true, NULL, 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400'),
('6f0dbcf0-19b8-47d4-806d-df2fc9e10042', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', 'Magnetic Lighting 20mm', 'magnetic-lighting-20mm', 2, true, NULL, 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Magnetic Lights 20mm nested subcategories
('14cc4ba9-e165-4b9a-a44a-11154ba5df2e', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', 'Magnetic Linear', 'magnetic-linear', 1, true, '6f0dbcf0-19b8-47d4-806d-df2fc9e10042', 'https://images.pexels.com/photos/1159102/pexels-photo-1159102.jpeg?auto=compress&cs=tinysrgb&w=400'),
('80d696fa-8f0f-4d20-96fa-d9b3ae82668c', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', 'Magnetic Profile', 'magnetic-profile', 2, true, '6f0dbcf0-19b8-47d4-806d-df2fc9e10042', 'https://images.pexels.com/photos/1112580/pexels-photo-1112580.jpeg?auto=compress&cs=tinysrgb&w=400'),
('feb206a8-5c7d-4f6f-8ff6-af9080ae71f2', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', 'Magnetic Foldable Linear', 'magnetic-foldable-linear', 3, true, '6f0dbcf0-19b8-47d4-806d-df2fc9e10042', 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400'),
('43155ba7-ec57-4811-a657-8d2194c95822', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', 'Magnetic Foldable Profile', 'magnetic-foldable-profile', 4, true, '6f0dbcf0-19b8-47d4-806d-df2fc9e10042', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=400'),
('5f9f1726-9b2c-440d-9e37-a563813454c3', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', 'Magnetic Tiltable Linear Profile', 'magnetic-tiltable-linear-profile', 5, true, '6f0dbcf0-19b8-47d4-806d-df2fc9e10042', 'https://images.pexels.com/photos/1031506/pexels-photo-1031506.jpeg?auto=compress&cs=tinysrgb&w=400'),
('14acd677-acbb-4c7a-b450-962a11469a5a', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', 'Magnetic Track Series', 'magnetic-track-series', 6, true, '6f0dbcf0-19b8-47d4-806d-df2fc9e10042', 'https://images.pexels.com/photos/1159102/pexels-photo-1159102.jpeg?auto=compress&cs=tinysrgb&w=400'),
('8b129a83-29a2-4d8b-98f8-963c417342d2', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', 'Magnetic Spot', 'magnetic-spot', 7, true, '6f0dbcf0-19b8-47d4-806d-df2fc9e10042', 'https://images.pexels.com/photos/356968/pexels-photo-356968.jpeg?auto=compress&cs=tinysrgb&w=400'),
('71b02fe8-b248-4e15-a77b-426e6b525679', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', 'Magnetic Pendent', 'magnetic-pendent', 8, true, '6f0dbcf0-19b8-47d4-806d-df2fc9e10042', 'https://images.pexels.com/photos/109347/pexels-photo-109347.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Profile Lights subcategories
('b54029f7-4f25-4502-ac9a-22f1b817f746', 'b0da26f0-868f-4e0f-839b-f60587d689fb', 'LED Aluminum Profile', 'led-aluminum-profile', 1, true, NULL, 'https://images.pexels.com/photos/1112580/pexels-photo-1112580.jpeg?auto=compress&cs=tinysrgb&w=400'),
('9755602a-8acc-466a-9277-4d4f92108f40', 'b0da26f0-868f-4e0f-839b-f60587d689fb', 'Geometrical Shapes Profile', 'geometrical-shapes-profile', 2, true, NULL, 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Outdoor Lights subcategories
('269cce47-164d-40be-9139-0a4b893945b8', '8eb720a2-8bf3-4697-9882-18edf97ce41b', 'Flood Light Series', 'flood-light-series', 1, true, NULL, 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=400'),
('2cfa472f-212f-4582-a867-badf4f38971f', '8eb720a2-8bf3-4697-9882-18edf97ce41b', 'Street Lights', 'outdoor-street-lights', 2, true, NULL, 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinyrgb&w=400'),
('5587a48e-d8ed-4c63-94b0-a45912009221', '8eb720a2-8bf3-4697-9882-18edf97ce41b', 'Garden Light', 'outdoor-garden-light', 3, true, NULL, 'https://images.pexels.com/photos/109347/pexels-photo-109347.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Industrial subcategories
('46714d70-0a09-4c50-a6c3-bd8471e33161', '78dec9b1-8355-44f1-8c61-d9d9fa5a4426', 'UFO Highbay Series', 'ufo-highbay-series', 1, true, NULL, 'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=400'),
('b9624157-b794-4aa8-8e68-cacdaea7fa96', '78dec9b1-8355-44f1-8c61-d9d9fa5a4426', 'Modular Highbay', 'modular-highbay', 2, true, NULL, 'https://images.pexels.com/photos/2431258/pexels-photo-2431258.jpeg?auto=compress&cs=tinysrgb&w=400'),
('de993ed0-6a2b-4f25-83da-3262bccce147', '78dec9b1-8355-44f1-8c61-d9d9fa5a4426', 'Ignito Highbay Series', 'ignito-highbay-series', 3, true, NULL, 'https://images.pexels.com/photos/1290424/pexels-photo-1290424.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Facade Lights subcategories
('f9f4bf18-7a73-42d8-b7e8-1d676199a8e2', 'ca5732f6-13e0-4c2b-a61e-6ee9c81dfc64', 'Flood Lights RGBW / Mono', 'flood-lights-rgbw-mono', 1, true, NULL, 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=400'),
('7d224054-fa05-4f44-ace4-55fbdb8e2209', 'ca5732f6-13e0-4c2b-a61e-6ee9c81dfc64', 'Linear Wall Washer', 'linear-wall-washer', 2, true, NULL, 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400'),
('2f095285-ce97-4bd0-95e0-d62626aac17b', 'ca5732f6-13e0-4c2b-a61e-6ee9c81dfc64', 'Fountain Light', 'fountain-light', 3, true, NULL, 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400'),
('21918488-d09b-4598-b6e7-8702bbc4300e', 'ca5732f6-13e0-4c2b-a61e-6ee9c81dfc64', 'Under Water Light', 'facade-under-water-light', 4, true, NULL, 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400'),
('276a4f56-213b-4ac0-91ae-e0b91829b9aa', 'ca5732f6-13e0-4c2b-a61e-6ee9c81dfc64', 'Linear Inground Light', 'linear-inground-light', 5, true, NULL, 'https://images.pexels.com/photos/219792/pexels-photo-219792.jpeg?auto=compress&cs=tinysrgb&w=400'),
('50345470-fdcc-4936-b636-77e908229edb', 'ca5732f6-13e0-4c2b-a61e-6ee9c81dfc64', 'Round Inground Light', 'round-inground-light', 6, true, NULL, 'https://images.pexels.com/photos/109347/pexels-photo-109347.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- Under Water Light subcategories
('f2791bb6-19af-4c0e-b0d5-63fb115802ba', '26317183-57e3-443f-bde1-3d3b453a3fb6', 'Nozzle Light', 'nozzle-light', 1, true, NULL, 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400'),
('0e8bb800-3240-44c8-9878-91e01a8ab41b', '26317183-57e3-443f-bde1-3d3b453a3fb6', 'Garden Light', 'underwater-garden-light', 2, true, NULL, 'https://images.pexels.com/photos/109347/pexels-photo-109347.jpeg?auto=compress&cs=tinysrgb&w=400'),
('bcb60d4e-d779-4fc3-ba67-5536130815f2', '26317183-57e3-443f-bde1-3d3b453a3fb6', 'Fiber Optic Light', 'fiber-optic-light', 3, true, NULL, 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=400'),
('e1638bfd-1e36-4b2e-85fd-fd09f24d1b21', '26317183-57e3-443f-bde1-3d3b453a3fb6', 'Wall Washer Light', 'wall-washer-light', 4, true, NULL, 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400'),
('5f71403d-d7d4-4bfb-b393-531f6f4308e2', '26317183-57e3-443f-bde1-3d3b453a3fb6', 'DMX Flood Light', 'dmx-flood-light', 5, true, NULL, 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=400'),
('0c80eb8a-4c23-4a14-944c-aa8f5c70d0f6', '26317183-57e3-443f-bde1-3d3b453a3fb6', 'Inground Light', 'inground-light', 6, true, NULL, 'https://images.pexels.com/photos/219792/pexels-photo-219792.jpeg?auto=compress&cs=tinysrgb&w=400'),

-- EV Chargers subcategories
('8e6b12f4-b46d-4e84-ade9-b0876adbbc1c', 'd67dbe2c-085d-41a4-9ea3-2f153765ef37', 'EV Chargers', 'ev-chargers-sub', 1, true, NULL, 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400')
ON CONFLICT (id) DO NOTHING;

-- Products Data
INSERT INTO products (id, name, slug, category_id, subcategory_id, short_description, full_description, specifications, images, status, cover_image_url) VALUES
('ab8a9bb1-2fdf-43cf-b894-1d2e193e9be8', 'Premium LED Panel 60x60', 'premium-led-panel-60x60', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', '9a6e679f-801c-4f36-8aee-7d82c5ab041b',
'Ultra-thin edge-lit LED panel with uniform brightness',
'High-quality edge-lit LED panel designed for modern office spaces. Features excellent color rendering with CRI>80, flicker-free driver, and 50,000 hours lifespan.',
'{"Wattage": "36W", "Size": "600x600mm", "CRI": ">80", "Color Temp": "4000K", "Lifespan": "50,000 hrs", "IP Rating": "IP20"}',
ARRAY['https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', NULL),

('b7ae3584-e06a-48ad-b7f0-b0f0f6ee9dba', 'Square LED Downlight', 'square-led-downlight', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', '9a6e679f-801c-4f36-8aee-7d82c5ab041b',
'Recessed square downlight with anti-glare design',
'Modern square LED downlight with deep recessed design for reduced glare. Perfect for retail stores, hotels, and residential applications.',
'{"Wattage": "12W", "Cut-out": "150x150mm", "Beam Angle": "60°", "Color Temp": "3000K/4000K", "Material": "Aluminum"}',
ARRAY['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', NULL),

('40e7159c-4da1-44cb-ba56-baeb9b34cd40', 'LED Street Light 50W', 'led-street-light-50w', '8eb720a2-8bf3-4697-9882-18edf97ce41b', '2cfa472f-212f-4582-a867-badf4f38971f',
'IK10 rated street light with surge protection',
'Robust LED street light designed for urban roads and streets. Features multiple surge protection, IP66 rating, and tool-less access for maintenance.',
'{"Wattage": "50W", "Lumen": "6500lm", "IP Rating": "IP66", "IK Rating": "IK10", "Color Temp": "4000K", "Warranty": "5 Years"}',
ARRAY['https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', NULL),

('7202339b-393d-44be-96a9-8a1199a69c32', 'Architectural Linear Light', 'architectural-linear-light', 'b0da26f0-868f-4e0f-839b-f60587d689fb', 'b54029f7-4f25-4502-ac9a-22f1b817f746',
'Slim profile linear luminaire for cove and graze lighting',
'Sleek linear LED luminaire ideal for architectural lighting applications. Features adjustable beam angles and seamless linking for continuous runs.',
'{"Wattage": "20W/m", "Length": "1000mm/1500mm/2000mm", "Beam Angle": "30°/60°", "Color Temp": "3000K/4000K/RGB"}',
ARRAY['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', NULL),

('8c0a0724-1756-4486-978c-174f561c7a14', 'Industrial High Bay LED', 'industrial-high-bay-led', '78dec9b1-8355-44f1-8c61-d9d9fa5a4426', '46714d70-0a09-4c50-a6c3-bd8471e33161',
'High-efficiency UFO high bay for factory lighting',
'UFO-style high bay luminaire with efficient heat dissipation. Perfect for factories, warehouses, and gymnasiums with mounting heights up to 12m.',
'{"Wattage": "100W/150W/200W", "Lumen": "13000-26000lm", "IP Rating": "IP65", "Color Temp": "5000K", "Mounting": "Suspension/Surface", "Warranty": "5 Years"}',
ARRAY['https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', NULL),

('6e7a29bc-286d-4d3c-ad0e-22d4c01fc64c', 'Magnetic Track System Complete Kit', 'magnetic-track-system-kit', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '5b8f6279-91f5-481c-9203-331b02b1c39f',
'Complete magnetic track lighting system with adjustable spots',
'Modern magnetic track lighting system featuring 10mm sleek profile, adjustable LED spots, and easy installation. Perfect for residential and commercial applications.',
'{"Wattage": "24W/m", "Length": "2m", "Spots": "5 included", "Color Temp": "3000K/4000K", "Material": "Aluminum"}',
ARRAY['https://images.pexels.com/photos/1159102/pexels-photo-1159102.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1159102/pexels-photo-1159102.jpeg?auto=compress&cs=tinysrgb&w=800'),

('c35b0f79-a7e0-4a15-9423-8428c3147a7c', 'COB Spotlight Pro', 'cob-spotlight-pro', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', 'b168b0a5-87da-4533-9133-c900384dab41',
'Professional COB spotlight with honeycomb anti-glare design',
'High-quality COB spotlight featuring honeycomb anti-glare technology, excellent color rendering with CRI>90, and precision beam control. Ideal for retail and gallery lighting.',
'{"Wattage": "15W", "Lumen": "1200lm", "CRI": ">90", "Beam Angle": "24°", "Color Temp": "3000K"}',
ARRAY['https://images.pexels.com/photos/1031506/pexels-photo-1031506.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1031506/pexels-photo-1031506.jpeg?auto=compress&cs=tinysrgb&w=800'),

('da2c775c-e75c-4985-ae7e-49aeab245203', 'Aura Flood Light 1000W', 'aura-flood-light-1000w', '8eb720a2-8bf3-4697-9882-18edf97ce41b', '269cce47-164d-40be-9139-0a4b893945b8',
'High-power LED flood light for sports and industrial applications',
'Professional grade LED flood light with advanced thermal management, IP66 rating, and surge protection. Perfect for sports facilities, parking lots, and industrial yards.',
'{"Wattage": "1000W", "Lumen": "120000lm", "Beam Angle": "120°", "IP Rating": "IP66", "Color Temp": "5700K", "Warranty": "5 Years"}',
ARRAY['https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800'),

('5bd22ce8-24f8-4b1c-9e6c-e9fb64f4e45a', 'UFO Highbay 200W', 'ufo-highbay-200w', '78dec9b1-8355-44f1-8c61-d9d9fa5a4426', '46714d70-0a09-4c50-a6c3-bd8471e33161',
'UFO-style high bay for warehouses and factories',
'Compact UFO highbay luminaire with efficient heat sink design, microwave sensor option, and IP65 rating. Suitable for mounting heights 6-15m.',
'{"Wattage": "200W", "Lumen": "26000lm", "IP Rating": "IP65", "Color Temp": "5000K", "Mounting Height": "6-15m"}',
ARRAY['https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=800'),

('e842b871-4a6c-4348-9b30-844626661b66', 'Linear Wall Washer RGBW', 'linear-wall-washer-rgbw', 'ca5732f6-13e0-4c2b-a61e-6ee9c81dfc64', '7d224054-fa05-4f44-ace4-55fbdb8e2209',
'RGBW linear wall washer for architectural facades',
'IP67 rated linear wall washer with RGBW color mixing, DMX control, and seamless linking capability. Creates stunning architectural lighting effects.',
'{"Wattage": "48W/m", "Length": "1000mm", "Colors": "RGBW", "Control": "DMX512", "IP Rating": "IP67"}',
ARRAY['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'),

('714169a1-90c3-4f11-8eb1-b3ea8e6551ee', 'Underwater Pool Light', 'underwater-pool-light', '26317183-57e3-443f-bde1-3d3b453a3fb6', 'f2791bb6-19af-4c0e-b0d5-63fb115802ba',
'IP68 rated underwater LED light for pools and fountains',
'Premium underwater LED light with IP68 rating, stainless steel housing, and RGB color changing. Perfect for swimming pools, fountains, and water features.',
'{"Wattage": "18W", "Housing": "Stainless Steel 316", "IP Rating": "IP68", "Colors": "RGB+White", "Control": "Remote/DMX"}',
ARRAY['https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800'),

('ad78518f-abec-4b32-b43a-c3bbb20dd73c', '10mm Sleek Magnetic Track Kit', '10mm-sleek-magnetic-track-kit', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '5b8f6279-91f5-481c-9203-331b02b1c39f',
'Ultra-slim 10mm magnetic track lighting system',
'Modern ultra-slim 10mm magnetic track system with adjustable LED spots. Perfect for contemporary interiors with minimal visual footprint. Easy installation and flexible spot positioning.',
'{"Track Width": "10mm", "Wattage": "15W/m", "Length Options": "1m, 1.5m, 2m", "Color Temp": "3000K/4000K", "Spots Included": "3-5 (configurable)"}',
ARRAY['https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800'),

('6d832bc3-5428-49a7-99a1-3151bb79e176', 'Magnetic Linear Light 40W', 'magnetic-linear-light-40w', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '14cc4ba9-e165-4b9a-a44a-11154ba5df2e',
'Professional magnetic linear light module',
'High-output magnetic linear light module compatible with 20mm track systems. Uniform light distribution with high CRI>95 for retail and commercial applications.',
'{"Wattage": "40W", "Lumen Output": "4800lm", "CRI": ">95", "Color Temp": "3000K/4000K/5000K", "Length": "900mm"}',
ARRAY['https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800'),

('35add7df-6baf-4735-994a-0243ac9de07e', 'Aluminum Magnetic Profile', 'aluminum-magnetic-profile', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '80d696fa-8f0f-4d20-96fa-d9b3ae82668c',
'Premium aluminum magnetic profile for track systems',
'Anodized aluminum magnetic profile designed for 20mm magnetic track systems. Available in black, white, and silver finishes. Snap-on installation for light modules.',
'{"Material": "Anodized Aluminum", "Finish": "Black/White/Silver", "Length": "1m, 2m, custom", "Width": "20mm"}',
ARRAY['https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800'),

('404418a3-d395-4575-bdc9-3c1bd8594a33', 'Foldable Magnetic Linear 30W', 'foldable-magnetic-linear-30w', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', 'feb206a8-5c7d-4f6f-8ff6-af9080ae71f2',
'Flexible foldable magnetic linear light for curved installations',
'Innovative foldable magnetic linear light module that can bend to create curved lighting designs. Perfect for architectural features and retail displays.',
'{"Wattage": "30W", "Length": "600mm", "Bend Angle": "0-180°", "Color Temp": "3000K/4000K"}',
ARRAY['https://images.pexels.com/photos/1545527/pexels-photo-1545527.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1545527/pexels-photo-1545527.jpeg?auto=compress&cs=tinysrgb&w=800'),

('90999e50-1ab0-462b-b372-d75fd4cd43c2', 'Flexible Magnetic Foldable Profile', 'flexible-magnetic-foldable-profile', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '43155ba7-ec57-4811-a657-8d2194c95822',
'Bendable aluminum profile for curved magnetic track layouts',
'Flexible foldable aluminum profile for magnetic track systems. Create stunning curved and circular lighting designs in commercial and residential spaces.',
'{"Material": "Flexible Aluminum", "Min Bend Radius": "300mm", "Length": "1m extended", "Surface": "Powder Coated"}',
ARRAY['https://images.pexels.com/photos/1545527/pexels-photo-1545527.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1545527/pexels-photo-1545527.jpeg?auto=compress&cs=tinysrgb&w=800'),

('36c56641-e8a0-4764-a66c-ba2a2c656f57', 'Tiltable Magnetic Linear Profile', 'tiltable-magnetic-linear-profile', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '5f9f1726-9b2c-440d-9e37-a563813454c3',
'Adjustable angle magnetic linear profile for directional lighting',
'Premium tiltable linear profile with 0-45° adjustable angle for precise light direction. Ideal for wall washing, accent lighting, and task lighting applications.',
'{"Tilt Angle": "0-45°", "Material": "Aluminum", "Length": "600mm, 900mm, 1200mm", "Mounting": "Surface/Recessed"}',
ARRAY['https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800'),

('0526279a-886d-45ae-8880-918e5f6f175b', 'Magnetic Track 20mm System', 'magnetic-track-20mm-system', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '14acd677-acbb-4c7a-b450-962a11469a5a',
'Complete 20mm magnetic track lighting system with connectors',
'Professional 20mm magnetic track system with comprehensive connector accessories. Includes L-connectors, T-connectors, X-connectors, and flexible connectors for versatile layouts.',
'{"Track Width": "20mm", "Voltage": "48V DC", "Max Load": "100W/m", "Connectors": "L/T/X/Flexible"}',
ARRAY['https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800'),

('c4de7cb7-d7c2-4567-9643-d35005672b3e', 'Magnetic Adjustable Spot Light', 'magnetic-adjustable-spot-light', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '8b129a83-29a2-4d8b-98f8-963c417342d2',
'Magnetic spot light with 360° rotation and adjustable beam',
'Versatile magnetic spot light compatible with 20mm track systems. Features 360° horizontal rotation, 90° vertical tilt, and adjustable beam angle. Available in multiple wattages.',
'{"Wattage": "5W/7W/10W", "Beam Angle": "15°/24°/36°", "Rotation": "360° Horizontal", "Tilt": "90° Vertical"}',
ARRAY['https://images.pexels.com/photos/1031506/pexels-photo-1031506.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1031506/pexels-photo-1031506.jpeg?auto=compress&cs=tinysrgb&w=800'),

('8a9145cd-fae6-4855-a43a-6650dadf2247', 'Magnetic Pendant Light', 'magnetic-pendant-light', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '71b02fe8-b248-4e15-a77b-426e6b525679',
'Magnetic pendant light module for suspended installations',
'Elegant magnetic pendant light module compatible with 20mm track systems. Adjustable suspension height, available in different designs and color temperatures.',
'{"Wattage": "12W", "Lumen": "900lm", "Suspension": "Adjustable 0.5-2m", "Color Temp": "2700K/3000K/4000K"}',
ARRAY['https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT (id) DO NOTHING;

-- Sectors Data
INSERT INTO sectors (id, name, slug, short_description, full_description, image_url, is_active, sort_order) VALUES
('024f9139-da90-4816-a0b0-115bd95824bd', 'Industrial', 'industrial', 'High-performance lighting for factories, warehouses, and manufacturing facilities.', 'Our industrial LED solutions are designed for demanding environments including factories, warehouses, and manufacturing plants. With high lumen output, excellent heat dissipation, and IP65+ ratings, our industrial lights ensure maximum productivity and safety.', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800', true, 0),
('1c492b79-2f38-4765-bd30-513930944dd4', 'Commercial', 'commercial', 'Modern lighting solutions for offices, malls, and commercial spaces.', 'Transform your commercial spaces with our energy-efficient LED lighting. Perfect for offices, shopping malls, and corporate buildings, our solutions enhance aesthetics while reducing operational costs.', 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800', true, 1),
('69848d38-8239-4667-8e11-f520ecf5e6b5', 'Retail', 'retail', 'Eye-catching displays and ambient lighting for retail environments.', 'Create compelling shopping experiences with our retail lighting solutions. From accent lighting for product displays to ambient illumination for the entire store.', 'https://images.pexels.com/photos/264942/pexels-photo-264942.jpeg?auto=compress&cs=tinysrgb&w=800', true, 2),
('3a7e454f-2dda-4303-beeb-77d35e5f444e', 'Sports', 'sports', 'Professional-grade lighting for stadiums, arenas, and sports complexes.', 'Illuminate sports venues with broadcast-quality lighting. Our sports lighting solutions meet international standards for television broadcasting.', 'https://images.pexels.com/photos/315866/pexels-photo-315866.jpeg?auto=compress&cs=tinysrgb&w=800', true, 3),
('4eaa99b7-e363-44b1-ad05-cad9ae02f184', 'Infrastructure', 'infrastructure', 'Reliable lighting for roads, bridges, and public infrastructure.', 'Our infrastructure lighting solutions provide safe and efficient illumination for roads, bridges, tunnels, and public spaces.', 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800', true, 4),
('4e22e010-3e40-41b6-a20d-b8e464947251', 'Hospitality', 'hospitality', 'Warm, inviting lighting for hotels, restaurants, and resorts.', 'Create memorable experiences with our hospitality lighting solutions. Perfect for hotels, restaurants, and resorts.', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800', true, 5)
ON CONFLICT (id) DO NOTHING;

-- Gallery Data
INSERT INTO gallery (id, title, category, image_url, project_name, is_active) VALUES
('420fa365-2957-4e53-99b0-c2a325bca923', 'City Mall Project', 'Indoor Projects', 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800', 'City Mall Delhi', true),
('1f903681-2dc9-4143-99fa-376bfdb01153', 'Factory Lighting', 'Industrial Projects', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800', 'TechPark Manufacturing', true),
('58b07ea3-b07b-4f2e-b2f4-4150fdeaadbb', 'Hotel Lobby', 'Hospitality Projects', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800', 'Grand Palace Hotel', true),
('4df3b8ab-cc0b-4606-9853-0bddeea9bb01', 'Street Lighting', 'Infrastructure Projects', 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800', 'Smart City Initiative', true)
ON CONFLICT (id) DO NOTHING;

-- Testimonials Data
INSERT INTO testimonials (id, customer_name, company_name, testimonial_text, star_rating, is_active, sort_order) VALUES
('a644281a-426a-491c-bac6-9f5ae6034d12', 'Rajesh Kumar', 'Modern Industries Pvt Ltd', 'RELED transformed our factory with their industrial lighting solutions. Energy savings exceeded our expectations and the quality is outstanding.', 5, true, 0),
('679a87d4-5bae-40b4-9e8e-13f772d3921f', 'Priya Sharma', 'Urban Mall Development', 'Outstanding quality and service. The architectural lighting brought our mall to life. Highly recommended for any commercial project.', 5, true, 1),
('e6d02dd2-e67f-47de-9afd-b34ffa75a89a', 'Amit Patel', 'GreenTech Infrastructure', 'Professional team, premium products. Our street lighting project was delivered on time and within budget. Great after-sales support.', 5, true, 2),
('7da94aa7-f409-436c-ab53-91b0f6567e97', 'Sneha Gupta', 'Hotel Grand Palace', 'The perfect lighting for our hotel. RELED understood our vision and delivered beyond expectations. Our guests love the ambiance.', 5, true, 3)
ON CONFLICT (id) DO NOTHING;

-- FAQs Data
INSERT INTO faqs (id, question, answer, sort_order, is_active) VALUES
('a54107b6-9d8d-4e28-9e97-232d97923061', 'What warranty do you offer on your LED products?', 'We offer a comprehensive warranty ranging from 2 to 5 years depending on the product category. All our products come with guaranteed performance and dedicated after-sales support.', 0, true),
('6657355e-e046-4837-8681-0abe16044e80', 'Do you provide installation services?', 'Yes, we have a network of certified installation partners across the country. We can provide end-to-end solutions from product selection to installation and commissioning.', 1, true),
('681d74bf-d124-479e-824b-2ce71761ce23', 'What is the typical lifespan of your LED lights?', 'Our LED products are designed to last 50,000 to 100,000 hours depending on the product type. This translates to approximately 10-15 years of normal usage with minimal maintenance.', 2, true),
('38f46e21-1bff-465b-bf31-815f3c30eaa6', 'Can I get custom lighting solutions for my project?', 'Absolutely! We specialize in custom lighting solutions. Our team of engineers can design and manufacture products tailored to your specific requirements, including custom specifications, colors, and form factors.', 3, true)
ON CONFLICT (id) DO NOTHING;

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
-- END OF BACKUP
-- =====================================================
