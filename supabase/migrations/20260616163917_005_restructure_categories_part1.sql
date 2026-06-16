-- Add parent_id column for nested subcategories and image_url
ALTER TABLE subcategories ADD COLUMN parent_id uuid REFERENCES subcategories(id) ON DELETE CASCADE;
ALTER TABLE subcategories ADD COLUMN image_url text;

-- Clear existing data
DELETE FROM subcategories;
DELETE FROM categories;

-- Insert main categories
INSERT INTO categories (name, slug, description, image_url, sort_order, is_active) VALUES
('Indoor Lights', 'indoor-lights', 'Premium LED solutions for homes, offices, and commercial interiors', 'https://images.pexels.com/photos/1112580/pexels-photo-1112580.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
('Magnetic Lights', 'magnetic-lights', 'Modern magnetic track lighting systems for flexible illumination', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800', 2, true),
('Profile Lights', 'profile-lights', 'LED aluminum profile lights for architectural applications', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800', 3, true),
('Outdoor Lights', 'outdoor-lights', 'Weather-resistant lighting for landscapes, streets, and facades', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=800', 4, true),
('Industrial', 'industrial', 'High-performance lighting for factories, warehouses, and manufacturing', 'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=800', 5, true),
('Facade Lights', 'facade-lights', 'Architectural facade and wall washer lighting solutions', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800', 6, true),
('Under Water Light', 'under-water-light', 'Waterproof lighting solutions for pools, fountains, and water features', 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800', 7, true),
('EV Chargers', 'ev-chargers', 'Electric vehicle charging solutions', 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800', 8, true);