-- Quick Fix: Resolve Infinite Recursion in Profiles Policies
-- Run this IMMEDIATELY in Supabase SQL Editor to fix the login issue

-- ============================================
-- Step 1: Drop problematic policies
-- ============================================
DROP POLICY IF EXISTS "Users can update own profile except role" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- ============================================
-- Step 2: Create helper function with explicit RLS bypass
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- SECURITY DEFINER runs as function owner (bypasses RLS)
  -- Explicitly query without triggering policies
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, '') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;

-- ============================================
-- Step 3: Recreate policies using the helper function
-- ============================================

-- Users can view own profile (simple, no recursion)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Admins can view all profiles (using helper function)
CREATE POLICY "Admins can view all profiles" ON profiles 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================
-- Step 4: Verify the trigger exists (from previous migration)
-- ============================================
-- The prevent_role_change trigger should already exist
-- If not, it will be created by fix-role-security.sql

-- ============================================
-- Verification
-- ============================================
-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Test the function (should return true/false without error)
-- SELECT public.is_admin(auth.uid());
