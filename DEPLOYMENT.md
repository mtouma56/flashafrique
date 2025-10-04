# Guide de Déploiement - FlashAfrique

Ce document décrit le processus complet de déploiement de FlashAfrique après la synchronisation GitHub.

## 📋 Prérequis

- [x] Compte Vercel connecté au repo GitHub
- [x] Projet Supabase actif (Project ID: `ixsqqmqipnekmkfgicvq`)
- [x] Supabase CLI installé: `npm install -g supabase`
- [x] Google Analytics 4 property créée
- [x] Compte Sentry créé (optionnel mais recommandé)

## 🚀 Ordre de Déploiement

### 1️⃣ Database (Supabase) - FAIT ✅

Les migrations ont déjà été exécutées. Pour vérifier ou rejouer:

```bash
# Se connecter à Supabase
supabase login

# Lier le projet
supabase link --project-ref ixsqqmqipnekmkfgicvq

# Vérifier l'état des migrations
supabase db diff

# Si besoin, rejouer les migrations SQL
supabase db push
```

Ou manuellement dans le SQL Editor:
1. https://supabase.com/dashboard/project/ixsqqmqipnekmkfgicvq/sql/new
2. Copier/coller le contenu de chaque fichier dans `supabase/sql/` dans l'ordre:
   - `01_profiles_and_roles.sql`
   - `02_security_functions.sql`
   - `03_articles_and_policies.sql`
   - `04_moderation_logs.sql`

### 2️⃣ Edge Functions (Supabase)

```bash
# Déployer toutes les fonctions
supabase functions deploy sitemap
supabase functions deploy cache-category
supabase functions deploy cache-article
supabase functions deploy cache-search
```

Vérifier le déploiement:
- https://supabase.com/dashboard/project/ixsqqmqipnekmkfgicvq/functions

Tester les endpoints:
```bash
# Sitemap
curl https://ixsqqmqipnekmkfgicvq.supabase.co/functions/v1/sitemap

# Category
curl https://ixsqqmqipnekmkfgicvq.supabase.co/functions/v1/cache-category/politique

# Search
curl "https://ixsqqmqipnekmkfgicvq.supabase.co/functions/v1/cache-search?q=économie"
```

### 3️⃣ Frontend (Vercel)

#### Configuration des variables d'environnement

1. Aller dans Vercel Project Settings → Environment Variables
2. Ajouter les variables suivantes pour **Production**, **Preview**, et **Development**:

```env
# Supabase (déjà dans le code mais besoin en preview/dev)
VITE_SUPABASE_URL=https://ixsqqmqipnekmkfgicvq.supabase.co
VITE_SUPABASE_ANON_KEY=[Voir Supabase Dashboard → Settings → API]

# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry (optionnel)
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
VITE_SENTRY_ENVIRONMENT=production
```

#### Déploiement via GitHub

Si Vercel est déjà connecté au repo:
1. Pusher la branche `feat/audit-impl-20251003`
2. Merger la PR vers `main`
3. Vercel déploiera automatiquement

Si Vercel n'est pas connecté:
1. Aller sur https://vercel.com/new
2. Importer le repo `mtouma56/flashafrique`
3. Configurer:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Ajouter les variables d'environnement (voir ci-dessus)
5. Cliquer sur "Deploy"

### 4️⃣ Configuration Post-Déploiement

#### A. Google Search Console

1. Aller sur https://search.google.com/search-console
2. Ajouter la propriété `https://flashafrique.vercel.app` (ou votre domaine custom)
3. Soumettre le sitemap:
   ```
   https://ixsqqmqipnekmkfgicvq.supabase.co/functions/v1/sitemap
   ```

#### B. Supabase Auth Settings

1. https://supabase.com/dashboard/project/ixsqqmqipnekmkfgicvq/auth/providers
2. **Activer "Leaked Password Protection"** (recommandation de sécurité)
3. Configurer les URL de redirection si nécessaire:
   - Site URL: `https://flashafrique.vercel.app`
   - Redirect URLs: `https://flashafrique.vercel.app/auth/callback`

#### C. PWA Testing

1. Ouvrir l'app sur mobile (Chrome/Safari)
2. Vérifier le prompt "Add to Home Screen"
3. Tester l'expérience offline:
   - Désactiver le réseau
   - Vérifier que les pages cachées s'affichent
   - Vérifier le message offline pour les nouvelles pages

#### D. Analytics Verification

1. **Google Analytics**:
   - Aller sur https://analytics.google.com
   - Vérifier que les événements remontent (Realtime → Events)
   - Vérifier `page_view`, `article_view`, `category_click`

