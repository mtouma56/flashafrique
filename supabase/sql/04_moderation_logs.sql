-- Create moderation_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  article_id UUID,
  article_title TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on moderation_logs
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read moderation logs
CREATE POLICY "Admins can read moderation logs" ON public.moderation_logs
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Only admins can insert moderation logs
CREATE POLICY "Admins can insert moderation logs" ON public.moderation_logs
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- Create function to log moderation actions
CREATE OR REPLACE FUNCTION public.log_moderation_action(
  p_action TEXT,
  p_article_id UUID,
  p_article_title TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_moderation_logs_user ON public.moderation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_article ON public.moderation_logs(article_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_created ON public.moderation_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_action ON public.moderation_logs(action);

-- Comments for documentation
COMMENT ON TABLE public.moderation_logs IS 'Audit trail for moderation actions';
COMMENT ON FUNCTION public.log_moderation_action IS 'Helper function to log moderation actions with current user context';
