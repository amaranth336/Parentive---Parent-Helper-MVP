/**
 * Step 2: Timing and Recurrence
 * 
 * Collects preferred date, time window, recurrence, and arrival notification preferences.
 */

'use client';

import React from 'react';
import { Field, TextInput, Radio, RadioGroup, Checkbox } from '@/components/form';

interface Step2Props {
  formData: any;
  onUpdate: (data: any) => void;
  errors: Record<string, string>;
}

const TIME_WINDOWS = [
  { value: 'morning', label: 'Morning', hint: 'Typically 8am - 12pm' },
  { value: 'afternoon', label: 'Afternoon', hint: 'Typically 12pm - 5pm' },
  { value: 'evening', label: 'Evening', hint: 'Typically 5pm - 8pm' },
  { value: 'flexible', label: 'Flexible', hint: 'Any time works' },
];

const RECURRENCE_OPTIONS = [
  { value: 'one-time', label: 'One-time', hint: 'Just this once' },
  { value: 'weekly', label: 'Weekly', hint: 'Same day each week' },
  { value: 'biweekly', label: 'Biweekly', hint: 'Every two weeks' },
  { value: 'monthly', label: 'Monthly', hint: 'Once per month' },
  { value: 'flexible', label: 'Not sure yet / flexible', hint: 'We can discuss' },
];

const WEEKDAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
  { value: 'flexible', label: 'Flexible' },
];

export default function Step2({ formData, onUpdate, errors }: Step2Props) {
  const {
    preferredDate = '',
    alternateDate = '',
    dateFlexible = false,
    preferredTimeWindow = 'flexible',
    recurrence = 'one-time',
    preferredWeekdays = [],
    arrivalNotificationPreference = '',
  } = formData;

  const showWeekdaySelection = recurrence !== 'one-time' && recurrence !== '';

  const toggleWeekday = (day: string) => {
    const newWeekdays = preferredWeekdays.includes(day)
      ? preferredWeekdays.filter((d: string) => d !== day)
      : [...preferredWeekdays, day];
    onUpdate({ ...formData, preferredWeekdays: newWeekdays });
  };

  return (
    <div>
      <h2 className="form-section-title">When and how often?</h2>
      <p className="form-section-description">
        During pre-launch, these are preferred dates and times so Parentive can understand when support would help. They are not a confirmed booking.
      </p>

      <div className="form-section">
        <Field 
          label="Preferred Date" 
          htmlFor="preferred-date"
          hint="When would you ideally like this support?"
        >
          <TextInput
            id="preferred-date"
            type="date"
            value={preferredDate}
            onChange={(e) => onUpdate({ ...formData, preferredDate: e.target.value })}
          />
        </Field>

        <Field 
          label="Alternate Date (Optional)" 
          htmlFor="alternate-date"
          hint="If your preferred date doesn&apos;t work, what&apos;s another option?"
        >
          <TextInput
            id="alternate-date"
            type="date"
            value={alternateDate}
            onChange={(e) => onUpdate({ ...formData, alternateDate: e.target.value })}
          />
        </Field>

        <Checkbox
          label="I'm flexible with dates"
          checked={dateFlexible}
          onChange={(e) => onUpdate({ ...formData, dateFlexible: e.target.checked })}
        />
      </div>

      <div className="form-section">
        <h3 className="form-section-title" style={{ fontSize: '16px' }}>
          Time of Day
        </h3>
        <RadioGroup>
          {TIME_WINDOWS.map((window) => (
            <Radio
              key={window.value}
              name="time-window"
              value={window.value}
              label={window.label}
              hint={window.hint}
              checked={preferredTimeWindow === window.value}
              onChange={(e) => onUpdate({ ...formData, preferredTimeWindow: e.target.value })}
            />
          ))}
        </RadioGroup>
      </div>

      <div className="form-section">
        <h3 className="form-section-title" style={{ fontSize: '16px' }}>
          How Often?
        </h3>
        <RadioGroup>
          {RECURRENCE_OPTIONS.map((option) => (
            <Radio
              key={option.value}
              name="recurrence"
              value={option.value}
              label={option.label}
              hint={option.hint}
              checked={recurrence === option.value}
              onChange={(e) => onUpdate({ ...formData, recurrence: e.target.value })}
            />
          ))}
        </RadioGroup>
      </div>

      {showWeekdaySelection && (
        <div className="form-section">
          <h3 className="form-section-title" style={{ fontSize: '16px' }}>
            Preferred Day(s) of the Week
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
            {WEEKDAYS.map((day) => (
              <Checkbox
                key={day.value}
                label={day.label}
                checked={preferredWeekdays.includes(day.value)}
                onChange={() => toggleWeekday(day.value)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="form-section">
        <h3 className="form-section-title" style={{ fontSize: '16px' }}>
          Arrival Notification
        </h3>
        <p className="form-section-description">
          Would you like a heads-up when your Parentive Helper is on the way? This can help with sleeping children, pets, or access preparation.
        </p>
        <RadioGroup>
          <Radio
            name="arrival-notification"
            value="yes"
            label="Yes, please"
            checked={arrivalNotificationPreference === 'yes'}
            onChange={(e) => onUpdate({ ...formData, arrivalNotificationPreference: e.target.value })}
          />
          <Radio
            name="arrival-notification"
            value="no"
            label="No, thanks"
            checked={arrivalNotificationPreference === 'no'}
            onChange={(e) => onUpdate({ ...formData, arrivalNotificationPreference: e.target.value })}
          />
          <Radio
            name="arrival-notification"
            value="no-preference"
            label="No preference"
            checked={arrivalNotificationPreference === 'no-preference'}
            onChange={(e) => onUpdate({ ...formData, arrivalNotificationPreference: e.target.value })}
          />
        </RadioGroup>
      </div>
    </div>
  );
}
