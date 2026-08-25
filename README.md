# Parentive — Family Support Service MVP

**Parentive** is a trusted, flexible family support service for busy and overwhelmed parents. This repository contains the customer-facing web application for the Parentive MVP.

> **Note**: This is a completely new greenfield application. It does not reuse or reference any previous Parentive codebase.

## Overview

Parentive helps families by providing outcome-based support services—from laundry resets to dinner prep, playroom tidying to childcare support. Rather than selling hours of labor, Parentive sells the outcomes busy families need most.

This MVP serves as a **concierge validation platform** to test demand, service selection, pricing, and booking behavior before building full automation.

---

## Technology Stack

This application is built with:

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - Code quality and formatting

### Why This Stack?

- **Next.js** provides excellent developer experience, SEO support, and built-in optimizations
- **TypeScript** ensures type safety across the service catalogue and booking flow
- **Tailwind CSS** enables rapid UI development with consistent design tokens
- **Vercel-compatible** for simple, scalable deployment

---

## Repository Structure

```
/
├── app/                      # Next.js App Router pages and layouts
│   ├── layout.tsx           # Root layout with header/footer
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Global styles and Tailwind
│   ├── services/            # Service catalogue page
│   ├── pricing/             # Pricing information
│   ├── packages/            # Service packages/bundles
│   ├── how-it-works/        # Process explanation
│   ├── book/                # Booking/service request form
│   ├── helpers/             # Helper application page
│   ├── trust/               # Trust & safety information
│   ├── about/               # About Parentive
│   ├── faq/                 # Frequently asked questions
│   ├── policies/            # Service policies
│   ├── privacy/             # Privacy policy
│   ├── terms/               # Terms of service
│   ├── not-found.tsx        # 404 page
│   └── error.tsx            # Error boundary
│
├── components/              # Reusable React components
│   ├── ui/                  # UI primitives (Button, Container, etc.)
│   └── layout/              # Layout components (Header, Footer)
│
├── types/                   # TypeScript type definitions
│   └── catalogue.ts         # Service catalogue types
│
├── .cursor/                 # Cursor Cloud Agent configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.ts           # Next.js configuration
├── eslint.config.mjs        # ESLint configuration
├── .prettierrc              # Prettier configuration
├── .env.example             # Environment variables template
└── package.json             # Dependencies and scripts
```

---

## Getting Started

### Prerequisites

- **Node.js 18.18.0 or higher**
- **npm** (comes with Node.js)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/amaranth336/parentive---parent-helper-mvp.git
cd parentive---parent-helper-mvp
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development Commands

| Command              | Description                                    |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Start development server on port 3000          |
| `npm run build`      | Create production build                        |
| `npm start`          | Run production build                           |
| `npm run lint`       | Run ESLint to check code quality               |
| `npm run type-check` | Run TypeScript type checking                   |
| `npm run format`     | Format all files with Prettier                 |

---

## Environment Variables

Environment variables are managed through `.env.local` (for local development) and Vercel's environment settings (for production).

See `.env.example` for available variables.

Current environment variables:

- `NEXT_PUBLIC_APP_URL` - Application base URL
- `NEXT_PUBLIC_DEFAULT_SERVICE_AREA` - Default service area (e.g., "Greater Vancouver")
- `NEXT_PUBLIC_CONTACT_EMAIL` - Contact email address

---

## Architecture Decisions

### Server Components by Default

This application uses React Server Components as the default rendering strategy. Client Components (with `'use client'`) are used only where interactivity requires them (e.g., navigation menu, forms).

### No Premature Infrastructure

Per MVP requirements, this foundation intentionally **does not include**:

- Database (Supabase will be considered separately when implementing booking persistence)
- Authentication framework (not needed for MVP service requests)
- State management library (React's built-in state is sufficient)
- Payment processing (will be implemented separately)
- Real-time services or complex scheduling

These will be introduced in future issues when needed.

### Service Catalogue Type Separation

The service catalogue types (`/types/catalogue.ts`) separate **customer-facing** fields from **operational metadata**:

- **Customer-facing types** (`Service`, `ServicePackage`) include pricing, descriptions, and availability
- **Operational types** (`ServiceOperationalMetadata`) include internal scheduling, costing, and helper requirements

This separation ensures operational complexity never leaks into customer-facing interfaces.

### Design System Approach

The design system is intentionally minimal at this stage:

- **Design tokens** are defined in `tailwind.config.ts` (colors, spacing, typography)
- **UI primitives** exist as composable components (`Button`, `Container`)
- **Layout components** provide consistent structure (`Header`, `Footer`)

Full design will be implemented alongside content in subsequent issues.

---

## Accessibility

This foundation includes accessible defaults:

- Semantic HTML landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Skip-to-main-content link for keyboard navigation
- Visible focus indicators on all interactive elements
- Logical heading hierarchy
- ARIA labels on interactive controls
- Mobile-first responsive design

---

## Deployment

### Vercel (Recommended)

This application is designed for deployment on [Vercel](https://vercel.com):

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to `main`

### Build Validation

Before deploying, ensure the application passes all checks:

```bash
npm run lint           # ESLint checks
npm run type-check     # TypeScript checks
npm run build          # Production build
```

All three commands must succeed for deployment.

---

## Service Catalogue

The service catalogue types support the following categories:

- **Laundry & Clothing** - Laundry Reset, Fold & Put Away, Bed Reset, etc.
- **Kitchen & Food** - Kitchen Reset, Dinner Prep, Meal Prep, etc.
- **Home Reset** - Playroom Reset, Nursery Reset, Home Organization, etc.
- **Kids & Parent Support** - Parent's Helper Visit, Date Night Care, etc.
- **Life & Outdoors** - Garden Reset, Errand Run, etc.

See `/types/catalogue.ts` for complete type definitions.

Actual service data and content will be implemented in subsequent Linear issues.

---

## Routes

All required routes are established with placeholder content:

| Route            | Purpose                                |
| ---------------- | -------------------------------------- |
| `/`              | Homepage                               |
| `/services`      | Service catalogue                      |
| `/pricing`       | Pricing information                    |
| `/packages`      | Service bundles                        |
| `/how-it-works`  | Process explanation                    |
| `/book`          | Booking/service request form           |
| `/helpers`       | Helper application page                |
| `/trust`         | Trust & safety information             |
| `/about`         | About Parentive                        |
| `/faq`           | Frequently asked questions             |
| `/policies`      | Service policies                       |
| `/privacy`       | Privacy policy                         |
| `/terms`         | Terms of service                       |

---

## Design Principles

This foundation follows these principles:

- **Server components by default** - Client components only where necessary
- **Typed data** - TypeScript everywhere
- **Semantic HTML** - Accessible markup
- **Mobile-first** - Responsive from the smallest screens up
- **Minimal dependencies** - Only essential packages
- **Conventional patterns** - Standard Next.js practices

---

## Contributing

This is an MVP project with development managed through Linear issues. Each feature or content addition should:

1. Reference a specific Linear issue
2. Be delivered in a focused PR
3. Pass linting, type checking, and build validation
4. Include appropriate tests where applicable

---

## What's Next?

After this foundation is merged, subsequent Linear issues will implement:

- Complete service catalogue content and data
- Booking/service request form with validation
- Helper application form
- Trust & safety content
- FAQ content
- Full page designs
- Supabase integration for booking persistence
- Analytics and tracking

---

## License

Proprietary - © 2026 Parentive. All rights reserved.

---

## Questions?

For questions about this codebase, please refer to the Parentive Linear project or contact the development team.
