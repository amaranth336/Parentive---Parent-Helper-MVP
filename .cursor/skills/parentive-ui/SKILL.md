---
name: parentive-ui
description: Apply when creating or materially modifying Parentive customer-facing React/Next.js UI, layout, components, forms, responsive behaviour, design-system usage, accessibility or brand presentation.
---

# Parentive UI Skill

Use this skill for meaningful customer-facing UI work.

Before implementation:
1. Read `AGENTS.md`.
2. Inspect existing UI patterns and reusable components.
3. Read `docs/ai/parentive-product-context.md` when the work affects brand,
   service copy or customer-facing product behaviour.

# Existing System First

Before creating a new component:
1. Search for an existing equivalent.
2. Determine whether it can be reused directly.
3. Determine whether a small extension would serve the new requirement.
4. Create a new component only when its semantics or behaviour are genuinely
   distinct.

Use existing design tokens rather than arbitrary one-off values where tokens
exist.

Do not reinvent:
- buttons
- form controls
- cards
- typography primitives
- spacing conventions
- containers
- navigation
- common status messaging

# Brand Direction

Parentive should feel:
- warm
- calm
- capable
- modern
- inclusive
- restrained

Palette direction:
- Deep Moss
- Oat / Cream
- Muted Honey

Use actual repository tokens as the implementation source of truth.

Do not invent new brand colours if suitable tokens already exist.

Avoid:
- harsh black-and-white presentation
- excessive visual contrast
- overt honeycomb geometry
- queen-bee references
- excessive decorative motifs
- overly childish design
- generic SaaS dashboard styling on customer-facing surfaces

# Typography

Use the repository's existing typography configuration.

Current intended direction is Manrope + Inter, but the implemented project
configuration is authoritative.

Use hierarchy through:
- size
- spacing
- weight
- tone

Avoid unnecessarily heavy headings.

# Responsive Design

Treat mobile as a first-class experience.

Check:
- narrow mobile widths
- tablet/intermediate widths where relevant
- desktop
- text wrapping
- horizontal overflow
- card stacking
- button width
- form usability
- image cropping
- navigation behaviour

Do not solve desktop layout in a way that breaks mobile.

# Accessibility

Prefer native semantic elements.

Ensure where relevant:
- inputs have labels
- buttons are real buttons
- navigation is semantic
- keyboard behaviour works
- focus is visible
- error messaging is understandable
- meaningful images have useful alt text
- decorative imagery does not create noise
- controls have sufficient target size
- colour is not the sole communication mechanism

Do not add ARIA when native HTML already supplies the correct semantics.

# Forms

Forms must account for:
- labels
- validation
- actionable validation messages
- disabled/submitting state where appropriate
- success state
- server/network failure
- preservation of useful entered values after recoverable errors

Do not imply submission succeeded before the server-side outcome is known.

# Copy

Use direct `you/your` language when suitable.

Tone:
- supportive
- neutral
- professional
- human

Avoid:
- rescue framing
- guilt
- parenting judgment
- gender assumptions
- defaulting to "mom"
- unnecessary exclamation marks
- exaggerated promises

# Completion

Before calling UI work complete:
- inspect it in context
- verify responsive behaviour
- check interaction states
- check navigation
- check accessibility basics
- check console errors where practical
- compare against existing Parentive visual language