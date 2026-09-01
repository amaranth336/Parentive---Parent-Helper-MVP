const fs = require('fs');

const header = `/**
 * Parentive Service Catalogue Data
 * 
 * Centralized source of truth for all Parentive services.
 * Contains working descriptions and preliminary scope definitions.
 */

import { CatalogueService, CategoryMetadata } from "./types";

/**
 * Category definitions
 */
export const CATEGORIES: CategoryMetadata[] = [
  {
    id: "home-laundry",
    name: "Home & laundry",
    description: "Bring household spaces and laundry back to a ready, organized state.",
    displayOrder: 1,
  },
  {
    id: "kitchen-food",
    name: "Kitchen & food",
    description: "From meal prep to clean counters, we handle the kitchen tasks that pile up.",
    displayOrder: 2,
  },
  {
    id: "family-support",
    name: "Family support",
    description: "Parent-home child engagement that creates uninterrupted time for you.",
    displayOrder: 3,
  },
  {
    id: "flexible-support",
    name: "Flexible support",
    description: "Request support for tasks that do not fit the standard catalogue.",
    displayOrder: 4,
  },
];

/**
 * Complete service catalogue - 14 pilot services + Pre-ordered Pickup add-on
 */
export const CATALOGUE: CatalogueService[] = [
`;

const footer = `];
`;

// Write the file
fs.writeFileSync('/workspace/lib/catalogue/data.ts', header + '  // Services will be added here\n' + footer);
console.log('Created base data.ts file');
