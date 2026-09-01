/**
 * Helper Application Submission API
 * 
 * Handles creation of helper applications including file uploads.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHelperApplication } from '@/lib/helper-applications';
import type { HelperApplication } from '@/lib/supabase/helper-types';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract personal information
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const mobile = formData.get('mobile') as string;
    const preferredContactMethod = formData.get('preferredContactMethod') as any;
    
    // Location and transportation
    const postalCode = formData.get('postalCode') as string;
    const municipality = formData.get('municipality') as string || null;
    const hasValidDriversLicense = formData.get('hasValidDriversLicense') === 'true';
    const hasReliableVehicle = formData.get('hasReliableVehicle') === 'true';
    const hasAppropriateInsurance = formData.get('hasAppropriateInsurance') === 'true';
    
    // Employment eligibility
    const age18OrOver = formData.get('age18OrOver') === 'true';
    const legallyEligibleToWorkInCanada = formData.get('legallyEligibleToWorkInCanada') === 'true';
    
    // Availability
    const availabilityWindows = JSON.parse(formData.get('availabilityWindows') as string || '[]');
    const desiredWeeklyHoursMin = formData.get('desiredWeeklyHoursMin') 
      ? parseInt(formData.get('desiredWeeklyHoursMin') as string) 
      : null;
    const desiredWeeklyHoursMax = formData.get('desiredWeeklyHoursMax') 
      ? parseInt(formData.get('desiredWeeklyHoursMax') as string) 
      : null;
    const availabilityNotes = formData.get('availabilityNotes') as string || null;
    
    // Experience and background
    const relevantExperience = formData.get('relevantExperience') as string || null;
    const whyInterested = formData.get('whyInterested') as string || null;
    const strengths = formData.get('strengths') as string || null;
    
    // Child support capability
    const interestedInChildSupport = formData.get('interestedInChildSupport') === 'true';
    const childSupportExperience = formData.get('childSupportExperience') as string || null;
    const childEngagementApproach = formData.get('childEngagementApproach') as string || null;
    
    // Additional qualifications
    const hasFirstAidCertification = formData.get('hasFirstAidCertification') === 'true';
    const firstAidCertificationDetails = formData.get('firstAidCertificationDetails') as string || null;
    const hasFoodSafetyCertification = formData.get('hasFoodSafetyCertification') === 'true';
    const foodSafetyCertificationDetails = formData.get('foodSafetyCertificationDetails') as string || null;
    const additionalCertifications = formData.get('additionalCertifications') as string || null;
    
    // Work preferences
    const physicalCapabilitiesConfirmed = formData.get('physicalCapabilitiesConfirmed') === 'true';
    const taskRestrictions = formData.get('taskRestrictions') as string || null;
    const additionalInformation = formData.get('additionalInformation') as string || null;
    
    // Consent and acknowledgments
    const applicationConsent = formData.get('applicationConsent') === 'true';
    const pilotHoursAcknowledgment = formData.get('pilotHoursAcknowledgment') === 'true';
    const foundingHelperInterestConfirmed = formData.get('foundingHelperInterestConfirmed') === 'true';
    
    // Marketing
    const howDidYouHearAboutUs = formData.get('howDidYouHearAboutUs') as string || null;
    const marketingConsent = formData.get('marketingConsent') === 'true';
    
    // Validate required fields
    const errors: Record<string, string> = {};
    
    if (!firstName || !lastName) {
      errors.name = 'First and last name are required';
    }
    
    if (!email || !email.includes('@')) {
      errors.email = 'Valid email is required';
    }
    
    if (!mobile) {
      errors.mobile = 'Mobile number is required';
    }
    
    if (!postalCode) {
      errors.postalCode = 'Postal code is required';
    }
    
    if (!age18OrOver) {
      errors.age = 'You must be 18 or over to apply';
    }
    
    if (!legallyEligibleToWorkInCanada) {
      errors.eligibility = 'You must be legally eligible to work in Canada';
    }
    
    if (!hasValidDriversLicense || !hasReliableVehicle || !hasAppropriateInsurance) {
      errors.transportation = 'Valid driver\'s license, reliable vehicle, and appropriate insurance are required for pilot';
    }
    
    if (availabilityWindows.length === 0) {
      errors.availability = 'Please select at least one availability window';
    }
    
    if (!applicationConsent) {
      errors.consent = 'Application consent is required';
    }
    
    if (!pilotHoursAcknowledgment) {
      errors.pilotAcknowledgment = 'You must acknowledge pilot hours flexibility';
    }
    
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }
    
    // Handle file uploads if present
    let resumeFileUrl: string | null = null;
    let coverLetterFileUrl: string | null = null;
    const additionalDocumentUrls: string[] = [];
    
    const uploadsDir = path.join(process.cwd(), 'data', 'helper-uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    
    const resumeFile = formData.get('resumeFile') as File | null;
    if (resumeFile && resumeFile.size > 0) {
      const timestamp = Date.now();
      const sanitizedName = resumeFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `resume_${timestamp}_${sanitizedName}`;
      const filePath = path.join(uploadsDir, fileName);
      
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      
      resumeFileUrl = `/helper-uploads/${fileName}`;
    }
    
    const coverLetterFile = formData.get('coverLetterFile') as File | null;
    if (coverLetterFile && coverLetterFile.size > 0) {
      const timestamp = Date.now();
      const sanitizedName = coverLetterFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `cover_letter_${timestamp}_${sanitizedName}`;
      const filePath = path.join(uploadsDir, fileName);
      
      const buffer = Buffer.from(await coverLetterFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      
      coverLetterFileUrl = `/helper-uploads/${fileName}`;
    }
    
    // Handle additional documents (if needed in future)
    
    // Create helper application
    const applicationData: Omit<HelperApplication, 'id' | 'created_at' | 'updated_at'> = {
      status: 'submitted',
      internal_notes: null,
      hiring_stage: null,
      
      first_name: firstName,
      last_name: lastName,
      email,
      mobile,
      preferred_contact_method: preferredContactMethod,
      
      postal_code: postalCode,
      municipality,
      has_valid_drivers_license: hasValidDriversLicense,
      has_reliable_vehicle: hasReliableVehicle,
      has_appropriate_insurance: hasAppropriateInsurance,
      
      age_18_or_over: age18OrOver,
      legally_eligible_to_work_in_canada: legallyEligibleToWorkInCanada,
      
      availability_windows: availabilityWindows,
      desired_weekly_hours_min: desiredWeeklyHoursMin,
      desired_weekly_hours_max: desiredWeeklyHoursMax,
      availability_notes: availabilityNotes,
      
      relevant_experience: relevantExperience,
      why_interested: whyInterested,
      strengths: strengths,
      
      interested_in_child_support: interestedInChildSupport,
      child_support_experience: childSupportExperience,
      child_engagement_approach: childEngagementApproach,
      
      has_first_aid_certification: hasFirstAidCertification,
      first_aid_certification_details: firstAidCertificationDetails,
      has_food_safety_certification: hasFoodSafetyCertification,
      food_safety_certification_details: foodSafetyCertificationDetails,
      additional_certifications: additionalCertifications,
      
      physical_capabilities_confirmed: physicalCapabilitiesConfirmed,
      task_restrictions: taskRestrictions,
      additional_information: additionalInformation,
      
      resume_file_url: resumeFileUrl,
      cover_letter_file_url: coverLetterFileUrl,
      additional_document_urls: additionalDocumentUrls.length > 0 ? additionalDocumentUrls : null,
      
      references_provided: false,
      references_data: null,
      
      application_consent: applicationConsent,
      pilot_hours_acknowledgment: pilotHoursAcknowledgment,
      founding_helper_interest_confirmed: foundingHelperInterestConfirmed,
      
      how_did_you_hear_about_us: howDidYouHearAboutUs,
      marketing_consent: marketingConsent,
    };
    
    const application = await createHelperApplication(applicationData);
    
    return NextResponse.json({
      success: true,
      applicationId: application.id,
      status: application.status,
    });
    
  } catch (error) {
    console.error('Helper application submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}
