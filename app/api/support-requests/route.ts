/**
 * Support Request Submission API
 * 
 * Handles creation of support requests including file uploads.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupportRequest } from '@/lib/support-requests';
import type { SupportRequest } from '@/lib/supabase/types';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const selectedServices = JSON.parse(formData.get('selectedServices') as string || '[]');
    const flexibleSupportDescription = formData.get('flexibleSupportDescription') as string || null;
    const serviceNotes = formData.get('serviceNotes') as string || null;
    
    const preferredDate = formData.get('preferredDate') as string || null;
    const alternateDate = formData.get('alternateDate') as string || null;
    const dateFlexible = formData.get('dateFlexible') === 'true';
    const preferredTimeWindow = formData.get('preferredTimeWindow') as any;
    const recurrence = formData.get('recurrence') as any;
    const preferredWeekdays = JSON.parse(formData.get('preferredWeekdays') as string || '[]');
    const arrivalNotificationPreference = formData.get('arrivalNotificationPreference') as any || null;
    
    const postalCode = formData.get('postalCode') as string;
    const municipality = formData.get('municipality') as string || null;
    const inServiceArea = formData.get('inServiceArea') === 'true';
    const hasPets = formData.get('hasPets') === 'true';
    const petDetails = formData.get('petDetails') as string || null;
    const accessConsiderations = formData.get('accessConsiderations') as string || null;
    const householdNotes = formData.get('householdNotes') as string || null;
    
    const ingredientsAvailable = formData.get('ingredientsAvailable') as any || null;
    const recipeText = formData.get('recipeText') as string || null;
    const recipeUrl = formData.get('recipeUrl') as string || null;
    const foodAllergiesPresent = formData.get('foodAllergiesPresent') === 'true';
    const foodAllergyDetails = formData.get('foodAllergyDetails') as string || null;
    const foodServiceNotes = formData.get('foodServiceNotes') as string || null;
    
    const numberOfChildren = formData.get('numberOfChildren') ? parseInt(formData.get('numberOfChildren') as string) : null;
    const childrenAges = JSON.parse(formData.get('childrenAges') as string || '[]');
    const expectedActivities = formData.get('expectedActivities') as string || null;
    const childRoutineContext = formData.get('childRoutineContext') as string || null;
    const childSupportAssessment = formData.get('childSupportAssessment') as string || null;
    const parentRemainsOnsiteConfirmed = formData.get('parentRemainsOnsiteConfirmed') === 'true';
    
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const mobile = formData.get('mobile') as string;
    const preferredContactMethod = formData.get('preferredContactMethod') as any;
    
    const contactConsent = formData.get('contactConsent') === 'true';
    const marketingConsent = formData.get('marketingConsent') === 'true';
    
    // Validate required fields
    const errors: Record<string, string> = {};
    
    if (selectedServices.length === 0 && !flexibleSupportDescription) {
      errors.services = 'Please select at least one service or describe a flexible support need';
    }
    
    if (!postalCode) {
      errors.postalCode = 'Postal code is required';
    }
    
    if (!firstName || !lastName) {
      errors.name = 'First and last name are required';
    }
    
    if (!email || !email.includes('@')) {
      errors.email = 'Valid email is required';
    }
    
    if (!mobile) {
      errors.mobile = 'Mobile number is required';
    }
    
    if (!contactConsent) {
      errors.consent = 'Contact consent is required';
    }
    
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }
    
    // Handle file upload if present
    let recipeFileUrl: string | null = null;
    const recipeFile = formData.get('recipeFile') as File | null;
    
    if (recipeFile) {
      // Store file in data/uploads directory
      const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      
      const timestamp = Date.now();
      const sanitizedName = recipeFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `recipe_${timestamp}_${sanitizedName}`;
      const filePath = path.join(uploadsDir, fileName);
      
      const buffer = Buffer.from(await recipeFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      
      recipeFileUrl = `/uploads/${fileName}`;
    }
    
    // Determine initial status
    let status: SupportRequest['status'] = 'submitted';
    if (!inServiceArea) {
      status = 'waitlisted';
    }
    
    // Create support request
    const requestData: Omit<SupportRequest, 'id' | 'created_at' | 'updated_at'> = {
      status,
      internal_notes: null,
      
      selected_services: selectedServices,
      flexible_support_description: flexibleSupportDescription,
      service_notes: serviceNotes,
      
      preferred_date: preferredDate,
      alternate_date: alternateDate,
      date_flexible: dateFlexible,
      preferred_time_window: preferredTimeWindow,
      recurrence,
      preferred_weekdays: preferredWeekdays.length > 0 ? preferredWeekdays : null,
      arrival_notification_preference: arrivalNotificationPreference,
      
      postal_code: postalCode,
      municipality,
      in_service_area: inServiceArea,
      has_pets: hasPets,
      pet_details: petDetails,
      access_considerations: accessConsiderations,
      household_notes: householdNotes,
      
      ingredients_available: ingredientsAvailable,
      recipe_text: recipeText,
      recipe_url: recipeUrl,
      recipe_file_url: recipeFileUrl,
      food_allergies_present: foodAllergiesPresent,
      food_allergy_details: foodAllergyDetails,
      food_service_notes: foodServiceNotes,
      
      number_of_children: numberOfChildren,
      children_ages: childrenAges.length > 0 ? childrenAges : null,
      expected_activities: expectedActivities,
      child_routine_context: childRoutineContext,
      child_support_assessment: childSupportAssessment,
      parent_remains_onsite_confirmed: parentRemainsOnsiteConfirmed,
      
      first_name: firstName,
      last_name: lastName,
      email,
      mobile,
      preferred_contact_method: preferredContactMethod,
      
      contact_consent: contactConsent,
      marketing_consent: marketingConsent,
    };
    
    const supportRequest = await createSupportRequest(requestData);
    
    return NextResponse.json({
      success: true,
      requestId: supportRequest.id,
      status: supportRequest.status,
    });
    
  } catch (error) {
    console.error('Support request submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit support request. Please try again.' },
      { status: 500 }
    );
  }
}
