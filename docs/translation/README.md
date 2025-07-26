# SoNoBrokers Translation System

Complete internationalization (i18n) system for the SoNoBrokers application supporting multiple languages across Canada, USA, and UAE markets.

## 🌍 Supported Languages

| Country    | Languages        | Codes            |
| ---------- | ---------------- | ---------------- |
| **Canada** | English, French  | `en-CA`, `fr-CA` |
| **USA**    | English, Spanish | `en-US`, `es-US` |
| **UAE**    | Arabic, English  | `ar-AE`, `en-AE` |

## 🚀 Quick Start

### Apply Translations to All Files

```bash
npm run i18n:apply
```

This processes all files in `src/app` and `src/components`, adds translation hooks, and replaces hardcoded strings.

### Generate Missing Translations

```bash
npm run i18n:translate
```

Automatically generates translations for missing keys using AI/mock translation service.

### Validate Translation Coverage

```bash
npm run i18n:validate
```

Checks translation completeness across all supported languages.

### Complete Workflow

```bash
npm run i18n:workflow
```

Runs the complete translation workflow from start to finish.

## 📁 Project Structure

```
src/
├── locales/                    # Translation files
│   ├── en-US/common.json      # US English (base)
│   ├── es-US/common.json      # US Spanish
│   ├── en-CA/common.json      # Canadian English
│   ├── fr-CA/common.json      # Canadian French
│   ├── ar-AE/common.json      # UAE Arabic
│   └── en-AE/common.json      # UAE English
├── components/
│   └── providers/
│       └── I18nProvider.tsx   # i18next configuration
└── app/
    └── layout.tsx             # Root layout with providers
```

## 🔧 Translation Scripts

### **1. `npm run i18n:apply`** (First Step)

**What it does:**

- Scans all files in `src/app` and `src/components` (excludes `src/components/_archive`)
- Adds `'use client'` directive to components that need it
- Adds translation support in one operation: import + hook + string replacement
- Replaces hardcoded strings like `"Browse Properties"` with `{t('buttons.browseProperties')}`
- **Automatically adds new translation keys to ALL language files** (en-US, es-US, en-CA, fr-CA, ar-AE, en-AE)

### **2. `npm run i18n:translate`** (Second Step)

**What it does:**

- Finds missing translation keys across all language files
- Generates translations for missing keys using AI/mock translation service
- Updates all language files (`es-US`, `en-CA`, `fr-CA`, `ar-AE`, `en-AE`) with new translations
- Ensures 100% coverage across all supported languages

### **3. `npm run i18n:validate`** (Third Step - Verification)

**What it does:**

- Checks translation completeness across all languages
- Reports coverage percentage for each language
- Identifies missing or unused translation keys
- Validates that all used keys exist in translation files

### **4. `npm run i18n:workflow`** (Complete Automation)

**What it does:**

- Runs all the above steps in sequence automatically
- Equivalent to running: apply → translate → validate
- Best for full automation

### **5. `npm run i18n:build-check`** (Build Integration)

**What it does:**

- Runs during `npm run build` automatically
- Validates translations before build
- Fails the build if critical translation issues are found
- Ensures production builds have complete translations

## � **Proper Execution Order**

### **Manual Step-by-Step:**

```bash
# Step 1: Apply translations to components
npm run i18n:apply

# Step 2: Generate missing translations
npm run i18n:translate

# Step 3: Validate everything is complete
npm run i18n:validate

# Step 4: Test your application
npm run dev

# Step 5: Build (includes automatic validation)
npm run build
```

### **Quick Automation:**

```bash
# Run everything at once
npm run i18n:workflow
```

## 🎯 **What Each Script Validates:**

- **`i18n:apply`**: Validates that components can use translations (adds hooks)
- **`i18n:translate`**: Validates that all languages have the same keys
- **`i18n:validate`**: Validates coverage and finds unused/missing keys
- **`i18n:build-check`**: Validates production readiness

## �📝 Usage in Components

### Client Components

```tsx
"use client";
import { useTranslation } from "react-i18next";

export function MyComponent() {
  const { t } = useTranslation("common");

  return (
    <div>
      <h1>{t("navigation.dashboard")}</h1>
      <button>{t("common.save")}</button>
    </div>
  );
}
```

### Server Components

Server components don't support hooks. Use hardcoded strings or convert to client components when translation is needed.

## 🎯 Translation Key Structure

### Naming Convention

- **Navigation**: `navigation.dashboard`, `navigation.services`
- **Buttons**: `buttons.listProperty`, `buttons.learnMore`
- **Forms**: `forms.firstName`, `forms.emailAddress`
- **General**: `general.loading`, `general.save`
- **Common**: `common.save`, `common.cancel`, `common.submit`

