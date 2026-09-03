/**
 * Step 1: Service Selection
 *
 * Catalogue-first service selection using centralized Parentive V2 data.
 */

'use client';

import React from 'react';
import { Field, TextArea } from '@/components/form';
import {
  FLEXIBLE_SUPPORT_SLUG,
  getCategories,
  getServicesByCategory,
} from '@/lib/catalogue';

interface Step1Props {
  formData: any;
  onUpdate: (data: any) => void;
  errors: Record<string, string>;
}

export default function Step1({ formData, onUpdate, errors }: Step1Props) {
  const selectedServices: string[] = formData.selectedServices || [];
  const flexibleSupportDescription = formData.flexibleSupportDescription || '';
  const serviceNotes = formData.serviceNotes || '';
  const categories = getCategories();
  const flexibleSelected = selectedServices.includes(FLEXIBLE_SUPPORT_SLUG);

  const toggleService = (slug: string) => {
    const next = selectedServices.includes(slug)
      ? selectedServices.filter((item) => item !== slug)
      : [...selectedServices, slug];

    const nextData: Record<string, unknown> = {
      ...formData,
      selectedServices: next,
    };

    if (slug === FLEXIBLE_SUPPORT_SLUG && !next.includes(FLEXIBLE_SUPPORT_SLUG)) {
      nextData.flexibleSupportDescription = '';
    }

    onUpdate(nextData);
  };

  const handleFlexibleChange = (value: string) => {
    const hasFlexible = selectedServices.includes(FLEXIBLE_SUPPORT_SLUG);
    let next = selectedServices;

    if (value.trim() && !hasFlexible) {
      next = [...selectedServices, FLEXIBLE_SUPPORT_SLUG];
    }

    onUpdate({
      ...formData,
      selectedServices: next,
      flexibleSupportDescription: value,
    });
  };

  return (
    <div>
      <h2 className="form-section-title">What would you like help with?</h2>
      <p className="form-section-description">
        Choose everything you’d like help with. We’ll review the combination
        together and make sure the timing makes sense.
      </p>
      {errors.services ? (
        <p className="field-error" style={{ marginBottom: 'var(--space-4)' }}>
          {errors.services}
        </p>
      ) : null}

      {categories.map((category) => {
        const services = getServicesByCategory(category.id);
        return (
          <div key={category.id} className="form-section">
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '12px',
                color: 'var(--foreground)',
              }}
            >
              {category.name}
            </h3>
            <div className="service-grid">
              {services.map((service) => (
                <div
                  key={service.public.slug}
                  className={`service-card ${
                    selectedServices.includes(service.public.slug) ? 'selected' : ''
                  }`}
                  onClick={() => toggleService(service.public.slug)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      toggleService(service.public.slug);
                    }
                  }}
                  role="checkbox"
                  aria-checked={selectedServices.includes(service.public.slug)}
                  tabIndex={0}
                >
                  <div className="service-card-header">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.public.slug)}
                      onChange={() => toggleService(service.public.slug)}
                      onClick={(event) => event.stopPropagation()}
                      aria-label={service.public.name}
                    />
                    <div style={{ flex: 1 }}>
                      <div className="service-card-title">{service.public.name}</div>
                    </div>
                  </div>
                  <div className="service-card-description">
                    {service.public.shortDescription}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {flexibleSelected ? (
        <div className="form-section">
          <Field
            label="Tell us what would help"
            htmlFor="flexible-support"
            hint="Describe the tasks, what finished looks like, and any household context Parentive should review."
            error={errors.flexibleSupportDescription}
          >
            <TextArea
              id="flexible-support"
              value={flexibleSupportDescription}
              onChange={(event) => handleFlexibleChange(event.target.value)}
              placeholder="Have something else on your list? Tell us what would help."
              rows={4}
            />
          </Field>
        </div>
      ) : null}

      <div className="form-section">
        <Field
          label="Anything else you’d like us to know about these tasks?"
          htmlFor="service-notes"
          hint="Optional"
        >
          <TextArea
            id="service-notes"
            value={serviceNotes}
            onChange={(event) =>
              onUpdate({ ...formData, serviceNotes: event.target.value })
            }
            placeholder="Any additional context that would help Parentive review the request..."
            rows={3}
          />
        </Field>
      </div>
    </div>
  );
}
