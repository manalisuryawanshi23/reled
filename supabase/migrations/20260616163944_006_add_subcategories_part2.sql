-- ============================================
-- INDOOR LIGHTS SUBCATEGORIES
-- ============================================
INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active)
SELECT id, 'Spark Series', 'spark-series', 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Surface Light', 'surface-light', 'https://images.pexels.com/photos/1014774/pexels-photo-1014774.jpeg?auto=compress&cs=tinysrgb&w=400', 2, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Altima Series', 'altima-series', 'https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=400', 3, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'COB', 'cob', 'https://images.pexels.com/photos/1031506/pexels-photo-1031506.jpeg?auto=compress&cs=tinysrgb&w=400', 4, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Sonic Series', 'sonic-series', 'https://images.pexels.com/photos/1009628/pexels-photo-1009628.jpeg?auto=compress&cs=tinysrgb&w=400', 5, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Downlight Series', 'downlight-series', 'https://images.pexels.com/photos/1112580/pexels-photo-1112580.jpeg?auto=compress&cs=tinysrgb&w=400', 6, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Slim', 'slim', 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400', 7, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Track Light', 'track-light', 'https://images.pexels.com/photos/1159102/pexels-photo-1159102.jpeg?auto=compress&cs=tinysrgb&w=400', 8, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Tube Light', 'tube-light', 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400', 9, true FROM categories WHERE slug = 'indoor-lights'
UNION ALL
SELECT id, 'Zoom Light', 'zoom-light', 'https://images.pexels.com/photos/356968/pexels-photo-356968.jpeg?auto=compress&cs=tinysrgb&w=400', 10, true FROM categories WHERE slug = 'indoor-lights';

-- ============================================
-- MAGNETIC LIGHTS SUBCATEGORIES (parent groups)
-- ============================================
INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active)
SELECT id, 'Magnetic Lighting 10mm Sleek', 'magnetic-lighting-10mm-sleek', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true FROM categories WHERE slug = 'magnetic-lights'
UNION ALL
SELECT id, 'Magnetic Lighting 20mm', 'magnetic-lighting-20mm', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=400', 2, true FROM categories WHERE slug = 'magnetic-lights';

-- ============================================
-- PROFILE LIGHTS SUBCATEGORIES
-- ============================================
INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active)
SELECT id, 'LED Aluminum Profile', 'led-aluminum-profile', 'https://images.pexels.com/photos/1112580/pexels-photo-1112580.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true FROM categories WHERE slug = 'profile-lights'
UNION ALL
SELECT id, 'Geometrical Shapes Profile', 'geometrical-shapes-profile', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=400', 2, true FROM categories WHERE slug = 'profile-lights';

-- ============================================
-- OUTDOOR LIGHTS SUBCATEGORIES (parent groups)
-- ============================================
INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active)
SELECT id, 'Flood Light Series', 'flood-light-series', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true FROM categories WHERE slug = 'outdoor-lights'
UNION ALL
SELECT id, 'Street Lights', 'outdoor-street-lights', 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400', 2, true FROM categories WHERE slug = 'outdoor-lights'
UNION ALL
SELECT id, 'Garden Light', 'outdoor-garden-light', 'https://images.pexels.com/photos/109347/pexels-photo-109347.jpeg?auto=compress&cs=tinysrgb&w=400', 3, true FROM categories WHERE slug = 'outdoor-lights';

-- ============================================
-- INDUSTRIAL SUBCATEGORIES (parent groups)
-- ============================================
INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active)
SELECT id, 'UFO Highbay Series', 'ufo-highbay-series', 'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true FROM categories WHERE slug = 'industrial'
UNION ALL
SELECT id, 'Modular Highbay', 'modular-highbay', 'https://images.pexels.com/photos/2431258/pexels-photo-2431258.jpeg?auto=compress&cs=tinysrgb&w=400', 2, true FROM categories WHERE slug = 'industrial'
UNION ALL
SELECT id, 'Ignito Highbay Series', 'ignito-highbay-series', 'https://images.pexels.com/photos/1290424/pexels-photo-1290424.jpeg?auto=compress&cs=tinysrgb&w=400', 3, true FROM categories WHERE slug = 'industrial';

-- ============================================
-- FACADE LIGHTS SUBCATEGORIES
-- ============================================
INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active)
SELECT id, 'Flood Lights RGBW / Mono', 'flood-lights-rgbw-mono', 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true FROM categories WHERE slug = 'facade-lights'
UNION ALL
SELECT id, 'Linear Wall Washer', 'linear-wall-washer', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400', 2, true FROM categories WHERE slug = 'facade-lights'
UNION ALL
SELECT id, 'Fountain Light', 'fountain-light', 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400', 3, true FROM categories WHERE slug = 'facade-lights'
UNION ALL
SELECT id, 'Under Water Light', 'facade-under-water-light', 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400', 4, true FROM categories WHERE slug = 'facade-lights'
UNION ALL
SELECT id, 'Linear Inground Light', 'linear-inground-light', 'https://images.pexels.com/photos/219792/pexels-photo-219792.jpeg?auto=compress&cs=tinysrgb&w=400', 5, true FROM categories WHERE slug = 'facade-lights'
UNION ALL
SELECT id, 'Round Inground Light', 'round-inground-light', 'https://images.pexels.com/photos/109347/pexels-photo-109347.jpeg?auto=compress&cs=tinysrgb&w=400', 6, true FROM categories WHERE slug = 'facade-lights';

-- ============================================
-- UNDER WATER LIGHT SUBCATEGORIES
-- ============================================
INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active)
SELECT id, 'Nozzle Light', 'nozzle-light', 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true FROM categories WHERE slug = 'under-water-light'
UNION ALL
SELECT id, 'Garden Light', 'underwater-garden-light', 'https://images.pexels.com/photos/109347/pexels-photo-109347.jpeg?auto=compress&cs=tinysrgb&w=400', 2, true FROM categories WHERE slug = 'under-water-light'
UNION ALL
SELECT id, 'Fiber Optic Light', 'fiber-optic-light', 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=400', 3, true FROM categories WHERE slug = 'under-water-light'
UNION ALL
SELECT id, 'Wall Washer Light', 'wall-washer-light', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400', 4, true FROM categories WHERE slug = 'under-water-light'
UNION ALL
SELECT id, 'DMX Flood Light', 'dmx-flood-light', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=400', 5, true FROM categories WHERE slug = 'under-water-light'
UNION ALL
SELECT id, 'Inground Light', 'inground-light', 'https://images.pexels.com/photos/219792/pexels-photo-219792.jpeg?auto=compress&cs=tinysrgb&w=400', 6, true FROM categories WHERE slug = 'under-water-light';

-- ============================================
-- EV CHARGERS SUBCATEGORIES
-- ============================================
INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active)
SELECT id, 'EV Chargers', 'ev-chargers-sub', 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true FROM categories WHERE slug = 'ev-chargers';