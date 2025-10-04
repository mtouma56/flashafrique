import { Helmet } from "react-helmet-async";

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

const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, "") ?? "https://flashafrique.vercel.app";

const sanitiseText = (value: string) => value.replace(/\s+/g, " ").trim();

export const ArticleStructuredData = ({
  title,
  description,
  image,
  publishedTime,
  modifiedTime,
  author,
  category,
  url,
}: ArticleStructuredDataProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: sanitiseText(title),
    description: sanitiseText(description),
    image: [image],
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "FlashAfrique",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon-512.png`,
      },
    },
    articleSection: category,
    inLanguage: "fr-FR",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
};
