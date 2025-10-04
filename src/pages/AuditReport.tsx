import { SEOHead } from "@/components/SEO/SEOHead";
import { AuditReportDownload } from "./AuditReportDownload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, Shield, Zap, Eye, Search } from "lucide-react";

const AuditReport = () => {
  const auditSections = [
    {
      title: "Architecture Globale",
      icon: TrendingUp,
      score: 75,
      color: "text-yellow-600",
      items: [
        { status: "success", text: "Stack moderne (Vite, React, TypeScript, Supabase)" },
        { status: "success", text: "Déploiement Vercel avec edge caching partiel" },
        { status: "success", text: "RLS configuré pour la sécurité des données" },
        { status: "warning", text: "Pas de SSR/SSG - Impact SEO majeur" },
        { status: "warning", text: "Cache edge uniquement sur /api/home" }
      ]
    },
    {
      title: "Sécurité & RLS",
      icon: Shield,
      score: 60,
      color: "text-orange-600",
      items: [
        { status: "error", text: "Policy 'auth_full_access' dangereuse (CORRIGÉE)" },
        { status: "success", text: "Fonction is_admin() sécurisée avec SECURITY DEFINER" },
        { status: "success", text: "Séparation reader/admin fonctionnelle" },
        { status: "warning", text: "Pas de rate limiting sur les APIs" },
        { status: "success", text: "Magic link + password auth bien configuré" }
      ]
    },
    {
      title: "Performance",
      icon: Zap,
      score: 65,
      color: "text-blue-600",
      items: [
        { status: "warning", text: "TTFB élevé (800-1500ms) - Objectif: <300ms" },
        { status: "success", text: "Cache localStorage implémenté" },
        { status: "success", text: "Code splitting avec React.lazy" },
        { status: "warning", text: "Images non optimisées (pas de srcset)" },
        { status: "success", text: "Queries Supabase limitées aux colonnes nécessaires" }
      ]
    },
    {
      title: "SEO",
      icon: Search,
      score: 35,
      color: "text-red-600",
      items: [
        { status: "error", text: "Contenu non crawlable (SPA pure)" },
        { status: "error", text: "Meta tags insuffisants" },
        { status: "error", text: "Pas de JSON-LD NewsArticle (AJOUTÉ)" },
        { status: "error", text: "Sitemap.xml manquant" },
        { status: "success", text: "Meta tags dynamiques ajoutés avec react-helmet" }
      ]
    },
    {
      title: "UX/UI",
      icon: Eye,
      score: 70,
      color: "text-green-600",
      items: [
        { status: "success", text: "Design clean et responsive" },
        { status: "success", text: "Toast notifications pour feedback" },
        { status: "warning", text: "Skeleton loaders manquants (AJOUTÉS)" },
        { status: "warning", text: "Pas de fil d'Ariane sur pages article" },
        { status: "success", text: "Navigation simple et intuitive" }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 border-green-600";
    if (score >= 60) return "text-yellow-600 border-yellow-600";
    return "text-red-600 border-red-600";
  };

  const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') ?? 'https://flashafrique.vercel.app';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Rapport d'Audit Technique"
        description="Audit complet de FlashAfrique : architecture, performance, sécurité, SEO et UX"
        canonicalUrl={`${siteUrl}/audit`}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Rapport d'Audit FlashAfrique</h1>
          <p className="text-xl text-muted-foreground">
            Analyse complète : Architecture, Performance, Sécurité, SEO & UX
          </p>
          <Badge variant="secondary" className="mt-4">
            Généré le {new Date().toLocaleDateString('fr-FR')}
          </Badge>
        </div>

        {/* Download Section */}
        <AuditReportDownload />

        {/* Score Global */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Score Global</CardTitle>
            <CardDescription>Moyenne pondérée de tous les critères</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className={`text-6xl font-bold ${getScoreColor(61)} border-4 rounded-full w-32 h-32 flex items-center justify-center`}>
                61/100
              </div>
            </div>
            <p className="text-center mt-4 text-muted-foreground">
              Niveau : <strong>Amélioration nécessaire</strong>
            </p>
          </CardContent>
        </Card>

        {/* Sections d'audit */}
        <div className="space-y-6">
          {auditSections.map((section, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <section.icon className={`w-6 h-6 ${section.color}`} />
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(section.score)}`}>
                    {section.score}/100
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start gap-3">
                      {getStatusIcon(item.status)}
                      <p className="text-sm">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions Prioritaires */}
        <Card className="mt-8 border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-2xl">🚀 Actions Prioritaires</CardTitle>
            <CardDescription>Recommandations pour atteindre un niveau "presse premium"</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-red-600 mb-2">🔴 Critique (Semaine 1)</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Migrer vers Next.js pour SSR/SSG (SEO critique)</li>
                  <li>Implémenter sitemap.xml dynamique</li>
                  <li>Ajouter rate limiting sur APIs</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold text-yellow-600 mb-2">🟡 Important (Semaines 2-3)</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Étendre edge caching à toutes les routes</li>
                  <li>Optimisation images (WebP, AVIF, srcset complet)</li>
                  <li>Intégrer Google Analytics 4</li>
                  <li>Améliorer admin dashboard (filtres, preview)</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold text-blue-600 mb-2">🔵 Long terme (Mois 2-3)</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>CI/CD avec tests E2E (Playwright)</li>
                  <li>PWA avec service worker</li>
                  <li>CDN images (Cloudinary / Vercel Image Optimization)</li>
                  <li>Monitoring (Sentry, Web Vitals)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparaison Objectifs */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📊 Comparaison vs. Objectifs "Presse Premium"</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Métrique</th>
                    <th className="text-center p-2">Actuel</th>
                    <th className="text-center p-2">Objectif</th>
                    <th className="text-center p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">TTFB</td>
                    <td className="text-center p-2">800-1500ms</td>
                    <td className="text-center p-2">&lt;300ms</td>
                    <td className="text-center p-2">❌</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">LCP</td>
                    <td className="text-center p-2">2-3s</td>
                    <td className="text-center p-2">&lt;2.5s</td>
                    <td className="text-center p-2">⚠️</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">SEO Score</td>
                    <td className="text-center p-2">35/100</td>
                    <td className="text-center p-2">&gt;80/100</td>
                    <td className="text-center p-2">❌</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Sécurité</td>
                    <td className="text-center p-2">Corrigée</td>
                    <td className="text-center p-2">RLS strict</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr>
                    <td className="p-2">Contenu crawlable</td>
                    <td className="text-center p-2">Non</td>
                    <td className="text-center p-2">Oui (SSR)</td>
                    <td className="text-center p-2">❌</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditReport;
