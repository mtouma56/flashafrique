-- Fix search_path for existing functions
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- Note: "Leaked Password Protection" warning is a Supabase Auth setting
-- that the user needs to enable manually in their Supabase dashboard:
-- https://supabase.com/dashboard/project/ixsqqmqipnekmkfgicvq/settings/auth
-- Enable "Leaked password protection" under Password Settings