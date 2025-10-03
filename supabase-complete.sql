-- FlashAfrique DB schema
-- Version: 1.0.0
-- Description: Schéma complet pour la base de données FlashAfrique

-- ============================================
-- TABLE: articles
-- ============================================
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT DEFAULT 'FlashAfrique',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'rejected')),
  publish_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_publish_at ON public.articles(publish_at);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);

-- Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy pour lecture publique des articles approuvés
DROP POLICY IF EXISTS "Articles approuvés publiquement lisibles" ON public.articles;
CREATE POLICY "Articles approuvés publiquement lisibles"
  ON public.articles
  FOR SELECT
  USING (status = 'approved' AND publish_at <= NOW());

-- Policy pour tout accès authentifié (admin)
DROP POLICY IF EXISTS "Accès complet pour utilisateurs authentifiés" ON public.articles;
CREATE POLICY "Accès complet pour utilisateurs authentifiés"
  ON public.articles
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- DONNÉES DE DÉMO
-- ============================================
INSERT INTO public.articles (title, summary, body, image_url, category, status, publish_at) VALUES
(
  'Nouvelle loi sur l''économie numérique adoptée',
  'Le parlement a adopté une nouvelle loi visant à stimuler l''économie numérique en Côte d''Ivoire.',
  'Le parlement ivoirien a adopté ce mardi une loi majeure sur l''économie numérique. Cette législation vise à créer un cadre juridique favorable au développement des technologies de l''information et de la communication. Les députés ont salué cette avancée qui devrait attirer davantage d''investissements dans le secteur du numérique.',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
  'economie',
  'approved',
  NOW()
),
(
  'Sommet de la CEDEAO à Abidjan',
  'Les chefs d''État de la CEDEAO se réunissent à Abidjan pour discuter de l''intégration régionale.',
  'Abidjan accueille ce week-end un sommet crucial de la Communauté Économique des États de l''Afrique de l''Ouest (CEDEAO). Les discussions porteront sur le renforcement de l''intégration économique, la libre circulation des personnes et des biens, ainsi que les défis sécuritaires dans la région. Ce sommet intervient dans un contexte régional marqué par plusieurs transitions politiques.',
  'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=800&q=80',
  'politique',
  'approved',
  NOW()
),
(
  'Le football ivoirien en plein essor',
  'De jeunes talents ivoiriens brillent sur la scène internationale.',
  'Le football ivoirien connaît un renouveau remarquable avec l''émergence de nombreux jeunes talents. Plusieurs joueurs de moins de 23 ans évoluent désormais dans les meilleurs championnats européens. Cette nouvelle génération fait honneur à l''héritage laissé par les légendes comme Didier Drogba et Yaya Touré. Les observateurs s''attendent à de grandes performances lors des prochaines compétitions internationales.',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
  'sports',
  'approved',
  NOW()
),
(
  'Festival de musique Anoumabo 2025',
  'Le plus grand festival de musique d''Afrique de l''Ouest revient en mars.',
  'Le Festival Anoumabo, devenu incontournable sur la scène musicale africaine, revient pour sa 10e édition. Pendant trois jours, artistes locaux et internationaux se produiront sur plusieurs scènes à travers Abidjan. Cette année, le festival met l''accent sur la fusion entre musiques traditionnelles et sonorités contemporaines. Plus de 50 artistes sont attendus pour cette édition anniversaire.',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
  'culture',
  'approved',
  NOW()
),
(
  'L''Afrique face aux défis climatiques',
  'Une conférence internationale se penche sur les solutions africaines au changement climatique.',
  'Des experts africains du climat se réunissent cette semaine à Abidjan pour une conférence de trois jours sur les solutions locales face au changement climatique. Les discussions portent sur l''adaptation des pratiques agricoles, la gestion des ressources en eau, et le développement des énergies renouvelables. Les participants soulignent l''importance d''une approche africaine du développement durable, adaptée aux réalités du continent.',
  'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&q=80',
  'africa',
  'approved',
  NOW()
),
(
  'Croissance du secteur technologique en Afrique',
  'Les startups africaines lèvent des fonds records et attirent l''attention des investisseurs mondiaux.',
  'Le secteur technologique africain connaît une croissance exceptionnelle. En 2024, les startups du continent ont levé plus de 5 milliards de dollars, un record historique. Cette dynamique s''explique par l''émergence d''une jeunesse entreprenante, l''amélioration de la connectivité internet et l''intérêt croissant des investisseurs internationaux. Les hubs technologiques se multiplient dans plusieurs capitales africaines, créant un écosystème favorable à l''innovation.',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
  'economie',
  'approved',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- FORCER LE RECHARGEMENT DU CACHE PostgREST
-- ============================================
NOTIFY pgrst, 'reload schema';
