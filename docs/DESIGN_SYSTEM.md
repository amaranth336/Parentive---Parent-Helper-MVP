# Parentive Design System

**Version**: 1.1.0  
**Status**: Production Ready  
**Last Updated**: September 1, 2026

---

## Overview

The Parentive Design System is a comprehensive, accessible component library implementing the approved Parentive brand identity from Linear Issue 003. Built with React, TypeScript, Tailwind CSS, and Radix UI primitives.

## Design Principles

1. **Implement, don't redesign** - The brand identity from Issue 003 is the source of truth
2. **Honey is punctuation, not paint** - Use Muted Honey sparingly for small accents only
3. **Only seven approved organic shapes** - No random blob generation
4. **Accessibility-first** - All components meet WCAG 2.2 AA standards
5. **Semantic tokens** - Colors are mapped to semantic meanings, not used directly
6. **Mobile-first responsive** - Optimized for all screen sizes

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.x
- **Primitives**: Radix UI
- **Icons**: Lucide React
- **Utilities**: class-variance-authority, clsx, tailwind-merge

## Getting Started

### Installation

The design system is integrated into the Parentive application. All components are available under `/components`:

```bash
npm install
```

### Using Components

```tsx
import { Button, Heading, Text, Card } from "@/components";

export default function MyPage() {
  return (
    <Card>
      <Heading as="h2">Welcome to Parentive</Heading>
      <Text>Support isn't a last resort.</Text>
      <Button variant="primary">Get Started</Button>
    </Card>
  );
}
```

### Viewing the Design System

Visit `/design-system` to see all components, colors, typography, and usage examples.

## Brand Assets

### Logo source of truth

Logo **mark**, **wordmark**, and horizontal **lockup** are the locked files from
Linear 003. The app must not reconstruct Option 14 in CSS, and it must not treat
the brand-package PDF or design board as the logo file.

**Canonical Drive folder:**
https://drive.google.com/drive/folders/1r6GTJERQDf3pFb57RwftqhqY2StSo0yU?usp=drive_link

Local copies are served from `public/brand/`:

| Kind | Component | Files |
|------|-----------|-------|
| Standalone mark | `<Logo />` | `/brand/logo-mark.svg` (PNG fallback) |
| Wordmark | `<Wordmark />` | `/brand/wordmark.svg` (PNG fallback) |
| Horizontal lockup | `<LogoLockup />` | `/brand/logo-lockup-horizontal.svg` (PNG fallback) |

After the Drive folder is updated, refresh local files with:

```bash
npm run sync:brand-assets
```

The Option 14 mark itself is a full lowercase serif `p` in Deep Moss on a soft
organic Oat form, with a small Muted Honey dot at the upper-right. Do not
recreate that construction in components — render the exported artwork.

**Components**: `<Logo />`, `<Wordmark />`, `<LogoLockup />`

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Deep Moss** | `#30483B` | Primary brand, buttons, headings |
| **Soft Sage** | `#AEBBA6` | Secondary elements, subtle backgrounds |
| **Oat** | `#F5F2EA` | Default page background |
| **Warm Sand** | `#E7DECF` | Secondary surfaces |
| **Walnut** | `#594B41` | Primary text color |
| **Muted Honey** | `#D5A552` | Small accents, focus states |

### Typography

- **Headings**: Manrope (Regular, Medium, Semibold, Bold)
- **Body/UI**: Inter (Regular, Medium, Semibold)

## Component Library

### Primitives

- **Button** - Primary, Secondary, Outline, Ghost, Link, Accent variants
- **Text** - Size and color variants
- **Heading** - H1-H4 and Display sizes
- **Divider** - Horizontal rule separator
- **Section** - Layout container with spacing
- **Card** - Content card with variants

### Forms

All form components include proper labels, validation states, and accessibility:

- **Input** - Text, email, number, etc.
- **Textarea** - Multi-line text input
- **Label** - Form field labels
- **Checkbox** - Single/multiple selection
- **RadioGroup** - Single selection from options
- **Select** - Dropdown selection
- **FormField** - Complete field with label, help text, validation

### Feedback

- **Alert** - Info, Success, Warning, Error variants
- **Badge** - Status indicators
- **Spinner** - Loading indicator
- **LoadingState** - Full loading screen
- **EmptyState** - Empty content placeholder

### Navigation

- **Header** - Responsive site header with navigation
- **Footer** - Site footer with links

### Brand Components

- **Logo** - Logo mark, wordmark, and lockup variations
- **OrganicShape** - Seven approved organic shapes
- **OrganicBrandSurface** - Card with organic shape decoration
- **Icon** - Lucide icon wrapper with Parentive styling
- **Callout** - Emphasized content blocks

## Accessibility

All components meet **WCAG 2.2 Level AA** requirements:

✓ **Color Contrast**: 4.5:1 for normal text, 3:1 for large text  
✓ **Keyboard Navigation**: All interactive elements are keyboard accessible  
✓ **Focus Indicators**: Visible focus rings on all interactive elements  
✓ **Screen Readers**: Proper ARIA labels and semantic HTML  
✓ **Touch Targets**: Minimum 44x44px for interactive elements

