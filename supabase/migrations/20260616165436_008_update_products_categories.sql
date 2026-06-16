-- Update existing products to have proper category and subcategory assignments

-- Premium LED Panel 60x60 - Indoor Lights > Downlight Series
UPDATE products SET 
  category_id = '6cf1d935-a59b-4c1c-a4e9-e260356213b5',
  subcategory_id = '9a6e679f-801c-4f36-8aee-7d82c5ab041b'
WHERE name = 'Premium LED Panel 60x60';

-- Square LED Downlight - Indoor Lights > Downlight Series
UPDATE products SET 
  category_id = '6cf1d935-a59b-4c1c-a4e9-e260356213b5',
  subcategory_id = '9a6e679f-801c-4f36-8aee-7d82c5ab041b'
WHERE name = 'Square LED Downlight';

-- LED Street Light 50W - Outdoor Lights > Street Lights
UPDATE products SET 
  category_id = '8eb720a2-8bf3-4697-9882-18edf97ce41b',
  subcategory_id = '2cfa472f-212f-4582-a867-badf4f38971f'
WHERE name = 'LED Street Light 50W';

-- Architectural Linear Light - Profile Lights > LED Aluminum Profile
UPDATE products SET 
  category_id = 'b0da26f0-868f-4e0f-839b-f60587d689fb',
  subcategory_id = 'b54029f7-4f25-4502-ac9a-22f1b817f746'
WHERE name = 'Architectural Linear Light';

-- Industrial High Bay LED - Industrial > UFO Highbay Series
UPDATE products SET 
  category_id = '78dec9b1-8355-44f1-8c61-d9d9fa5a4426',
  subcategory_id = '46714d70-0a09-4c50-a6c3-bd8471e33161'
WHERE name = 'Industrial High Bay LED';

-- Add more sample products for better demonstration
INSERT INTO products (name, slug, category_id, subcategory_id, short_description, full_description, specifications, images, status, cover_image_url) VALUES

-- Indoor Products
('Magnetic Track System Complete Kit', 'magnetic-track-system-kit', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '5b8f6279-91f5-481c-9203-331b02b1c39f', 'Complete magnetic track lighting system with adjustable spots', 'Modern magnetic track lighting system featuring 10mm sleek profile, adjustable LED spots, and easy installation. Perfect for residential and commercial applications.', '{"Wattage": "24W/m", "Length": "2m", "Color Temp": "3000K/4000K", "Spots": "5 included", "Material": "Aluminum"}', ARRAY['https://images.pexels.com/photos/1159102/pexels-photo-1159102.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1159102/pexels-photo-1159102.jpeg?auto=compress&cs=tinysrgb&w=800'),

('COB Spotlight Pro', 'cob-spotlight-pro', '6cf1d935-a59b-4c1c-a4e9-e260356213b5', 'b168b0a5-87da-4533-9133-c900384dab41', 'Professional COB spotlight with honeycomb anti-glare design', 'High-quality COB spotlight featuring honeycomb anti-glare technology, excellent color rendering with CRI>90, and precision beam control. Ideal for retail and gallery lighting.', '{"Wattage": "15W", "Beam Angle": "24°", "CRI": ">90", "Lumen": "1200lm", "Color Temp": "3000K"}', ARRAY['https://images.pexels.com/photos/1031506/pexels-photo-1031506.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1031506/pexels-photo-1031506.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Outdoor Products
('Aura Flood Light 1000W', 'aura-flood-light-1000w', '8eb720a2-8bf3-4697-9882-18edf97ce41b', '269cce47-164d-40be-9139-0a4b893945b8', 'High-power LED flood light for sports and industrial applications', 'Professional grade LED flood light with advanced thermal management, IP66 rating, and surge protection. Perfect for sports facilities, parking lots, and industrial yards.', '{"Wattage": "1000W", "Lumen": "120000lm", "Beam Angle": "120°", "IP Rating": "IP66", "Color Temp": "5700K", "Warranty": "5 Years"}', ARRAY['https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Industrial Products  
('UFO Highbay 200W', 'ufo-highbay-200w', '78dec9b1-8355-44f1-8c61-d9d9fa5a4426', '46714d70-0a09-4c50-a6c3-bd8471e33161', 'UFO-style high bay for warehouses and factories', 'Compact UFO highbay luminaire with efficient heat sink design, microwave sensor option, and IP65 rating. Suitable for mounting heights 6-15m.', '{"Wattage": "200W", "Lumen": "26000lm", "Color Temp": "5000K", "IP Rating": "IP65", "Mounting Height": "6-15m"}', ARRAY['https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Facade Products
('Linear Wall Washer RGBW', 'linear-wall-washer-rgbw', 'ca5732f6-13e0-4c2b-a61e-6ee9c81dfc64', '7d224054-fa05-4f44-ace4-55fbdb8e2209', 'RGBW linear wall washer for architectural facades', 'IP67 rated linear wall washer with RGBW color mixing, DMX control, and seamless linking capability. Creates stunning architectural lighting effects.', '{"Wattage": "48W/m", "Length": "1000mm", "Colors": "RGBW", "Control": "DMX512", "IP Rating": "IP67"}', ARRAY['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'),

('Underwater Pool Light', 'underwater-pool-light', '26317183-57e3-443f-bde1-3d3b453a3fb6', 'f2791bb6-19af-4c0e-b0d5-63fb115802ba', 'IP68 rated underwater LED light for pools and fountains', 'Premium underwater LED light with IP68 rating, stainless steel housing, and RGB color changing. Perfect for swimming pools, fountains, and water features.', '{"Wattage": "18W", "Housing": "Stainless Steel 316", "IP Rating": "IP68", "Colors": "RGB+White", "Control": "Remote/DMX"}', ARRAY['https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800'], 'active', 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800');