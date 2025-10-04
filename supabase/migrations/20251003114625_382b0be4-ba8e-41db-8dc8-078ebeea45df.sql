-- ============================================
-- AUDIT FLASHAFRIQUE : CORRECTIONS SÉCURITÉ CRITIQUES
-- ============================================

-- 1. SUPPRIMER LA POLICY DANGEREUSE "auth_full_access"
-- Risque : Permet à tout utilisateur authentifié de faire n'importe quoi
DROP POLICY IF EXISTS auth_full_access ON public.articles;

-- 2. SÉCURISER LA FONCTION is_admin CONTRE LES RÉCURSIONS RLS
-- Ajouter SECURITY DEFINER pour contourner RLS lors de l'exécution
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER  -- ← Critique pour éviter récursions infinies
SET search_path = public
AS $$
  select exists (
    select 1 from public.profiles p
    where p.id = uid and p.role = 'admin'
  );
$$;

-- 3. CRÉER UNE POLICY ADMIN INSERT ARTICLES
-- Permettre aux admins de créer des articles
CREATE POLICY "admin_create_articles"
ON public.articles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- 4. CRÉER UNE POLICY ADMIN DELETE ARTICLES
-- Permettre aux admins de supprimer des articles
CREATE POLICY "admin_delete_articles"
ON public.articles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Vérification : Lister toutes les policies sur articles
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'articles';