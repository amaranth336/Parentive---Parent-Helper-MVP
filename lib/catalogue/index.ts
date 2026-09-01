/**
 * Parentive Service Catalogue
 * 
 * Centralized export for the Parentive service catalogue.
 * Provides types, data, and utilities for service catalogue operations.
 */

// Types
export type {
  ServiceCategory,
  PricingModel,
  PriceStatus,
  AvailabilityStatus,
  RiskClassification,
  ValidationStatus,
  ServicePublicContent,
  ServiceOperationalMetadata,
  CatalogueService,
  CategoryMetadata,
} from './types';

// Data
export { CATALOGUE, CATEGORIES } from './data';

// Utilities
export {
  getAllServices,
  getPubliclyVisibleServices,
  getMvpServices,
  getFeaturedServices,
  getServicesByCategory,
  getServicesByAvailability,
  getServiceBySlug,
  getServiceBySku,
  getAddOnServices,
  getCategories,
  getCategoryById,
  searchServices,
  getServicesWithPricing,
  groupServicesByCategory,
} from './utils';
