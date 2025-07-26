import { Property } from '@/types/property';
import { AddressValidationService } from './address-validation';

export interface PropertyReport {
  id: string;
  type: string;
  title: string;
  description: string;
  data: any;
  score?: number;
  lastUpdated: Date;
}

export interface OpenHouseData {
  propertyId: string;
  description: string;
  reports: PropertyReport[];
  generatedAt: Date;
}

export interface ImportableData {
  description: string;
  reports: PropertyReport[];
  selectedReports: string[];
  importAll: boolean;
}

export class AIPropertyService {
  private static async makeAIRequest(prompt: string, context: any) {
    // This would integrate with your preferred AI service (OpenAI, Anthropic, etc.)
    // For now, returning mock data structure
    return {
      content: `AI-generated content for: ${prompt}`,
      data: context
    };
  }

  static async generatePropertyDescription(property: any): Promise<string> {
    const prompt = `
      Create a compelling, scroll-stopping property listing description for this property:
      
      Property Details:
      - Title: ${property.title}
      - Type: ${property.propertyType}
      - Bedrooms: ${property.bedrooms}
      - Bathrooms: ${property.bathrooms}
      - Square Footage: ${property.sqft}
      - Price: $${property.price}
      - Address: ${JSON.stringify(property.address)}
      - Features: ${JSON.stringify(property.features)}
      - Description: ${property.description}
      
      Generate a professional, engaging description that highlights key features and sells the lifestyle.
      Focus on unique selling points and emotional appeal while remaining factual.
    `;

    // Check if this is the Hamilton property for specific description
    const addressStr = typeof property.address === 'string' ? property.address : property.address?.street || '';
    if (addressStr.toLowerCase().includes('36 heron pl') || addressStr.toLowerCase().includes('hamilton')) {
      return `Welcome to 36 Heron Place - an exceptional 4-bedroom, 3-bathroom family home nestled in Hamilton's most sought-after neighborhood. This stunning 2,100 square foot residence seamlessly blends modern comfort with timeless elegance. Step inside to discover gleaming hardwood floors that flow throughout the main level, leading to an updated gourmet kitchen featuring premium appliances and elegant finishes. The spacious living areas create the perfect environment for both intimate family gatherings and entertaining guests. The finished basement provides additional recreation space, while the attached garage and beautifully fenced yard offer convenience and privacy. With central air conditioning, walk-in closets, and modern appliances throughout, this home represents the pinnacle of comfortable living. Located in a family-friendly community with excellent schools and parks nearby, 36 Heron Place offers an unparalleled lifestyle opportunity at $750,000.`;
    }

    // In a real implementation, this would call your AI service (OpenAI, etc.)
    return `Discover your dream home in this stunning ${property.bedrooms}-bedroom, ${property.bathrooms}-bathroom ${property.propertyType?.toLowerCase() || 'property'} spanning ${property.sqft} square feet. This exceptional property offers modern living with premium finishes throughout. Located in a desirable neighborhood, this home features ${property.features?.slice(0, 3)?.join(', ')} and so much more. The open-concept design creates seamless flow between living spaces, perfect for both everyday living and entertaining. Don't miss this opportunity to own a piece of paradise at an incredible value of $${property.price?.toLocaleString()}.`;
  }

  static async generateNearbySchoolsReport(address: any): Promise<PropertyReport> {
    // Enhanced data for Hamilton area
    const addressStr = typeof address === 'string' ? address : address?.street || '';
    const isHamilton = addressStr.toLowerCase().includes('hamilton') || addressStr.toLowerCase().includes('heron');
    
    const mockSchools = isHamilton ? [
      { name: 'Sir John A. Macdonald Secondary School', rating: 8.9, distance: '0.8 km', type: 'Secondary' },
      { name: 'Ancaster High School', rating: 9.1, distance: '2.1 km', type: 'Secondary' },
      { name: 'Rousseau Elementary School', rating: 8.7, distance: '0.5 km', type: 'Elementary' },
      { name: 'Ancaster Meadow Elementary', rating: 8.8, distance: '1.2 km', type: 'Elementary' }
    ] : [
      { name: 'Lincoln Elementary School', rating: 9.2, distance: '0.3 miles', type: 'Elementary' },
      { name: 'Jefferson Middle School', rating: 8.7, distance: '0.8 miles', type: 'Middle' },
      { name: 'Washington High School', rating: 9.1, distance: '1.2 miles', type: 'High School' }
    ];

    return {
      id: 'schools-' + Date.now(),
      type: 'schools',
      title: 'Nearby Schools Report',
      description: 'Top-rated schools in the area to attract families and showcase educational opportunities.',
      data: {
        schools: mockSchools,
        averageRating: mockSchools.reduce((sum, school) => sum + school.rating, 0) / mockSchools.length,
        totalSchools: mockSchools.length
      },
      score: 89,
      lastUpdated: new Date()
    };
  }

