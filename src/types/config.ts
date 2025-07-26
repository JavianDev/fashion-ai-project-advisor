export type Theme =
  | "light"
  | "dark"
  | "cupcake"
  | "bumblebee"
  | "emerald"
  | "corporate"
  | "synthwave"
  | "retro"
  | "cyberpunk"
  | "valentine"
  | "halloween"
  | "garden"
  | "forest"
  | "aqua"
  | "lofi"
  | "pastel"
  | "fantasy"
  | "wireframe"
  | "black"
  | "luxury"
  | "dracula"
  | "";

export interface StripePrice {
  title: string;
  productId: string;
  subtitle: string;
  price: number;
  isBest?: boolean;
  linkTitle: string;
  featuresTitle: string;
  priceId: string;
  features: {
    title: string;
    disabled?: boolean;
  }[];
}

export interface StripeOneTime extends StripePrice {
  type: 'one-time';
}

export interface StripePlan extends StripePrice {
  type: 'subscription';
  period: string;
}

export type StripeProduct = StripeOneTime | StripePlan;

export interface ConfigProps {
  appName: string;
  appDescription: string;
  domainName: string;
  stripe: {
    products: StripeProduct[];
  };
  colors: {
    theme: Theme;
    main: string;
  };
  resend: {
    fromAdmin: string;
    supportEmail?: string;
    forwardRepliesTo?: string;
    subjects?: {
      [key: string]: string
    }
  };
  supportedRegions?: string[];
  socialLinks?: {
    twitter: string;
    facebook: string;
    linkedin: string;
  };
  contact?: {
    email: string;
    phone: string;
    address?: string;
  };
  seo?: {
    defaultImage: string;
    defaultLocale: string;
    twitterHandle: string;
  };
}
