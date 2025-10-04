-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT DEFAULT 'FlashAfrique',
  status TEXT DEFAULT 'draft',
  publish_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public can read approved and published articles only
CREATE POLICY "public_read_articles" ON public.articles
  FOR SELECT
  USING (
    status = 'approved' 
    AND publish_at <= now()
  );

-- Admins can read all articles (including drafts/pending)
CREATE POLICY "admin_read_pending" ON public.articles
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Only admins can insert articles
CREATE POLICY "admin_create_articles" ON public.articles
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- Only admins can update articles
CREATE POLICY "admin_update_articles" ON public.articles
  FOR UPDATE
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Only admins can delete articles
CREATE POLICY "admin_delete_articles" ON public.articles
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for articles updated_at
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_publish_at ON public.articles(publish_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status_publish ON public.articles(status, publish_at DESC);

-- Comments for documentation
COMMENT ON TABLE public.articles IS 'News articles with moderation workflow';
COMMENT ON POLICY "public_read_articles" ON public.articles IS 'Anonymous users can only read approved and published articles';
COMMENT ON POLICY "admin_read_pending" ON public.articles IS 'Admins can read all articles regardless of status';
