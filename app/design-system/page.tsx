"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Spinner, LoadingState, EmptyState } from "@/components/ui/loading";
import { Divider } from "@/components/ui/divider";
import { Section } from "@/components/ui/section";
import { Logo, Wordmark, LogoLockup } from "@/components/brand/logo";
import { OrganicShape, OrganicBrandSurface } from "@/components/brand/organic-shape";
import { Icon } from "@/components/brand/icon";
import { Callout } from "@/components/brand/callout";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { BRAND_ASSET_SOURCE, BRAND_ASSET_FILES } from "@/lib/brand-assets";
import { Heart, Home, Calendar, Users, Settings, Sparkles } from "lucide-react";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-surface-default">
      <Header
        links={[
          { href: "#colors", label: "Colors" },
          { href: "#typography", label: "Typography" },
          { href: "#components", label: "Components" },
        ]}
      />

      <main>
        {/* Hero Section */}
        <Section spacing="lg" className="text-center">
          <Heading as="display" color="brand" className="mb-4">
            Parentive Design System
          </Heading>
          <Text size="lg" color="secondary" className="max-w-2xl mx-auto">
            A comprehensive, accessible design system implementing the Parentive brand
            identity. Built with React, TypeScript, Tailwind CSS, and Radix UI.
          </Text>
        </Section>

        <Divider />

        {/* Brand Palette Section */}
        <Section spacing="lg" id="colors">
          <Heading as="h2" className="mb-8">
            Brand Palette
          </Heading>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Deep Moss", value: "#30483B", bg: "bg-moss" },
              { name: "Soft Sage", value: "#AEBBA6", bg: "bg-sage" },
              { name: "Oat", value: "#F5F2EA", bg: "bg-oat" },
              { name: "Warm Sand", value: "#E7DECF", bg: "bg-sand" },
              { name: "Walnut", value: "#594B41", bg: "bg-walnut" },
              { name: "Muted Honey", value: "#D5A552", bg: "bg-honey" },
            ].map((color) => (
              <Card key={color.name} padding="sm">
                <div className={`${color.bg} w-full h-24 rounded-subtle mb-3`} />
                <Text weight="semibold" size="sm">
                  {color.name}
                </Text>
                <Text size="utility" color="muted" className="font-mono">
                  {color.value}
                </Text>
              </Card>
            ))}
          </div>

          <Heading as="h3" className="mt-12 mb-6">
            Semantic Colors
          </Heading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Success", bg: "bg-success" },
              { name: "Warning", bg: "bg-warning" },
              { name: "Error", bg: "bg-error" },
              { name: "Info", bg: "bg-info" },
            ].map((color) => (
              <Card key={color.name} padding="sm">
                <div className={`${color.bg} w-full h-20 rounded-subtle mb-3`} />
                <Text weight="semibold" size="sm">
                  {color.name}
                </Text>
              </Card>
            ))}
          </div>
        </Section>

        <Divider />

        {/* Typography Section */}
        <Section spacing="lg" id="typography">
          <Heading as="h2" className="mb-8">
            Typography
          </Heading>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Font Families</CardTitle>
              <CardDescription>
                Manrope for headings and brand moments, Inter for body and UI text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Text size="eyebrow" color="muted" className="mb-2">
                  Headings — Manrope
                </Text>
                <Heading as="display" className="mb-2">
                  Display Heading
                </Heading>
                <Heading as="h1" className="mb-2">
                  Heading 1
                </Heading>
                <Heading as="h2" className="mb-2">
                  Heading 2
                </Heading>
                <Heading as="h3" className="mb-2">
                  Heading 3
                </Heading>
                <Heading as="h4">Heading 4</Heading>
              </div>

              <Divider />

              <div>
                <Text size="eyebrow" color="muted" className="mb-2">
                  Body Text — Inter
                </Text>
                <Text size="lg" className="mb-2">
                  Body Large: Suitable for introductory paragraphs and emphasis content.
                </Text>
                <Text className="mb-2">
                  Body Default: The standard body text size for most content. Optimized
                  for readability with 1.6 line height.
                </Text>
                <Text size="sm">
                  Body Small: Used for secondary information and captions.
                </Text>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Divider />

        {/* Logo & Branding Section */}
        <Section spacing="lg" id="branding">
          <Heading as="h2" className="mb-8">
            Logo & Branding
          </Heading>

          <Callout title="Canonical logo source" variant="brand" className="mb-8">
            <Text className="mb-3">
              Logo mark, wordmark, and horizontal lockup are the locked files from
              Linear 003. They are served from <code>public/brand/</code>, which
              must stay in sync with the Drive folder — not a CSS reconstruction
              and not the brand-package PDF.
            </Text>
            <Text>
              <a
                href={BRAND_ASSET_SOURCE.driveFolderUrl}
                className="text-text-brand underline underline-offset-2"
              >
                Parentive logos on Google Drive
              </a>
            </Text>
            <ul className="mt-4 space-y-1 text-body-sm text-text-secondary">
              {BRAND_ASSET_FILES.map((asset) => (
                <li key={asset.kind}>
                  <span className="font-medium text-text-primary">{asset.description}:</span>{" "}
                  <code>{asset.svg}</code> / <code>{asset.png}</code>
                </li>
              ))}
            </ul>
          </Callout>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="flex flex-col items-center justify-center p-8">
              <Logo size="xl" />
              <Text size="sm" color="muted" className="mt-4 text-center">
                Standalone mark
              </Text>
              <Text size="utility" color="muted" className="mt-1 font-mono text-center">
                {BRAND_ASSET_FILES[0].svg}
              </Text>
            </Card>

            <Card className="flex flex-col items-center justify-center p-8">
              <Wordmark size="lg" />
              <Text size="sm" color="muted" className="mt-4 text-center">
                Wordmark
              </Text>
              <Text size="utility" color="muted" className="mt-1 font-mono text-center">
                {BRAND_ASSET_FILES[1].svg}
              </Text>
            </Card>

            <Card className="flex flex-col items-center justify-center p-8">
              <LogoLockup size="md" tagline />
              <Text size="sm" color="muted" className="mt-4 text-center">
                Horizontal lockup
              </Text>
              <Text size="utility" color="muted" className="mt-1 font-mono text-center">
                {BRAND_ASSET_FILES[2].svg}
              </Text>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="flex flex-col items-center justify-center p-8 bg-surface-default">
              <LogoLockup size="md" />
              <Text size="sm" color="muted" className="mt-4 text-center">
                Lockup on Oat
              </Text>
            </Card>
            <Card className="flex flex-col items-center justify-center p-8 bg-moss">
              <Logo size="lg" />
              <Text size="sm" className="mt-4 text-center text-oat">
                Mark on Deep Moss
              </Text>
            </Card>
          </div>

          <Heading as="h3" className="mb-6">
            Organic Shapes
          </Heading>
          <Text className="mb-6">
            Seven approved organic shapes that add warmth and softness to the brand:
          </Text>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {[
              { name: "Open", shape: "open" as const },
              { name: "Drift", shape: "drift" as const },
              { name: "Lean", shape: "lean" as const },
              { name: "Pebble", shape: "pebble" as const },
              { name: "Room", shape: "room" as const },
              { name: "Sidecar", shape: "sidecar" as const },
              { name: "Quiet Edge", shape: "quiet-edge" as const },
            ].map((item) => (
              <div key={item.name} className="flex flex-col items-center gap-3">
                <OrganicShape shape={item.shape} color="sand" size="sm" />
                <Text size="sm" className="text-center">
                  {item.name}
                </Text>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* Buttons Section */}
        <Section spacing="lg" id="components">
          <Heading as="h2" className="mb-8">
            Components
          </Heading>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                Various button styles with accessible focus states
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="link">Link Button</Button>
                <Button variant="accent">Accent Button</Button>
              </div>

              <Divider className="my-6" />

              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>
                Accessible form inputs with validation states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField label="Name" htmlFor="name" required helpText="Enter your full name">
                <Input id="name" placeholder="John Doe" />
              </FormField>

              <FormField
                label="Email"
                htmlFor="email"
                error="Please enter a valid email address"
              >
                <Input id="email" type="email" placeholder="john@example.com" error />
              </FormField>

              <FormField
                label="Message"
                htmlFor="message"
                success="Your message looks great!"
              >
                <Textarea id="message" placeholder="Type your message here..." />
              </FormField>

              <FormField label="Country" htmlFor="country">
                <Select>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Preferences" htmlFor="prefs">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="newsletter" />
                    <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="updates" />
                    <Label htmlFor="updates">Receive product updates</Label>
                  </div>
                </div>
              </FormField>

              <FormField label="Notification method">
                <RadioGroup defaultValue="email">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="email" id="r-email" />
                    <Label htmlFor="r-email">Email</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="sms" id="r-sms" />
                    <Label htmlFor="r-sms">SMS</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="push" id="r-push" />
                    <Label htmlFor="r-push">Push notification</Label>
                  </div>
                </RadioGroup>
              </FormField>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Alerts & Feedback</CardTitle>
              <CardDescription>
                Contextual feedback messages with icons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="default">
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>
                  This is a standard informational message.
                </AlertDescription>
              </Alert>

              <Alert variant="info">
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  Here&apos;s some helpful information for you to know.
                </AlertDescription>
              </Alert>

              <Alert variant="success">
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your action was completed successfully.
                </AlertDescription>
              </Alert>

              <Alert variant="warning">
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Please review this information before proceeding.
                </AlertDescription>
              </Alert>

              <Alert variant="error">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>
                Status indicators and labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="accent">Accent</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Loading States</CardTitle>
              <CardDescription>
                Spinners and loading indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center gap-6">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </div>

              <Divider />

              <LoadingState message="Loading your content..." />
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Empty States</CardTitle>
              <CardDescription>
                Placeholder states for empty content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Users className="w-12 h-12" />}
                title="No team members yet"
                description="Get started by inviting your first team member to collaborate."
                action={<Button>Invite Team Member</Button>}
              />
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Icons</CardTitle>
              <CardDescription>
                Lucide icons with Parentive styling (1.75px stroke, rounded caps)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6">
                <Icon icon={Home} color="moss" size="lg" />
                <Icon icon={Heart} color="walnut" size="lg" />
                <Icon icon={Calendar} color="moss" size="lg" />
                <Icon icon={Users} color="walnut" size="lg" />
                <Icon icon={Settings} color="moss" size="lg" />
                <Icon icon={Sparkles} color="honey" size="lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Callouts</CardTitle>
              <CardDescription>
                Emphasized content blocks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Callout title="Important Information">
                This is a default callout with important information that deserves
                special attention.
              </Callout>

              <Callout variant="brand" title="Brand Moment">
                Use brand callouts to highlight key value propositions and brand
                messaging.
              </Callout>

              <Callout variant="emphasis">
                Emphasis callouts draw attention to special offers or time-sensitive
                information.
              </Callout>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cards with Organic Surfaces</CardTitle>
              <CardDescription>
                Combining organic shapes with content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganicBrandSurface shape="pebble" color="sand" className="p-8 rounded-card">
                <Heading as="h3" className="mb-4">
                  Welcome to Parentive
                </Heading>
                <Text className="mb-6">
                  Support isn&apos;t a last resort. It&apos;s part of how modern life gets
                  done. Take something off your plate with our trusted family support
                  services.
                </Text>
                <Button>Learn More</Button>
              </OrganicBrandSurface>
            </CardContent>
          </Card>
        </Section>

        <Divider />

        {/* Accessibility Section */}
        <Section spacing="lg">
          <Heading as="h2" className="mb-8">
            Accessibility
          </Heading>

          <Card>
            <CardHeader>
              <CardTitle>WCAG 2.2 AA Compliance</CardTitle>
              <CardDescription>
                All components meet accessibility standards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Text weight="semibold" className="mb-2">
                  ✓ Color Contrast
                </Text>
                <Text size="sm" color="muted">
                  All text and interactive elements meet WCAG AA contrast ratios (4.5:1
                  for normal text, 3:1 for large text)
                </Text>
              </div>

              <Divider />

              <div>
                <Text weight="semibold" className="mb-2">
                  ✓ Keyboard Navigation
                </Text>
                <Text size="sm" color="muted">
                  All interactive components are keyboard accessible with visible focus
                  indicators
                </Text>
              </div>

              <Divider />

              <div>
                <Text weight="semibold" className="mb-2">
                  ✓ Screen Reader Support
                </Text>
                <Text size="sm" color="muted">
                  Semantic HTML, ARIA labels, and proper focus management throughout
                </Text>
              </div>

              <Divider />

              <div>
                <Text weight="semibold" className="mb-2">
                  ✓ Touch Targets
                </Text>
                <Text size="sm" color="muted">
                  All interactive elements meet minimum 44x44px touch target sizes
                </Text>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Divider />

        {/* Implementation Notes */}
        <Section spacing="lg">
          <Heading as="h2" className="mb-8">
            Implementation Notes
          </Heading>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Text size="sm">• Next.js 14 with App Router</Text>
                <Text size="sm">• React 18</Text>
                <Text size="sm">• TypeScript</Text>
                <Text size="sm">• Tailwind CSS</Text>
                <Text size="sm">• Radix UI Primitives</Text>
                <Text size="sm">• class-variance-authority</Text>
                <Text size="sm">• Lucide Icons</Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Design Principles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Text size="sm">• Implement, don&apos;t redesign</Text>
                <Text size="sm">• Honey is punctuation, not paint</Text>
                <Text size="sm">• Only seven approved organic shapes</Text>
                <Text size="sm">• Accessibility-first approach</Text>
                <Text size="sm">• Semantic color tokens</Text>
                <Text size="sm">• Responsive and mobile-ready</Text>
              </CardContent>
            </Card>
          </div>
        </Section>
      </main>

      <Footer
        links={[
          {
            title: "Services",
            items: [
              { href: "#", label: "Browse Services" },
              { href: "#", label: "How It Works" },
              { href: "#", label: "Pricing" },
            ],
          },
          {
            title: "Company",
            items: [
              { href: "#", label: "About Us" },
              { href: "#", label: "Join the Hive" },
              { href: "#", label: "Contact" },
            ],
          },
          {
            title: "Legal",
            items: [
              { href: "#", label: "Privacy Policy" },
              { href: "#", label: "Terms of Service" },
              { href: "#", label: "Trust & Safety" },
            ],
          },
        ]}
      />
    </div>
  );
}
