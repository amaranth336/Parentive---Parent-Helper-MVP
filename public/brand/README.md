# Parentive Brand Assets

Approved Parentive logo files live here so the app can serve them. They are
**copies** of the locked Linear 003 artwork — do not reconstruct the logo in
CSS or substitute the brand-package PDF / design board.

## Canonical source

**Google Drive folder (logo mark, wordmark, lockup):**
https://drive.google.com/drive/folders/1r6GTJERQDf3pFb57RwftqhqY2StSo0yU?usp=drive_link

That folder is the source of truth for:

- standalone logo **mark** (Option 14)
- Parentive **wordmark**
- primary horizontal **lockup**

Refresh local copies after the folder changes:

```bash
npm run sync:brand-assets
```

The Drive folder must be readable as "Anyone with the link can view" (or the
machine must be signed into an account that can open it).

Do **not** import logos from:

- the brand-package PDF
- the final design board
- the implementation-token reference
- a Georgia/`p` + honey-dot CSS stand-in

Those documents are useful context. They are not the production logo files.

## Files served by the app

| Role | SVG (preferred) | PNG fallback |
|------|-----------------|--------------|
| Standalone mark | `logo-mark.svg` | `logo-mark.png` |
| Wordmark | `wordmark.svg` | `wordmark.png` |
| Horizontal lockup | `logo-lockup-horizontal.svg` | `logo-lockup-horizontal.png` |

Optional derivatives, generated from the mark when needed:

- `favicon.ico`
- `apple-touch-icon.png`

## Components

`Logo`, `Wordmark`, and `LogoLockup` in `components/brand/logo.tsx` render these
files. `LogoLockup` uses the horizontal lockup artwork rather than composing
the mark and wordmark in code.

Registry: `lib/brand-assets.ts`.

## Logo guardrails — do not

- Redraw or reinterpret Option 14
- Add a gap to the `p`
- Isolate `ive` from the wordmark
- Add ligatures
- Add bees, honeycomb, or hive imagery
- Add parent/child silhouettes, hearts, houses, hands, or childcare symbols
- Make Honey the dominant logo colour

## Notes

- SVG/vector versions are preferred for scalability
- PNG versions are acceptable for MVP
- Keep clear space around the logo
- Minimum size: readable at 32px height
