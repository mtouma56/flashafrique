-- Create security definer function to check admin role
-- This prevents recursive RLS issues by bypassing RLS policies
CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = uid AND role = 'admin'
  );
$$;

-- Create security definer function to check any role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Add admin management policy to user_roles (now that has_role exists)
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Comments for documentation
COMMENT ON FUNCTION public.is_admin(UUID) IS 'Security definer function to check if user is admin - bypasses RLS to prevent recursion';
COMMENT ON FUNCTION public.has_role(UUID, public.app_role) IS 'Security definer function to check if user has specific role - bypasses RLS to prevent recursion';
