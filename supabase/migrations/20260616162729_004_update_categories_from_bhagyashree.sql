-- Clear existing categories and subcategories (cascade will delete subcategories)
DELETE FROM subcategories;
DELETE FROM categories;

-- Insert main categories from bhagyashreeindustries.in
INSERT INTO categories (name, slug, description, image_url, sort_order, is_active) VALUES
('Indoor Lights', 'indoor-lights', 'Indoor LED lighting solutions for homes, offices, and commercial interiors', 'https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
('Magnetic Lights', 'magnetic-lights', 'Modern magnetic track lighting systems for flexible illumination', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800', 2, true),
('Profile Lights', 'profile-lights', 'LED aluminum profile lights for architectural applications', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800', 3, true),
('Outdoor Lights', 'outdoor-lights', 'Weather-resistant lighting for landscapes, streets, and facades', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800', 4, true),
('Street Lights', 'street-lights', 'Designer street lights for urban infrastructure', 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800', 5, true),
('Industrial Lights', 'industrial-lights', 'High-performance lighting for factories, warehouses, and manufacturing', 'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=800', 6, true),
('Facade Lights', 'facade-lights', 'Architectural facade and wall washer lighting solutions', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800', 7, true),
('Garden Lights', 'garden-lights', 'Decorative and functional lighting for gardens and landscapes', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800', 8, true),
('EV Chargers', 'ev-chargers', 'Electric vehicle charging solutions', 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800', 9, true),
('Underwater Light', 'underwater-light', 'Waterproof lighting solutions for pools, fountains, and water features', 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800', 10, true);

-- Insert subcategories for Indoor Lights
INSERT INTO subcategories (category_id, name, slug, sort_order, is_active)
SELECT id, 'Spark Series', 'spark-series', 1, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Surface Light', 'surface-light', 2, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Altima Series', 'altima-series', 3, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'COB', 'cob', 4, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Sonic Series', 'sonic-series', 5, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Downlight Series', 'downlight-series', 6, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Slim', 'slim', 7, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Track Light', 'track-light', 8, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Tube Light', 'tube-light', 9, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Zoom Light', 'zoom-light', 10, true FROM categories WHERE slug = 'indoor-lights';

-- Insert subcategories for Magnetic Lights
INSERT INTO subcategories (category_id, name, slug, sort_order, is_active)
SELECT id, 'Foldable', 'foldable', 1, true FROM categories WHERE slug = 'magnetic-lights'
UNION ALL
SELECT id, 'Linear', 'linear', 2, true FROM categories WHERE slug = 'magnetic-lights'
UNION ALL
SELECT id, 'Pendent Series', 'pendent-series', 3, true FROM categories WHERE slug = 'magnetic-lights'
UNION ALL
SELECT id, 'Profile', 'profile', 4, true FROM categories WHERE slug = 'magnetic-lights'
UNION ALL
SELECT id, 'Spot Series', 'spot-series', 5, true FROM categories WHERE slug = 'magnetic-lights'
UNION ALL
SELECT id, 'Tiltable', 'tiltable', 6, true FROM categories WHERE slug = 'magnetic-lights'
UNION ALL
SELECT id, 'Track Series', 'track-series', 7, true FROM categories WHERE slug = 'magnetic-lights';

-- Insert subcategories for Profile Lights
INSERT INTO subcategories (category_id, name, slug, sort_order, is_active)
SELECT id, 'LED Aluminum Profile', 'led-aluminum-profile', 1, true FROM categories WHERE slug = 'profile-lights'
UNION ALL
SELECT id, 'Geometrical Shape', 'geometrical-shape', 2, true FROM categories WHERE slug = 'profile-lights'
UNION ALL
SELECT id, 'Hexagon Hanging Profile', 'hexagon-hanging-profile', 3, true FROM categories WHERE slug = 'profile-lights'
UNION ALL
SELECT id, 'Round Hanging Profile', 'round-hanging-profile', 4, true FROM categories WHERE slug = 'profile-lights'
UNION ALL
SELECT id, 'Triangle Hanging Profile', 'triangle-hanging-profile', 5, true FROM categories WHERE slug = 'profile-lights';

-- Insert subcategories for Outdoor Lights
INSERT INTO subcategories (category_id, name, slug, sort_order, is_active)
SELECT id, 'Modular Flood Light', 'modular-flood-light', 1, true FROM categories WHERE slug = 'outdoor-lights'
UNION ALL
SELECT id, 'Ultra Slim', 'ultra-slim', 2, true FROM categories WHERE slug = 'outdoor-lights'
UNION ALL
SELECT id, 'Striker Flood Light', 'striker-flood-light', 3, true FROM categories WHERE slug = 'outdoor-lights'
UNION ALL
SELECT id, 'Aura Flood Light', 'aura-flood-light', 4, true FROM categories WHERE slug = 'outdoor-lights'
UNION ALL
SELECT id, 'Elite Flood Light', 'elite-flood-light', 5, true FROM categories WHERE slug = 'outdoor-lights';

-- Insert subcategories for Street Lights
INSERT INTO subcategories (category_id, name, slug, sort_order, is_active)
SELECT id, 'Designer Street Light', 'designer-street-light', 1, true FROM categories WHERE slug = 'street-lights'
UNION ALL
SELECT id, 'Solar Street Light', 'solar-street-light', 2, true FROM categories WHERE slug = 'street-lights'
UNION ALL
SELECT id, 'LED Street Light', 'led-street-light', 3, true FROM categories WHERE slug = 'street-lights';
 
-- Insert subcategories for Industrial Lights
INSERT INTO subcategories (category_id, name, slug, sort_order, is_active)
SELECT id, 'UFO Highbay', 'ufo-highbay', 1, true FROM categories WHERE slug = 'industrial-lights'
UNION ALL
SELECT id, 'Modular Highbay', 'modular-highbay', 2, true FROM categories WHERE slug = 'industrial-lights'
UNION ALL
SELECT id, 'Ignito Highbay', 'ignito-highbay', 3, true FROM categories WHERE slug = 'industrial-lights';

-- Insert subcategories for Facade Lights
INSERT INTO subcategories (category_id, name, slug, sort_order, is_active)
SELECT id, 'Flood Lights RGBW/Mono', 'flood-lights-rgbw-mono', 1, true FROM categories WHERE slug = 'facade-lights'
UNION ALL
SELECT id, 'Linear Wall Washer', 'linear-wall-washer', 2, true FROM categories WHERE slug = 'facade-lights'
UNION ALL
SELECT id, 'Fountain Light', 'fountain-light', 3, true FROM categories WHERE slug = 'facade-lights'
UNION ALL
SELECT id, 'Under Water Light', 'under-water-light', 4, true FROM categories WHERE slug = 'facade-lights'
UNION ALL
SELECT id, 'Linear Inground Light', 'linear-inground-light', 5, true FROM categories WHERE slug = 'facade-lights'
UNION ALL
SELECT id, 'Round Inground Light', 'round-inground-light', 6, true FROM categories WHERE slug = 'facade-lights';

-- Insert subcategories for Garden Lights
INSERT INTO subcategories (category_id, name, slug, sort_order, is_active)
SELECT id, 'Bollard Lights', 'bollard-lights', 1, true FROM categories WHERE slug = 'garden-lights'
UNION ALL
SELECT id, 'Lawn Lights', 'lawn-lights', 2, true FROM categories WHERE slug = 'garden-lights'
UNION ALL
SELECT id, 'Step Lights', 'step-lights', 3, true FROM categories WHERE slug = 'garden-lights'
UNION ALL
SELECT id, 'Spot Lights', 'spot-lights', 4, true FROM categories WHERE slug = 'garden-lights';

-- Insert subcategories for EV Chargers
INSERT INTO subcategories (category_id, name, slug, sort_order, is_active)
SELECT id, 'Two Wheeler Chargers', 'two-wheeler-chargers', 1, true FROM categories WHERE slug = 'ev-chargers'
UNION ALL
SELECT id, 'Three Wheeler Chargers', 'three-wheeler-chargers', 2, true FROM categories WHERE slug = 'ev-chargers'
UNION ALL
SELECT id, 'Four Wheeler Chargers', 'four-wheeler-chargers', 3, true FROM categories WHERE slug = 'ev-chargers';

-- Insert subcategories for Underwater Light (new category requested)
INSERT INTO subcategories (category_id, name, slug, sort_order, is_active)
SELECT id, 'Nozzle Light', 'nozzle-light', 1, true FROM categories WHERE slug = 'underwater-light'
UNION ALL
SELECT id, 'Garden Light', 'garden-light', 2, true FROM categories WHERE slug = 'underwater-light'
UNION ALL
SELECT id, 'Fiber Optic Light', 'fiber-optic-light', 3, true FROM categories WHERE slug = 'underwater-light'
UNION ALL
SELECT id, 'Wall Washer Light', 'wall-washer-light', 4, true FROM categories WHERE slug = 'underwater-light'
UNION ALL
SELECT id, 'DMX Flood Light', 'dmx-flood-light', 5, true FROM categories WHERE slug = 'underwater-light'
UNION ALL
SELECT id, 'Inground Light', 'inground-light', 6, true FROM categories WHERE slug = 'underwater-light';
