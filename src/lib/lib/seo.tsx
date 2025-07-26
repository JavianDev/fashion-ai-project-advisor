import { Metadata } from 'next';
import config from '@/config';

interface SEOTagsProps {
  title?: string;
  description?: string;
  canonicalUrlRelative?: string;
  image?: string;
  noIndex?: boolean;
}

export function getSEOTags({
  title,
  description,
  canonicalUrlRelative,
  image,
  noIndex = false,
}: SEOTagsProps = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${config.appName}`
    : `${config.appName} - Commission-Free Real Estate Platform`;

  const fullDescription =
    description ||
    `${config.appDescription} - Buy and sell properties directly, save on commission fees, and access professional services on-demand.`;

  const canonicalUrl = canonicalUrlRelative
    ? `${config.domainName}${canonicalUrlRelative}`
    : config.domainName;

  const fullImage = image || `${config.domainName}/images/og-image.jpg`;

  return {
    title: fullTitle,
    description: fullDescription,
    metadataBase: new URL(config.domainName),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: canonicalUrl,
      siteName: config.appName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: config.appName,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  };
}

export function renderSchemaTags() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: config.appName,
    description: config.appDescription,
    url: config.domainName,
    logo: `${config.domainName}/images/logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    areaServed: ['US', 'CA'],
    sameAs: [
      'https://twitter.com/sonobrokers',
      'https://facebook.com/sonobrokers',
      'https://linkedin.com/company/sonobrokers',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