2. **Sentry** (si configuré):
   - Aller sur https://sentry.io
   - Vérifier que le projet apparaît
   - Tester une erreur intentionnelle pour vérifier l'intégration

#### E. Lighthouse CI

Les audits Lighthouse se lancent automatiquement via GitHub Actions:
- À chaque push sur `main`
- À chaque PR

Voir les résultats:
- https://github.com/mtouma56/flashafrique/actions

### 5️⃣ Domaine Custom (Optionnel)

Si vous avez un domaine custom (ex: `flashafrique.com`):

1. **Dans Vercel**:
   - Project Settings → Domains
   - Ajouter `flashafrique.com` et `www.flashafrique.com`
   - Suivre les instructions DNS

2. **Mettre à jour les URLs dans**:
   - `public/manifest.json` → `start_url`
   - `src/components/SEO/ArticleStructuredData.tsx` → URLs de base
   - Supabase Auth → Site URL

3. **Soumettre le nouveau sitemap à Google**:
   ```
   https://ixsqqmqipnekmkfgicvq.supabase.co/functions/v1/sitemap
   ```

## ✅ Checklist de Déploiement

### Avant le déploiement
- [ ] Migrations SQL exécutées dans Supabase
- [ ] Edge functions déployées et testées
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Build local réussi: `npm install && npm run build`
- [ ] Tests locaux passent (si présents)

### Après le déploiement
- [ ] Site accessible sur Vercel URL
- [ ] PWA manifest chargé (vérifier dans DevTools → Application)
- [ ] Service worker enregistré
- [ ] Sitemap XML accessible et valide
- [ ] Google Analytics envoie des événements
- [ ] Sentry capture les erreurs (si configuré)
- [ ] Lighthouse CI passe (scores > 90)
- [ ] Sitemap soumis à Google Search Console
- [ ] Leaked Password Protection activé dans Supabase

### Monitoring continu
- [ ] Vérifier les logs des edge functions
- [ ] Monitorer les scores Lighthouse via GitHub Actions
- [ ] Vérifier les métriques GA4 hebdomadairement
- [ ] Vérifier les erreurs Sentry quotidiennement
- [ ] Surveiller l'indexation Google Search Console

## 🔧 Commandes Utiles

```bash
# Build local
npm run build

# Analyser le bundle
npm run analyze

# Servir la build localement
npm run preview

# Logs des edge functions
supabase functions logs sitemap --tail

# Déployer une fonction spécifique
supabase functions deploy [nom-fonction]

# Vérifier les secrets Supabase
supabase secrets list
```

## 📊 URLs de Monitoring

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard/project/ixsqqmqipnekmkfgicvq
- **Supabase Functions**: https://supabase.com/dashboard/project/ixsqqmqipnekmkfgicvq/functions
- **Supabase Logs**: https://supabase.com/dashboard/project/ixsqqmqipnekmkfgicvq/logs
- **GitHub Actions**: https://github.com/mtouma56/flashafrique/actions
- **Google Search Console**: https://search.google.com/search-console
- **Google Analytics**: https://analytics.google.com
- **Sentry**: https://sentry.io

## 🆘 Troubleshooting

### Build échoue sur Vercel
- Vérifier que `npm install` passe localement
- Vérifier les variables d'environnement
- Voir les logs Vercel détaillés

### Edge functions ne répondent pas
- Vérifier les logs: https://supabase.com/dashboard/project/ixsqqmqipnekmkfgicvq/logs/edge-functions
- Vérifier que les fonctions sont déployées: `supabase functions list`
- Tester avec curl (voir section 2)

### PWA ne s'installe pas
- Vérifier que le manifest est accessible: `/manifest.json`
- Vérifier que le service worker est enregistré (DevTools → Application)
- Vérifier les icônes: `/icon-192.png`, `/icon-512.png`

### Analytics ne trackent pas
- Vérifier que `VITE_GA_MEASUREMENT_ID` est bien configuré
- Ouvrir la console browser et chercher les logs GA4
- Vérifier Realtime dans Google Analytics

### Lighthouse scores bas
- Vérifier les métriques dans GitHub Actions
- Analyser le bundle: `npm run analyze`
- Vérifier que les images utilisent `OptimizedImage`
- Vérifier que les skeletons loaders sont bien présents

## 📞 Support

- **GitHub Issues**: https://github.com/mtouma56/flashafrique/issues
- **Supabase Support**: https://supabase.com/dashboard/support
- **Vercel Support**: https://vercel.com/support

---

**Dernière mise à jour**: 2025-01-03
**Version**: 1.0.0 (Audit Implementation)
