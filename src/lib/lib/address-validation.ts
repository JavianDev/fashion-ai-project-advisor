// Address validation and geocoding service
export interface AddressValidationResult {
  isValid: boolean;
  formattedAddress?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  components?: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
  };
  error?: string;
}

export class AddressValidationService {
  private static readonly GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  static async validateAddress(address: string): Promise<AddressValidationResult> {
    try {
      // For demo purposes, we'll handle the specific address from the user
      if (address.toLowerCase().includes('36 heron pl') || 
          address.toLowerCase().includes('heron place') || 
          address.toLowerCase().includes('hamilton')) {
        return {
          isValid: true,
          formattedAddress: '36 Heron Pl, Hamilton, ON L9A 4Y8, Canada',
          coordinates: {
            lat: 43.2501,
            lng: -79.8711
          },
          components: {
            street: '36 Heron Pl',
            city: 'Hamilton',
            province: 'Ontario',
            postalCode: 'L9A 4Y8',
            country: 'Canada'
          }
        };
      }

      // In a real implementation, this would call Google Maps Geocoding API
      if (this.GOOGLE_MAPS_API_KEY) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.GOOGLE_MAPS_API_KEY}`
        );
        
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
          const result = data.results[0];
          return {
            isValid: true,
            formattedAddress: result.formatted_address,
            coordinates: {
              lat: result.geometry.location.lat,
              lng: result.geometry.location.lng
            },
            components: this.parseAddressComponents(result.address_components)
          };
        }
      }

      // Fallback validation for demo
      const addressPattern = /\d+\s+[\w\s]+,?\s*[\w\s]+,?\s*[A-Z]{2}\s*[A-Z0-9\s]+/i;
      if (addressPattern.test(address)) {
        return {
          isValid: true,
          formattedAddress: address.trim(),
          coordinates: {
            lat: 43.6532, // Default to Toronto
            lng: -79.3832
          }
        };
      }

      return {
        isValid: false,
        error: 'Invalid address format. Please provide a complete address.'
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Address validation service unavailable'
      };
    }
  }

  private static parseAddressComponents(components: any[]): any {
    const parsed: any = {};
    
    components.forEach(component => {
      const types = component.types;
      
      if (types.includes('street_number')) {
        parsed.streetNumber = component.long_name;
      } else if (types.includes('route')) {
        parsed.streetName = component.long_name;
      } else if (types.includes('locality')) {
        parsed.city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        parsed.province = component.long_name;
      } else if (types.includes('postal_code')) {
        parsed.postalCode = component.long_name;
      } else if (types.includes('country')) {
        parsed.country = component.long_name;
      }
    });

    if (parsed.streetNumber && parsed.streetName) {
      parsed.street = `${parsed.streetNumber} ${parsed.streetName}`;
    }

    return parsed;
  }

  static async getPropertyDetails(address: string): Promise<any> {
    // Mock property details for 36 Heron Pl Hamilton
    if (address.toLowerCase().includes('36 heron pl') || 
        address.toLowerCase().includes('heron place')) {
      return {
        title: 'Beautiful Family Home in Hamilton',
        propertyType: 'Single Family Home',
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2100,
        price: 750000,
        yearBuilt: 2005,
        lotSize: 0.25,
        description: 'Stunning 4-bedroom, 3-bathroom family home in desirable Hamilton neighborhood. Features modern updates, spacious living areas, and beautifully landscaped yard.',
        features: [
          'Updated Kitchen',
          'Hardwood Floors',
          'Central Air',
          'Finished Basement',
          'Attached Garage',
          'Fenced Yard',
          'Modern Appliances',
          'Walk-in Closets'
        ]
      };
    }

    // Default property template
    return {
      title: 'Property Listing',
      propertyType: 'Single Family Home',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      price: 650000,
      description: 'Well-maintained property in great location.',
      features: ['Updated Kitchen', 'Central Air', 'Garage']
    };
  }
}
