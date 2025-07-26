# Address Autofill Feature

## Overview

The Address Autofill feature provides intelligent address suggestions using the Mapbox Search API, enhancing the user experience when entering property addresses in the PropertyListingForm component.

## Features

- **Real-time Address Suggestions**: As users type, the component fetches address suggestions from Mapbox
- **Automatic Form Population**: When an address is selected, it automatically fills in the address, city, province, and postal code fields
- **Keyboard Navigation**: Users can navigate suggestions using arrow keys and select with Enter
- **Debounced Search**: Optimized API calls with 300ms debounce to reduce unnecessary requests
- **Multi-country Support**: Supports addresses in Canada (CA), United States (US), and UAE (AE)
- **Loading States**: Visual feedback during address search
- **Error Handling**: Graceful fallback when API is unavailable

## Implementation

### Components

#### AddressAutofill Component
Location: `src/components/shared/properties/AddressAutofill.tsx`

**Props:**
- `value: string` - Current input value
- `onChange: (value: string) => void` - Callback when input changes
- `onAddressSelect?: (addressComponents: AddressComponents) => void` - Callback when address is selected
- `placeholder?: string` - Input placeholder text
- `className?: string` - Additional CSS classes
- `disabled?: boolean` - Disable the input

**AddressComponents Interface:**
```typescript
interface AddressComponents {
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
```

### Integration in PropertyListingForm

The AddressAutofill component is integrated in two places:

1. **AI Import Section**: For importing property data with AI
2. **Property Information Section**: For the main address field

#### Usage Examples

```typescript
// AI Import Address
<AddressAutofill
  value={aiAddress}
  onChange={setAiAddress}
  onAddressSelect={handleAIAddressSelect}
  placeholder="Enter property address (e.g., 123 Main St, Toronto, ON)"
  className="flex-1 h-8"
/>

// Main Address Field
<AddressAutofill
  value={propertyData.address}
  onChange={(value) => updatePropertyData('address', value)}
  onAddressSelect={handleMainAddressSelect}
  placeholder="123 Main Street"
  className="h-8 mt-1"
/>
```

## Configuration

### Environment Variables

Add your Mapbox API key to your `.env.local` file:

```bash
NEXT_PUBLIC_MAPBOX_API_KEY=pk.eyJ1IjoiamF2aWFucGljYXJkbzMzIiwiYSI6ImNtYjY4ZGRyazBiaWYybHEyMWpnNGN4cDQifQ.m63aGFvbfzrQhT3sWlSbDQ
```

### Mapbox API Configuration

The component uses the Mapbox Geocoding API with the following parameters:
- **Countries**: CA (Canada), US (United States), AE (UAE)
- **Types**: address, poi (points of interest)
- **Limit**: 5 suggestions
- **Autocomplete**: Enabled

## API Integration

### Mapbox Geocoding API

**Endpoint**: `https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json`

**Parameters:**
- `access_token`: Your Mapbox API key
- `country`: CA,US,AE
- `types`: address,poi
- `limit`: 5
- `autocomplete`: true

### Response Format

The API returns a GeoJSON response with features containing:
- `place_name`: Full formatted address
- `text`: Primary address text
- `center`: [longitude, latitude] coordinates
- `context`: Array of address components (city, region, postcode, country)

## Error Handling

- **Missing API Key**: Component logs a warning and disables autofill functionality
- **Network Errors**: Silently fails and clears suggestions
- **Invalid Responses**: Handles malformed API responses gracefully
- **Rate Limiting**: Debounced requests prevent excessive API calls

## User Experience

### Keyboard Navigation
- **Arrow Down**: Move to next suggestion
- **Arrow Up**: Move to previous suggestion
- **Enter**: Select highlighted suggestion
- **Escape**: Close suggestions dropdown

### Visual Feedback
- Loading spinner during API requests
- Map pin icon for visual context
- Highlighted suggestions on hover/keyboard navigation
- Smooth transitions and animations

## Testing

### Manual Testing
1. Navigate to the List Property page
2. Click "AI Import" button
3. Start typing an address (e.g., "123 Main St, Toronto")
4. Verify suggestions appear
5. Select a suggestion and verify form fields are populated
6. Test the main address field in Property Information section

### Test Cases
- Valid addresses in Canada, US, and UAE
- Partial addresses
- Invalid/non-existent addresses
- Network connectivity issues
- Missing API key scenarios

## Future Enhancements

1. **Address Validation**: Validate selected addresses against postal service databases
2. **Geocoding Accuracy**: Display confidence scores for suggestions
3. **Recent Addresses**: Cache and suggest recently used addresses
4. **Custom Styling**: Theme-aware styling options
5. **Offline Support**: Cache common addresses for offline use
6. **Analytics**: Track address selection patterns for UX improvements

## Dependencies

- **Mapbox Search API**: For address geocoding and suggestions
- **React**: Component framework
- **Lucide React**: Icons (MapPin, Loader2)
- **Tailwind CSS**: Styling
- **shadcn/ui**: Base UI components (Input, Button)

## Performance Considerations

- **Debounced Requests**: 300ms delay reduces API calls
- **Request Cancellation**: Previous requests are cancelled when new ones are made
- **Minimal Re-renders**: Optimized state management
- **Lazy Loading**: Component only loads when needed
- **Memory Management**: Proper cleanup of timeouts and event listeners

## Security

- **API Key Protection**: Uses public Mapbox key (safe for client-side use)
- **Input Sanitization**: All user inputs are properly encoded
- **HTTPS Only**: All API requests use secure connections
- **Rate Limiting**: Built-in protection against abuse
