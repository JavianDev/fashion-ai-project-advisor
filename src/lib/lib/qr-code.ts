// QR Code generation and management for open house access
export interface QRCodeData {
  propertyId: string;
  openHouseId: string;
  accessType: 'public' | 'private';
  expiresAt?: Date;
  maxUses?: number;
  currentUses?: number;
}

export interface OpenHouseAccess {
  id: string;
  propertyId: string;
  buyerId?: string;
  accessedAt: Date;
  accessType: 'qr_scan' | 'online_access';
  buyerInfo?: {
    name: string;
    email: string;
    phone?: string;
    prequalified?: boolean;
  };
}

export interface BuyerOffer {
  id: string;
  propertyId: string;
  buyerId: string;
  offerAmount: number;
  conditions?: string[];
  message?: string;
  submittedAt: Date;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  expiresAt?: Date;
}

export class QRCodeService {
  // Generate QR code data for property open house
  static generateOpenHouseQR(propertyId: string, options: {
    accessType?: 'public' | 'private';
    expiresHours?: number;
    maxUses?: number;
  } = {}): QRCodeData {
    const openHouseId = `oh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const qrData: QRCodeData = {
      propertyId,
      openHouseId,
      accessType: options.accessType || 'public',
      currentUses: 0
    };

    if (options.expiresHours) {
      qrData.expiresAt = new Date(Date.now() + options.expiresHours * 60 * 60 * 1000);
    }

    if (options.maxUses) {
      qrData.maxUses = options.maxUses;
    }

    return qrData;
  }

  // Generate QR code URL for scanning
  static generateQRCodeURL(qrData: QRCodeData): string {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const params = new URLSearchParams({
      property: qrData.propertyId,
      access: qrData.openHouseId,
      type: qrData.accessType
    });

    return `${baseUrl}/open-house/access?${params.toString()}`;
  }

  // Validate QR code access
  static validateQRAccess(qrData: QRCodeData): {
    isValid: boolean;
    error?: string;
  } {
    // Check expiration
    if (qrData.expiresAt && new Date() > qrData.expiresAt) {
      return { isValid: false, error: 'QR code has expired' };
    }

    // Check usage limits
    if (qrData.maxUses && (qrData.currentUses || 0) >= qrData.maxUses) {
      return { isValid: false, error: 'QR code usage limit reached' };
    }

    return { isValid: true };
  }

  // Record open house access
  static recordAccess(
    propertyId: string,
    accessType: 'qr_scan' | 'online_access',
    buyerInfo?: OpenHouseAccess['buyerInfo']
  ): OpenHouseAccess {
    return {
      id: `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      propertyId,
      accessedAt: new Date(),
      accessType,
      buyerInfo
    };
  }

  // Create buyer offer
  static createOffer(
    propertyId: string,
    buyerId: string,
    offerAmount: number,
    options: {
      conditions?: string[];
      message?: string;
      expiresHours?: number;
    } = {}
  ): BuyerOffer {
    const offer: BuyerOffer = {
      id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      propertyId,
      buyerId,
      offerAmount,
      submittedAt: new Date(),
      status: 'pending',
      conditions: options.conditions,
      message: options.message
    };

    if (options.expiresHours) {
      offer.expiresAt = new Date(Date.now() + options.expiresHours * 60 * 60 * 1000);
    }

    return offer;
  }

  // Get mock data for demo
  static getMockOpenHouseData(propertyId: string) {
    return {
      accesses: [
        {
          id: 'access_1',
          propertyId,
          accessedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          accessType: 'qr_scan' as const,
          buyerInfo: {
            name: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            phone: '+1 (555) 123-4567',
            prequalified: true
          }
        },
        {
          id: 'access_2',
          propertyId,
          accessedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          accessType: 'online_access' as const,
          buyerInfo: {
            name: 'Michael Chen',
            email: 'mchen@email.com',
            phone: '+1 (555) 987-6543',
            prequalified: false
          }
        },
        {
          id: 'access_3',
          propertyId,
          accessedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          accessType: 'qr_scan' as const,
          buyerInfo: {
            name: 'Emily Rodriguez',
            email: 'emily.r@email.com',
            prequalified: true
          }
        }
      ],
      offers: [
        {
          id: 'offer_1',
          propertyId,
          buyerId: 'buyer_1',
          offerAmount: 720000,
          conditions: ['Home Inspection', 'Financing Contingency'],
          message: 'We love this home and would like to schedule a private viewing. We are pre-approved for financing.',
          submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          status: 'pending' as const,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        {
          id: 'offer_2',
          propertyId,
          buyerId: 'buyer_2',
          offerAmount: 745000,
          conditions: ['Home Inspection'],
          message: 'Cash offer, quick closing possible.',
          submittedAt: new Date(Date.now() - 30 * 60 * 1000),
          status: 'pending' as const,
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
        }
      ]
    };
  }
}

// QR Code SVG generator (simple implementation)
export function generateQRCodeSVG(data: string, size: number = 200): string {
  // This is a simplified QR code representation
  // In a real implementation, you'd use a library like 'qrcode' or 'qr-code-generator'
  const gridSize = 21; // Standard QR code is 21x21
  const cellSize = size / gridSize;
  
  // Create a pattern (this is just for demo - real QR codes have specific encoding)
  const pattern = Array(gridSize).fill(null).map(() => 
    Array(gridSize).fill(null).map(() => Math.random() > 0.5)
  );
  
  // Add finder patterns (corners)
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      pattern[i][j] = (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4));
      pattern[i][gridSize - 1 - j] = (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4));
      pattern[gridSize - 1 - i][j] = (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4));
    }
  }
  
  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${size}" height="${size}" fill="white"/>`;
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (pattern[i][j]) {
        svg += `<rect x="${j * cellSize}" y="${i * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }
  }
  
  svg += '</svg>';
  return svg;
}
