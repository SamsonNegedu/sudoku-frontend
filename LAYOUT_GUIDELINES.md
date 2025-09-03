# Layout Guidelines & Consistency

This document outlines the standardized layout components and patterns to ensure consistent design across all pages in the Sudoku application.

## Layout Components

### 1. PageLayout Component

**Purpose**: Provides consistent viewport height management and centering options.

**Usage**:
```tsx
import { PageLayout } from './components/PageLayout';

// Basic usage
<PageLayout className="bg-gray-50">
  <YourPageContent />
</PageLayout>

// Centered content (good for modals, landing screens)
<PageLayout centered={true} className="bg-gradient-to-br from-neutral-50 to-neutral-100">
  <YourCenteredContent />
</PageLayout>
```

**Features**:
- Automatically accounts for navbar height (`min-h-[calc(100vh-4rem)]`)
- Optional centering with `centered={true}`
- Custom styling via `className`

### 2. PageHeader Component

**Purpose**: Provides consistent page headers that align with the navbar structure.

**Usage**:
```tsx
import { PageHeader } from './components/PageHeader';

// Basic usage
<PageHeader title="Page Title" />

// With subtitle
<PageHeader 
  title="Analytics Dashboard"
  subtitle="Track your progress and improve your skills"
/>

// With action buttons
<PageHeader title="Settings">
  <Button onClick={handleSave}>Save Changes</Button>
  <Button onClick={handleCancel} variant="outline">Cancel</Button>
</PageHeader>

// Multiple actions
<PageHeader title="User Profile">
  <Button onClick={handleEdit}>Edit Profile</Button>
  <Button onClick={handleLogout} variant="outline">Logout</Button>
</PageHeader>
```

**Features**:
- Uses same container structure as navbar (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`)
- Responsive design with proper mobile stacking
- Flexible children prop for custom actions
- Built-in truncation for long titles
- Consistent spacing and typography

## Standard Page Patterns

### Pattern 1: Basic Content Page
```tsx
<PageLayout className="bg-gray-50">
  <PageHeader title="Page Title" subtitle="Optional description">
    <Button onClick={handleAction}>Action</Button>
  </PageHeader>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <YourPageContent />
  </div>
</PageLayout>
```

### Pattern 2: Centered Content (Modals, Landing)
```tsx
<PageLayout centered={true} className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-4">
  <div className="max-w-md w-full">
    <YourCenteredContent />
  </div>
</PageLayout>
```

### Pattern 3: Full-Screen Game/App View
```tsx
<PageLayout className="bg-gradient-to-br from-neutral-50 to-neutral-100">
  <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6">
    <YourGameContent />
  </div>
</PageLayout>
```

## Container Guidelines

### Responsive Padding
Always use the navbar's responsive padding pattern:
```css
px-4 sm:px-6 lg:px-8
```

### Container Widths
- **Standard pages**: `max-w-7xl mx-auto`
- **Narrow content**: `max-w-4xl mx-auto`
- **Forms/modals**: `max-w-md` or `max-w-lg`

### Vertical Spacing
- **Page sections**: `py-6` or `py-4 sm:py-6`
- **Component gaps**: `gap-4 sm:gap-6 lg:gap-8`
- **Header margins**: `mb-4 sm:mb-6`

## Adding New Pages

When creating new pages, follow this checklist:

### ✅ Required Components
- [ ] Use `PageLayout` for viewport management
- [ ] Use `PageHeader` for consistent headers
- [ ] Apply proper container structure

### ✅ Responsive Design
- [ ] Test on mobile (320px+)
- [ ] Test on tablet (768px+)
- [ ] Test on desktop (1024px+)
- [ ] Verify alignment with navbar

### ✅ Example Implementation
```tsx
import { PageLayout } from '../components/PageLayout';
import { PageHeader } from '../components/PageHeader';

export const NewPage: React.FC = () => {
  const handleAction = () => {
    // Your action logic
  };

  return (
    <PageLayout className="bg-gray-50">
      <PageHeader 
        title="New Page"
        subtitle="Description of what this page does"
      >
        <button
          onClick={handleAction}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          Primary Action
        </button>
      </PageHeader>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Your page content here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Section Title</h2>
          <p className="text-gray-600">Your content...</p>
        </div>
      </div>
    </PageLayout>
  );
};
```

## Benefits of This System

1. **Consistent Alignment**: All page headers align perfectly with navbar content
2. **Responsive Design**: Built-in mobile-first responsive behavior
3. **Maintainable**: Changes to container structure only need updates in one place
4. **Flexible**: Supports various content types and layouts
5. **Accessible**: Proper semantic HTML structure
6. **Future-Proof**: Easy to extend with new features

## Migration Guide

### Existing Pages
To migrate existing pages to use these components:

1. **Replace manual containers** with `PageLayout`
2. **Replace custom headers** with `PageHeader`
3. **Update padding classes** to match navbar structure
4. **Test responsive behavior** on all screen sizes

### Before:
```tsx
<div className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 py-6">
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold">Page Title</h1>
      <button>Action</button>
    </div>
    <Content />
  </div>
</div>
```

### After:
```tsx
<PageLayout className="bg-gray-50">
  <PageHeader title="Page Title">
    <button>Action</button>
  </PageHeader>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <Content />
  </div>
</PageLayout>
```

This ensures all future pages will automatically maintain visual consistency with the navbar and overall application design! 🎯
