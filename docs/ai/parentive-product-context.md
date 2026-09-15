# Parentive Product Context

Last maintained: September 2026

This file documents the current Parentive product baseline.

An explicit current product requirement or Linear issue can supersede this
document. Do not independently expand product scope based on assumptions about
what a household-help, childcare or marketplace product "should" contain.

# Product Positioning

Parentive is a local helper service designed to make everyday family life more
manageable.

The service provides practical household and parent-present support such as:
- laundry
- household resets
- food preparation
- light childcare while a parent is home
- flexible household support

Parentive should be positioned as part of how modern life gets done, not as a
rescue service for overwhelmed parents.

The long-term brand should remain broad enough to support other caregiving
contexts in the future.

# Current Launch Stage

The initial website launch is an early-access / pilot-list launch.

Current baseline:
- Customers can learn about Parentive.
- Customers can explore services.
- Customers can join early access.
- Live customer booking is NOT part of the initial website launch.
- Same-day/on-demand service is NOT available at launch.
- Services are pre-booked during the pilot when booking functionality is
  introduced.

Do not create or imply live booking, instant dispatch, available-now helpers,
payment checkout or same-day service unless the current requirement explicitly
introduces that functionality.

# Initial Service Area

Customer-facing language should generally use:

"Select communities across the GTA"

Current pilot communities:
- East Gwillimbury
- Newmarket
- Aurora
- Georgina
- Whitchurch-Stouffville

Do not imply GTA-wide coverage unless product scope is explicitly expanded.

# Pilot Service Catalogue

Current catalogue contains 14 services:

1. Laundry Reset
2. Fold & Put Away
3. Bed Reset
4. Playroom Reset
5. Family Room Reset
6. Baby Gear Reset
7. Kitchen Reset
8. Dinner Prep
9. Tomorrow's Lunches
10. Meal Prep Reset
11. Produce & Snack Prep
12. Flexible Support Request
13. Uninterrupted Hour
14. Parent's Helper Visit

All services are intended to have service-detail routes using the existing
service-detail architecture, currently conceptualized as:

`/services/[slug]`

The catalogue itself uses:

`/services`

Do not invent additional launch services unless requested.

# Service Model

Most catalogue services are outcome-oriented.

Two primary time-based offerings are:
- Flexible Support Request
- Parent's Helper Visit

Flexible Support Request:
- allows a customer to describe support that does not cleanly map to a
  catalogue service
- requires Parentive review
- Parentive may accept, decline or provide a revised estimate
- it is not an unrestricted promise to perform any requested task

Parent's Helper Visit:
- time-based
- provides flexible household/parent-present support within Parentive scope

Uninterrupted Hour:
- one-hour service block

Parent's Helper Visit:
- two-hour minimum client service block

Flexible Support Request:
- two-hour minimum client service block when time-based

Internal pilot economics may account for a three-hour paid-helper floor even
where a customer's service block is shorter. Do not expose internal helper-pay
logic as customer pricing unless explicitly required.

Exact customer dollar pricing is not finalized in this product-context file.
Never invent prices.

# Recurrence

Parentive should support or encourage these service cadences when appropriate:
- weekly
- biweekly
- monthly
- ad hoc

Same-day/on-demand service may be discussed as future functionality but is not
available at launch.

# Childcare Boundaries

Parent-present childcare support is permitted during the pilot.

The parent or responsible adult must remain home for childcare-related service
during the initial launch model.

Independent/date-night childcare is NOT offered at launch.

Do not:
- imply babysitting while the parent leaves
- imply independent childcare
- imply overnight childcare
- imply child transportation

Age suitability should be stated clearly when relevant to a service.

# Transportation

Parentive does not provide general customer or child transportation.

Potential permitted exception:
- pickup of pre-ordered, pre-paid groceries or household items as an approved
  add-on
- pricing can account for time and kilometres when this offering is active

Do not invent ride, school pickup, daycare pickup or child transportation
services.

# Supplies

The household provides normal supplies required for the requested task,
including where relevant:
- cleaning products
- laundry products
- food ingredients
- cookware
- storage containers
- household task supplies

Do not imply that helpers routinely arrive with a professional cleaning kit or
food ingredients unless the current requirement changes this policy.

# Brand

Parentive's visual and verbal identity should be warm, inclusive,
gender-neutral and restrained.

Brand palette direction:
- Deep Moss primary
- Oat / Cream neutrals
- Muted Honey accent

Typography direction:
- Manrope
- Inter

Use the repository's actual implemented font and design-token configuration as
the technical source of truth.

Brand characteristics:
- supportive
- empowering
- capable
- human
- calm
- modern
- professional but approachable

Use direct "you/your" language where appropriate.

Light wit is acceptable.

Avoid:
- sarcasm
- patronizing language
- rescue framing
- "supermom" / "mom does everything" stereotypes
- assuming the customer is a mother
- queen-bee terminology
- prominent geometric honeycomb motifs
- language that implies customers have failed because they need help
- unnecessarily sentimental parenting copy

# Visual Identity

Logo direction:
- lowercase Parentive identity
- Deep Moss
- Oat/Cream
- Muted Honey accent
- subtle organic/hive references only

Do not invent new logo concepts as part of ordinary feature implementation.

Photography direction:
- real
- intentional
- gentle
- warm neutrals
- sandy tones
- greens
- earthy textures
- broad and equitable representation

Avoid:
- harsh contrast
- generic corporate stock imagery
- overly staged "perfect mother" imagery
- exclusively maternal imagery

# Product Scope Discipline

When a feature request is ambiguous, prefer the smallest implementation that
supports the documented pilot.

Do not independently add:
- live booking
- payment processing
- subscriptions
- same-day dispatch
- helper-customer direct messaging
- ratings/reviews
- map tracking
- childcare without a parent home
- child transportation
- marketplace bidding
- dynamic pricing

These may become future capabilities but are not implied by the current MVP.