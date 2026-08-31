# Parentive Brand Assets

This directory contains the approved Parentive brand assets from Linear Issue 003.

## Assets Needed

The following assets should be placed in this directory:

### Logo Files
- `logo-mark.svg` - Standalone Parentive logo mark (Option 14)
- `logo-mark.png` - PNG version for fallback
- `wordmark.svg` - Parentive wordmark
- `wordmark.png` - PNG version for fallback
- `logo-lockup-horizontal.svg` - Primary horizontal logo lockup
- `logo-lockup-horizontal.png` - PNG version for fallback

### Favicon Assets
- `favicon.ico` - Browser favicon
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` - Apple device icon

### Social/Avatar
- `social-avatar.png` - Square avatar for social media profiles

## Logo Specifications

### Option 14 (Approved Final Logo)
- Full lowercase serif 'p' (Georgia or similar serif font)
- Color: Deep Moss (#30483B)
- Background: Soft organic Oat/cream form (#F5F2EA)
- Accent: Small Muted Honey dot (#D5A552)
- Dot position: Upper-right of the 'p', tight but not touching
- No gap or break in the 'p'

## Usage Guidelines

### Logo Guardrails - DO NOT:
- Redraw or reinterpret the logo
- Add a gap to the 'p'
- Isolate 'ive' from the wordmark
- Add ligatures
- Add bees, honeycomb, or hive imagery
- Add parent/child silhouettes
- Add hearts, houses, hands, or childcare symbols
- Make Honey the dominant logo color

### Wordmark
- Font: Manrope (Semibold recommended)
- Color: Deep Moss (#30483B)
- Use: Primary brand identifier alongside logo

### Logo Lockup
- Horizontal arrangement preferred
- Logo mark on left, wordmark on right
- Optional tagline below: "Trusted, flexible help for real life"

## Implementation

The Logo component in `components/brand/logo.tsx` provides a code-based implementation 
of the logo for development purposes. For production, replace with actual vector assets 
when available.

## Color Reference

| Element | Color Name | Hex Value | Usage |
|---------|------------|-----------|-------|
| Logo 'p' | Deep Moss | #30483B | Primary logo color |
| Background | Oat | #F5F2EA | Organic background shape |
| Accent dot | Muted Honey | #D5A552 | Small accent only |

## Notes

- SVG/vector versions are preferred for scalability
- PNG versions can support MVP initially
- Maintain proper spacing and clear space around logo
- Minimum size: ensure readability at 32px height
