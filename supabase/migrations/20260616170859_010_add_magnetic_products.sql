-- Add sample products for Magnetic Lighting subcategories
INSERT INTO products (id, name, slug, category_id, subcategory_id, short_description, full_description, specifications, images, status, cover_image_url) VALUES

-- Magnetic Lighting 10mm Sleek
(gen_random_uuid(), '10mm Sleek Magnetic Track Kit', '10mm-sleek-magnetic-track-kit', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '5b8f6279-91f5-481c-9203-331b02b1c39f', 
'Ultra-slim 10mm magnetic track lighting system', 
'Modern ultra-slim 10mm magnetic track system with adjustable LED spots. Perfect for contemporary interiors with minimal visual footprint. Easy installation and flexible spot positioning.',
'{"Track Width": "10mm", "Wattage": "15W/m", "Length Options": "1m, 1.5m, 2m", "Color Temp": "3000K/4000K", "Spots Included": "3-5 (configurable)"}',
ARRAY['https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800'],
'active', 'https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Magnetic Linear (under 20mm)
(gen_random_uuid(), 'Magnetic Linear Light 40W', 'magnetic-linear-light-40w', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '14cc4ba9-e165-4b9a-a44a-11154ba5df2e',
'Professional magnetic linear light module', 
'High-output magnetic linear light module compatible with 20mm track systems. Uniform light distribution with high CRI>95 for retail and commercial applications.',
'{"Wattage": "40W", "Lumen Output": "4800lm", "CRI": ">95", "Color Temp": "3000K/4000K/5000K", "Length": "900mm"}',
ARRAY['https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800'],
'active', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Magnetic Profile (under 20mm)
(gen_random_uuid(), 'Aluminum Magnetic Profile', 'aluminum-magnetic-profile', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '80d696fa-8f0f-4d20-96fa-d9b3ae82668c',
'Premium aluminum magnetic profile for track systems', 
'Anodized aluminum magnetic profile designed for 20mm magnetic track systems. Available in black, white, and silver finishes. Snap-on installation for light modules.',
'{"Material": "Anodized Aluminum", "Finish": "Black/White/Silver", "Length": "1m, 2m, custom", "Width": "20mm"}',
ARRAY['https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800'],
'active', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Magnetic Foldable Linear (under 20mm)
(gen_random_uuid(), 'Foldable Magnetic Linear 30W', 'foldable-magnetic-linear-30w', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', 'feb206a8-5c7d-4f6f-8ff6-af9080ae71f2',
'Flexible foldable magnetic linear light for curved installations', 
'Innovative foldable magnetic linear light module that can bend to create curved lighting designs. Perfect for architectural features and retail displays.',
'{"Wattage": "30W", "Length": "600mm", "Bend Angle": "0-180°", "Color Temp": "3000K/4000K"}',
ARRAY['https://images.pexels.com/photos/1545527/pexels-photo-1545527.jpeg?auto=compress&cs=tinysrgb&w=800'],
'active', 'https://images.pexels.com/photos/1545527/pexels-photo-1545527.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Magnetic Foldable Profile (under 20mm)
(gen_random_uuid(), 'Flexible Magnetic Foldable Profile', 'flexible-magnetic-foldable-profile', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '43155ba7-ec57-4811-a657-8d2194c95822',
'Bendable aluminum profile for curved magnetic track layouts', 
'Flexible foldable aluminum profile for magnetic track systems. Create stunning curved and circular lighting designs in commercial and residential spaces.',
'{"Material": "Flexible Aluminum", "Min Bend Radius": "300mm", "Length": "1m extended", "Surface": "Powder Coated"}',
ARRAY['https://images.pexels.com/photos/1545527/pexels-photo-1545527.jpeg?auto=compress&cs=tinysrgb&w=800'],
'active', 'https://images.pexels.com/photos/1545527/pexels-photo-1545527.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Magnetic Tiltable Linear Profile (under 20mm)
(gen_random_uuid(), 'Tiltable Magnetic Linear Profile', 'tiltable-magnetic-linear-profile', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '5f9f1726-9b2c-440d-9e37-a563813454c3',
'Adjustable angle magnetic linear profile for directional lighting', 
'Premium tiltable linear profile with 0-45° adjustable angle for precise light direction. Ideal for wall washing, accent lighting, and task lighting applications.',
'{"Tilt Angle": "0-45°", "Material": "Aluminum", "Length": "600mm, 900mm, 1200mm", "Mounting": "Surface/Recessed"}',
ARRAY['https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800'],
'active', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Magnetic Track Series (under 20mm)
(gen_random_uuid(), 'Magnetic Track 20mm System', 'magnetic-track-20mm-system', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '14acd677-acbb-4c7a-b450-962a11469a5a',
'Complete 20mm magnetic track lighting system with connectors', 
'Professional 20mm magnetic track system with comprehensive connector accessories. Includes L-connectors, T-connectors, X-connectors, and flexible connectors for versatile layouts.',
'{"Track Width": "20mm", "Voltage": "48V DC", "Max Load": "100W/m", "Connectors": "L/T/X/Flexible"}',
ARRAY['https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800'],
'active', 'https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Magnetic Spot (under 20mm)
(gen_random_uuid(), 'Magnetic Adjustable Spot Light', 'magnetic-adjustable-spot-light', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '8b129a83-29a2-4d8b-98f8-963c417342d2',
'Magnetic spot light with 360° rotation and adjustable beam', 
'Versatile magnetic spot light compatible with 20mm track systems. Features 360° horizontal rotation, 90° vertical tilt, and adjustable beam angle. Available in multiple wattages.',
'{"Wattage": "5W/7W/10W", "Beam Angle": "15°/24°/36°", "Rotation": "360° Horizontal", "Tilt": "90° Vertical"}',
ARRAY['https://images.pexels.com/photos/1031506/pexels-photo-1031506.jpeg?auto=compress&cs=tinysrgb&w=800'],
'active', 'https://images.pexels.com/photos/1031506/pexels-photo-1031506.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Magnetic Pendent (under 20mm)
(gen_random_uuid(), 'Magnetic Pendant Light', 'magnetic-pendant-light', '4a2af03e-9a16-49f4-a1de-db34c2db4c7c', '71b02fe8-b248-4e15-a77b-426e6b525679',
'Magnetic pendant light module for suspended installations', 
'Elegant magnetic pendant light module compatible with 20mm track systems. Adjustable suspension height, available in different designs and color temperatures.',
'{"Wattage": "12W", "Lumen": "900lm", "Suspension": "Adjustable 0.5-2m", "Color Temp": "2700K/3000K/4000K"}',
ARRAY['https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800'],
'active', 'https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800');