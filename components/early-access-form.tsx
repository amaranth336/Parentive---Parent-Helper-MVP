"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Field,
  Radio,
  RadioGroup,
  TextArea,
  TextInput,
} from "@/components/form";
import {
  EARLY_ACCESS_ERRORS,
  EARLY_ACCESS_SUCCESS_MESSAGE,
  FIELD_LABELS,
  FREQUENCY_OPTIONS,
  FREQUENCY_OTHER_LABEL,
  FREQUENCY_PLANNING_NOTE,
  FREQUENCY_QUESTION,
  MARKETING_CONSENT_LABEL,
  PILOT_CONTACT_CONSENT_LABEL,
  POSTAL_PLACEHOLDER,
  PRIVACY_NOTICE,
  PRIVACY_NOTICE_LINK_LABEL,
  PRIVACY_PATH,
  SERVICE_INTEREST_OPTIONS,
  SERVICE_INTEREST_OTHER_LABEL,
  SERVICE_INTEREST_QUESTION,
  SUBMIT_IDLE_LABEL,
  SUBMIT_PENDING_LABEL,
  type FrequencyKey,
  type ServiceInterestKey,
} from "@/lib/early-access/copy";
import { isVerifiedEarlyAccessSuccess } from "@/lib/early-access/response";
import { maskPostalCode, validateEarlyAccessInput } from "@/lib/early-access/validation";

const FIELD_FOCUS_ORDER = [
  "firstName",
  "email",
  "postalCode",
  "serviceInterests",
  "serviceInterestOther",
  "frequency",
  "frequencyOther",
  "pilotContactConsent",
  "marketingConsent",
] as const;

const FIELD_CONTROL_IDS: Record<(typeof FIELD_FOCUS_ORDER)[number], string> = {
  firstName: "early-access-first-name",
  email: "early-access-email",
  postalCode: "early-access-postal-code",
  serviceInterests: "early-access-interest-home_laundry",
  serviceInterestOther: "early-access-service-interest-other",
  frequency: "early-access-frequency-one_time",
  frequencyOther: "early-access-frequency-other",
  pilotContactConsent: "early-access-pilot-consent",
  marketingConsent: "early-access-marketing-consent",
};

type FormValues = {
  firstName: string;
  email: string;
  postalCode: string;
  serviceInterests: ServiceInterestKey[];
  serviceInterestOther: string;
  frequency: FrequencyKey | "";
  frequencyOther: string;
  pilotContactConsent: boolean;
  marketingConsent: boolean;
};

const EMPTY_VALUES: FormValues = {
  firstName: "",
  email: "",
  postalCode: "",
  serviceInterests: [],
  serviceInterestOther: "",
  frequency: "",
  frequencyOther: "",
  pilotContactConsent: false,
  marketingConsent: false,
};

function toggleInterest(
  current: ServiceInterestKey[],
  key: ServiceInterestKey,
  checked: boolean,
): ServiceInterestKey[] {
  if (checked) {
    return current.includes(key) ? current : [...current, key];
  }

  return current.filter((item) => item !== key);
}

