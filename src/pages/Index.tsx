import { SEOHead } from "@/components/SEO/SEOHead";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted">
      <SEOHead
        title="Bienvenue"
        description="FlashAfrique - Votre source d'actualités africaines en temps réel"
      />
      
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            FlashAfrique
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            L'actualité africaine en temps réel
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="text-lg">
            <a href="https://flashafrique.vercel.app" target="_blank" rel="noopener noreferrer">
              Voir le site en production
            </a>
          </Button>
          
          <Button asChild size="lg" variant="outline" className="text-lg">
            <Link to="/audit">
              📊 Voir le rapport d'audit
            </Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-border max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Améliorations implémentées ✨</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-lg bg-card border">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                🔒 Sécurité
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ RLS policies corrigées</li>
                <li>✅ Fonction is_admin sécurisée</li>
                <li>✅ Protection anti-récursion</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-card border">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                📊 SEO
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Meta tags dynamiques</li>
                <li>✅ JSON-LD NewsArticle</li>
                <li>✅ Robots.txt optimisé</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-card border">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                ⚡ Performance
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Images optimisées (srcset)</li>
                <li>✅ Skeleton loaders</li>
                <li>✅ Lazy loading images</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-card border">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                🎨 UX
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Loading states améliorés</li>
                <li>✅ Feedback utilisateur</li>
                <li>✅ Rapport d'audit complet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
