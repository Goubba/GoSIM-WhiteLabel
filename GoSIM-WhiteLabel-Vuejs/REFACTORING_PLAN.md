# GoSIM Codebase Refactoring Plan

## Overview
This document outlines the refactoring plan to clean up the codebase, remove over-engineering, and create a simple, minimal, well-organized structure following the example project patterns.

## Current Issues Identified
1. **Over-engineered views**: Views like `LocationPackagesView.vue` (1977 lines) and `DetailsView.vue` (1400+ lines) are too complex
2. **Poor organization**: Views scattered in root with inconsistent folder structure
3. **Duplicate functionality**: Multiple similar components and views
4. **Complex nested structures**: Deep folder nesting without clear purpose

## Target Structure (Following Example Project)

### Views Organization
```
src/views/
├── auth/
│   ├── AuthLayout.vue
│   ├── LoginView.vue
│   └── RegisterView.vue
├── packagesList/
│   ├── PackagesListView.vue
│   └── components/
│       ├── PackageCard.vue
│       ├── PackageFilter.vue
│       └── LocationHeader.vue
├── esimDetails/
│   ├── EsimDetailsView.vue
│   └── components/
│       ├── EsimStatus.vue
│       ├── InstallationTabs.vue
│       └── UsageStats.vue
├── profile/
│   ├── ProfileView.vue
│   ├── PersonalInformationView.vue
│   ├── PreferencesView.vue
│   └── components/
│       ├── ProfileHeader.vue
│       └── SettingsItem.vue
├── guide/
│   ├── GuideView.vue
│   └── components/
│       ├── GuideStep.vue
│       └── DeviceCheck.vue
├── summary/
│   ├── SummaryView.vue
│   └── components/
│       ├── OrderSummary.vue
│       └── PaymentInfo.vue
├── home/
│   ├── HomeView.vue
│   └── components/
│       ├── HeroSection.vue
│       └── FeaturedPackages.vue
└── support/
    ├── SupportView.vue
    └── components/
        ├── FAQSection.vue
        └── ContactForm.vue
```

## Refactoring Principles

### 1. File Size Limits
- **Views**: Maximum 200 lines
- **Components**: Maximum 150 lines
- **Complex logic**: Extract to composables or services

### 2. Component Structure
```vue
<template>
  <!-- Clean, minimal template -->
</template>

<script>
// Simple, focused script
export default {
  components: {},
  data() {
    return {
      // Only essential data
    }
  },
  computed: {
    // Simple computed properties
  },
  methods: {
    // Focused methods
  }
}
</script>

<style scoped>
/* Minimal styling */
</style>
```

### 3. Folder Organization Rules
- Each major feature gets its own folder
- Components specific to a view go in `components/` subfolder
- Shared components stay in global `src/components/`
- Maximum 2 levels of nesting

## Refactoring Tasks

### Phase 1: Core Views Refactoring
1. **LocationPackagesView → packagesList/**
   - Break down 1977-line monolith
   - Extract package cards, filters, location header
   - Simplify data fetching logic

2. **DetailsView → esimDetails/**
   - Split installation tabs, usage stats, QR code
   - Remove complex device detection logic
   - Simplify status management

3. **Profile Views Consolidation**
   - Merge scattered profile components
   - Create clean profile navigation
   - Remove duplicate functionality

### Phase 2: Guide & Summary Cleanup
4. **Guide Views Consolidation**
   - Merge GuideView, GuideActivationView, GuideInstalltionView
   - Create single, clean guide flow
   - Remove redundant device checks

5. **Summary Views Simplification**
   - Consolidate summary components
   - Remove over-engineered helpers
   - Simplify payment flow

### Phase 3: Cleanup & Optimization
6. **Remove Unused Files**
   - Delete duplicate components
   - Remove empty folders
   - Clean up unused imports

7. **Router Updates**
   - Update routes to match new structure
   - Remove unused routes
   - Simplify route parameters

## Success Metrics
- [ ] All views under 200 lines
- [ ] Clear folder structure with max 2 levels
- [ ] No duplicate functionality
- [ ] Consistent component patterns
- [ ] Maintained functionality
- [ ] Improved maintainability

## Implementation Order
1. Create new folder structure
2. Refactor LocationPackagesView (highest priority - most complex)
3. Refactor DetailsView
4. Consolidate profile views
5. Clean up guide and summary views
6. Remove unused files
7. Update router
8. Test all functionality

## Notes
- Follow example project patterns exactly
- Prioritize simplicity over features
- Maintain existing functionality
- Use consistent naming conventions
- Keep components focused and single-purpose

