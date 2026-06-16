-- Insert sample categories
INSERT INTO categories (name, slug, description, image_url, sort_order, is_active) VALUES
('Indoor Lighting', 'indoor', 'Premium LED solutions for homes, offices, and commercial interiors', 'https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800', 0, true),
('Outdoor Lighting', 'outdoor', 'Weather-resistant lighting for landscapes, streets, and facades', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
('Architectural Lighting', 'architectural', 'Designer lighting to enhance building aesthetics and ambiance', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800', 2, true),
('Industrial Lighting', 'industrial', 'High-performance lighting for factories, warehouses, and manufacturing', 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800', 3, true);

-- Insert sample subcategories
INSERT INTO subcategories (category_id, name, slug, sort_order, is_active)
SELECT id, 'LED Panels', 'led-panels', 0, true FROM categories WHERE slug = 'indoor'
UNION ALL
SELECT id, 'Downlights', 'downlights', 1, true FROM categories WHERE slug = 'indoor'
UNION ALL
SELECT id, 'Tube Lights', 'tube-lights', 2, true FROM categories WHERE slug = 'indoor'
UNION ALL
SELECT id, 'Street Lights', 'street-lights', 0, true FROM categories WHERE slug = 'outdoor'
UNION ALL
SELECT id, 'Flood Lights', 'flood-lights', 1, true FROM categories WHERE slug = 'outdoor'
UNION ALL
SELECT id, 'Linear Lights', 'linear-lights', 0, true FROM categories WHERE slug = 'architectural'
UNION ALL
SELECT id, 'Wall Washers', 'wall-washers', 1, true FROM categories WHERE slug = 'architectural'
UNION ALL
SELECT id, 'High Bay', 'high-bay', 0, true FROM categories WHERE slug = 'industrial';

-- Insert sample products
DO $$
DECLARE
  indoor_id uuid;
  outdoor_id uuid;
  arch_id uuid;
  ind_id uuid;
BEGIN
  SELECT id INTO indoor_id FROM categories WHERE slug = 'indoor';
  SELECT id INTO outdoor_id FROM categories WHERE slug = 'outdoor';
  SELECT id INTO arch_id FROM categories WHERE slug = 'architectural';
  SELECT id INTO ind_id FROM categories WHERE slug = 'industrial';

  INSERT INTO products (name, slug, category_id, short_description, full_description, specifications, images, status) VALUES
  ('Premium LED Panel 60x60', 'premium-led-panel-60x60', indoor_id, 'Ultra-thin edge-lit LED panel with uniform brightness', 'High-quality edge-lit LED panel designed for modern office spaces. Features excellent color rendering with CRI>80, flicker-free driver, and 50,000 hours lifespan.', '{"Wattage": "36W", "Size": "600x600mm", "Color Temp": "4000K", "CRI": ">80", "Lifespan": "50,000 hrs", "IP Rating": "IP20"}', ARRAY['https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active'),
  ('Square LED Downlight', 'square-led-downlight', indoor_id, 'Recessed square downlight with anti-glare design', 'Modern square LED downlight with deep recessed design for reduced glare. Perfect for retail stores, hotels, and residential applications.', '{"Wattage": "12W", "Cut-out": "150x150mm", "Color Temp": "3000K/4000K", "Beam Angle": "60°", "Material": "Aluminum"}', ARRAY['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active'),
  ('LED Street Light 50W', 'led-street-light-50w', outdoor_id, 'IK10 rated street light with surge protection', 'Robust LED street light designed for urban roads and streets. Features multiple surge protection, IP66 rating, and tool-less access for maintenance.', '{"Wattage": "50W", "Lumen": "6500lm", "Color Temp": "4000K", "IP Rating": "IP66", "IK Rating": "IK10", "Warranty": "5 Years"}', ARRAY['https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active'),
  ('Architectural Linear Light', 'architectural-linear-light', arch_id, 'Slim profile linear luminaire for cove and graze lighting', 'Sleek linear LED luminaire ideal for architectural lighting applications. Features adjustable beam angles and seamless linking for continuous runs.', '{"Wattage": "20W/m", "Length": "1000mm/1500mm/2000mm", "Color Temp": "3000K/4000K/RGB", "Beam Angle": "30°/60°"}', ARRAY['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active'),
  ('Industrial High Bay LED', 'industrial-high-bay-led', ind_id, 'High-efficiency UFO high bay for factory lighting', 'UFO-style high bay luminaire with efficient heat dissipation. Perfect for factories, warehouses, and gymnasiums with mounting heights up to 12m.', '{"Wattage": "100W/150W/200W", "Lumen": "13000-26000lm", "Color Temp": "5000K", "IP Rating": "IP65", "Mounting": "Suspension/Surface", "Warranty": "5 Years"}', ARRAY['https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active');
END $$;

-- Insert sample gallery items
INSERT INTO gallery (title, category, image_url, project_name, is_active) VALUES
('City Mall Project', 'Indoor Projects', 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800', 'City Mall Delhi', true),
('Factory Lighting', 'Industrial Projects', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800', 'TechPark Manufacturing', true),
('Hotel Lobby', 'Hospitality Projects', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800', 'Grand Palace Hotel', true),
('Street Lighting', 'Infrastructure Projects', 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800', 'Smart City Initiative', true);

-- Insert sample testimonials
INSERT INTO testimonials (customer_name, company_name, testimonial_text, star_rating, is_active, sort_order) VALUES
('Rajesh Kumar', 'Modern Industries Pvt Ltd', 'RELED transformed our factory with their industrial lighting solutions. Energy savings exceeded our expectations and the quality is outstanding.', 5, true, 0),
('Priya Sharma', 'Urban Mall Development', 'Outstanding quality and service. The architectural lighting brought our mall to life. Highly recommended for any commercial project.', 5, true, 1),
('Amit Patel', 'GreenTech Infrastructure', 'Professional team, premium products. Our street lighting project was delivered on time and within budget. Great after-sales support.', 5, true, 2),
('Sneha Gupta', 'Hotel Grand Palace', 'The perfect lighting for our hotel. RELED understood our vision and delivered beyond expectations. Our guests love the ambiance.', 5, true, 3);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, sort_order, is_active) VALUES
('What warranty do you offer on your LED products?', 'We offer a comprehensive warranty ranging from 2 to 5 years depending on the product category. All our products come with guaranteed performance and dedicated after-sales support.', 0, true),
('Do you provide installation services?', 'Yes, we have a network of certified installation partners across the country. We can provide end-to-end solutions from product selection to installation and commissioning.', 1, true),
('What is the typical lifespan of your LED lights?', 'Our LED products are designed to last 50,000 to 100,000 hours depending on the product type. This translates to approximately 10-15 years of normal usage with minimal maintenance.', 2, true),
('Can I get custom lighting solutions for my project?', 'Absolutely! We specialize in custom lighting solutions. Our team of engineers can design and manufacture products tailored to your specific requirements, including custom specifications, colors, and form factors.', 3, true);

-- Insert sample sectors
INSERT INTO sectors (name, slug, short_description, full_description, image_url, sort_order, is_active) VALUES
('Industrial', 'industrial', 'High-performance lighting for factories, warehouses, and manufacturing facilities.', 'Our industrial LED solutions are designed for demanding environments including factories, warehouses, and manufacturing plants. With high lumen output, excellent heat dissipation, and IP65+ ratings, our industrial lights ensure maximum productivity and safety.', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800', 0, true),
('Commercial', 'commercial', 'Modern lighting solutions for offices, malls, and commercial spaces.', 'Transform your commercial spaces with our energy-efficient LED lighting. Perfect for offices, shopping malls, and corporate buildings, our solutions enhance aesthetics while reducing operational costs.', 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
('Retail', 'retail', 'Eye-catching displays and ambient lighting for retail environments.', 'Create compelling shopping experiences with our retail lighting solutions. From accent lighting for product displays to ambient illumination for the entire store.', 'https://images.pexels.com/photos/264942/pexels-photo-264942.jpeg?auto=compress&cs=tinysrgb&w=800', 2, true),
('Sports', 'sports', 'Professional-grade lighting for stadiums, arenas, and sports complexes.', 'Illuminate sports venues with broadcast-quality lighting. Our sports lighting solutions meet international standards for television broadcasting.', 'https://images.pexels.com/photos/315866/pexels-photo-315866.jpeg?auto=compress&cs=tinysrgb&w=800', 3, true),
('Infrastructure', 'infrastructure', 'Reliable lighting for roads, bridges, and public infrastructure.', 'Our infrastructure lighting solutions provide safe and efficient illumination for roads, bridges, tunnels, and public spaces.', 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800', 4, true),
('Hospitality', 'hospitality', 'Warm, inviting lighting for hotels, restaurants, and resorts.', 'Create memorable experiences with our hospitality lighting solutions. Perfect for hotels, restaurants, and resorts.', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800', 5, true);

-- Update settings with sample hero slides
UPDATE settings SET 
  hero_slides = '[
    {"image_url": "https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=1920", "headline": "Illuminate Your World", "subheadline": "Premium LED lighting solutions for every space", "cta_text": "Explore Products", "cta_link": "/products"},
    {"image_url": "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920", "headline": "Architectural Excellence", "subheadline": "Transform buildings into stunning visual experiences", "cta_text": "View Solutions", "cta_link": "/products/category/architectural"},
    {"image_url": "https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=1920", "headline": "Industrial Strength", "subheadline": "Reliable lighting for demanding environments", "cta_text": "Learn More", "cta_link": "/sectors"}
  ]'::jsonb,
  about_text = 'RELED is a leading manufacturer and supplier of premium LED lighting solutions. We specialize in indoor, outdoor, architectural, and industrial lighting systems designed to meet the highest standards of quality, efficiency, and aesthetics. Our products are trusted by businesses across India for their reliability, energy efficiency, and superior performance.'
WHERE id = 1;