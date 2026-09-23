"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Field,
  TextArea,
  TextInput,
} from "@/components/form";
import {
  APPLICATION_CONSENT_LABEL,
  AVAILABLE_DAY_OPTIONS,
  DOCUMENT_ATTACH_COPY,
  EXPERIENCE_SUPPORTING,
  FIELD_LABELS,
  FUTURE_OPPORTUNITIES_CONSENT_LABEL,
  HELPERS_ERRORS,
  HELPERS_PRIVACY_ANCHOR,
  HELPERS_PRIVACY_POLICY_VERSION,
  INTEREST_HELPER_TEXT,
  INTEREST_OPTIONS,
  INTEREST_QUESTION,
  POSTAL_PLACEHOLDER,
  PREFERRED_TIME_OPTIONS,
  SCREENING_ACK_HELPER_TEXT,
  SUBMIT_IDLE_LABEL,
  SUBMIT_PENDING_LABEL,
  SUCCESS_HEADING,
  SUCCESS_MESSAGE,
  VEHICLE_REQUIREMENT_TEXT,
  WEEKLY_HOURS_HELPER_TEXT,
  WEEKLY_HOURS_OPTIONS,
  type AvailableDayKey,
  type InterestKey,
  type PreferredTimeKey,
  type WeeklyHoursKey,
} from "@/lib/helpers/copy";
import { isVerifiedHelpersSuccess } from "@/lib/helpers/response";
import {
  maskPostalCode,
  validateHelpersInput,
} from "@/lib/helpers/validation";

const FIELD_FOCUS_ORDER = [
  "firstName",
  "lastName",
  "email",
  "telephone",
  "postalCode",
  "interestKeys",
  "experienceText",
  "motivationText",
  "availableDays",
  "preferredTimeBlocks",
  "preferredWeeklyHours",
  "age18Confirmed",
  "workEligibleCanada",
  "hasOwnVehicle",
  "screeningAcknowledgement",
  "document",
  "applicationConsent",
  "futureOpportunitiesConsent",
] as const;

const FIELD_CONTROL_IDS: Record<(typeof FIELD_FOCUS_ORDER)[number], string> = {
  firstName: "helpers-first-name",
  lastName: "helpers-last-name",
  email: "helpers-email",
  telephone: "helpers-telephone",
  postalCode: "helpers-postal-code",
  interestKeys: "helpers-interest-laundry_household_resets",
  experienceText: "helpers-experience-text",
  motivationText: "helpers-motivation-text",
  availableDays: "helpers-day-monday",
  preferredTimeBlocks: "helpers-time-mornings",
  preferredWeeklyHours: "helpers-hours-under_6",
  age18Confirmed: "helpers-age-18",
  workEligibleCanada: "helpers-work-eligible",
  hasOwnVehicle: "helpers-own-vehicle",
  screeningAcknowledgement: "helpers-screening-ack",
  document: "helpers-document",
  applicationConsent: "helpers-application-consent",
  futureOpportunitiesConsent: "helpers-future-consent",
};

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  postalCode: string;
  interestKeys: InterestKey[];
  experienceText: string;
  motivationText: string;
  availableDays: AvailableDayKey[];
  preferredTimeBlocks: PreferredTimeKey[];
  preferredWeeklyHours: WeeklyHoursKey | "";
  age18Confirmed: boolean;
  workEligibleCanada: boolean;
  hasOwnVehicle: boolean;
  screeningAcknowledgement: boolean;
  applicationConsent: boolean;
  futureOpportunitiesConsent: boolean;
};

const EMPTY_VALUES: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  telephone: "",
  postalCode: "",
  interestKeys: [],
  experienceText: "",
  motivationText: "",
  availableDays: [],
  preferredTimeBlocks: [],
  preferredWeeklyHours: "",
  age18Confirmed: false,
  workEligibleCanada: false,
  hasOwnVehicle: false,
  screeningAcknowledgement: false,
  applicationConsent: false,
  futureOpportunitiesConsent: false,
};

function toggleKey<T extends string>(
  current: T[],
  key: T,
  checked: boolean,
): T[] {
  if (checked) {
    return current.includes(key) ? current : [...current, key];
  }

  return current.filter((item) => item !== key);
}

function inferDocumentContentType(file: File | null): string {
  if (!file) {
    return "";
  }
  if (file.type.trim()) {
    return file.type.trim();
  }
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".pdf")) {
    return "application/pdf";
  }
  if (lower.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  return "";
}

