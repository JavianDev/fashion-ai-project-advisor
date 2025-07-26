/**
 * Photo Validation Service for Property Listings
 * Provides client-side validation for property photos before publishing
 */

export interface PhotoValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  photoCount: number;
  validPhotoCount: number;
}

export interface PhotoValidationOptions {
  minPhotos?: number;
  maxPhotos?: number;
  requiredFormats?: string[];
  maxFileSize?: number; // in bytes
  minDimensions?: { width: number; height: number };
  checkDuplicates?: boolean;
}

export class PhotoValidationService {
  private static readonly DEFAULT_OPTIONS: PhotoValidationOptions = {
    minPhotos: 1,
    maxPhotos: 20,
    requiredFormats: ['jpg', 'jpeg', 'png', 'webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    minDimensions: { width: 800, height: 600 },
    checkDuplicates: true
  };

  /**
   * Validate property photos for publishing
   */
  static validatePhotos(
    photos: string[] | File[] | null | undefined,
    options: PhotoValidationOptions = {}
  ): PhotoValidationResult {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const result: PhotoValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      photoCount: 0,
      validPhotoCount: 0
    };

    // Check if photos exist
    if (!photos || photos.length === 0) {
      result.errors.push('At least one property photo is required before publishing');
      result.isValid = false;
      return result;
    }

    result.photoCount = photos.length;

    // Validate minimum photos requirement
    if (photos.length < opts.minPhotos!) {
      result.errors.push(`At least ${opts.minPhotos} photo(s) required, but only ${photos.length} provided`);
      result.isValid = false;
    }

    // Validate maximum photos limit
    if (photos.length > opts.maxPhotos!) {
      result.errors.push(`Maximum ${opts.maxPhotos} photos allowed, but ${photos.length} provided`);
      result.isValid = false;
    }

    // Validate individual photos
    const validPhotos: (string | File)[] = [];
    const seenPhotos = new Set<string>();

    photos.forEach((photo, index) => {
      const photoErrors = this.validateSinglePhoto(photo, index, opts);
      
      if (photoErrors.length === 0) {
        validPhotos.push(photo);
        
        // Check for duplicates if enabled
        if (opts.checkDuplicates) {
          const photoKey = typeof photo === 'string' ? photo : photo.name;
          if (seenPhotos.has(photoKey)) {
            result.warnings.push(`Duplicate photo detected: ${photoKey}`);
          } else {
            seenPhotos.add(photoKey);
          }
        }
      } else {
        result.errors.push(...photoErrors);
        result.isValid = false;
      }
    });

    result.validPhotoCount = validPhotos.length;

    // Additional validation warnings
    if (result.validPhotoCount < 3) {
      result.warnings.push('Consider adding more photos to showcase your property better (recommended: 3+ photos)');
    }

    if (result.validPhotoCount === 1) {
      result.warnings.push('Single photo listings may receive less interest. Consider adding more photos.');
    }

    return result;
  }

  /**
   * Validate a single photo
   */
  private static validateSinglePhoto(
    photo: string | File,
    index: number,
    options: PhotoValidationOptions
  ): string[] {
    const errors: string[] = [];

    if (!photo) {
      errors.push(`Photo ${index + 1}: Empty or invalid photo`);
      return errors;
    }

    if (typeof photo === 'string') {
      // URL validation
      if (photo.trim() === '') {
        errors.push(`Photo ${index + 1}: Empty photo URL`);
      } else if (!this.isValidImageUrl(photo)) {
        errors.push(`Photo ${index + 1}: Invalid image URL format`);
      }
    } else if (photo instanceof File) {
      // File validation
      const fileErrors = this.validatePhotoFile(photo, index, options);
      errors.push(...fileErrors);
    }

    return errors;
  }

  /**
   * Validate photo file properties
   */
  private static validatePhotoFile(
    file: File,
    index: number,
    options: PhotoValidationOptions
  ): string[] {
    const errors: string[] = [];

    // Check file size
    if (options.maxFileSize && file.size > options.maxFileSize) {
      const maxSizeMB = (options.maxFileSize / (1024 * 1024)).toFixed(1);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      errors.push(`Photo ${index + 1}: File size ${fileSizeMB}MB exceeds maximum ${maxSizeMB}MB`);
    }

    // Check file format
    if (options.requiredFormats && options.requiredFormats.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !options.requiredFormats.includes(fileExtension)) {
        errors.push(`Photo ${index + 1}: Unsupported format. Allowed: ${options.requiredFormats.join(', ')}`);
      }
    }

    // Check MIME type
    if (!file.type.startsWith('image/')) {
      errors.push(`Photo ${index + 1}: File is not a valid image`);
    }

    return errors;
  }

  /**
   * Check if URL is a valid image URL
   */
  private static isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      return validExtensions.some(ext => pathname.endsWith(ext)) || 
             url.includes('blob:') || 
             url.includes('data:image/');
    } catch {
      return false;
    }
  }

  /**
   * Get validation summary message
   */
  static getValidationSummary(result: PhotoValidationResult): string {
    if (result.isValid) {
      let summary = `✅ ${result.validPhotoCount} valid photo(s) ready for publishing`;
      if (result.warnings.length > 0) {
        summary += `\n\n⚠️ Suggestions:\n${result.warnings.join('\n')}`;
      }
      return summary;
    } else {
      return `❌ Photo validation failed:\n${result.errors.join('\n')}`;
    }
  }

  /**
   * Quick validation for publish button state
   */
  static canPublish(photos: string[] | File[] | null | undefined): boolean {
    const result = this.validatePhotos(photos, { minPhotos: 1 });
    return result.isValid;
  }

  /**
   * Get photo count for display
   */
  static getPhotoCount(photos: string[] | File[] | null | undefined): number {
    return photos?.length || 0;
  }

  /**
   * Check if photos meet minimum requirements
   */
  static hasMinimumPhotos(photos: string[] | File[] | null | undefined, minCount: number = 1): boolean {
    const count = this.getPhotoCount(photos);
    return count >= minCount;
  }
}
