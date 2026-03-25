-- ============================================
-- UPDATE handle_new_user() TO SUPPORT OAUTH
-- ============================================

-- Update the function to handle both email signup and OAuth providers (Google, etc.)
-- OAuth providers may use 'name' instead of 'full_name' in metadata
-- Google OAuth provides: name, email, picture
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    -- Try full_name first (email signup), then name (OAuth providers like Google), then empty string
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    ),
    -- Always set role to 'viewer' for security (OAuth users cannot self-assign roles)
    -- This matches the security fix from fix-role-security.sql
    'viewer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger already exists, so no need to recreate it
-- This update will automatically apply to the existing trigger

-- ============================================
-- Note: This function works with the security fixes from fix-role-security.sql
-- OAuth users will:
-- 1. Get 'viewer' role automatically (secure)
-- 2. Have their name extracted from OAuth metadata
-- 3. Have their profile created via the existing trigger
-- ============================================
