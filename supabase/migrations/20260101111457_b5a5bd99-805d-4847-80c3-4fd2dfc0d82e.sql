-- Fix critical security issue: Restrict profiles to only allow users to view their own profile
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add policy for viewing basic public info of other users (for marketplace seller info)
-- This only exposes non-sensitive fields via a view
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  full_name,
  county,
  avatar_url,
  is_verified,
  created_at
FROM public.profiles;

-- Allow users to delete their own profiles (GDPR compliance)
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Allow users to delete their own AI scans
CREATE POLICY "Users can delete their own scans" 
ON public.ai_scans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Allow users to update their own AI scans
CREATE POLICY "Users can update their own scans" 
ON public.ai_scans 
FOR UPDATE 
USING (auth.uid() = user_id);