See `/docs/ACCESSIBILITY.md` for detailed validation report.

## Organic Shapes

Seven approved organic shapes are available:

1. **Open** - Wide, welcoming shape
2. **Drift** - Flowing, relaxed shape
3. **Lean** - Dynamic, tilted shape
4. **Pebble** - Rounded, soft shape
5. **Room** - Spacious, contained shape
6. **Sidecar** - Asymmetric, adjacent shape
7. **Quiet Edge** - Gentle, subtle shape

```tsx
<OrganicShape shape="pebble" color="sand" size="md" />
```

## Design Tokens

### Colors

Use semantic tokens, not raw hex values:

```tsx
// ✅ Good
<div className="bg-surface-default text-text-primary">

// ❌ Bad
<div className="bg-[#F5F2EA] text-[#594B41]">
```

### Spacing

Consistent spacing scale:
- `section-sm` - 3rem (48px)
- `section-md` - 5rem (80px)
- `section-lg` - 8rem (128px)
- `section-xl` - 10rem (160px)

### Border Radius

- `subtle` - 0.375rem (6px) - Inputs, small elements
- `card` - 1rem (16px) - Cards, larger containers
- `organic` - 2.5rem (40px) - Organic brand elements

## Usage Guidelines

### Buttons

```tsx
// Primary action (Moss background)
<Button variant="primary">Get Started</Button>

// Secondary action
<Button variant="secondary">Learn More</Button>

// Outlined
<Button variant="outline">Cancel</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

### Typography

```tsx
<Heading as="display">Large Display</Heading>
<Heading as="h1">Main Page Title</Heading>
<Heading as="h2">Section Heading</Heading>
<Text size="lg">Large body text</Text>
<Text>Default body text</Text>
<Text size="sm" color="muted">Helper text</Text>
```

### Forms

```tsx
<FormField 
  label="Email" 
  htmlFor="email" 
  required
  helpText="We'll never share your email"
  error={errors.email}
>
  <Input 
    id="email" 
    type="email" 
    error={!!errors.email}
  />
</FormField>
```

### Alerts

```tsx
<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your changes have been saved.
  </AlertDescription>
</Alert>
```

## File Structure

```
components/
├── ui/                    # Core UI primitives
│   ├── button.tsx
│   ├── heading.tsx
│   ├── text.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   ├── label.tsx
│   ├── checkbox.tsx
│   ├── radio-group.tsx
│   ├── select.tsx
│   ├── form-field.tsx
│   ├── alert.tsx
│   ├── badge.tsx
│   ├── loading.tsx
│   ├── divider.tsx
│   ├── section.tsx
│   ├── header.tsx
│   └── footer.tsx
├── brand/                 # Brand-specific components
│   ├── logo.tsx
│   ├── organic-shape.tsx
│   ├── icon.tsx
│   └── callout.tsx
└── index.ts              # Barrel exports

lib/
├── brand-assets.ts        # Canonical Drive source + public/brand paths
├── utils.ts
└── ...
```

## Configuration Files

### Tailwind Config (`tailwind.config.ts`)

Defines all design tokens including colors, typography, spacing, and more.

### Global Styles (`app/globals.css`)

Base styles and Tailwind directives.

### Utils (`lib/utils.ts`)

Helper functions including `cn()` for merging class names.

## Testing

All components have been tested for:
- Visual appearance and consistency
- Keyboard navigation
- Focus states
- Responsive behavior
- Accessibility compliance

Visit `/design-system` to manually test all components.

## What NOT to Do

❌ **Don't** create arbitrary color scales (50-950)  
❌ **Don't** use Honey as a primary button color  
❌ **Don't** generate random organic shapes  
❌ **Don't** redesign or reinterpret the brand  
❌ **Don't** reconstruct the logo, wordmark, or lockup in CSS  
❌ **Don't** treat the brand-package PDF or design board as the logo file  
❌ **Don't** use raw hex values instead of semantic tokens  
❌ **Don't** create one-off component variations  

## Next Steps

With the design system complete, the build sequence continues:

- ✅ **004** - Design System (Complete)
- 🔜 **005** - Homepage
- 🔜 **006** - Services + Service Detail
- 🔜 **007** - Pricing + How It Works
- 🔜 **008** - Booking Request
- 🔜 **009** - Join the Hive
- 🔜 **010** - Trust + FAQ
- 🔜 **011** - Policies/Legal
- 🔜 **012** - Analytics/SEO
- 🔜 **013** - Launch QA

## Support

For questions or issues with the design system, refer to:
- `/design-system` - Live component showcase
- `/docs/ACCESSIBILITY.md` - WCAG validation report
- `/public/brand/README.md` - Brand asset guidelines
- This README - Implementation documentation

---

**Remember**: The design system implements the approved brand identity. Focus on consistent, accessible implementation rather than creative reinterpretation.
