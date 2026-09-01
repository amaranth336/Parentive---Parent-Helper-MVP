/**
 * Request Parentive Support
 * 
 * Multi-step form for submitting support requests during pre-launch.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MultiStepForm } from '@/components/multi-step-form';
import Step1 from '@/components/request/step1-services';
import Step2 from '@/components/request/step2-timing';
import Step3 from '@/components/request/step3-household';
import Step4 from '@/components/request/step4-contact';
import Step5 from '@/components/request/step5-review';

const STEPS = [
  { title: 'Services', component: Step1 },
  { title: 'Timing', component: Step2 },
  { title: 'Household', component: Step3 },
  { title: 'Contact', component: Step4 },
  { title: 'Review', component: Step5 },
];

interface FormData {
  // Step 1
  selectedServices: string[];
  flexibleSupportDescription: string;
  serviceNotes: string;
  // Step 2
  preferredDate: string;
  alternateDate: string;
  dateFlexible: boolean;
  preferredTimeWindow: string;
  recurrence: string;
  preferredWeekdays: string[];
  arrivalNotificationPreference: string;
  // Step 3
  postalCode: string;
  municipality: string;
  inServiceArea: boolean;
  hasPets: boolean;
  petDetails: string;
  accessConsiderations: string;
  householdNotes: string;
  ingredientsAvailable: string;
  recipeText: string;
  recipeUrl: string;
  recipeFile: File | null;
  foodAllergiesPresent: boolean;
  foodAllergyDetails: string;
  foodServiceNotes: string;
  numberOfChildren: string;
  childrenAges: string;
  expectedActivities: string;
  childRoutineContext: string;
  childSupportAssessment: string;
  parentRemainsOnsiteConfirmed: boolean;
  // Step 4
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  preferredContactMethod: string;
  contactConsent: boolean;
  marketingConsent: boolean;
}

export default function RequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    selectedServices: [],
    flexibleSupportDescription: '',
    serviceNotes: '',
    preferredDate: '',
    alternateDate: '',
    dateFlexible: false,
    preferredTimeWindow: 'flexible',
    recurrence: 'one-time',
    preferredWeekdays: [],
    arrivalNotificationPreference: '',
    postalCode: '',
    municipality: '',
    inServiceArea: true,
    hasPets: false,
    petDetails: '',
    accessConsiderations: '',
    householdNotes: '',
    ingredientsAvailable: '',
    recipeText: '',
    recipeUrl: '',
    recipeFile: null,
    foodAllergiesPresent: false,
    foodAllergyDetails: '',
    foodServiceNotes: '',
    numberOfChildren: '',
    childrenAges: '',
    expectedActivities: '',
    childRoutineContext: '',
    childSupportAssessment: '',
    parentRemainsOnsiteConfirmed: false,
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    preferredContactMethod: 'either',
    contactConsent: false,
    marketingConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = new FormData();
      
      // Add all form fields
      submitData.append('selectedServices', JSON.stringify(formData.selectedServices));
      submitData.append('flexibleSupportDescription', formData.flexibleSupportDescription);
      submitData.append('serviceNotes', formData.serviceNotes);
      
      submitData.append('preferredDate', formData.preferredDate);
      submitData.append('alternateDate', formData.alternateDate);
      submitData.append('dateFlexible', String(formData.dateFlexible));
      submitData.append('preferredTimeWindow', formData.preferredTimeWindow);
      submitData.append('recurrence', formData.recurrence);
      submitData.append('preferredWeekdays', JSON.stringify(formData.preferredWeekdays));
      submitData.append('arrivalNotificationPreference', formData.arrivalNotificationPreference);
      
      submitData.append('postalCode', formData.postalCode);
      submitData.append('municipality', formData.municipality);
      submitData.append('inServiceArea', String(formData.inServiceArea));
      submitData.append('hasPets', String(formData.hasPets));
      submitData.append('petDetails', formData.petDetails);
      submitData.append('accessConsiderations', formData.accessConsiderations);
      submitData.append('householdNotes', formData.householdNotes);
      
      submitData.append('ingredientsAvailable', formData.ingredientsAvailable);
      submitData.append('recipeText', formData.recipeText);
      submitData.append('recipeUrl', formData.recipeUrl);
      if (formData.recipeFile) {
        submitData.append('recipeFile', formData.recipeFile);
      }
      submitData.append('foodAllergiesPresent', String(formData.foodAllergiesPresent));
      submitData.append('foodAllergyDetails', formData.foodAllergyDetails);
      submitData.append('foodServiceNotes', formData.foodServiceNotes);
      
      submitData.append('numberOfChildren', formData.numberOfChildren);
      const childrenAgesArray = formData.childrenAges ? formData.childrenAges.split(',').map(s => s.trim()) : [];
      submitData.append('childrenAges', JSON.stringify(childrenAgesArray));
      submitData.append('expectedActivities', formData.expectedActivities);
      submitData.append('childRoutineContext', formData.childRoutineContext);
      submitData.append('childSupportAssessment', formData.childSupportAssessment);
      submitData.append('parentRemainsOnsiteConfirmed', String(formData.parentRemainsOnsiteConfirmed));
      
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('mobile', formData.mobile);
      submitData.append('preferredContactMethod', formData.preferredContactMethod);
      
      submitData.append('contactConsent', String(formData.contactConsent));
      submitData.append('marketingConsent', String(formData.marketingConsent));

      const response = await fetch('/api/support-requests', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/request/confirmation?id=${result.requestId}`);
      } else {
        setError(result.error || 'Failed to submit request. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div className="logo">🧸</div>
          <h1 style={{ fontSize: '28px', margin: 0, color: '#fff' }}>Parentive</h1>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', margin: '8px 0' }}>
          Request Parentive Support
        </h2>
        <p style={{ fontSize: '16px', color: 'rgba(226, 232, 240, 0.9)', maxWidth: '600px', margin: '0 auto' }}>
          Tell us what you&apos;d like help with. We&apos;re preparing for launch and will follow up when pilot availability opens.
        </p>
      </div>

      {error && (
        <div style={{ maxWidth: '800px', margin: '0 auto 20px' }}>
          <div className="alert alert-error">{error}</div>
        </div>
      )}

      <MultiStepForm
        steps={STEPS}
        formData={formData}
        onUpdate={handleUpdate}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}
