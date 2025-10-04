import { Helmet } from 'react-helmet-async';

interface ArticleStructuredDataProps {
  title: string;
  description: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  category: string;
  url: string;
}

export const ArticleStructuredData = ({
  title,
  description,
  image,
  publishedTime,
  modifiedTime,
  author,
  category,
  url
}: ArticleStructuredDataProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "description": description,
    "image": [image],
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": "https://flashafrique.vercel.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FlashAfrique",
      "logo": {
        "@type": "ImageObject",
        "url": "https://flashafrique.vercel.app/favicon.ico"
      }
    },
    "articleSection": category,
    "inLanguage": "fr-FR",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
