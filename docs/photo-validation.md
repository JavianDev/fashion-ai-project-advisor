# Photo Validation Service

## Overview

The Photo Validation Service provides comprehensive client-side validation for property photos before publishing listings. It ensures that properties meet minimum photo requirements and provides helpful feedback to users.

## Features

- **Minimum Photo Requirements**: Ensures at least 1 photo is uploaded before publishing
- **File Format Validation**: Supports JPG, JPEG, PNG, WebP formats
- **File Size Validation**: Configurable maximum file size (default: 5MB)
- **Quality Recommendations**: Suggests adding more photos for better listings
- **Duplicate Detection**: Identifies duplicate photos
- **Real-time Validation**: Provides instant feedback in the UI

## Usage

### Basic Validation

```typescript
import { PhotoValidationService } from '@/lib/services/photo-validation';

// Validate photos array
const photos = ['photo1.jpg', 'photo2.png'];
const result = PhotoValidationService.validatePhotos(photos);

if (result.isValid) {
  console.log('Photos are valid for publishing');
} else {
  console.log('Validation errors:', result.errors);
}
```

### Custom Validation Options

```typescript
const result = PhotoValidationService.validatePhotos(photos, {
  minPhotos: 3,
  maxPhotos: 15,
  requiredFormats: ['jpg', 'jpeg', 'png'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  checkDuplicates: true
});
```

### Quick Validation Checks

```typescript
// Check if can publish (minimum requirements met)
const canPublish = PhotoValidationService.canPublish(photos);

// Get photo count
const count = PhotoValidationService.getPhotoCount(photos);

// Check minimum photos
const hasMinimum = PhotoValidationService.hasMinimumPhotos(photos, 1);
```

## Validation Rules

### Required Photos
- **Minimum**: 1 photo required for publishing
- **Recommended**: 3+ photos for better engagement
- **Maximum**: 20 photos per listing

### File Requirements
- **Formats**: JPG, JPEG, PNG, WebP
- **Size**: Maximum 5MB per file
- **Type**: Must be valid image files

### Quality Recommendations
- **Multiple Photos**: Suggests adding more photos if less than 3
- **Single Photo Warning**: Warns about reduced interest with only 1 photo
- **Duplicate Detection**: Identifies potential duplicate uploads

## UI Integration

### PropertyListingForm Integration

The service is integrated into the property listing form with:

1. **Real-time Badge Updates**: Shows photo count and validation status
2. **Visual Feedback**: Green/red styling based on validation state
3. **Publish Button State**: Disables publish button if validation fails
4. **Helpful Messages**: Context-aware messages for different states

### Validation Status Component

```typescript
import { PhotoValidationStatus } from '@/components/shared/properties/PhotoValidationStatus';

<PhotoValidationStatus 
  photos={propertyData.photos} 
  showDetails={true} 
/>
```

## Validation Result Structure

```typescript
interface PhotoValidationResult {
  isValid: boolean;           // Overall validation status
  errors: string[];          // Validation errors (blocking)
  warnings: string[];        // Suggestions (non-blocking)
  photoCount: number;        // Total photos provided
  validPhotoCount: number;   // Valid photos count
}
```

## Error Messages

### Common Errors
- "At least one property photo is required before publishing"
- "Photo 1: File size 8.5MB exceeds maximum 5.0MB"
- "Photo 2: Unsupported format. Allowed: jpg, jpeg, png, webp"
- "Photo 3: File is not a valid image"

### Warnings
- "Consider adding more photos to showcase your property better (recommended: 3+ photos)"
- "Single photo listings may receive less interest. Consider adding more photos."
- "Duplicate photo detected: photo1.jpg"

## Configuration

### Default Settings
```typescript
{
  minPhotos: 1,
  maxPhotos: 20,
  requiredFormats: ['jpg', 'jpeg', 'png', 'webp'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  minDimensions: { width: 800, height: 600 },
  checkDuplicates: true
}
```

### Customization
All validation options can be customized per use case:

```typescript
// Strict validation for premium listings
const strictOptions = {
  minPhotos: 5,
  maxPhotos: 30,
  maxFileSize: 2 * 1024 * 1024, // 2MB
  requiredFormats: ['jpg', 'jpeg', 'png']
};

// Relaxed validation for quick listings
const relaxedOptions = {
  minPhotos: 1,
  maxPhotos: 10,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  checkDuplicates: false
};
```

## Best Practices

1. **Progressive Enhancement**: Start with basic validation, add advanced features
2. **User-Friendly Messages**: Provide clear, actionable error messages
3. **Performance**: Validate on user interaction, not continuously
4. **Accessibility**: Ensure validation messages are screen reader friendly
5. **Mobile Optimization**: Consider mobile upload limitations

## Testing

### Unit Tests
```typescript
describe('PhotoValidationService', () => {
  it('should require at least one photo', () => {
    const result = PhotoValidationService.validatePhotos([]);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('At least one property photo is required before publishing');
  });

  it('should validate file formats', () => {
    const result = PhotoValidationService.validatePhotos(['photo.gif']);
    expect(result.isValid).toBe(false);
  });
});
```

## Future Enhancements

- **Image Dimension Validation**: Check minimum resolution requirements
- **Content Analysis**: AI-powered inappropriate content detection
- **Compression Suggestions**: Recommend image optimization
- **Batch Upload Progress**: Show upload progress for multiple files
- **Cloud Storage Integration**: Direct upload to cloud storage with validation