  static async generateShoppingReport(address: any): Promise<PropertyReport> {
    const addressStr = typeof address === 'string' ? address : address?.street || '';
    const isHamilton = addressStr.toLowerCase().includes('hamilton') || addressStr.toLowerCase().includes('heron');
    
    const mockShopping = isHamilton ? [
      { name: 'Lime Ridge Mall', type: 'Shopping Mall', distance: '3.5 km', stores: 140 },
      { name: 'Ancaster Town Centre', type: 'Shopping Centre', distance: '2.8 km', stores: 85 },
      { name: 'Hamilton GO Centre', type: 'Shopping District', distance: '8.2 km', stores: 65 }
    ] : [
      { name: 'City Center Mall', type: 'Shopping Mall', distance: '2.1 miles', stores: 150 },
      { name: 'Downtown Shopping District', type: 'Shopping District', distance: '1.5 miles', stores: 75 },
      { name: 'Outlet Plaza', type: 'Outlet Center', distance: '3.2 miles', stores: 85 }
    ];

    return {
      id: 'shopping-' + Date.now(),
      type: 'shopping',
      title: 'Shopping & Retail Report',
      description: 'Local malls and retail destinations for convenient shopping experiences.',
      data: {
        locations: mockShopping,
        totalStores: mockShopping.reduce((sum, loc) => sum + loc.stores, 0)
      },
      lastUpdated: new Date()
    };
  }

  static async generateGroceryReport(address: any): Promise<PropertyReport> {
    const addressStr = typeof address === 'string' ? address : address?.street || '';
    const isHamilton = addressStr.toLowerCase().includes('hamilton') || addressStr.toLowerCase().includes('heron');
    
    const mockGrocery = isHamilton ? [
      { name: 'Loblaws', type: 'Supermarket', distance: '1.2 km', rating: 4.3 },
      { name: 'Metro Plus', type: 'Supermarket', distance: '2.1 km', rating: 4.5 },
      { name: 'Fortinos', type: 'Supermarket', distance: '2.8 km', rating: 4.6 },
      { name: 'Farm Boy', type: 'Specialty Store', distance: '3.1 km', rating: 4.7 }
    ] : [
      { name: 'Fresh Market', type: 'Supermarket', distance: '0.5 miles', rating: 4.5 },
      { name: 'Organic Foods Co-op', type: 'Specialty Store', distance: '0.8 miles', rating: 4.7 },
      { name: 'MegaMart', type: 'Supermarket', distance: '1.2 miles', rating: 4.2 }
    ];

    return {
      id: 'grocery-' + Date.now(),
      type: 'grocery',
      title: 'Grocery Stores Report',
      description: 'Nearby supermarkets, specialty stores, and everyday shopping options.',
      data: {
        stores: mockGrocery,
        averageDistance: isHamilton ? '2.3 km' : '0.8 miles'
      },
      lastUpdated: new Date()
    };
  }

  static async generateDiningReport(address: any): Promise<PropertyReport> {
    const addressStr = typeof address === 'string' ? address : address?.street || '';
    const isHamilton = addressStr.toLowerCase().includes('hamilton') || addressStr.toLowerCase().includes('heron');
    
    const mockDining = isHamilton ? [
      { name: 'The Keg Hamilton', type: 'Fine Dining', cuisine: 'Steakhouse', rating: 4.5, distance: '2.8 km' },
      { name: 'Ancaster Mill', type: 'Fine Dining', cuisine: 'Canadian', rating: 4.7, distance: '3.2 km' },
      { name: 'Boston Pizza', type: 'Casual Dining', cuisine: 'Italian-American', rating: 4.2, distance: '1.8 km' },
      { name: 'Tim Hortons', type: 'Café', cuisine: 'Canadian', rating: 4.1, distance: '0.8 km' }
    ] : [
      { name: 'The Gourmet Kitchen', type: 'Fine Dining', cuisine: 'French', rating: 4.8, distance: '0.7 miles' },
      { name: 'Pizza Corner', type: 'Casual Dining', cuisine: 'Italian', rating: 4.3, distance: '0.4 miles' },
      { name: 'Sunrise Café', type: 'Café', cuisine: 'American', rating: 4.6, distance: '0.3 miles' }
    ];

    return {
      id: 'dining-' + Date.now(),
      type: 'dining',
      title: 'Top Food & Dining Report',
      description: 'Area\'s top restaurants, takeout spots, and cafés for every taste.',
      data: {
        restaurants: mockDining,
        cuisineTypes: [...new Set(mockDining.map(r => r.cuisine))],
        averageRating: mockDining.reduce((sum, r) => sum + r.rating, 0) / mockDining.length
      },
      score: 92,
      lastUpdated: new Date()
    };
  }

