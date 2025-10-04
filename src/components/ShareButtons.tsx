import React from 'react';
import { Facebook, Link as LinkIcon, MessageCircle, Share2, Twitter } from 'lucide-react';

import { trackArticleShare } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';

type SharePlatform = 'native' | 'twitter' | 'facebook' | 'whatsapp' | 'copy';

interface ShareButtonsProps {
  articleId: string;
  title: string;
  url: string;
  summary?: string;
}

const buttonClasses =
  'flex items-center gap-2 rounded-full bg-background-light px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-primary/10 dark:bg-background-dark dark:hover:bg-primary/20';

const iconClasses = 'h-5 w-5 text-subtle-light dark:text-subtle-dark';

const ShareButtons: React.FC<ShareButtonsProps> = ({ articleId, title, url, summary }) => {
  const { toast } = useToast();
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = summary && summary.trim().length > 0 ? summary : title;

  const emitShareEvent = (platform: SharePlatform) => {
    trackArticleShare(articleId, platform);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      emitShareEvent('native');

      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error('Erreur lors du partage natif:', error);
        toast({
          variant: 'destructive',
          title: 'Partage indisponible',
          description: 'Le partage natif a échoué. Essayez une autre option.',
        });
      }

      return;
    }

    void handleCopyLink();
  };

  const handleCopyLink = async () => {
    emitShareEvent('copy');

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: 'Lien copié',
          description: "L'article a été copié dans votre presse-papiers.",
        });
        return;
      }

      throw new Error('Clipboard API not available');
    } catch (error) {
      console.error('Erreur lors de la copie du lien:', error);
      toast({
        variant: 'destructive',
        title: 'Copie impossible',
        description: `Copiez ce lien manuellement : ${shareUrl}`,
      });
    }
  };

  const handleSocialShare = (platform: Extract<SharePlatform, 'twitter' | 'facebook' | 'whatsapp'>) => {
    emitShareEvent(platform);

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`${title} – ${shareText}`);

    let shareTarget = '';

    switch (platform) {
      case 'twitter':
        shareTarget = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'facebook':
        shareTarget = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareTarget = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (shareTarget) {
      window.open(shareTarget, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="mt-12 flex flex-wrap gap-4 border-y border-subtle-light/20 py-8 dark:border-subtle-dark/20">
      <button
        type="button"
        onClick={handleNativeShare}
        className={buttonClasses}
        aria-label="Partager l'article"
      >
        <Share2 className={iconClasses} />
        <span>Partager</span>
      </button>

      <button
        type="button"
        onClick={() => handleSocialShare('twitter')}
        className={buttonClasses}
        aria-label="Partager sur X (Twitter)"
      >
        <Twitter className={iconClasses} />
        <span>X</span>
      </button>

      <button
        type="button"
        onClick={() => handleSocialShare('facebook')}
        className={buttonClasses}
        aria-label="Partager sur Facebook"
      >
        <Facebook className={iconClasses} />
        <span>Facebook</span>
      </button>

      <button
        type="button"
        onClick={() => handleSocialShare('whatsapp')}
        className={buttonClasses}
        aria-label="Partager sur WhatsApp"
      >
        <MessageCircle className={iconClasses} />
        <span>WhatsApp</span>
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        className={buttonClasses}
        aria-label="Copier le lien de l'article"
      >
        <LinkIcon className={iconClasses} />
        <span>Copier le lien</span>
      </button>
    </div>
  );
};

export default ShareButtons;
