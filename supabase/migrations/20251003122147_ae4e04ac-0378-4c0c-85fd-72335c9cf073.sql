-- Create moderation_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'approve', 'reject', 'delete', 'create', 'update'
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  article_title TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_moderation_logs_user_id ON public.moderation_logs(user_id);
CREATE INDEX idx_moderation_logs_article_id ON public.moderation_logs(article_id);
CREATE INDEX idx_moderation_logs_created_at ON public.moderation_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read logs
CREATE POLICY "Admins can read moderation logs"
ON public.moderation_logs
FOR SELECT
USING (is_admin(auth.uid()));

-- Policy: Only admins can insert logs
CREATE POLICY "Admins can insert moderation logs"
ON public.moderation_logs
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Create a function to log moderation actions
CREATE OR REPLACE FUNCTION public.log_moderation_action(
  p_action TEXT,
  p_article_id UUID,
  p_article_title TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.moderation_logs (
    user_id,
    action,
    article_id,
    article_title,
    metadata
  ) VALUES (
    auth.uid(),
    p_action,
    p_article_id,
    p_article_title,
    p_metadata
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Create a separate user_roles table for role management (best practice)
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'reader');

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'reader',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own roles
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Only admins can manage roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Update is_admin function to use user_roles table
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = uid AND role = 'admin'
  );
$$;

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Migrate existing admin users from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM public.profiles
WHERE role = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;