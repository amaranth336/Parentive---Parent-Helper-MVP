/**
 * Step 3: Household Context
 * 
 * Collects postal code, household info, and conditional questions for food/child services.
 */

'use client';

import React from 'react';
import { Field, TextInput, TextArea, Radio, RadioGroup, Checkbox, Alert } from '@/components/form';

// GTA service area postal code prefixes
const SERVICE_AREA_PREFIXES = [
  'L3Y', // East Gwillimbury
  'L3X', // Newmarket
  'L4G', // Aurora
  'L4P', // Georgina
  'L4A', // Whitchurch-Stouffville
  'L9N', // East Gwillimbury
  'L0E', // Georgina
];

// Food-related service slugs
const FOOD_SERVICES = [
  'dinner-prep',
  'tomorrows-lunches',
  'meal-prep-reset',
  'produce-snack-prep',
  'kitchen-reset',
];

// Child support service slugs
const CHILD_SUPPORT_SERVICES = [
  'uninterrupted-hour',
  'parents-helper-visit',
];

interface Step3Props {
  formData: any;
  onUpdate: (data: any) => void;
  errors: Record<string, string>;
}

export default function Step3({ formData, onUpdate, errors }: Step3Props) {
  const {
    postalCode = '',
    inServiceArea = true,
    hasPets = false,
    petDetails = '',
    accessConsiderations = '',
    householdNotes = '',
    selectedServices = [],
    // Food conditional
    ingredientsAvailable = '',
    recipeText = '',
    recipeUrl = '',
    recipeFile = null,
    foodAllergiesPresent = false,
    foodAllergyDetails = '',
    foodServiceNotes = '',
    // Child support conditional
    numberOfChildren = '',
    childrenAges = '',
    expectedActivities = '',
    childRoutineContext = '',
    childSupportAssessment = '',
    parentRemainsOnsiteConfirmed = false,
  } = formData;

  const showFoodQuestions = selectedServices.some((s: string) => FOOD_SERVICES.includes(s));
  const showChildQuestions = selectedServices.some((s: string) => CHILD_SUPPORT_SERVICES.includes(s));

  const validatePostalCode = (code: string) => {
    const cleaned = code.toUpperCase().replace(/\s/g, '');
    if (cleaned.length >= 3) {
      const prefix = cleaned.substring(0, 3);
      const isInArea = SERVICE_AREA_PREFIXES.includes(prefix);
      onUpdate({ ...formData, postalCode: code, inServiceArea: isInArea });
    } else {
      onUpdate({ ...formData, postalCode: code });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, DOCX, or TXT file.');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }
      
      onUpdate({ ...formData, recipeFile: file });
    }
  };

  return (
    <div>
      <h2 className="form-section-title">Tell us about your household</h2>
      <p className="form-section-description">
        We&apos;ll collect only the information needed to assess service suitability. Full address will be requested when bookings become available.
      </p>

      <div className="form-section">
        <Field 
          label="Postal Code" 
          htmlFor="postal-code"
          hint="We&apos;ll check if you&apos;re in our current service area"
          error={errors.postalCode}
        >
          <TextInput
            id="postal-code"
            value={postalCode}
            onChange={(e) => validatePostalCode(e.target.value)}
            placeholder="e.g., L3Y 1A1"
            maxLength={7}
          />
        </Field>

        {postalCode && !inServiceArea && (
          <Alert variant="warning">
            <strong>Parentive isn&apos;t in your area yet.</strong>
            <br />
            We&apos;re currently launching in select GTA communities including East Gwillimbury, Newmarket, Aurora, Georgina, and Whitchurch-Stouffville. We&apos;d still love to hear about your needs for future expansion.
          </Alert>
        )}
      </div>

      <div className="form-section">
        <h3 className="form-section-title" style={{ fontSize: '16px' }}>
          Household Context
        </h3>
        
        <Checkbox
          label="We have pets in the home"
          checked={hasPets}
          onChange={(e) => onUpdate({ ...formData, hasPets: e.target.checked })}
        />

        {hasPets && (
          <Field 
            label="Pet Details (Optional)" 
            htmlFor="pet-details"
            hint="What should we know about your pets?"
          >
            <TextArea
              id="pet-details"
              value={petDetails}
              onChange={(e) => onUpdate({ ...formData, petDetails: e.target.value })}
              placeholder="e.g., Friendly dog, will be in backyard during visit"
              rows={2}
            />
          </Field>
        )}

        <Field 
          label="Access Considerations (Optional)" 
          htmlFor="access-considerations"
          hint="Any relevant practical or accessibility details"
        >
          <TextArea
            id="access-considerations"
            value={accessConsiderations}
            onChange={(e) => onUpdate({ ...formData, accessConsiderations: e.target.value })}
            placeholder="e.g., Second floor apartment, visitor parking available"
            rows={2}
          />
        </Field>

        <Field 
          label="General Household Notes (Optional)" 
          htmlFor="household-notes"
        >
          <TextArea
            id="household-notes"
            value={householdNotes}
            onChange={(e) => onUpdate({ ...formData, householdNotes: e.target.value })}
            placeholder="Any other context that would be helpful..."
            rows={3}
          />
        </Field>
      </div>

      {showFoodQuestions && (
        <>
          <div className="form-section">
            <h3 className="form-section-title" style={{ fontSize: '17px', color: 'var(--brand)' }}>
              Food Service Questions
            </h3>
            <p className="form-section-description">
              You&apos;ve selected food-related services. A few additional questions will help us prepare.
            </p>

            <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>
              Ingredients & Equipment
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Will the necessary ingredients and cookware be available in the home?
            </p>
            <RadioGroup>
              <Radio
                name="ingredients-available"
                value="yes"
                label="Yes"
                checked={ingredientsAvailable === 'yes'}
                onChange={(e) => onUpdate({ ...formData, ingredientsAvailable: e.target.value })}
              />
              <Radio
                name="ingredients-available"
                value="not-sure"
                label="Not sure yet"
                checked={ingredientsAvailable === 'not-sure'}
                onChange={(e) => onUpdate({ ...formData, ingredientsAvailable: e.target.value })}
              />
              <Radio
                name="ingredients-available"
                value="not-applicable"
                label="Not applicable"
                checked={ingredientsAvailable === 'not-applicable'}
                onChange={(e) => onUpdate({ ...formData, ingredientsAvailable: e.target.value })}
              />
            </RadioGroup>
          </div>

          <div className="form-section">
            <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
              Recipe Information
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.6' }}>
              If your request requires a specific recipe, please provide it at least 24 hours before the visit so Parentive can review the preparation and assign an appropriate Helper.
            </p>

            <Field 
              label="Recipe URL (Optional)" 
              htmlFor="recipe-url"
              hint="Link to an online recipe"
            >
              <TextInput
                id="recipe-url"
                type="url"
                value={recipeUrl}
                onChange={(e) => onUpdate({ ...formData, recipeUrl: e.target.value })}
                placeholder="https://..."
              />
            </Field>

            <Field 
              label="Recipe Text (Optional)" 
              htmlFor="recipe-text"
              hint="Paste recipe instructions here"
            >
              <TextArea
                id="recipe-text"
                value={recipeText}
                onChange={(e) => onUpdate({ ...formData, recipeText: e.target.value })}
                placeholder="Ingredients and instructions..."
                rows={4}
              />
            </Field>

            <Field 
              label="Recipe Document (Optional)" 
              htmlFor="recipe-file"
              hint="PDF, DOC, DOCX, or TXT (max 5MB)"
            >
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="recipe-file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
                <label htmlFor="recipe-file" className="file-input-label">
                  📎 {recipeFile ? 'Change File' : 'Upload Recipe'}
                </label>
              </div>
              {recipeFile && (
                <div className="file-selected">
                  Selected: {recipeFile.name}
                </div>
              )}
            </Field>
          </div>

          <div className="form-section">
            <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
              Food Allergies & Dietary Considerations
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Are there any food allergies, dietary requirements or cross-contamination considerations relevant to this service?
            </p>
            
            <RadioGroup>
              <Radio
                name="food-allergies"
                value="no"
                label="No"
                checked={!foodAllergiesPresent}
                onChange={() => onUpdate({ ...formData, foodAllergiesPresent: false, foodAllergyDetails: '' })}
              />
              <Radio
                name="food-allergies"
                value="yes"
                label="Yes"
                checked={foodAllergiesPresent}
                onChange={() => onUpdate({ ...formData, foodAllergiesPresent: true })}
              />
            </RadioGroup>

            {foodAllergiesPresent && (
              <Field 
                label="Please Describe" 
                htmlFor="food-allergy-details"
                hint="Include only information relevant to performing the food task"
              >
                <TextArea
                  id="food-allergy-details"
                  value={foodAllergyDetails}
                  onChange={(e) => onUpdate({ ...formData, foodAllergyDetails: e.target.value })}
                  placeholder="e.g., Severe peanut allergy - no peanut products in kitchen"
                  rows={3}
                />
              </Field>
            )}

            <Field 
              label="Additional Food Service Notes (Optional)" 
              htmlFor="food-service-notes"
            >
              <TextArea
                id="food-service-notes"
                value={foodServiceNotes}
                onChange={(e) => onUpdate({ ...formData, foodServiceNotes: e.target.value })}
                placeholder="Any other food-related context..."
                rows={2}
              />
            </Field>
          </div>
        </>
      )}

      {showChildQuestions && (
        <div className="form-section">
          <h3 className="form-section-title" style={{ fontSize: '17px', color: 'var(--brand)' }}>
            Child Support Questions
          </h3>
          <p className="form-section-description">
            You&apos;ve selected parent-home child support. A few questions will help us understand your needs.
          </p>

          <Alert variant="info">
            <strong>Parent/caregiver remains on premises during pilot child support.</strong>
            <br />
            Parentive Helpers actively and intentionally engage with children, not just passive supervision.
            <br /><br />
            <strong>Pilot exclusions:</strong> No medication administration, no bathing, no transportation, and children do not leave premises.
          </Alert>

          <Field 
            label="Number of Children" 
            htmlFor="number-of-children"
            error={errors.numberOfChildren}
          >
            <TextInput
              id="number-of-children"
              type="number"
              min="1"
              value={numberOfChildren}
              onChange={(e) => onUpdate({ ...formData, numberOfChildren: e.target.value })}
              placeholder="1"
            />
          </Field>

          <Field 
            label="Ages or Age Ranges" 
            htmlFor="children-ages"
            hint="e.g., 2 years, 5 years"
          >
            <TextInput
              id="children-ages"
              value={childrenAges}
              onChange={(e) => onUpdate({ ...formData, childrenAges: e.target.value })}
              placeholder="Separate multiple ages with commas"
            />
          </Field>

          <Field 
            label="Expected Activities or Support" 
            htmlFor="expected-activities"
            hint="What will the Helper be doing with your child(ren)?"
          >
            <TextArea
              id="expected-activities"
              value={expectedActivities}
              onChange={(e) => onUpdate({ ...formData, expectedActivities: e.target.value })}
              placeholder="e.g., Play time, crafts, reading, snack supervision"
              rows={3}
            />
          </Field>

          <Field 
            label="Routine & Context (Optional)" 
            htmlFor="child-routine-context"
            hint="Any routines or context that would help?"
          >
            <TextArea
              id="child-routine-context"
              value={childRoutineContext}
              onChange={(e) => onUpdate({ ...formData, childRoutineContext: e.target.value })}
              placeholder="e.g., Nap schedule, favorite activities, communication style"
              rows={3}
            />
          </Field>

          <Field 
            label="Safety & Support Assessment (Optional)" 
            htmlFor="child-support-assessment"
            hint="Anything else we should know to provide safe, appropriate support?"
          >
            <TextArea
              id="child-support-assessment"
              value={childSupportAssessment}
              onChange={(e) => onUpdate({ ...formData, childSupportAssessment: e.target.value })}
              placeholder="Please do not include detailed medical information"
              rows={3}
            />
          </Field>

          <div style={{ marginTop: '16px' }}>
            <Checkbox
              label="I confirm that a parent/caregiver will remain on premises during the visit"
              checked={parentRemainsOnsiteConfirmed}
              onChange={(e) => onUpdate({ ...formData, parentRemainsOnsiteConfirmed: e.target.checked })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
