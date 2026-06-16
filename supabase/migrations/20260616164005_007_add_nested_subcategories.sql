-- ============================================
-- NESTED SUBCATEGORIES UNDER MAGNETIC LIGHTING 20mm
-- ============================================
INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Magnetic Linear', 'magnetic-linear', 'https://images.pexels.com/photos/1159102/pexels-photo-1159102.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'magnetic-lights' AND s.slug = 'magnetic-lighting-20mm';

INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Magnetic Profile', 'magnetic-profile', 'https://images.pexels.com/photos/1112580/pexels-photo-1112580.jpeg?auto=compress&cs=tinysrgb&w=400', 2, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'magnetic-lights' AND s.slug = 'magnetic-lighting-20mm';

INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Magnetic Foldable Linear', 'magnetic-foldable-linear', 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400', 3, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'magnetic-lights' AND s.slug = 'magnetic-lighting-20mm';

INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Magnetic Foldable Profile', 'magnetic-foldable-profile', 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=400', 4, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'magnetic-lights' AND s.slug = 'magnetic-lighting-20mm';

INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Magnetic Tiltable Linear Profile', 'magnetic-tiltable-linear-profile', 'https://images.pexels.com/photos/1031506/pexels-photo-1031506.jpeg?auto=compress&cs=tinysrgb&w=400', 5, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'magnetic-lights' AND s.slug = 'magnetic-lighting-20mm';

INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Magnetic Track Series', 'magnetic-track-series', 'https://images.pexels.com/photos/1159102/pexels-photo-1159102.jpeg?auto=compress&cs=tinysrgb&w=400', 6, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'magnetic-lights' AND s.slug = 'magnetic-lighting-20mm';

INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Magnetic Spot', 'magnetic-spot', 'https://images.pexels.com/photos/356968/pexels-photo-356968.jpeg?auto=compress&cs=tinysrgb&w=400', 7, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'magnetic-lights' AND s.slug = 'magnetic-lighting-20mm';

INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Magnetic Pendent', 'magnetic-pendent', 'https://images.pexels.com/photos/109347/pexels-photo-109347.jpeg?auto=compress&cs=tinysrgb&w=400', 8, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'magnetic-lights' AND s.slug = 'magnetic-lighting-20mm';

-- ============================================
-- NESTED SUBCATEGORIES UNDER FLOOD LIGHT SERIES
-- ============================================
INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Modular Flood Light', 'modular-flood-light', 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'outdoor-lights' AND s.slug = 'flood-light-series';

INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'WS Flood Light', 'ws-flood-light', 'https://images.pexels.com/photos/258389/pexels-photo-258389.jpeg?auto=compress&cs=tinysrgb&w=400', 2, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'outdoor-lights' AND s.slug = 'flood-light-series';

INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Ultra Slim', 'ultra-slim-flood', 'https://images.pexels.com/photos/241694/pexels-photo-241694.jpeg?auto=compress&cs=tinysrgb&w=400', 3, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'outdoor-lights' AND s.slug = 'flood-light-series';

INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Striker Flood Light', 'striker-flood-light', 'https://images.pexels.com/photos/219792/pexels-photo-219792.jpeg?auto=compress&cs=tinysrgb&w=400', 4, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'outdoor-lights' AND s.slug = 'flood-light-series';

INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Aura Flood Light', 'aura-flood-light', 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=400', 5, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'outdoor-lights' AND s.slug = 'flood-light-series';

-- ============================================
-- NESTED SUBCATEGORIES UNDER STREET LIGHTS (OUTDOOR)
-- ============================================
INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Street Lights', 'street-lights-nested', 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'outdoor-lights' AND s.slug = 'outdoor-street-lights';

-- ============================================
-- NESTED SUBCATEGORIES UNDER GARDEN LIGHT (OUTDOOR)
-- ============================================
INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'Bollard Lights', 'bollard-lights', 'https://images.pexels.com/photos/219792/pexels-photo-219792.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'outdoor-lights' AND s.slug = 'outdoor-garden-light';

-- ============================================
-- NESTED SUBCATEGORIES UNDER UFO HIGHBAY SERIES
-- ============================================
INSERT INTO subcategories (category_id, name, slug, image_url, sort_order, is_active, parent_id)
SELECT c.id, 'UFO Highbay', 'ufo-highbay', 'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true, s.id 
FROM categories c, subcategories s WHERE c.slug = 'industrial' AND s.slug = 'ufo-highbay-series';