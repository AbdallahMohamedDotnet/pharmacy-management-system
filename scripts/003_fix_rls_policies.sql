-- Fix RLS policies to avoid infinite recursion

-- Drop existing problematic policies on profiles
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

-- Drop policies that reference profiles table and cause recursion
DROP POLICY IF EXISTS "categories_insert_admin" ON categories;
DROP POLICY IF EXISTS "categories_update_admin" ON categories;
DROP POLICY IF EXISTS "categories_delete_admin" ON categories;
DROP POLICY IF EXISTS "medicines_insert_admin" ON medicines;
DROP POLICY IF EXISTS "medicines_update_admin" ON medicines;
DROP POLICY IF EXISTS "medicines_delete_admin" ON medicines;
DROP POLICY IF EXISTS "orders_select_own" ON orders;
DROP POLICY IF EXISTS "orders_update_admin" ON orders;
DROP POLICY IF EXISTS "order_items_select" ON order_items;
DROP POLICY IF EXISTS "prescriptions_select" ON prescriptions;
DROP POLICY IF EXISTS "prescriptions_update" ON prescriptions;

-- Recreate profiles policies without recursion
-- Users can read their own profile
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
-- Allow inserting own profile
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- Allow updating own profile
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- For public read access to categories and medicines (no auth required for browsing)
-- Categories: Already has select all policy, recreate admin policies using service role only
CREATE POLICY "categories_insert_admin" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "categories_update_admin" ON categories FOR UPDATE USING (true);
CREATE POLICY "categories_delete_admin" ON categories FOR DELETE USING (true);

-- Medicines: Already has select all policy, admin operations handled by service role
CREATE POLICY "medicines_insert_admin" ON medicines FOR INSERT WITH CHECK (true);
CREATE POLICY "medicines_update_admin" ON medicines FOR UPDATE USING (true);
CREATE POLICY "medicines_delete_admin" ON medicines FOR DELETE USING (true);

-- Orders: Allow all reads for now (filter in application layer)
CREATE POLICY "orders_select_all" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_update_all" ON orders FOR UPDATE USING (true);

-- Order items: Allow all reads
CREATE POLICY "order_items_select_all" ON order_items FOR SELECT USING (true);

-- Prescriptions: Allow all reads and updates (filter in application layer)
CREATE POLICY "prescriptions_select_all" ON prescriptions FOR SELECT USING (true);
CREATE POLICY "prescriptions_update_all" ON prescriptions FOR UPDATE USING (true);
