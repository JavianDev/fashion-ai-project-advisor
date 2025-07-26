import { ConfigProps } from '@/types'

const config: ConfigProps = {
	// REQUIRED
	appName: 'Fashion AI Advisor',
	// REQUIRED: a short description of your app for SEO tags (can be overwritten)
	appDescription: 'AI-powered fashion recommendation platform with virtual try-on and smart shopping integration',
	// REQUIRED (no https://, not trialing slash at the end, just the naked domain)
	domainName: process.env.NEXT_PUBLIC_DOMAIN_NAME || 'https://www.fashion-ai-advisor.com',
	stripe: {
		// Create multiple products in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
		products: [
			{
				type: 'one-time', // one-time, subscription
				title: 'your-title',
				productId: 'your-product-id',
				subtitle: 'Per month price',
				price: 25,
				isBest: true,
				linkTitle: 'PAY MOTHERFUCKER',
				featuresTitle: 'Features',
				priceId: 'your-price-id',
				features: [
					{
						title: 'Feature 1',
						disabled: false,
					},
					{
						title: 'Feature 2',
						disabled: true,
					},
				],
			},
			{
				type: 'subscription',
				period: 'year',
				productId: 'your-product-id',
				title: 'Year',
				subtitle: 'Per year price',
				price: 25,
				linkTitle: 'PAY MOTHERFUCKER YEAR',
				featuresTitle: 'Features VIP',
				priceId: 'your-price-id',
				features: [
					{
						title: 'Feature 1',
						disabled: false,
					},
					{
						title: 'Feature 2',
						disabled: false,
					},
				],
			},
		],
	},
	colors: {
		// REQUIRED — The theme to use (light & dark mode supported)
		theme: 'light',
		// REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..)
		// Use a custom color: main: "#f37055". HEX only.
		main: '#8b5cf6', // Beautiful Purple Primary
	},
	resend: {
		// REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
		fromAdmin: `SoNoBrokers <support@sonobrokers.com>`,
		// Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
		supportEmail: 'support@sonobrokers.com',
		// When someone replies to supportEmail sent by the app, forward it to the email below (otherwise it's lost). If you set supportEmail to empty, this will be ignored.
		forwardRepliesTo: 'support@sonobrokers.com',
		subjects: {
			thankYou: 'Welcome to SoNoBrokers',
		},
	},
	supportedRegions: ['US', 'CA'],
	socialLinks: {
		twitter: 'https://twitter.com/sonobrokers',
		facebook: 'https://facebook.com/sonobrokers',
		linkedin: 'https://linkedin.com/company/sonobrokers',
	},
	contact: {
		email: 'support@sonobrokers.com',
		phone: '6477715300',
	},
	seo: {
		defaultImage: '/images/og-image.jpg',
		defaultLocale: 'en_US',
		twitterHandle: '@sonobrokers',
	},
}

export default config
