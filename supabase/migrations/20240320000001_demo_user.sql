-- Insert demo user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'demo@example.com',
  crypt('password', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Demo User"}',
  false,
  'authenticated',
  '',
  '',
  ''
);

-- Insert demo user profile
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'demo@example.com',
  'Demo User',
  now(),
  now()
); 