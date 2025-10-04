# Supabase Edge Functions

Ce dossier contient les Edge Functions déployées sur Supabase pour FlashAfrique.

## Fonctions disponibles

### 1. sitemap
Génère dynamiquement le sitemap XML avec toutes les pages et articles.
- **Endpoint**: `https://ixsqqmqipnekmkfgicvq.supabase.co/functions/v1/sitemap`
- **Cache**: 1 heure (s-maxage=3600)

### 2. cache-category
Cache les articles d'une catégorie spécifique.
- **Endpoint**: `https://ixsqqmqipnekmkfgicvq.supabase.co/functions/v1/cache-category/{category}`
- **Cache**: 5 minutes (max-age=300, s-maxage=600, stale-while-revalidate=86400)

### 3. cache-article
Cache un article spécifique avec ses articles liés.
- **Endpoint**: `https://ixsqqmqipnekmkfgicvq.supabase.co/functions/v1/cache-article/{article_id}`
- **Cache**: 5 minutes (max-age=300, s-maxage=600, stale-while-revalidate=86400)

### 4. cache-search
Cache les résultats de recherche.
- **Endpoint**: `https://ixsqqmqipnekmkfgicvq.supabase.co/functions/v1/cache-search?q={query}`
- **Cache**: 5 minutes (max-age=300, s-maxage=600, stale-while-revalidate=86400)

## Déploiement

### Prérequis
- Supabase CLI installé: `npm install -g supabase`
- Authentification: `supabase login`
- Lien au projet: `supabase link --project-ref ixsqqmqipnekmkfgicvq`

### Déployer toutes les fonctions
```bash
supabase functions deploy sitemap
supabase functions deploy cache-category
supabase functions deploy cache-article
supabase functions deploy cache-search
```

### Déployer une fonction spécifique
```bash
supabase functions deploy [nom-fonction]
```

### Configurer les secrets (si nécessaire)
```bash
supabase secrets set CUSTOM_SECRET=value
```

## Logs et Debug

### Voir les logs en temps réel
```bash
supabase functions logs [nom-fonction] --tail
```

### Voir les logs dans le dashboard
https://supabase.com/dashboard/project/ixsqqmqipnekmkfgicvq/functions

## Tests locaux

### Démarrer Supabase localement
```bash
supabase start
```

### Servir les fonctions localement
```bash
supabase functions serve [nom-fonction]
```

### Tester avec curl
```bash
# Sitemap
curl http://localhost:54321/functions/v1/sitemap

# Category
curl http://localhost:54321/functions/v1/cache-category/politique

# Article
curl http://localhost:54321/functions/v1/cache-article/[uuid]

# Search
curl http://localhost:54321/functions/v1/cache-search?q=politique
```

## Configuration

Les fonctions sont configurées dans `supabase/config.toml`:
- `verify_jwt = false` : Fonctions publiques sans authentification requise
- Toutes les fonctions utilisent CORS pour permettre les appels depuis le frontend

## Monitoring

- **Dashboard Supabase**: [Functions](https://supabase.com/dashboard/project/ixsqqmqipnekmkfgicvq/functions)
- **Logs**: [Edge Function Logs](https://supabase.com/dashboard/project/ixsqqmqipnekmkfgicvq/logs/edge-functions)
- **Métriques**: Temps d'exécution, erreurs, invocations par fonction
