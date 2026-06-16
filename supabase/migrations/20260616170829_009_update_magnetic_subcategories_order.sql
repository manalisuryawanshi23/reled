-- Update sort orders for Magnetic Lighting subcategories
UPDATE subcategories SET sort_order = 1 WHERE slug = 'magnetic-lighting-10mm-sleek';
UPDATE subcategories SET sort_order = 2 WHERE slug = 'magnetic-lighting-20mm';

-- Update sort orders for nested subcategories under Magnetic Lighting 20mm
UPDATE subcategories SET sort_order = 1 WHERE slug = 'magnetic-linear';
UPDATE subcategories SET sort_order = 2 WHERE slug = 'magnetic-profile';
UPDATE subcategories SET sort_order = 3 WHERE slug = 'magnetic-foldable-linear';
UPDATE subcategories SET sort_order = 4 WHERE slug = 'magnetic-foldable-profile';
UPDATE subcategories SET sort_order = 5 WHERE slug = 'magnetic-tiltable-linear-profile';
UPDATE subcategories SET sort_order = 6 WHERE slug = 'magnetic-track-series';
UPDATE subcategories SET sort_order = 7 WHERE slug = 'magnetic-spot';
UPDATE subcategories SET sort_order = 8 WHERE slug = 'magnetic-pendent';