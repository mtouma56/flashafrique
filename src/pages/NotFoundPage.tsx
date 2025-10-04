import { Link } from 'react-router-dom';

import { SEOHead } from '@/components/SEO/SEOHead';

const NotFoundPage: React.FC = () => {
  const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') ?? 'https://flashafrique.vercel.app';
  const canonicalUrl = `${siteUrl}/404`;

  return (
    <>
      <SEOHead
        title="Page non trouvée"
        description="La page demandée n'existe pas ou a été déplacée. Utilisez la navigation FlashAfrique pour retrouver l'information recherchée."
        canonicalUrl={canonicalUrl}
        robots="noindex, nofollow"
        image="/placeholder.svg"
      />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Page non trouvée
          </h2>
        <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">
          Désolé, nous n'avons pas trouvé la page que vous recherchez.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Retour à l'accueil
          </Link>
          <Link
            to="/search"
            className="text-sm font-semibold text-gray-900 dark:text-white hover:text-primary"
          >
            Rechercher <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
      </main>
    </>
  );
};

export default NotFoundPage;
