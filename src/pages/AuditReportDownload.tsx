import { Download, FileText, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const AuditReportDownload = () => {
  const { toast } = useToast();

  const handleDownloadMarkdown = async () => {
    try {
      const response = await fetch('/AUDIT_RECOMMENDATIONS.md');
      if (!response.ok) throw new Error('Failed to fetch markdown file');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FlashAfrique_Audit_${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Téléchargement réussi',
        description: 'Le rapport d\'audit a été téléchargé au format Markdown',
      });
    } catch (error) {
      console.error('Error downloading markdown:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger le rapport',
        variant: 'destructive',
      });
    }
  };

  const handlePrintPDF = () => {
    toast({
      title: 'Impression en cours',
      description: 'Sélectionnez "Enregistrer au format PDF" dans la boîte de dialogue',
    });
    window.print();
  };

  const handleDownloadImplementationGuide = async () => {
    try {
      const response = await fetch('/IMPLEMENTATION_GUIDE.md');
      if (!response.ok) throw new Error('Failed to fetch implementation guide');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FlashAfrique_Implementation_Guide_${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Téléchargement réussi',
        description: 'Le guide d\'implémentation a été téléchargé',
      });
    } catch (error) {
      console.error('Error downloading implementation guide:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger le guide',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <CardTitle>📥 Télécharger les rapports</CardTitle>
        </div>
        <CardDescription>
          Téléchargez le rapport d'audit et le guide d'implémentation dans différents formats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={handlePrintPDF}
            variant="outline"
            className="h-auto flex-col items-start gap-2 p-4 hover:bg-primary/5 hover:border-primary"
          >
            <div className="flex items-center gap-2 w-full">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">PDF (via impression)</span>
            </div>
            <p className="text-xs text-muted-foreground text-left">
              Imprimez cette page et sélectionnez "Enregistrer au format PDF" dans la boîte de dialogue
            </p>
          </Button>

          <Button
            onClick={handleDownloadMarkdown}
            variant="outline"
            className="h-auto flex-col items-start gap-2 p-4 hover:bg-primary/5 hover:border-primary"
          >
            <div className="flex items-center gap-2 w-full">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">Rapport d'audit (MD)</span>
            </div>
            <p className="text-xs text-muted-foreground text-left">
              Téléchargez le rapport complet au format Markdown (lisible et éditable)
            </p>
          </Button>

          <Button
            onClick={handleDownloadImplementationGuide}
            variant="outline"
            className="h-auto flex-col items-start gap-2 p-4 hover:bg-primary/5 hover:border-primary"
          >
            <div className="flex items-center gap-2 w-full">
              <FileJson className="h-5 w-5 text-primary" />
              <span className="font-semibold">Guide d'implémentation</span>
            </div>
            <p className="text-xs text-muted-foreground text-left">
              Guide complet d'implémentation avec instructions détaillées et checklist
            </p>
          </Button>
        </div>

        <div className="mt-4 p-4 bg-muted/30 rounded-md">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Conseil</strong> : Pour le PDF, utilisez l'impression avec les options suivantes :<br />
            • Mise en page : Portrait<br />
            • Marges : Par défaut<br />
            • En-têtes et pieds de page : Désactivés
          </p>
        </div>
      </CardContent>
    </Card>
  );
};