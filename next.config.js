/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	reactStrictMode: true,
	
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'pbs.twimg.com',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'logos-world.net',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
			},
			{
				protocol: 'https',
				hostname: 'cdn-icons-png.flaticon.com',
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
			{
				protocol: 'https',
				hostname: 'blogger.googleusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'secure.gravatar.com',
			},
			{
				protocol: 'https',
				hostname: 'img.clerk.com',
			},
		],
	},
	// Add optimizations from Next.js 15
	experimental: {
		optimizePackageImports: [
			'lucide-react',
			'@radix-ui/react-icons',
			'@heroicons/react',
			'date-fns',
		],
		// Enable React compiler for better performance
		// reactCompiler: true, // Uncomment if you want to try the React compiler
	},
	// HTTPS and security headers
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'Referrer-Policy',
						value: 'origin-when-cross-origin',
					},
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=31536000; includeSubDomains; preload',
					},
				],
			},
		];
	},
	// Note: serverExternalPackages is only available in Next.js 15+
	// For Next.js 14, Clerk should work without this configuration
	// Suppress headers() warnings for Clerk compatibility
	logging: {
		fetches: {
			fullUrl: false,
		},
	},
	// Webpack configuration to prevent chunk loading errors
	webpack: (config, { dev, isServer }) => {
		if (dev && !isServer) {
			// Increase chunk loading timeout in development
			config.output.chunkLoadTimeout = 30000;
		}
		// Externalize sharp to prevent issues with native modules in serverless environments
		if (isServer) {
			config.externals.push({
				sharp: 'commonjs sharp',
				'@tensorflow/tfjs-node': 'commonjs @tensorflow/tfjs-node',
				'onnxruntime-node': 'commonjs onnxruntime-node',
			});
		}

		// Ignore ONNX runtime binary files during build
		config.module.rules.push({
			test: /\.node$/,
			use: 'ignore-loader',
		});

		// Fallback for modules that might not be available in browser
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
			path: false,
			crypto: false,
		};

		return config;
	},
}

module.exports = nextConfig
