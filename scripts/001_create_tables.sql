-- Pharmacy Management System Database Schema

-- Users table (for profiles, linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'pharmacist')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  requires_prescription BOOLEAN DEFAULT FALSE,
  manufacturer TEXT,
  dosage TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, medicine_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT NOT NULL,
  payment_method TEXT DEFAULT 'cash_on_delivery',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category_id);
CREATE INDEX IF NOT EXISTS idx_medicines_active ON medicines(is_active);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_user ON prescriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- Categories: Anyone can read, only admin can write
CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_insert_admin" ON categories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "categories_update_admin" ON categories FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "categories_delete_admin" ON categories FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Medicines: Anyone can read active medicines, only admin can write
CREATE POLICY "medicines_select_all" ON medicines FOR SELECT USING (true);
CREATE POLICY "medicines_insert_admin" ON medicines FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "medicines_update_admin" ON medicines FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "medicines_delete_admin" ON medicines FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles: Users can read/update their own profile, admin can read all
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (
  auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Cart items: Users can manage their own cart
CREATE POLICY "cart_select_own" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cart_insert_own" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cart_update_own" ON cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cart_delete_own" ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- Orders: Users can see their own orders, admin/pharmacist can see all
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'pharmacist'))
);
CREATE POLICY "orders_insert_own" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_admin" ON orders FOR UPDATE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'pharmacist'))
);

-- Order items: Same as orders
CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (
    orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'pharmacist'))
  ))
);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Prescriptions: Users can manage their own, pharmacist/admin can review
CREATE POLICY "prescriptions_select" ON prescriptions FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'pharmacist'))
);
CREATE POLICY "prescriptions_insert_own" ON prescriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "prescriptions_update" ON prescriptions FOR UPDATE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'pharmacist'))
);
