-- Categories Data
INSERT INTO categories (id, name, slug, description, image_url, sort_order, is_active) VALUES
('3bfd3420-656d-4e61-95f8-a8faac558653', 'Indoor Lighting', 'indoor-lighting', '', '/uploads/indoor_lighting_1781880234381.png', 1, true),
('3f309009-946b-4ed6-b360-d532f62b9ccf', 'Outdoor Lighting', 'outdoor-lighting', '', '/uploads/outdoor_lighting_1781880246488.png', 2, true),
('2e12107a-5e66-4f39-97f6-268c521ddd47', 'Architectural Lighting', 'architectural-lighting', '', '/uploads/architectural_lighting_1781880260327.png', 3, true),
('ac69dd9b-c2ff-41bd-b435-cbf5648764c8', 'Decorative Pole', 'decorative-pole', '', '/uploads/decorative_pole_1781880276468.png', 4, true),
('46b38567-e6bf-4345-ad07-08d5663be11d', 'Underwater Light', 'underwater-light', '', '/uploads/underwater_light_1781880291711.png', 5, true),
('1c0f594f-0c80-49b7-a75f-6b86ef2a7118', 'EV Charger', 'ev-charger', '', '/uploads/ev_charger_1781880304776.png', 6, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, image_url = EXCLUDED.image_url, sort_order = EXCLUDED.sort_order;

-- Subcategories Data
INSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active) VALUES
('c05731c9-de7e-44aa-9bae-550b2d7703d6', '3bfd3420-656d-4e61-95f8-a8faac558653', 'LED Panel Light', 'led-panel-light', '', 1, true),
('be498ec6-cc7c-42ca-bf5d-2549cc806573', '3bfd3420-656d-4e61-95f8-a8faac558653', 'LED COB Light', 'led-cob-light', '', 2, true),
('eae5eec6-6309-48b6-be97-bb4998338752', '3bfd3420-656d-4e61-95f8-a8faac558653', 'LED Bulb / Tube Light', 'led-bulb-tube-light', '', 3, true),
('3faaf121-211a-4dfa-9748-2c0f4cb5c52f', '3bfd3420-656d-4e61-95f8-a8faac558653', 'LED Track Light', 'led-track-light', '', 4, true),
('24eca157-3978-42c0-9428-74013710865c', '3bfd3420-656d-4e61-95f8-a8faac558653', 'LED Cylinder Light', 'led-cylinder-light', '', 5, true),
('8079ac33-731f-4cf9-a305-fd707b96200f', '3f309009-946b-4ed6-b360-d532f62b9ccf', 'LED Street Light', 'led-street-light', '', 1, true),
('0ab4fe42-b253-4860-b1e4-76fe2a242800', '3f309009-946b-4ed6-b360-d532f62b9ccf', 'LED Flood Light', 'led-flood-light', '', 2, true),
('f6522db6-4420-4d3d-925f-e391b6bcfc56', '3f309009-946b-4ed6-b360-d532f62b9ccf', 'LED Stadium Light', 'led-stadium-light', '', 3, true),
('70ef590e-7842-4b5d-9449-858878668af5', '3f309009-946b-4ed6-b360-d532f62b9ccf', 'LED Highway Light', 'led-highway-light', '', 4, true),
('141f5214-a9cc-4f3a-b89d-0ebb26d7aaba', '3f309009-946b-4ed6-b360-d532f62b9ccf', 'LED Solar Light', 'led-solar-light', '', 5, true),
('501552dc-9960-4b89-bbb7-fc67e6cf7a1c', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'COB Light', 'cob-light', '', 1, true),
('f55c9264-a3ea-45b0-b1c2-601d535bff36', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'Magnetic Light', 'magnetic-light', '', 2, true),
('68758cfa-c88f-4ab7-8366-0b64c8735fb0', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'Strip Light / SMPS', 'strip-light-smps', '', 3, true),
('676e5878-0c36-4f43-8eee-063accde7b3a', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'LED Foot Lamp', 'led-foot-lamp', '', 4, true),
('9230f5a8-1fbf-4b97-8b5b-55b9ac81f932', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'Profile Light', 'profile-light', '', 5, true),
('ce74d64f-fe02-44ee-b7a9-d687dec73c14', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'Hanging Profile Light', 'hanging-profile-light', '', 6, true),
('80dba48a-a37c-4a3c-abf5-01fff832d950', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'Gimble Lighting', 'gimble-lighting', '', 7, true),
('08c47831-bc23-4b8f-a11a-bd133152ee9a', '2e12107a-5e66-4f39-97f6-268c521ddd47', 'Facade Lighting', 'facade-lighting', '', 8, true),
('75381d1e-cedb-498e-9018-5264bec0f9b3', 'ac69dd9b-c2ff-41bd-b435-cbf5648764c8', 'Pole Light', 'pole-light', '', 1, true),
('5ffb9abb-c9e5-4c13-91e0-790e86044888', 'ac69dd9b-c2ff-41bd-b435-cbf5648764c8', 'Bollard Light', 'bollard-light', '', 2, true),
('14fdd7b5-dcee-4e93-82df-ca6dacce3a33', '46b38567-e6bf-4345-ad07-08d5663be11d', 'Inground Light', 'inground-light', '', 1, true),
('a8ca30dc-1dc0-4f76-8af0-e98bbd56a80d', '46b38567-e6bf-4345-ad07-08d5663be11d', 'Nozzle Light', 'nozzle-light', '', 2, true),
('80a9598c-e30c-4016-bf8f-75ae2409217e', '46b38567-e6bf-4345-ad07-08d5663be11d', 'Garden Light', 'garden-light', '', 3, true),
('c5197bc7-8287-475c-a932-e001b552ddce', '46b38567-e6bf-4345-ad07-08d5663be11d', 'Fiber Optic Light', 'fiber-optic-light', '', 4, true),
('20832115-2e9d-4ee4-8de4-3bbb923a3240', '46b38567-e6bf-4345-ad07-08d5663be11d', 'Wall Washer Light', 'wall-washer-light', '', 5, true),
('01f64642-de8a-46e1-9c98-0f39854c71c0', '46b38567-e6bf-4345-ad07-08d5663be11d', 'DMX Flood Light', 'dmx-flood-light', '', 6, true),
('af284254-1338-43a5-aa78-afb2ef622317', '1c0f594f-0c80-49b7-a75f-6b86ef2a7118', 'AC EV Charger', 'ac-ev-charger', '', 1, true),
('98d44bd5-b8e8-4142-b84b-f14430c64378', '1c0f594f-0c80-49b7-a75f-6b86ef2a7118', 'DC Fast Charger', 'dc-fast-charger', '', 2, true),
('c9d1a911-9281-4e12-a7c6-aa4b2cbcfaf9', '1c0f594f-0c80-49b7-a75f-6b86ef2a7118', 'Home EV Charger', 'home-ev-charger', '', 3, true),
('f5416811-aa61-4806-be7c-b97edb4b3c53', '1c0f594f-0c80-49b7-a75f-6b86ef2a7118', 'Commercial EV Charger', 'commercial-ev-charger', '', 4, true),
('09f4af24-3536-40ce-b8e8-ef1dc2a6235e', '1c0f594f-0c80-49b7-a75f-6b86ef2a7118', 'EV Charging Station', 'ev-charging-station', '', 5, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order, category_id = EXCLUDED.category_id;