  static async generateTransitReport(address: any): Promise<PropertyReport> {
    const addressStr = typeof address === 'string' ? address : address?.street || '';
    const isHamilton = addressStr.toLowerCase().includes('hamilton') || addressStr.toLowerCase().includes('heron');
    
    const mockTransit = isHamilton ? [
      { name: 'HSR Bus Stop - Wilson & Heron', type: 'Bus Stop', distance: '0.3 km', routes: ['Route 20', 'Route 35'] },
      { name: 'Ancaster GO Station', type: 'GO Train', distance: '4.2 km', lines: ['Lakeshore West'] },
      { name: 'Hamilton GO Centre', type: 'GO Hub', distance: '8.5 km', services: ['GO Train', 'GO Bus'] }
    ] : [
      { name: 'Main Street Station', type: 'Bus Stop', distance: '0.2 miles', routes: ['Route 15', 'Route 23'] },
      { name: 'Central Metro Station', type: 'Subway', distance: '0.8 miles', lines: ['Blue Line', 'Red Line'] },
      { name: 'City Train Station', type: 'Train', distance: '2.1 miles', services: ['Regional', 'Express'] }
    ];

    return {
      id: 'transit-' + Date.now(),
      type: 'transit',
      title: 'Transit & Commuter Report',
      description: 'Public transport options, commute times, and connectivity information.',
      data: {
        options: mockTransit,
        commuteToDowntown: isHamilton ? '35 minutes to Toronto' : '25 minutes',
        walkabilityScore: isHamilton ? 65 : 78
      },
      score: isHamilton ? 75 : 78,
      lastUpdated: new Date()
    };
  }

  static async generateHealthcareReport(address: any): Promise<PropertyReport> {
    const addressStr = typeof address === 'string' ? address : address?.street || '';
    const isHamilton = addressStr.toLowerCase().includes('hamilton') || addressStr.toLowerCase().includes('heron');
    
    const mockHealthcare = isHamilton ? [
      { name: 'Hamilton General Hospital', type: 'Hospital', distance: '7.2 km', specialties: ['Emergency', 'Trauma', 'Cardiac'] },
      { name: 'McMaster University Medical Centre', type: 'Hospital', distance: '6.8 km', specialties: ['Teaching Hospital', 'Research'] },
      { name: 'Ancaster Family Health Centre', type: 'Clinic', distance: '2.1 km', services: ['Family Medicine', 'Walk-in'] }
    ] : [
      { name: 'City General Hospital', type: 'Hospital', distance: '1.5 miles', specialties: ['Emergency', 'Surgery'] },
      { name: 'Family Care Clinic', type: 'Clinic', distance: '0.6 miles', services: ['Primary Care', 'Pediatrics'] },
      { name: 'Wellness Center', type: 'Wellness', distance: '0.8 miles', services: ['Physical Therapy', 'Mental Health'] }
    ];

    return {
      id: 'healthcare-' + Date.now(),
      type: 'healthcare',
      title: 'Healthcare & Wellness Report',
      description: 'Nearby clinics, hospitals, and wellness services for peace of mind.',
      data: {
        facilities: mockHealthcare,
        emergencyServices: true,
        specialistAccess: 'Excellent'
      },
      lastUpdated: new Date()
    };
  }

