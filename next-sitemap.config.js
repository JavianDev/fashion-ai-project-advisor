/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.sonobrokers.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/unsupported-region',
    '/api/*',
    '/admin/*',
    '/dashboard/*',
    '/properties/*/edit',
    '/properties/create',
  ],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/unsupported-region',
          '/api/*',
          '/admin/*',
          '/dashboard/*',
          '/properties/*/edit',
          '/properties/create',
        ],
      },
    ],
  },
}; 