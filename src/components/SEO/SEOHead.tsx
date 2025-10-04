import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  canonicalUrl?: string;
  robots?: string;
  locale?: string;
}

const defaultSiteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, "") ?? "https://flashafrique.vercel.app";
const defaultImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80";

const isAbsoluteUrl = (value?: string) => Boolean(value && /^https?:\/\//i.test(value));

const resolveUrl = (value?: string) => {
  if (!value) {
    if (typeof window !== "undefined") {
      return window.location.href;
    }

    return `${defaultSiteUrl}/`;
  }

  if (isAbsoluteUrl(value)) {
    return value;
  }

  const base = typeof window !== "undefined" ? window.location.origin : defaultSiteUrl;
  return new URL(value, base).toString();
};

export const SEOHead = ({
  title,
  description,
  image = defaultImage,
  type = "website",
  publishedTime,
  modifiedTime,
  author = "FlashAfrique",
  tags = [],
  canonicalUrl,
  robots = "index, follow",
  locale = "fr_FR",
}: SEOHeadProps) => {
  const siteName = "FlashAfrique";
  const fullTitle = `${title} | ${siteName}`;
  const url = resolveUrl(canonicalUrl);
  const absoluteImage = resolveUrl(image);
  const descriptionContent = description.replace(/\s+/g, " ").trim();

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={descriptionContent} />
      <meta name="robots" content={robots} />
      <meta name="language" content="French" />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={descriptionContent} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Article specific */}
      {type === "article" && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={descriptionContent} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:image:alt" content={title} />
    </Helmet>
  );
};
