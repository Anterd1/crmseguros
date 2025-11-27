-- Insert Clients
INSERT INTO public.clients (id, first_name, last_name, email, phone, type)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Juan', 'Pérez', 'juan.perez@email.com', '555-0101', 'Individual'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'María', 'López', 'maria.lopez@email.com', '555-0102', 'Individual'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Empresa ABC', 'S.A.', 'contacto@empresaabc.com', '555-0103', 'Empresa'),
  ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Carlos', 'Ruiz', 'carlos.ruiz@email.com', '555-0104', 'Individual'),
  ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Tech Solutions', 'Inc.', 'admin@techsolutions.com', '555-0105', 'Empresa');

-- Insert Policies
INSERT INTO public.policies (client_id, policy_number, type, status, start_date, end_date, amount)
VALUES
  -- Juan Pérez (Auto, Activa)
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'POL-AUT-001', 'Autos', 'Activa', CURRENT_DATE - INTERVAL '6 months', CURRENT_DATE + INTERVAL '6 months', 12500),
  
  -- María López (Vida, Activa, Vence pronto)
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'POL-VID-001', 'Vida', 'Activa', CURRENT_DATE - INTERVAL '11 months', CURRENT_DATE + INTERVAL '15 days', 24000),
  
  -- Empresa ABC (GMM Colectivo, En Trámite)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'POL-GMM-001', 'GMM Colectivo', 'En Trámite', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 450000),
  
  -- Carlos Ruiz (Hogar, Renovación, Vence hoy)
  ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'POL-HOG-001', 'Hogar', 'Renovación', CURRENT_DATE - INTERVAL '1 year', CURRENT_DATE, 8900),
  
  -- Tech Solutions (RC Profesional, Activa)
  ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'POL-RCP-001', 'RC Profesional', 'Activa', CURRENT_DATE - INTERVAL '3 months', CURRENT_DATE + INTERVAL '9 months', 35000);
