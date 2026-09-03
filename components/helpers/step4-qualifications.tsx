/**
 * Step 4: Qualifications & Documents
 * 
 * Collects certifications, work considerations, and supporting documents.
 */

'use client';

import React from 'react';
import { Field, TextInput, TextArea, Checkbox } from '@/components/form';

interface Step4Props {
  formData: any;
  onUpdate: (data: any) => void;
  errors: Record<string, string>;
}

export default function Step4({ formData, onUpdate, errors }: Step4Props) {
  const handleChange = (field: string, value: any) => {
    onUpdate({ ...formData, [field]: value });
  };

  const handleFileChange = (field: string, file: File | null) => {
    onUpdate({ ...formData, [field]: file });
  };

  return (
    <div>
      <h2 className="form-section-title">Qualifications & Documents</h2>
      <p className="form-section-description">
        Share any relevant certifications and upload supporting documents if available.
      </p>

      {/* Certifications */}
      <div className="form-section">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
          Certifications
        </h3>
        
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.6' }}>
          For parent-home child support assignments, CPR / First Aid is preferred. It is not currently mandatory for every general Parentive Helper.
        </p>

        <Checkbox
          label="I have current First Aid certification"
          checked={formData.hasFirstAidCertification || false}
          onChange={(e) => handleChange('hasFirstAidCertification', e.target.checked)}
        />

        {formData.hasFirstAidCertification && (
          <Field 
            label="First Aid Certification Details"
            htmlFor="firstAidCertificationDetails"
            hint="Optional. e.g., Standard First Aid, CPR Level C, expiry date"
          >
            <TextInput
              id="firstAidCertificationDetails"
              value={formData.firstAidCertificationDetails || ''}
              onChange={(e) => handleChange('firstAidCertificationDetails', e.target.value)}
              placeholder="e.g. Standard First Aid & CPR-C, expires June 2027"
            />
          </Field>
        )}

        <Checkbox
          label="I have Food Safety certification"
          checked={formData.hasFoodSafetyCertification || false}
          onChange={(e) => handleChange('hasFoodSafetyCertification', e.target.checked)}
        />

        {formData.hasFoodSafetyCertification && (
          <Field 
            label="Food Safety Certification Details"
            htmlFor="foodSafetyCertificationDetails"
            hint="Optional. e.g., Food Handler certification, expiry date"
          >
            <TextInput
              id="foodSafetyCertificationDetails"
              value={formData.foodSafetyCertificationDetails || ''}
              onChange={(e) => handleChange('foodSafetyCertificationDetails', e.target.value)}
              placeholder="e.g. Food Handler Certificate, expires March 2028"
            />
          </Field>
        )}

        <Field 
          label="Other Certifications or Qualifications"
          htmlFor="additionalCertifications"
          hint="Optional. Any other relevant certifications or training"
        >
          <TextArea
            id="additionalCertifications"
            value={formData.additionalCertifications || ''}
            onChange={(e) => handleChange('additionalCertifications', e.target.value)}
            placeholder="List any other relevant certifications..."
            rows={2}
          />
        </Field>
      </div>

      {/* Work considerations */}
      <div className="form-section">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
          Work Capabilities & Considerations
        </h3>

        <Checkbox
          label="I can safely perform the physical requirements of the assignments I accept"
          hint="This may include standing, bending, light household activity, carrying everyday household items and moving throughout a customer’s home."
          checked={formData.physicalCapabilitiesConfirmed || false}
          onChange={(e) => handleChange('physicalCapabilitiesConfirmed', e.target.checked)}
        />

        <Field 
          label="Task Restrictions"
          htmlFor="taskRestrictions"
          hint="Optional. Any legitimate task restrictions (religious, ethical, safety, or capability-related) we should be aware of"
        >
          <TextArea
            id="taskRestrictions"
            value={formData.taskRestrictions || ''}
            onChange={(e) => handleChange('taskRestrictions', e.target.value)}
            placeholder="Describe any restrictions that would affect your ability to perform certain tasks..."
            rows={3}
          />
        </Field>

        <Field 
          label="Additional Information"
          htmlFor="additionalInformation"
          hint="Optional. Anything else you'd like us to know about your application"
        >
          <TextArea
            id="additionalInformation"
            value={formData.additionalInformation || ''}
            onChange={(e) => handleChange('additionalInformation', e.target.value)}
            placeholder="Any additional information..."
            rows={3}
          />
        </Field>
      </div>

      {/* Supporting documents */}
      <div className="form-section">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
          Supporting Documents
        </h3>
        
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.6' }}>
          A conventional resume is optional. If you have a document that explains your skills, experience, practical capability, or why you are suited to the Parentive Helper role, you can upload it here.
        </p>

        <Field 
          label="Resume / CV"
          htmlFor="resumeFile"
          hint="Optional. PDF, DOC, or DOCX format"
        >
          <div className="file-input-wrapper">
            <label htmlFor="resumeFile" className="file-input-label">
              <span>📄</span>
              <span>Choose file</span>
            </label>
            <input
              id="resumeFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange('resumeFile', e.target.files?.[0] || null)}
            />
          </div>
          {formData.resumeFile && (
            <div className="file-selected">
              Selected: {formData.resumeFile.name}
            </div>
          )}
        </Field>

        <Field 
          label="Fit / experience document"
          htmlFor="coverLetterFile"
          hint="Optional. A written explanation of skills, experience and fit if you do not have a conventional resume."
        >
          <div className="file-input-wrapper">
            <label htmlFor="coverLetterFile" className="file-input-label">
              <span>📄</span>
              <span>Choose file</span>
            </label>
            <input
              id="coverLetterFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange('coverLetterFile', e.target.files?.[0] || null)}
            />
          </div>
          {formData.coverLetterFile && (
            <div className="file-selected">
              Selected: {formData.coverLetterFile.name}
            </div>
          )}
        </Field>
      </div>
    </div>
  );
}
