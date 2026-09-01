/**
 * Helper Application Form
 * 
 * Multi-step form for submitting helper applications.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MultiStepForm } from '@/components/multi-step-form';
import Step1 from '@/components/helpers/step1-personal';
import Step2 from '@/components/helpers/step2-availability';
import Step3 from '@/components/helpers/step3-experience';
import Step4 from '@/components/helpers/step4-qualifications';
import Step5 from '@/components/helpers/step5-review';

const STEPS = [
  { title: 'Personal Info', component: Step1 },
  { title: 'Availability', component: Step2 },
  { title: 'Experience', component: Step3 },
  { title: 'Qualifications', component: Step4 },
  { title: 'Review', component: Step5 },
];

interface FormData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  preferredContactMethod: string;
  postalCode: string;
  municipality: string;
  age18OrOver: boolean;
  legallyEligibleToWorkInCanada: boolean;
  hasValidDriversLicense: boolean;
  hasReliableVehicle: boolean;
  hasAppropriateInsurance: boolean;
  
  // Step 2: Availability
  availabilityWindows: string[];
  desiredWeeklyHoursMin: string;
  desiredWeeklyHoursMax: string;
  availabilityNotes: string;
  
  // Step 3: Experience
  relevantExperience: string;
  whyInterested: string;
  strengths: string;
  interestedInChildSupport: boolean;
  childSupportExperience: string;
  childEngagementApproach: string;
  howDidYouHearAboutUs: string;
  
  // Step 4: Qualifications
  hasFirstAidCertification: boolean;
  firstAidCertificationDetails: string;
  hasFoodSafetyCertification: boolean;
  foodSafetyCertificationDetails: string;
  additionalCertifications: string;
  physicalCapabilitiesConfirmed: boolean;
  taskRestrictions: string;
  additionalInformation: string;
  resumeFile: File | null;
  coverLetterFile: File | null;
  
  // Step 5: Consent
  foundingHelperInterestConfirmed: boolean;
  pilotHoursAcknowledgment: boolean;
  applicationConsent: boolean;
  marketingConsent: boolean;
}

export default function HelperApplicationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    preferredContactMethod: 'either',
    postalCode: '',
    municipality: '',
    age18OrOver: false,
    legallyEligibleToWorkInCanada: false,
    hasValidDriversLicense: false,
    hasReliableVehicle: false,
    hasAppropriateInsurance: false,
    
    availabilityWindows: [],
    desiredWeeklyHoursMin: '',
    desiredWeeklyHoursMax: '',
    availabilityNotes: '',
    
    relevantExperience: '',
    whyInterested: '',
    strengths: '',
    interestedInChildSupport: false,
    childSupportExperience: '',
    childEngagementApproach: '',
    howDidYouHearAboutUs: '',
    
    hasFirstAidCertification: false,
    firstAidCertificationDetails: '',
    hasFoodSafetyCertification: false,
    foodSafetyCertificationDetails: '',
    additionalCertifications: '',
    physicalCapabilitiesConfirmed: false,
    taskRestrictions: '',
    additionalInformation: '',
    resumeFile: null,
    coverLetterFile: null,
    
    foundingHelperInterestConfirmed: false,
    pilotHoursAcknowledgment: false,
    applicationConsent: false,
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
      
      // Personal information
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('mobile', formData.mobile);
      submitData.append('preferredContactMethod', formData.preferredContactMethod);
      
      // Location and transportation
      submitData.append('postalCode', formData.postalCode);
      submitData.append('municipality', formData.municipality);
      submitData.append('hasValidDriversLicense', String(formData.hasValidDriversLicense));
      submitData.append('hasReliableVehicle', String(formData.hasReliableVehicle));
      submitData.append('hasAppropriateInsurance', String(formData.hasAppropriateInsurance));
      
      // Eligibility
      submitData.append('age18OrOver', String(formData.age18OrOver));
      submitData.append('legallyEligibleToWorkInCanada', String(formData.legallyEligibleToWorkInCanada));
      
      // Availability
      submitData.append('availabilityWindows', JSON.stringify(formData.availabilityWindows));
      submitData.append('desiredWeeklyHoursMin', formData.desiredWeeklyHoursMin);
      submitData.append('desiredWeeklyHoursMax', formData.desiredWeeklyHoursMax);
      submitData.append('availabilityNotes', formData.availabilityNotes);
      
      // Experience
      submitData.append('relevantExperience', formData.relevantExperience);
      submitData.append('whyInterested', formData.whyInterested);
      submitData.append('strengths', formData.strengths);
      submitData.append('interestedInChildSupport', String(formData.interestedInChildSupport));
      submitData.append('childSupportExperience', formData.childSupportExperience);
      submitData.append('childEngagementApproach', formData.childEngagementApproach);
      submitData.append('howDidYouHearAboutUs', formData.howDidYouHearAboutUs);
      
      // Qualifications
      submitData.append('hasFirstAidCertification', String(formData.hasFirstAidCertification));
      submitData.append('firstAidCertificationDetails', formData.firstAidCertificationDetails);
      submitData.append('hasFoodSafetyCertification', String(formData.hasFoodSafetyCertification));
      submitData.append('foodSafetyCertificationDetails', formData.foodSafetyCertificationDetails);
      submitData.append('additionalCertifications', formData.additionalCertifications);
      submitData.append('physicalCapabilitiesConfirmed', String(formData.physicalCapabilitiesConfirmed));
      submitData.append('taskRestrictions', formData.taskRestrictions);
      submitData.append('additionalInformation', formData.additionalInformation);
      
      // Files
      if (formData.resumeFile) {
        submitData.append('resumeFile', formData.resumeFile);
      }
      if (formData.coverLetterFile) {
        submitData.append('coverLetterFile', formData.coverLetterFile);
      }
      
      // Consent
      submitData.append('foundingHelperInterestConfirmed', String(formData.foundingHelperInterestConfirmed));
      submitData.append('pilotHoursAcknowledgment', String(formData.pilotHoursAcknowledgment));
      submitData.append('applicationConsent', String(formData.applicationConsent));
      submitData.append('marketingConsent', String(formData.marketingConsent));

      const response = await fetch('/api/helper-applications', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/helpers/apply/confirmation?id=${result.applicationId}`);
      } else {
        setError(result.error || 'Failed to submit application. Please try again.');
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
          Join the Hive
        </h2>
        <p style={{ fontSize: '16px', color: 'rgba(226, 232, 240, 0.9)', maxWidth: '600px', margin: '0 auto' }}>
          Complete your application to become a Founding Helper with Parentive.
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
