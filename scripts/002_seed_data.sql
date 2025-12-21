-- Seed Categories
INSERT INTO categories (id, name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Pain Relief', 'Medicines for pain management and relief'),
  ('22222222-2222-2222-2222-222222222222', 'Antibiotics', 'Prescription antibiotics for bacterial infections'),
  ('33333333-3333-3333-3333-333333333333', 'Vitamins & Supplements', 'Dietary supplements and vitamins'),
  ('44444444-4444-4444-4444-444444444444', 'Cold & Flu', 'Medicines for cold, flu, and respiratory issues'),
  ('55555555-5555-5555-5555-555555555555', 'Digestive Health', 'Medicines for digestive system health'),
  ('66666666-6666-6666-6666-666666666666', 'Skin Care', 'Topical medicines and skincare products'),
  ('77777777-7777-7777-7777-777777777777', 'Heart & Blood Pressure', 'Cardiovascular medicines'),
  ('88888888-8888-8888-8888-888888888888', 'Diabetes Care', 'Insulin and diabetes management medicines')
ON CONFLICT (name) DO NOTHING;

-- Seed Medicines
INSERT INTO medicines (id, name, description, price, stock_quantity, category_id, requires_prescription, manufacturer, dosage, is_active) VALUES
  -- Pain Relief
  ('a1111111-1111-1111-1111-111111111111', 'Paracetamol 500mg', 'Effective pain reliever and fever reducer', 5.99, 500, '11111111-1111-1111-1111-111111111111', false, 'PharmaCo', '500mg tablets', true),
  ('a2222222-2222-2222-2222-222222222222', 'Ibuprofen 400mg', 'Anti-inflammatory pain reliever', 7.99, 350, '11111111-1111-1111-1111-111111111111', false, 'MediCare', '400mg tablets', true),
  ('a3333333-3333-3333-3333-333333333333', 'Aspirin 300mg', 'Pain reliever and blood thinner', 4.99, 400, '11111111-1111-1111-1111-111111111111', false, 'HealthPlus', '300mg tablets', true),
  ('a4444444-4444-4444-4444-444444444444', 'Tramadol 50mg', 'Strong pain reliever for moderate to severe pain', 25.99, 100, '11111111-1111-1111-1111-111111111111', true, 'PharmaCo', '50mg tablets', true),
  
  -- Antibiotics (all require prescription)
  ('b1111111-1111-1111-1111-111111111111', 'Amoxicillin 500mg', 'Broad-spectrum antibiotic', 15.99, 200, '22222222-2222-2222-2222-222222222222', true, 'AntiBio Labs', '500mg capsules', true),
  ('b2222222-2222-2222-2222-222222222222', 'Azithromycin 250mg', 'Antibiotic for respiratory infections', 22.99, 150, '22222222-2222-2222-2222-222222222222', true, 'MediCare', '250mg tablets', true),
  ('b3333333-3333-3333-3333-333333333333', 'Ciprofloxacin 500mg', 'Fluoroquinolone antibiotic', 18.99, 120, '22222222-2222-2222-2222-222222222222', true, 'PharmaCo', '500mg tablets', true),
  
  -- Vitamins
  ('c1111111-1111-1111-1111-111111111111', 'Vitamin C 1000mg', 'Immune system booster', 12.99, 600, '33333333-3333-3333-3333-333333333333', false, 'VitaHealth', '1000mg tablets', true),
  ('c2222222-2222-2222-2222-222222222222', 'Vitamin D3 5000IU', 'Supports bone health', 14.99, 400, '33333333-3333-3333-3333-333333333333', false, 'SunVit', '5000IU softgels', true),
  ('c3333333-3333-3333-3333-333333333333', 'Multivitamin Complex', 'Complete daily vitamin supplement', 19.99, 300, '33333333-3333-3333-3333-333333333333', false, 'VitaHealth', 'Daily tablets', true),
  ('c4444444-4444-4444-4444-444444444444', 'Omega-3 Fish Oil', 'Heart and brain health supplement', 24.99, 250, '33333333-3333-3333-3333-333333333333', false, 'OceanHealth', '1000mg softgels', true),
  
  -- Cold & Flu
  ('d1111111-1111-1111-1111-111111111111', 'Cold & Flu Relief', 'Multi-symptom cold relief', 9.99, 300, '44444444-4444-4444-4444-444444444444', false, 'ColdAway', 'Liquid capsules', true),
  ('d2222222-2222-2222-2222-222222222222', 'Cough Syrup', 'Relieves dry and wet cough', 8.49, 250, '44444444-4444-4444-4444-444444444444', false, 'MediCare', '200ml syrup', true),
  ('d3333333-3333-3333-3333-333333333333', 'Nasal Decongestant', 'Fast-acting nasal relief', 6.99, 400, '44444444-4444-4444-4444-444444444444', false, 'BreathEasy', 'Nasal spray', true),
  
  -- Digestive Health
  ('e1111111-1111-1111-1111-111111111111', 'Antacid Tablets', 'Fast relief from heartburn', 7.99, 500, '55555555-5555-5555-5555-555555555555', false, 'DigestAid', 'Chewable tablets', true),
  ('e2222222-2222-2222-2222-222222222222', 'Probiotics', 'Gut health and digestion support', 29.99, 200, '55555555-5555-5555-5555-555555555555', false, 'BioFlora', 'Capsules', true),
  ('e3333333-3333-3333-3333-333333333333', 'Laxative', 'Gentle constipation relief', 11.99, 180, '55555555-5555-5555-5555-555555555555', false, 'DigestAid', 'Tablets', true),
  
  -- Skin Care
  ('f1111111-1111-1111-1111-111111111111', 'Hydrocortisone Cream', 'Anti-itch and inflammation cream', 8.99, 300, '66666666-6666-6666-6666-666666666666', false, 'SkinCare Pro', '1% cream 30g', true),
  ('f2222222-2222-2222-2222-222222222222', 'Antifungal Cream', 'Treats fungal skin infections', 12.99, 150, '66666666-6666-6666-6666-666666666666', false, 'DermaCure', 'Topical cream 30g', true),
  
  -- Heart & Blood Pressure (prescription)
  ('g1111111-1111-1111-1111-111111111111', 'Lisinopril 10mg', 'ACE inhibitor for blood pressure', 15.99, 200, '77777777-7777-7777-7777-777777777777', true, 'CardioMed', '10mg tablets', true),
  ('g2222222-2222-2222-2222-222222222222', 'Atorvastatin 20mg', 'Cholesterol-lowering medication', 22.99, 180, '77777777-7777-7777-7777-777777777777', true, 'HeartSafe', '20mg tablets', true),
  
  -- Diabetes Care (prescription)
  ('h1111111-1111-1111-1111-111111111111', 'Metformin 500mg', 'Type 2 diabetes medication', 12.99, 300, '88888888-8888-8888-8888-888888888888', true, 'DiabeCare', '500mg tablets', true),
  ('h2222222-2222-2222-2222-222222222222', 'Insulin Glargine', 'Long-acting insulin', 89.99, 50, '88888888-8888-8888-8888-888888888888', true, 'InsuLife', 'Injection pen', true)
ON CONFLICT DO NOTHING;