export function HelpersApplicationForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [documentClearedHint, setDocumentClearedHint] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);
  const [focusTarget, setFocusTarget] = useState<"error" | "success" | null>(
    null,
  );

  useEffect(() => {
    if (focusTarget === "success") {
      successRef.current?.focus();
      setFocusTarget(null);
      return;
    }

    if (focusTarget === "error") {
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
        setFocusTarget(null);
        return;
      }

      const firstInvalid = FIELD_FOCUS_ORDER.find((field) => fieldErrors[field]);
      if (firstInvalid) {
        document.getElementById(FIELD_CONTROL_IDS[firstInvalid])?.focus();
      }
      setFocusTarget(null);
    }
  }, [focusTarget, fieldErrors]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) {
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});
    setSuccess(false);
    setDocumentClearedHint(false);

    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      telephone: values.telephone,
      postalCode: values.postalCode,
      interestKeys: values.interestKeys,
      experienceText: values.experienceText,
      motivationText: values.motivationText,
      availableDays: values.availableDays,
      preferredTimeBlocks: values.preferredTimeBlocks,
      preferredWeeklyHours: values.preferredWeeklyHours || null,
      age18Confirmed: values.age18Confirmed,
      workEligibleCanada: values.workEligibleCanada,
      hasOwnVehicle: values.hasOwnVehicle,
      screeningAcknowledgement: values.screeningAcknowledgement,
      applicationConsent: values.applicationConsent,
      futureOpportunitiesConsent: values.futureOpportunitiesConsent,
      documentOriginalFilename: documentFile?.name ?? "",
      documentContentType: inferDocumentContentType(documentFile),
      documentByteSize: documentFile?.size ?? 0,
    };

    const clientResult = validateHelpersInput(payload);
    if (!clientResult.ok) {
      setFieldErrors(clientResult.fieldErrors);
      setFormError(HELPERS_ERRORS.validation);
      if (!documentFile) {
        setDocumentClearedHint(true);
      }
      submittingRef.current = false;
      setSubmitting(false);
      setFocusTarget("error");
      return;
    }

    if (!documentFile) {
      setFieldErrors({ document: HELPERS_ERRORS.documentReselect });
      setFormError(HELPERS_ERRORS.validation);
      setDocumentClearedHint(true);
      submittingRef.current = false;
      setSubmitting(false);
      setFocusTarget("error");
      return;
    }

    const formData = new FormData();
    formData.set("firstName", values.firstName);
    formData.set("lastName", values.lastName);
    formData.set("email", values.email);
    formData.set("telephone", values.telephone);
    formData.set("postalCode", values.postalCode);
    for (const key of values.interestKeys) {
      formData.append("interestKeys", key);
    }
    formData.set("experienceText", values.experienceText);
    formData.set("motivationText", values.motivationText);
    for (const day of values.availableDays) {
      formData.append("availableDays", day);
    }
    for (const block of values.preferredTimeBlocks) {
      formData.append("preferredTimeBlocks", block);
    }
    formData.set("preferredWeeklyHours", values.preferredWeeklyHours);
    formData.set("age18Confirmed", values.age18Confirmed ? "true" : "false");
    formData.set(
      "workEligibleCanada",
      values.workEligibleCanada ? "true" : "false",
    );
    formData.set("hasOwnVehicle", values.hasOwnVehicle ? "true" : "false");
    formData.set(
      "screeningAcknowledgement",
      values.screeningAcknowledgement ? "true" : "false",
    );
    formData.set(
      "applicationConsent",
      values.applicationConsent ? "true" : "false",
    );
    formData.set(
      "futureOpportunitiesConsent",
      values.futureOpportunitiesConsent ? "true" : "false",
    );
    formData.set("document", documentFile);

    try {
      const response = await fetch("/api/helpers", {
        method: "POST",
        body: formData,
      });
      const data: unknown = await response.json();

      if (isVerifiedHelpersSuccess(response.ok, data)) {
        setSuccess(true);
        setFocusTarget("success");
        return;
      }

      const body =
        data && typeof data === "object" ? (data as Record<string, unknown>) : {};
      const nextFieldErrors =
        body.fieldErrors && typeof body.fieldErrors === "object"
          ? (body.fieldErrors as Record<string, string>)
          : {};
      setFieldErrors(nextFieldErrors);
      setFormError(
        typeof body.error === "string" ? body.error : HELPERS_ERRORS.unexpected,
      );

      if (!documentFile || nextFieldErrors.document) {
        setDocumentClearedHint(true);
      }
    } catch {
      setFormError(HELPERS_ERRORS.unexpected);
    }

    submittingRef.current = false;
    setSubmitting(false);
    setFocusTarget("error");
  }

  if (success) {
    return (
      <Card>
        <div ref={successRef} id="helpers-success" tabIndex={-1}>
          <h2 className="helpers-success-heading">{SUCCESS_HEADING}</h2>
          <Alert variant="success">{SUCCESS_MESSAGE}</Alert>
        </div>
      </Card>
    );
  }

  const showErrorSummary = Boolean(formError || Object.keys(fieldErrors).length);

  return (
    <Card>
      <form className="helpers-form" noValidate onSubmit={onSubmit}>
        {showErrorSummary ? (
          <div ref={errorSummaryRef} id="helpers-errors" tabIndex={-1}>
            <Alert variant="error">
              <p>{formError ?? HELPERS_ERRORS.validation}</p>
              {Object.keys(fieldErrors).length > 0 ? (
                <ul className="helpers-error-list">
                  {FIELD_FOCUS_ORDER.filter((field) => fieldErrors[field]).map(
                    (field) => (
                      <li key={field}>
                        <a href={`#${FIELD_CONTROL_IDS[field]}`}>
                          {fieldErrors[field]}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              ) : null}
            </Alert>
          </div>
        ) : null}

        <section
          className="helpers-form-section"
          aria-labelledby="helpers-about-heading"
        >
          <h2 id="helpers-about-heading" className="helpers-form-heading">
            01 About you
          </h2>

          <Field
            label={`${FIELD_LABELS.firstName} (required)`}
            htmlFor="helpers-first-name"
            error={fieldErrors.firstName}
          >
            <TextInput
              id="helpers-first-name"
              name="firstName"
              autoComplete="given-name"
              required
              aria-required="true"
              error={Boolean(fieldErrors.firstName)}
              value={values.firstName}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  firstName: event.target.value,
                }))
              }
            />
          </Field>

          <Field
            label={`${FIELD_LABELS.lastName} (required)`}
            htmlFor="helpers-last-name"
            error={fieldErrors.lastName}
          >
            <TextInput
              id="helpers-last-name"
              name="lastName"
              autoComplete="family-name"
              required
              aria-required="true"
              error={Boolean(fieldErrors.lastName)}
              value={values.lastName}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  lastName: event.target.value,
                }))
              }
            />
          </Field>

          <Field
            label={`${FIELD_LABELS.email} (required)`}
            htmlFor="helpers-email"
            error={fieldErrors.email}
          >
            <TextInput
              id="helpers-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              aria-required="true"
              error={Boolean(fieldErrors.email)}
              value={values.email}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
          </Field>

          <Field
            label={`${FIELD_LABELS.telephone} (required)`}
            htmlFor="helpers-telephone"
            error={fieldErrors.telephone}
          >
            <TextInput
              id="helpers-telephone"
              name="telephone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
              aria-required="true"
              error={Boolean(fieldErrors.telephone)}
              value={values.telephone}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  telephone: event.target.value,
                }))
              }
            />
          </Field>

          <Field
            label={`${FIELD_LABELS.postalCode} (required)`}
            htmlFor="helpers-postal-code"
            error={fieldErrors.postalCode}
          >
            <TextInput
              id="helpers-postal-code"
              name="postalCode"
              autoComplete="postal-code"
              inputMode="text"
              maxLength={7}
              spellCheck={false}
              placeholder={POSTAL_PLACEHOLDER}
              required
              aria-required="true"
              error={Boolean(fieldErrors.postalCode)}
              value={values.postalCode}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  postalCode: maskPostalCode(event.target.value),
                }))
              }
            />
          </Field>
        </section>

        <section
          className="helpers-form-section"
          aria-labelledby="helpers-interests-heading"
        >
          <h2 id="helpers-interests-heading" className="helpers-form-heading">
            02 Experience and interests
          </h2>

          <fieldset className="helpers-fieldset">
            <legend>{INTEREST_QUESTION}</legend>
            <p className="field-hint">{INTEREST_HELPER_TEXT}</p>
            {fieldErrors.interestKeys ? (
              <span className="field-error" id="helpers-interests-error">
                {fieldErrors.interestKeys}
              </span>
            ) : null}
            <div className="helpers-checkbox-column">
              {INTEREST_OPTIONS.map((option) => (
                <Checkbox
                  key={option.key}
                  id={`helpers-interest-${option.key}`}
                  name="interestKeys"
                  value={option.key}
                  label={option.label}
                  checked={values.interestKeys.includes(option.key)}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      interestKeys: toggleKey(
                        current.interestKeys,
                        option.key,
                        event.target.checked,
                      ),
                    }))
                  }
                />
              ))}
            </div>
          </fieldset>

          <Field
            label={`${FIELD_LABELS.experienceText} (required)`}
            htmlFor="helpers-experience-text"
            hint={EXPERIENCE_SUPPORTING}
            error={fieldErrors.experienceText}
          >
            <TextArea
              id="helpers-experience-text"
              name="experienceText"
              required
              aria-required="true"
              maxLength={5000}
              error={Boolean(fieldErrors.experienceText)}
              value={values.experienceText}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  experienceText: event.target.value,
                }))
              }
            />
          </Field>

          <Field
            label={`${FIELD_LABELS.motivationText} (required)`}
            htmlFor="helpers-motivation-text"
            error={fieldErrors.motivationText}
          >
            <TextArea
              id="helpers-motivation-text"
              name="motivationText"
              required
              aria-required="true"
              maxLength={5000}
              error={Boolean(fieldErrors.motivationText)}
              value={values.motivationText}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  motivationText: event.target.value,
                }))
              }
            />
          </Field>
        </section>

        <section
          className="helpers-form-section"
          aria-labelledby="helpers-availability-heading"
        >
          <h2
            id="helpers-availability-heading"
            className="helpers-form-heading"
          >
            03 Availability and practical details
          </h2>

          <fieldset className="helpers-fieldset">
            <legend>{FIELD_LABELS.availableDays}</legend>
            {fieldErrors.availableDays ? (
              <span className="field-error">{fieldErrors.availableDays}</span>
            ) : null}
            <div className="helpers-checkbox-column">
              {AVAILABLE_DAY_OPTIONS.map((option) => (
                <Checkbox
                  key={option.key}
                  id={`helpers-day-${option.key}`}
                  name="availableDays"
                  value={option.key}
                  label={option.label}
                  checked={values.availableDays.includes(option.key)}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      availableDays: toggleKey(
                        current.availableDays,
                        option.key,
                        event.target.checked,
                      ),
                    }))
                  }
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="helpers-fieldset">
            <legend>{FIELD_LABELS.preferredTimeBlocks}</legend>
            {fieldErrors.preferredTimeBlocks ? (
              <span className="field-error">
                {fieldErrors.preferredTimeBlocks}
              </span>
            ) : null}
            <div className="helpers-checkbox-column">
              {PREFERRED_TIME_OPTIONS.map((option) => (
                <Checkbox
                  key={option.key}
                  id={`helpers-time-${option.key}`}
                  name="preferredTimeBlocks"
                  value={option.key}
                  label={option.label}
                  checked={values.preferredTimeBlocks.includes(option.key)}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      preferredTimeBlocks: toggleKey(
                        current.preferredTimeBlocks,
                        option.key,
                        event.target.checked,
                      ),
                    }))
                  }
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="helpers-fieldset">
            <legend>{FIELD_LABELS.preferredWeeklyHours}</legend>
            <p className="field-hint">{WEEKLY_HOURS_HELPER_TEXT}</p>
            {fieldErrors.preferredWeeklyHours ? (
              <span className="field-error">
                {fieldErrors.preferredWeeklyHours}
              </span>
            ) : null}
            <div className="helpers-checkbox-column">
              {WEEKLY_HOURS_OPTIONS.map((option) => (
                <label
                  key={option.key}
                  className="checkbox-label"
                  htmlFor={`helpers-hours-${option.key}`}
                >
                  <input
                    type="radio"
                    className="checkbox"
                    id={`helpers-hours-${option.key}`}
                    name="preferredWeeklyHours"
                    value={option.key}
                    checked={values.preferredWeeklyHours === option.key}
                    onChange={() =>
                      setValues((current) => ({
                        ...current,
                        preferredWeeklyHours: option.key,
                      }))
                    }
                  />
                  <span className="checkbox-content">
                    <span className="checkbox-text">{option.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="helpers-fieldset">
            <legend>Please confirm</legend>
            <p className="field-hint">{VEHICLE_REQUIREMENT_TEXT}</p>
            <p className="field-hint">{SCREENING_ACK_HELPER_TEXT}</p>
            <div className="helpers-checkbox-column helpers-confirmations">
              <Checkbox
                id="helpers-age-18"
                name="age18Confirmed"
                label={`${FIELD_LABELS.age18Confirmed} (required)`}
                checked={values.age18Confirmed}
                required
                aria-required="true"
                aria-invalid={fieldErrors.age18Confirmed ? true : undefined}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    age18Confirmed: event.target.checked,
                  }))
                }
              />
              {fieldErrors.age18Confirmed ? (
                <span className="field-error">{fieldErrors.age18Confirmed}</span>
              ) : null}

              <Checkbox
                id="helpers-work-eligible"
                name="workEligibleCanada"
                label={`${FIELD_LABELS.workEligibleCanada} (required)`}
                checked={values.workEligibleCanada}
                required
                aria-required="true"
                aria-invalid={
                  fieldErrors.workEligibleCanada ? true : undefined
                }
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    workEligibleCanada: event.target.checked,
                  }))
                }
              />
              {fieldErrors.workEligibleCanada ? (
                <span className="field-error">
                  {fieldErrors.workEligibleCanada}
                </span>
              ) : null}

              <Checkbox
                id="helpers-own-vehicle"
                name="hasOwnVehicle"
                label={`${FIELD_LABELS.hasOwnVehicle} (required)`}
                checked={values.hasOwnVehicle}
                required
                aria-required="true"
                aria-invalid={fieldErrors.hasOwnVehicle ? true : undefined}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    hasOwnVehicle: event.target.checked,
                  }))
                }
              />
              {fieldErrors.hasOwnVehicle ? (
                <span className="field-error">{fieldErrors.hasOwnVehicle}</span>
              ) : null}

              <Checkbox
                id="helpers-screening-ack"
                name="screeningAcknowledgement"
                label={`${FIELD_LABELS.screeningAcknowledgement} (required)`}
                checked={values.screeningAcknowledgement}
                required
                aria-required="true"
                aria-invalid={
                  fieldErrors.screeningAcknowledgement ? true : undefined
                }
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    screeningAcknowledgement: event.target.checked,
                  }))
                }
              />
              {fieldErrors.screeningAcknowledgement ? (
                <span className="field-error">
                  {fieldErrors.screeningAcknowledgement}
                </span>
              ) : null}
            </div>
          </fieldset>
        </section>

        <section
          className="helpers-form-section"
          aria-labelledby="helpers-document-heading"
        >
          <h2 id="helpers-document-heading" className="helpers-form-heading">
            04 Details of Experience and Qualifications
          </h2>
          <p>{DOCUMENT_ATTACH_COPY}</p>
          <Field
            label={`${FIELD_LABELS.document} (required, PDF or DOCX)`}
            htmlFor="helpers-document"
            error={fieldErrors.document}
            hint={
              documentFile
                ? `Selected: ${documentFile.name}`
                : documentClearedHint
                  ? HELPERS_ERRORS.documentReselect
                  : "Maximum 5 MB. You can replace the selected file before submitting."
            }
          >
            <input
              id="helpers-document"
              name="document"
              type="file"
              className="helpers-file-input"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              required
              aria-required="true"
              aria-invalid={fieldErrors.document ? true : undefined}
              onChange={(event) => {
                const next = event.target.files?.[0] ?? null;
                setDocumentFile(next);
                setDocumentClearedHint(false);
                setFieldErrors((current) => {
                  if (!current.document) {
                    return current;
                  }
                  const { document: _removed, ...rest } = current;
                  return rest;
                });
              }}
            />
          </Field>
        </section>

        <section
          className="helpers-form-section"
          aria-labelledby="helpers-consent-heading"
        >
          <h2 id="helpers-consent-heading" className="helpers-form-heading">
            05 Consent and submission
          </h2>

          <div className="helpers-consents">
            <Checkbox
              id="helpers-application-consent"
              name="applicationConsent"
              label={`${APPLICATION_CONSENT_LABEL} (required)`}
              checked={values.applicationConsent}
              required
              aria-required="true"
              aria-invalid={fieldErrors.applicationConsent ? true : undefined}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  applicationConsent: event.target.checked,
                }))
              }
            />
            {fieldErrors.applicationConsent ? (
              <span className="field-error">
                {fieldErrors.applicationConsent}
              </span>
            ) : null}

            <Checkbox
              id="helpers-future-consent"
              name="futureOpportunitiesConsent"
              label={FUTURE_OPPORTUNITIES_CONSENT_LABEL}
              checked={values.futureOpportunitiesConsent}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  futureOpportunitiesConsent: event.target.checked,
                }))
              }
            />
          </div>

          <p className="helpers-privacy">
            We store privacy notice version {HELPERS_PRIVACY_POLICY_VERSION} with
            this application. Application consent is separate from optional
            future-opportunity retention.{" "}
            <a className="text-link" href={HELPERS_PRIVACY_ANCHOR}>
              Read the Founding Helper applications notice
            </a>
            .
          </p>

          <Button type="submit" variant="primary" block disabled={submitting}>
            {submitting ? SUBMIT_PENDING_LABEL : SUBMIT_IDLE_LABEL}
          </Button>
        </section>
      </form>
    </Card>
  );
}
