/**
 * Multi-step Form Container
 * 
 * Provides navigation and state management for multi-step forms.
 */

'use client';

import React, { useState } from 'react';
import { Button } from './form';

interface StepConfig {
  title: string;
  component: React.ComponentType<any>;
}

interface MultiStepFormProps {
  steps: StepConfig[];
  formData: any;
  onUpdate: (data: any) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function MultiStepForm({
  steps,
  formData,
  onUpdate,
  onSubmit,
  isSubmitting = false,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const CurrentStepComponent = steps[currentStep].component;

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    setErrors({});
    goNext();
  };

  const handleSubmit = () => {
    if (isLastStep) {
      onSubmit();
    }
  };

  return (
    <div className="multi-step-form">
      <div className="step-indicator">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-indicator-item ${index === currentStep ? 'active' : ''} ${
              index < currentStep ? 'completed' : ''
            }`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      <div className="step-content">
        <CurrentStepComponent
          formData={formData}
          onUpdate={onUpdate}
          errors={errors}
          onEditStep={goToStep}
        />
      </div>

      <div className="step-actions">
        {!isFirstStep && (
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={isSubmitting}
          >
            ← Back
          </Button>
        )}
        <div style={{ flex: 1 }} />
        {!isLastStep ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            Continue →
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        )}
      </div>
    </div>
  );
}