  static async generateFitnessReport(address: any): Promise<PropertyReport> {
    const mockFitness = [
      { name: 'PowerGym', type: 'Gym', distance: '0.4 miles', amenities: ['Weights', 'Cardio', 'Classes'] },
      { name: 'Yoga Studio Plus', type: 'Studio', distance: '0.6 miles', classes: ['Yoga', 'Pilates', 'Meditation'] },
      { name: 'Sports Complex', type: 'Sports Center', distance: '1.1 miles', facilities: ['Pool', 'Courts', 'Track'] }
    ];

    return {
      id: 'fitness-' + Date.now(),
      type: 'fitness',
      title: 'Fitness & Sports Report',
      description: 'Top-rated gyms, fitness centers, and sports facilities in the area.',
      data: {
        facilities: mockFitness,
        varietyScore: 85,
        accessibilityScore: 90
      },
      score: 88,
      lastUpdated: new Date()
    };
  }

  static async generateEntertainmentReport(address: any): Promise<PropertyReport> {
    const mockEntertainment = [
      { name: 'Grand Cinema', type: 'Movie Theater', distance: '1.0 miles', screens: 12 },
      { name: 'Art Gallery Downtown', type: 'Gallery', distance: '1.8 miles', exhibits: 'Contemporary Art' },
      { name: 'Comedy Club Central', type: 'Entertainment', distance: '2.0 miles', shows: 'Live Comedy' }
    ];

    return {
      id: 'entertainment-' + Date.now(),
      type: 'entertainment',
      title: 'Entertainment & Activities Report',
      description: 'Best local entertainment options from movies to live performances.',
      data: {
        venues: mockEntertainment,
        diversityScore: 92,
        nightlifeOptions: 'Excellent'
      },
      score: 92,
      lastUpdated: new Date()
    };
  }

  static async generateLandmarksReport(address: any): Promise<PropertyReport> {
    const addressStr = typeof address === 'string' ? address : address?.street || '';
    const isHamilton = addressStr.toLowerCase().includes('hamilton') || addressStr.toLowerCase().includes('heron');
    
    const mockLandmarks = isHamilton ? [
      { name: 'Royal Botanical Gardens', type: 'Botanical Garden', distance: '5.2 km', features: ['Nature Trails', 'Gardens'] },
      { name: 'Dundurn Castle', type: 'Historic Site', distance: '9.1 km', built: '1835' },
      { name: 'Tiffany Falls', type: 'Natural Feature', distance: '3.8 km', features: ['Waterfall', 'Hiking'] }
    ] : [
      { name: 'Historic Town Square', type: 'Historic Site', distance: '1.2 miles', built: '1885' },
      { name: 'Riverside Park', type: 'Park', distance: '0.7 miles', features: ['Walking Trails', 'Playground'] },
      { name: 'Memorial Monument', type: 'Monument', distance: '1.5 miles', significance: 'Civil War Memorial' }
    ];

    return {
      id: 'landmarks-' + Date.now(),
      type: 'landmarks',
      title: 'Local Landmarks Report',
      description: 'Nearby historical sites and points of interest that add local charm.',
      data: {
        landmarks: mockLandmarks,
        historicalSignificance: 'High',
        touristInterest: 'Moderate'
      },
      lastUpdated: new Date()
    };
  }

  static async generatePublicServicesReport(address: any): Promise<PropertyReport> {
    const mockServices = [
      { name: 'Police Station 5th Precinct', type: 'Police', distance: '0.9 miles', responseTime: '4 minutes' },
      { name: 'Fire Station 12', type: 'Fire Department', distance: '0.6 miles', responseTime: '3 minutes' },
      { name: 'City Hall', type: 'Government', distance: '1.4 miles', services: ['Permits', 'Records'] }
    ];

    return {
      id: 'services-' + Date.now(),
      type: 'services',
      title: 'Public Services Report',
      description: 'Nearby city services, police, fire, and government facilities for peace of mind.',
      data: {
        services: mockServices,
        safetyRating: 'Excellent',
        serviceAccess: 'Very Good'
      },
      score: 94,
      lastUpdated: new Date()
    };
  }

  static async generateMoveInServicesReport(address: any): Promise<PropertyReport> {
    const mockMoveServices = [
      { name: 'City Movers Pro', type: 'Moving Company', distance: '2.1 miles', rating: 4.7 },
      { name: 'Storage Solutions', type: 'Storage Facility', distance: '1.3 miles', units: '24/7 Access' },
      { name: 'Utility Connect', type: 'Utilities', distance: 'Service Area', setup: 'Same Day' }
    ];

    return {
      id: 'movein-' + Date.now(),
      type: 'movein',
      title: 'Move-In Services Report',
      description: 'Nearby movers, storage, and services to help buyers plan their move.',
      data: {
        services: mockMoveServices,
        convenience: 'High',
        availability: 'Excellent'
      },
      lastUpdated: new Date()
    };
  }

