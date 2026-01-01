-- Drop the security definer view and create a regular one
DROP VIEW IF EXISTS public.public_profiles;

-- Create a secure function to get public profile info instead
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  full_name text,
  county text,
  avatar_url text,
  is_verified boolean,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.county,
    p.avatar_url,
    p.is_verified,
    p.created_at
  FROM public.profiles p
  WHERE p.user_id = profile_user_id;
$$;