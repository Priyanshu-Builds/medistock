-- Security Fix: Prevent Self-Assigned Roles
-- Run this in Supabase SQL Editor
-- This ensures all new users are created with 'viewer' role only
-- and prevents non-admins from changing roles

-- ============================================
-- 1. Update handle_new_user() function
-- Always create profiles with 'viewer' role regardless of user metadata
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'viewer'  -- Always default to viewer, ignore user-provided role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. Create helper function to check admin status (avoids recursion)
-- Uses SECURITY DEFINER to bypass RLS and prevent infinite recursion
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Use SECURITY DEFINER to bypass RLS
  -- Query profiles directly without triggering policies
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, '') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;

-- ============================================
-- 3. Create trigger to prevent role changes (except by admins)
-- ============================================
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow role change if user is admin
  IF public.is_admin(auth.uid()) THEN
    RETURN NEW;
  END IF;
  
  -- Prevent role change if user is not admin
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    RAISE EXCEPTION 'Only administrators can change user roles';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS prevent_role_change_trigger ON profiles;
CREATE TRIGGER prevent_role_change_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_change();

-- ============================================
-- 4. Drop existing policies and create new ones (without recursion)
-- ============================================
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile except role" ON profiles;
DROP POLICY IF EXISTS "Admins can update roles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Only admins can update roles" ON profiles;

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Admins can update any profile
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================
-- 4. Ensure existing policies are still in place
-- ============================================

-- Users can view own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Admins can view all profiles (using helper function to avoid recursion)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- ============================================
-- Verification Queries (Optional - run to verify)
-- ============================================

-- Check current policies
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Test: Try to update your own role (should fail if not admin)
-- UPDATE profiles SET role = 'admin' WHERE id = auth.uid();