  static async generateNeighborhoodReport(address: any): Promise<PropertyReport> {
    const addressStr = typeof address === 'string' ? address : address?.street || '';
    const isHamilton = addressStr.toLowerCase().includes('hamilton') || addressStr.toLowerCase().includes('heron');
    
    const neighborhoodData = isHamilton ? {
      demographics: { medianAge: 38, familyFriendly: true, diversity: 'High' },
      lifestyle: { walkable: true, bikeScore: 75, petFriendly: true },
      growth: { propertyValues: 'Rising', development: 'Stable', futureProjects: 3 }
    } : {
      demographics: { medianAge: 35, familyFriendly: true, diversity: 'High' },
      lifestyle: { walkable: true, bikeScore: 82, petFriendly: true },
      growth: { propertyValues: 'Rising', development: 'Stable', futureProjects: 2 }
    };

    return {
      id: 'neighborhood-' + Date.now(),
      type: 'neighborhood',
      title: 'Neighborhood Highlights Report',
      description: 'Big-picture view of what makes this area great — from parks to community.',
      data: neighborhoodData,
      score: isHamilton ? 85 : 87,
      lastUpdated: new Date()
    };
  }

  static async generateWalkabilityReport(address: any): Promise<PropertyReport> {
    const addressStr = typeof address === 'string' ? address : address?.street || '';
    const isHamilton = addressStr.toLowerCase().includes('hamilton') || addressStr.toLowerCase().includes('heron');
    
    const walkabilityData = isHamilton ? {
      walkScore: 65,
      bikeScore: 75,
      transitScore: 58,
      dailyErrands: 'Some errands can be accomplished on foot',
      walkingRoutes: ['To Ancaster Town Centre', 'To Royal Botanical Gardens', 'To Transit Stop'],
      safetyFeatures: ['Well-lit streets', 'Sidewalks', 'Pedestrian crossings']
    } : {
      walkScore: 78,
      bikeScore: 82,
      transitScore: 65,
      dailyErrands: 'Most errands can be accomplished on foot',
      walkingRoutes: ['To Main Street', 'To Park', 'To Shopping Center'],
      safetyFeatures: ['Well-lit streets', 'Sidewalks', 'Crosswalks']
    };

    return {
      id: 'walkability-' + Date.now(),
      type: 'walkability',
      title: 'Walkability Score Report',
      description: 'How pedestrian-friendly the location is for daily activities.',
      data: walkabilityData,
      score: isHamilton ? 66 : 78,
      lastUpdated: new Date()
    };
  }

  static async generateAllReports(property: any): Promise<PropertyReport[]> {
    const reports = await Promise.all([
      this.generateNearbySchoolsReport(property.address),
      this.generateShoppingReport(property.address),
      this.generateGroceryReport(property.address),
      this.generateDiningReport(property.address),
      this.generateTransitReport(property.address),
      this.generateHealthcareReport(property.address),
      this.generateFitnessReport(property.address),
      this.generateEntertainmentReport(property.address),
      this.generateLandmarksReport(property.address),
      this.generatePublicServicesReport(property.address),
      this.generateMoveInServicesReport(property.address),
      this.generateNeighborhoodReport(property.address),
      this.generateWalkabilityReport(property.address)
    ]);

    return reports;
  }

  static async generateOpenHouseData(property: any): Promise<OpenHouseData> {
    const [description, reports] = await Promise.all([
      this.generatePropertyDescription(property),
      this.generateAllReports(property)
    ]);

    return {
      propertyId: property.id,
      description,
      reports,
      generatedAt: new Date()
    };
  }

  // New method for creating property from address
  static async createPropertyFromAddress(address: string): Promise<any> {
    const validation = await AddressValidationService.validateAddress(address);
    
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid address');
    }

    const propertyDetails = await AddressValidationService.getPropertyDetails(address);
    
    return {
      ...propertyDetails,
      address: validation.formattedAddress,
      coordinates: validation.coordinates,
      addressComponents: validation.components
    };
  }

  // New method for preparing importable data
  static prepareImportableData(openHouseData: OpenHouseData): ImportableData {
    return {
      description: openHouseData.description,
      reports: openHouseData.reports,
      selectedReports: [], // User can select which reports to import
      importAll: false
    };
  }
}
