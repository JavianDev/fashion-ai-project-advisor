# Fashion AI Project Advisor 👗✨

An AI-powered fashion recommendation platform that provides personalized style advice, virtual try-on capabilities, and smart shopping integration with affiliate monetization.

![Fashion AI Project Advisor](https://img.shields.io/badge/Fashion%20AI-Project%20Advisor-purple?style=for-the-badge&logo=sparkles)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![HTTPS](https://img.shields.io/badge/HTTPS-Enabled-green?style=for-the-badge&logo=lock)

## 🌟 Features

### 🎨 AI Fashion Advisor
- **Personalized Recommendations**: Get style advice based on your body type, skin tone, and preferences
- **Occasion-Based Styling**: Recommendations for casual, business, formal, and special events
- **Smart Form Interface**: Modern, responsive form with real-time validation

### 👤 Virtual Try-On & Body Analysis
- **AI Body Measurements**: Computer vision-powered body analysis using MediaPipe
- **Real-time Processing**: Live camera feed with pose detection and measurement extraction
- **Privacy-First**: All processing happens locally in your browser

### 👗 Outfit Builder
- **Visual Outfit Creation**: Mix and match clothing items to create complete looks
- **Style Combinations**: AI-generated outfit suggestions with visual previews
- **Shopping Integration**: Direct links to purchase recommended items

### 🛍️ Smart Shopping Integration
- **Affiliate Monetization**: Integrated affiliate tracking system for revenue generation
- **Budget-Friendly Options**: Filter recommendations by price range ($0-50 to $500+)
- **Regional Support**: Localized shopping options for US, Canada, UK, and Europe
- **Sale Detection**: Automatic highlighting of discounted items

### 📱 Profile Management
- **Comprehensive Profiles**: Store personal measurements, style preferences, and sizes
- **Data Persistence**: Profile information saved locally and synced across features
- **Tabbed Interface**: Organized sections for personal info, measurements, style, and sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/JavianDev/fashion-ai-project-advisor.git
cd fashion-ai-project-advisor

# Install dependencies
npm install

# Start development server with HTTPS
npm run dev
```

Visit `https://localhost:3000/project-advisor` to start using the Fashion AI platform!

### Available Scripts

```bash
npm run dev          # Start HTTPS development server (default)
npm run dev:http     # Start HTTP development server
npm run build        # Build for production
npm run start        # Start production server
npm run start:https  # Start production server with HTTPS
npm run start:custom # Start custom HTTPS server
```

## 🏗️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: UI library with hooks and context
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **ShadCN UI**: Modern component library
- **Framer Motion**: Smooth animations

### AI & Computer Vision
- **MediaPipe**: Real-time pose detection and body analysis
- **TensorFlow.js**: Client-side machine learning
- **RAG System**: Retrieval-Augmented Generation using Xenova Transformers
- **Embedding Model**: all-MiniLM-L6-v2 for semantic text understanding
- **Knowledge Base**: Curated fashion expertise in structured text format

### Backend & APIs
- **Next.js API Routes**: Serverless backend functions
- **Affiliate Tracking**: Custom monetization system
- **Shopping Integration**: Multi-retailer product APIs

### Development & Deployment
- **HTTPS Support**: Self-signed certificates for development
- **ESLint & Prettier**: Code quality and formatting
- **Responsive Design**: Mobile-first approach

## 📱 Application Structure

```
src/
├── app/
│   ├── (main)/
│   │   └── project-advisor/
│   │       ├── page.tsx              # Main dashboard
│   │       ├── profile/              # Profile management
│   │       ├── outfit-builder/       # Outfit creation
│   │       └── virtual-try-on/       # AI body analysis
│   └── api/
│       ├── rag/recommend/            # AI recommendations
│       └── affiliate/track/          # Monetization tracking
├── components/
│   ├── ui/                          # ShadCN UI components
│   └── project-advisor/             # Feature-specific components
├── lib/
│   └── shopping-integration.ts      # Affiliate & shopping logic
└── styles/                          # Global styles
```

## 🎯 Key Features Deep Dive

### AI-Powered Recommendations
The platform uses a sophisticated RAG (Retrieval-Augmented Generation) system that:
- **Semantic Search**: Uses `Xenova/all-MiniLM-L6-v2` embeddings for intelligent content retrieval
- **Personalized Analysis**: Analyzes user profiles including body type, skin tone, and measurements
- **Contextual Matching**: Matches clothing items to body types, occasions, and style preferences
- **Knowledge Base**: Curated fashion expertise covering body types, color theory, and occasion dressing
- **Real-time Processing**: Generates recommendations in ~200-500ms using cosine similarity search

📚 **[View Complete RAG Documentation](docs/RAG_SYSTEM_DOCUMENTATION.md)** for technical implementation details, API usage, and architecture overview.

### Virtual Try-On Technology
Advanced computer vision capabilities:
- Real-time pose detection using MediaPipe
- Automatic body measurement extraction
- Gender detection and body type analysis
- Privacy-focused local processing

### Monetization System
Comprehensive affiliate marketing integration:
- Automatic affiliate link generation
- Click tracking and commission calculation
- Performance analytics and reporting
- Multi-retailer support with regional pricing

## 🌍 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:custom"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MediaPipe** for computer vision capabilities
- **ShadCN** for the beautiful UI components
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first styling approach

## 📞 Support

For support, email support@fashionai.com or join our Discord community.

---

**Built with ❤️ by [JavianDev](https://github.com/JavianDev)**

*Transform your style with AI-powered fashion intelligence!* ✨