export function EarlyAccessForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);
  const [focusTarget, setFocusTarget] = useState<"error" | "success" | null>(null);

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

  const otherInterestSelected = values.serviceInterests.includes("other_support");
  const otherFrequencySelected = values.frequency === "other";

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

    const payload = {
      firstName: values.firstName,
      email: values.email,
      postalCode: values.postalCode,
      serviceInterests: values.serviceInterests,
      serviceInterestOther: values.serviceInterestOther,
      frequency: values.frequency || null,
      frequencyOther: values.frequencyOther,
      pilotContactConsent: values.pilotContactConsent,
      marketingConsent: values.marketingConsent,
    };

    const clientResult = validateEarlyAccessInput(payload);
    if (!clientResult.ok) {
      setFieldErrors(clientResult.fieldErrors);
      setFormError(EARLY_ACCESS_ERRORS.validation);
      submittingRef.current = false;
      setSubmitting(false);
      setFocusTarget("error");
      return;
    }

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: unknown = await response.json();

      if (isVerifiedEarlyAccessSuccess(response.ok, data)) {
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
        typeof body.error === "string" ? body.error : EARLY_ACCESS_ERRORS.unexpected,
      );
    } catch {
      setFormError(EARLY_ACCESS_ERRORS.unexpected);
    }

    submittingRef.current = false;
    setSubmitting(false);
    setFocusTarget("error");
  }

  if (success) {
    return (
      <Card>
        <div
          ref={successRef}
          id="early-access-success"
          tabIndex={-1}
        >
          <Alert variant="success">{EARLY_ACCESS_SUCCESS_MESSAGE}</Alert>
        </div>
      </Card>
    );
  }

  const showErrorSummary = Boolean(formError || Object.keys(fieldErrors).length);

  return (
    <Card>
      <form className="early-access-form" noValidate onSubmit={onSubmit}>
        {showErrorSummary ? (
          <div
            ref={errorSummaryRef}
            id="early-access-errors"
            tabIndex={-1}
          >
            <Alert variant="error">
              <p>{formError ?? EARLY_ACCESS_ERRORS.validation}</p>
              {Object.keys(fieldErrors).length > 0 ? (
                <ul className="early-access-error-list">
                  {FIELD_FOCUS_ORDER.filter((field) => fieldErrors[field]).map((field) => (
                    <li key={field}>
                      <a href={`#${FIELD_CONTROL_IDS[field]}`}>{fieldErrors[field]}</a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Alert>
          </div>
        ) : null}

        <Field
          label={`${FIELD_LABELS.firstName} (required)`}
          htmlFor="early-access-first-name"
          error={fieldErrors.firstName}
        >
          <TextInput
            id="early-access-first-name"
            name="firstName"
            autoComplete="given-name"
            required
            aria-required="true"
            error={Boolean(fieldErrors.firstName)}
            value={values.firstName}
            onChange={(event) =>
              setValues((current) => ({ ...current, firstName: event.target.value }))
            }
          />
        </Field>

        <Field
          label={`${FIELD_LABELS.email} (required)`}
          htmlFor="early-access-email"
          error={fieldErrors.email}
        >
          <TextInput
            id="early-access-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-required="true"
            error={Boolean(fieldErrors.email)}
            value={values.email}
            onChange={(event) =>
              setValues((current) => ({ ...current, email: event.target.value }))
            }
          />
        </Field>

        <Field
          label={`${FIELD_LABELS.postalCode} (required)`}
          htmlFor="early-access-postal-code"
          error={fieldErrors.postalCode}
        >
          <TextInput
            id="early-access-postal-code"
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

        <fieldset className="radio-group early-access-fieldset">
          <legend>{SERVICE_INTEREST_QUESTION}</legend>
          {SERVICE_INTEREST_OPTIONS.map((option) => (
            <Checkbox
              key={option.key}
              id={`early-access-interest-${option.key}`}
              name="serviceInterests"
              value={option.key}
              label={option.label}
              checked={values.serviceInterests.includes(option.key)}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  serviceInterests: toggleInterest(
                    current.serviceInterests,
                    option.key,
                    event.target.checked,
                  ),
                }))
              }
            />
          ))}
        </fieldset>

        {otherInterestSelected ? (
          <Field
            label={SERVICE_INTEREST_OTHER_LABEL}
            htmlFor="early-access-service-interest-other"
            error={fieldErrors.serviceInterestOther}
          >
            <TextArea
              id="early-access-service-interest-other"
              name="serviceInterestOther"
              maxLength={500}
              value={values.serviceInterestOther}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  serviceInterestOther: event.target.value,
                }))
              }
            />
          </Field>
        ) : null}

        <RadioGroup legend={FREQUENCY_QUESTION}>
          {FREQUENCY_OPTIONS.map((option) => (
            <Radio
              key={option.key}
              id={`early-access-frequency-${option.key}`}
              name="frequency"
              value={option.key}
              label={option.label}
              checked={values.frequency === option.key}
              onChange={() =>
                setValues((current) => ({ ...current, frequency: option.key }))
              }
            />
          ))}
        </RadioGroup>
        <p className="field-hint early-access-frequency-note">{FREQUENCY_PLANNING_NOTE}</p>

        {otherFrequencySelected ? (
          <Field
            label={FREQUENCY_OTHER_LABEL}
            htmlFor="early-access-frequency-other"
            error={fieldErrors.frequencyOther}
          >
            <TextInput
              id="early-access-frequency-other"
              name="frequencyOther"
              maxLength={120}
              value={values.frequencyOther}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  frequencyOther: event.target.value,
                }))
              }
            />
          </Field>
        ) : null}

        <div className="early-access-consents">
          <Checkbox
            id="early-access-pilot-consent"
            name="pilotContactConsent"
            label={`${PILOT_CONTACT_CONSENT_LABEL} (required)`}
            checked={values.pilotContactConsent}
            required
            aria-required="true"
            aria-invalid={fieldErrors.pilotContactConsent ? true : undefined}
            aria-describedby={
              fieldErrors.pilotContactConsent
                ? "early-access-pilot-consent-error"
                : undefined
            }
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                pilotContactConsent: event.target.checked,
              }))
            }
          />
          {fieldErrors.pilotContactConsent ? (
            <span className="field-error" id="early-access-pilot-consent-error">
              {fieldErrors.pilotContactConsent}
            </span>
          ) : null}

          <Checkbox
            id="early-access-marketing-consent"
            name="marketingConsent"
            label={MARKETING_CONSENT_LABEL}
            checked={values.marketingConsent}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                marketingConsent: event.target.checked,
              }))
            }
          />
        </div>

        <p className="early-access-privacy">
          {PRIVACY_NOTICE}{" "}
          <a className="text-link" href={PRIVACY_PATH}>
            {PRIVACY_NOTICE_LINK_LABEL}
          </a>
          .
        </p>

        <Button type="submit" variant="primary" block disabled={submitting}>
          {submitting ? SUBMIT_PENDING_LABEL : SUBMIT_IDLE_LABEL}
        </Button>
      </form>
    </Card>
  );
}
