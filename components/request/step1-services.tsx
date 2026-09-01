/**
 * Step 1: Service Selection
 * 
 * Allows customers to select services from the catalogue, including flexible support.
 */

'use client';

import React from 'react';
import { Field, TextArea, Checkbox } from '@/components/form';

// Service catalogue based on Linear 008 requirements
const SERVICE_CATEGORIES = [
  {
    id: 'home-laundry',
    name: 'Home & Laundry',
    services: [
      { slug: 'laundry-reset', name: 'Laundry Reset', description: 'One less basket following you around.' },
      { slug: 'fold-put-away', name: 'Fold & Put Away', description: 'Get clean clothes where they belong.' },
      { slug: 'bed-reset', name: 'Bed Reset', description: 'Fresh sheets and a welcoming bed.' },
      { slug: 'playroom-reset', name: 'Playroom Reset', description: 'Restore order to the play space.' },
      { slug: 'family-room-reset', name: 'Family Room Reset', description: 'A living space ready to enjoy again.' },
      { slug: 'baby-gear-reset', name: 'Baby Gear Reset', description: 'Organize and refresh baby essentials.' },
    ],
  },
  {
    id: 'kitchen-food',
    name: 'Kitchen & Food',
    services: [
      { slug: 'kitchen-reset', name: 'Kitchen Reset', description: 'From counters to sink, everything sorted.' },
      { slug: 'dinner-prep', name: 'Dinner Prep', description: 'Tonight&apos;s meal, ready to go.' },
      { slug: 'tomorrows-lunches', name: 'Tomorrow&apos;s Lunches', description: 'Packed and ready for the day ahead.' },
      { slug: 'meal-prep-reset', name: 'Meal Prep Reset', description: 'Batch cooking to set you up for the week.' },
      { slug: 'produce-snack-prep', name: 'Produce & Snack Prep', description: 'Healthy options, washed and ready.' },
    ],
  },
  {
    id: 'family-support',
    name: 'Family Support',
    services: [
      { slug: 'uninterrupted-hour', name: 'Uninterrupted Hour', description: 'Focused childcare while you work or rest.' },
      { slug: 'parents-helper-visit', name: 'Parent&apos;s Helper Visit', description: 'Extra hands with kids at home.' },
    ],
  },
];

interface Step1Props {
  formData: any;
  onUpdate: (data: any) => void;
  errors: Record<string, string>;
}

export default function Step1({ formData, onUpdate, errors }: Step1Props) {
  const selectedServices = formData.selectedServices || [];
  const flexibleSupportDescription = formData.flexibleSupportDescription || '';
  const serviceNotes = formData.serviceNotes || '';

  const toggleService = (slug: string) => {
    const newSelected = selectedServices.includes(slug)
      ? selectedServices.filter((s: string) => s !== slug)
      : [...selectedServices, slug];
    onUpdate({ ...formData, selectedServices: newSelected });
  };

  const handleFlexibleChange = (value: string) => {
    onUpdate({ ...formData, flexibleSupportDescription: value });
  };

  const handleNotesChange = (value: string) => {
    onUpdate({ ...formData, serviceNotes: value });
  };

  return (
    <div>
      <h2 className="form-section-title">What would you like help with?</h2>
      <p className="form-section-description">
        Choose everything you&apos;d like help with. We&apos;ll review the combination together and make sure the timing makes sense.
      </p>

      {SERVICE_CATEGORIES.map((category) => (
        <div key={category.id} className="form-section">
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
            {category.name}
          </h3>
          <div className="service-grid">
            {category.services.map((service) => (
              <div
                key={service.slug}
                className={`service-card ${selectedServices.includes(service.slug) ? 'selected' : ''}`}
                onClick={() => toggleService(service.slug)}
              >
                <div className="service-card-header">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.slug)}
                    onChange={() => toggleService(service.slug)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="service-card-title">{service.name}</div>
                  </div>
                </div>
                <div className="service-card-description">{service.description}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="form-section">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
          Flexible Support Request
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.6' }}>
          Have something else in mind? Tell us what you&apos;d like done and what &quot;finished&quot; looks like. The more detail you can share, the more accurately Parentive can assess the request, estimate the time required and provide pricing when available.
        </p>
        <Field label="" htmlFor="flexible-support">
          <TextArea
            id="flexible-support"
            value={flexibleSupportDescription}
            onChange={(e) => handleFlexibleChange(e.target.value)}
            placeholder="Describe what you need help with and what success looks like..."
            rows={4}
          />
        </Field>
      </div>

      <div className="form-section">
        <Field 
          label="Anything else you&apos;d like us to know about these tasks?"
          htmlFor="service-notes"
          hint="Optional"
        >
          <TextArea
            id="service-notes"
            value={serviceNotes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Any additional context or special considerations..."
            rows={3}
          />
        </Field>
      </div>
    </div>
  );
}
