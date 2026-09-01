/**
 * Step 2: Availability
 * 
 * Collects applicant availability and desired hours.
 */

'use client';

import React from 'react';
import { Field, TextInput, TextArea, Checkbox } from '@/components/form';

interface Step2Props {
  formData: any;
  onUpdate: (data: any) => void;
  errors: Record<string, string>;
}

const AVAILABILITY_OPTIONS = [
  { value: 'weekday_morning', label: 'Weekday mornings', hint: 'Typically 7am-12pm' },
  { value: 'weekday_afternoon', label: 'Weekday afternoons', hint: 'Typically 12pm-5pm' },
  { value: 'weekday_evening', label: 'Weekday evenings', hint: 'Typically 5pm-9pm' },
  { value: 'saturday', label: 'Saturdays', hint: '' },
  { value: 'sunday', label: 'Sundays', hint: '' },
  { value: 'open_flexible', label: 'Open/flexible availability', hint: 'Available across multiple time periods' },
];

export default function Step2({ formData, onUpdate, errors }: Step2Props) {
  const availabilityWindows = formData.availabilityWindows || [];

  const toggleAvailability = (value: string) => {
    const newWindows = availabilityWindows.includes(value)
      ? availabilityWindows.filter((w: string) => w !== value)
      : [...availabilityWindows, value];
    onUpdate({ ...formData, availabilityWindows: newWindows });
  };

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...formData, [field]: value });
  };

  return (
    <div>
      <h2 className="form-section-title">Availability</h2>
      <p className="form-section-description">
        Help us understand when you&apos;re available to work. Remember, pilot hours are flexible and will vary with customer demand.
      </p>

      {/* Availability windows */}
      <div className="form-section">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
          When are you available? <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Select all that apply)</span>
        </h3>
        
        <div className="alert alert-info" style={{ marginBottom: '16px' }}>
          Preference will be given to applicants who can commit to at least 6 hours of availability per week. This is a preference, not a guaranteed hours exchange.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {AVAILABILITY_OPTIONS.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              hint={option.hint}
              checked={availabilityWindows.includes(option.value)}
              onChange={() => toggleAvailability(option.value)}
            />
          ))}
        </div>

        {errors.availability && (
          <div className="field-error" style={{ marginTop: '8px' }}>{errors.availability}</div>
        )}
      </div>

      {/* Desired hours */}
      <div className="form-section">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
          Desired Weekly Hours
        </h3>
        
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.6' }}>
          Optional. This helps us understand your preferences, but does not guarantee specific hours during the pilot.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field 
            label="Minimum desired weekly hours" 
            htmlFor="desiredWeeklyHoursMin"
            hint="Optional"
          >
            <TextInput
              id="desiredWeeklyHoursMin"
              type="number"
              min="0"
              max="168"
              value={formData.desiredWeeklyHoursMin || ''}
              onChange={(e) => handleChange('desiredWeeklyHoursMin', e.target.value)}
              placeholder="e.g. 10"
            />
          </Field>

          <Field 
            label="Maximum desired weekly hours" 
            htmlFor="desiredWeeklyHoursMax"
            hint="Optional"
          >
            <TextInput
              id="desiredWeeklyHoursMax"
              type="number"
              min="0"
              max="168"
              value={formData.desiredWeeklyHoursMax || ''}
              onChange={(e) => handleChange('desiredWeeklyHoursMax', e.target.value)}
              placeholder="e.g. 25"
            />
          </Field>
        </div>
      </div>

      {/* Additional availability notes */}
      <div className="form-section">
        <Field 
          label="Additional availability information"
          htmlFor="availabilityNotes"
          hint="Optional. Any scheduling constraints, preferred patterns, or other availability details"
        >
          <TextArea
            id="availabilityNotes"
            value={formData.availabilityNotes || ''}
            onChange={(e) => handleChange('availabilityNotes', e.target.value)}
            placeholder="e.g. Available Tuesday-Thursday mornings, unavailable first week of each month..."
            rows={3}
          />
        </Field>
      </div>
    </div>
  );
}