### Example Keys

```json
{
  "navigation": {
    "dashboard": "Dashboard",
    "services": "Services",
    "resources": "Resources"
  },
  "buttons": {
    "listProperty": "List Property",
    "browseProperties": "Browse Properties"
  },
  "general": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

## 🔄 Automated Processing

### File Inclusion

- ✅ `src/app/**/*.{js,jsx,ts,tsx}` - All app pages and components
- ✅ `src/components/**/*.{js,jsx,ts,tsx}` - All components

### File Exclusions

- ❌ `src/components/_archive/**` - Archived components
- ❌ `src/components/ui/**` - shadcn/ui components
- ❌ `src/app/api/**` - API routes
- ❌ `**/*.test.*` - Test files
- ❌ `**/*.spec.*` - Spec files

### Component Handling

- **Client Components**: Full translation support with hooks
- **Server Components**: Automatically skipped (no client-side hooks)
- **Class Components**: Automatically skipped (hooks not supported)

## 🌐 Language Detection

The system automatically detects user language based on:

1. URL country parameter (`/ca`, `/us`, `/uae`)
2. Browser language preferences
3. User settings (stored in localStorage)
4. Fallback to country default

## 🔧 Configuration

### I18n Provider Setup

```tsx
// src/components/providers/I18nProvider.tsx
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en-US",
    supportedLngs: ["en-US", "es-US", "en-CA", "fr-CA", "ar-AE", "en-AE"],
    // ... configuration
  });
```

### Provider Hierarchy

```tsx
// Correct order in layout.tsx
<I18nProvider>
  <ClerkClientProvider>
    <ThemeProvider>
      <AppClientProvider>{children}</AppClientProvider>
    </ThemeProvider>
  </ClerkClientProvider>
</I18nProvider>
```

## 🚨 Troubleshooting

### Build Fails with Translation Errors

1. Run `npm run i18n:apply` to fix missing hooks
2. Run `npm run i18n:translate` to generate missing translations
3. Run `npm run build` again

### Component Not Translating

1. Check if it's a server component (add `'use client'` if needed)
2. Verify it's not in excluded patterns
3. Ensure `useTranslation` hook is properly imported

### Missing Translation Keys

1. Run `npm run i18n:validate` to see coverage report
2. Add missing keys manually to locale files
3. Run `npm run i18n:translate` to auto-generate

## 📊 Translation Coverage

The build process automatically validates translation coverage and prevents builds with missing translations. All supported languages must have 100% coverage.

## 🔄 Workflow Integration

### Development Workflow

1. Write components with hardcoded strings
2. Run `npm run i18n:apply` to add translation support
3. Run `npm run i18n:translate` to generate translations
4. Test language switching in application
5. Build and deploy

### CI/CD Integration

The `i18n:build-check` script runs automatically during the build process to ensure translation completeness.

## 📚 Best Practices

1. **Use semantic key names** for better maintainability
2. **Keep translations short and clear** for UI elements
3. **Test all languages** before deploying
4. **Use context-appropriate keys** (navigation, forms, etc.)
5. **Maintain consistent terminology** across languages
6. **Review auto-generated translations** for accuracy

## 📚 Documentation Structure

This documentation is organized into focused guides:

- **[README.md](./README.md)** - This overview and quick start guide
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Detailed implementation instructions
- **[MULTI_LANGUAGE_IMPLEMENTATION.md](./MULTI_LANGUAGE_IMPLEMENTATION.md)** - Architecture and technical details
- **[LANGUAGE_SWITCH_IMPLEMENTATION.md](./LANGUAGE_SWITCH_IMPLEMENTATION.md)** - Language switching functionality

## 🧹 Streamlined System

### What Was Removed

- ❌ **Redundant scripts** - Removed duplicate functionality
- ❌ **Report files** - No more JSON report generation
- ❌ **Complex workflows** - Simplified to essential tools only
- ❌ **Background services** - No unnecessary running processes

### What Was Kept

- ✅ **Essential scripts** - Core translation functionality
- ✅ **Automated processing** - Complete file processing
- ✅ **Build integration** - Validation during build process
- ✅ **AI translation** - Automated translation generation

## 🔗 Related Documentation

- [Multi-Language Implementation Guide](./MULTI_LANGUAGE_IMPLEMENTATION.md)
- [Language Switch Implementation](./LANGUAGE_SWITCH_IMPLEMENTATION.md)
- [Translation Implementation Guide](./IMPLEMENTATION_GUIDE.md)
