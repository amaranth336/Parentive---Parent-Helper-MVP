"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Alert, Button, Field, Select, TextArea, TextInput } from "@/components/form";
import familyPhoto from "@/public/images/home/home-2nd-father-homework-with-children.png";
import heroPhoto from "@/public/images/home/home-hero-mother-reading-with-children.png";
import kitchenPhoto from "@/public/images/helpers/helpers-midpage-meal-prep.png";
import laundryPhoto from "@/public/images/helpers/helpers-hero-laundry.png";
import {
  catalogue,
  formatServiceDollars,
  type CatalogueCategory,
  type CatalogueService,
  type CategoryId,
  type ServiceId,
} from "@/lib/our-support/catalogue";
import {
  ADD_LABEL,
  BELOW_MINIMUM_QUOTE_NOTE,
  BOOKING_NOTES_LABEL,
  EMAIL_LABEL,
  FLEXIBLE_LABEL,
  FLEXIBLE_PLACEHOLDER,
  HERO_BODY,
  HERO_DECK,
  HERO_HEADLINE,
  HERO_PRIMARY,
  HERO_SECONDARY,
  NAME_LABEL,
  NOTES_LABEL,
  PORTAL_HEADING,
  PORTAL_NOTE,
  POSTAL_LABEL,
  POSTAL_PLACEHOLDER,
  PREFERENCES_BODY,
  PREFERENCES_HEADING,
  PRICING_NOTE,
  PRIVACY_LINK_LABEL,
  PRIVACY_NOTE,
  PRIVACY_PATH,
  QUOTE_ONLY_LABEL,
  QUOTE_SEPARATE_LABEL,
  RECURRING_LABEL,
  RECURRING_NOTE,
  RECURRING_PLACEHOLDER,
  REMOVE_LABEL,
  REQUEST_EYEBROW,
  REQUEST_INTRO,
  REQUEST_NOTICE,
  REQUEST_TITLE,
  SUBMIT_LABEL,
  SUBMIT_PENDING_LABEL,
  SUBTOTAL_LABEL,
  SUCCESS_HEADING,
  SUCCESS_MESSAGE,
  TIMES_LABEL,
  VISIT_ERRORS,
  VISIT_HEADING,
  VISIT_STEPS,
  VISIT_TYPE_LABEL,
  VISIT_TYPE_OPTIONS,
} from "@/lib/our-support/copy";
import { isVerifiedVisitRequestSuccess } from "@/lib/our-support/response";
import {
  removeService,
  selectionIncludesFlexible,
  summarizeSelection,
  toggleService,
  type VisitType,
} from "@/lib/our-support/selection";
import { maskPostalCode } from "@/lib/early-access/validation";
import {
  selectionBlockers,
  validateVisitRequestInput,
} from "@/lib/our-support/validation";

const CATEGORY_IMAGES: Record<CategoryId, StaticImageData> = {
  "home-laundry": laundryPhoto,
  "kitchen-food": kitchenPhoto,
  "family-support": familyPhoto,
};

const FIELD_ORDER = [
  "services",
  "flexibleDescription",
  "visitType",
  "recurringPreferences",
  "name",
  "email",
  "postalCode",
  "preferredTimes",
  "helperNotes",
] as const;

type FormField = (typeof FIELD_ORDER)[number];

const FIELD_IDS: Record<Exclude<FormField, "services">, string> = {
  flexibleDescription: "visit-flexible",
  visitType: "visit-type",
  recurringPreferences: "visit-recurring",
  name: "visit-name",
  email: "visit-email",
  postalCode: "visit-postal",
  preferredTimes: "visit-times",
  helperNotes: "visit-notes",
};

export function OurSupportExperience() {
  const [selected, setSelected] = useState<ServiceId[]>([]);
  const [visitType, setVisitType] = useState<VisitType>("one-time");
  const [recurringPreferences, setRecurringPreferences] = useState("");
  const [flexibleDescription, setFlexibleDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [preferredTimes, setPreferredTimes] = useState("");
  const [helperNotes, setHelperNotes] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusTarget, setFocusTarget] = useState<"error" | "success" | null>(null);
  const submittingRef = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const summary = summarizeSelection(selected, visitType);
  const flexibleSelected = selectionIncludesFlexible(selected);
  const blockers = selectionBlockers(summary, visitType, flexibleDescription);

  useEffect(() => {
    if (focusTarget === "success") {
      successRef.current?.focus();
      setFocusTarget(null);
      return;
    }
    if (focusTarget === "error") {
      if (errorRef.current) {
        errorRef.current.focus();
      }
      setFocusTarget(null);
    }
  }, [focusTarget]);

  function toggle(id: ServiceId) {
    setSelected((current) => toggleService(current, id));
  }

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

    const payload: Record<string, unknown> = {
      name,
      email,
      postalCode,
      preferredTimes,
      helperNotes,
      visitType,
      serviceIds: selected,
      subtotalCents: summary.subtotalCents,
      companyWebsite,
    };
    if (visitType === "recurring") {
      payload.recurringPreferences = recurringPreferences;
    }
    if (flexibleSelected) {
      payload.flexibleDescription = flexibleDescription;
    }

    const clientResult = validateVisitRequestInput(payload);
    if (!clientResult.ok) {
      setFieldErrors(clientResult.fieldErrors);
      setFormError(VISIT_ERRORS.validation);
      submittingRef.current = false;
      setSubmitting(false);
      setFocusTarget("error");
      return;
    }

    try {
      const response = await fetch("/api/our-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: unknown = await response.json();
      if (isVerifiedVisitRequestSuccess(response.ok, data)) {
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
        typeof body.error === "string" ? body.error : VISIT_ERRORS.unexpected,
      );
    } catch {
      setFormError(VISIT_ERRORS.unexpected);
    }

    submittingRef.current = false;
    setSubmitting(false);
    setFocusTarget("error");
  }

  return (
    <main
      id="main-content"
      className={`our-support${summary.shortcutVisible ? " has-selection" : ""}`}
    >
      <div className="our-support-inner">
        <section className="support-hero" aria-labelledby="support-hero-heading">
          <div className="support-hero-copy">
            <h1 id="support-hero-heading">{HERO_HEADLINE}</h1>
            <p className="support-deck">{HERO_DECK}</p>
            <p>{HERO_BODY}</p>
            <div className="support-hero-actions">
              <a className="btn btn-primary" href="#home-laundry">
                {HERO_PRIMARY}
              </a>
              <a className="btn btn-secondary" href="#your-helper-visit">
                {HERO_SECONDARY}
              </a>
            </div>
          </div>
          <figure className="support-hero-photo">
            <Image
              src={heroPhoto}
              alt="Mother reading a picture book with two young children and a dog on a living room rug"
              fill
              priority
              sizes="(max-width: 800px) calc(100vw - 40px), 420px"
              className="support-photo-image support-photo-hero"
            />
          </figure>
        </section>

        <nav className="support-jumps" aria-label="Support categories">
          {catalogue.map((category) => (
            <a key={category.id} href={`#${category.id}`}>
              {category.name}
            </a>
          ))}
        </nav>

        {catalogue.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            selected={selected}
            onToggle={toggle}
          />
        ))}

        <section className="support-visit" id="your-helper-visit" aria-labelledby="support-visit-heading">
          <h2 id="support-visit-heading">{VISIT_HEADING}</h2>
          <ol className="support-steps">
            {VISIT_STEPS.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="support-preferences" aria-labelledby="support-preferences-heading">
          <h2 id="support-preferences-heading">{PREFERENCES_HEADING}</h2>
          <p>{PREFERENCES_BODY}</p>
        </section>

        <section className="support-request" id="request-cart" aria-labelledby="support-request-heading">
          <p className="support-eyebrow">{REQUEST_EYEBROW}</p>
          <h2 id="support-request-heading">{REQUEST_TITLE}</h2>
          <p>{REQUEST_INTRO}</p>

          {success ? (
            <div className="support-success">
              <h3 ref={successRef} tabIndex={-1}>
                {SUCCESS_HEADING}
              </h3>
              <Alert variant="success">{SUCCESS_MESSAGE}</Alert>
            </div>
          ) : (
            <form className="support-form" onSubmit={onSubmit} noValidate>
              <div className="support-cart" aria-live="polite">
                <h3>Your request</h3>
                {summary.lines.length === 0 ? (
                  <p>Nothing is selected yet. Check a service above to add it here.</p>
                ) : (
                  <ul className="support-cart-list">
                    {summary.lines.map((line) => (
                      <li key={line.id}>
                        <span>{line.name}</span>
                        <span className="support-cart-price">
                          {line.priceCents === null
                            ? "Quoted separately"
                            : formatServiceDollars(line.priceCents)}
                        </span>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          aria-label={`${REMOVE_LABEL} ${line.name}`}
                          onClick={() =>
                            setSelected((current) => removeService(current, line.id))
                          }
                        >
                          {REMOVE_LABEL}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {summary.count === 0 ? null : summary.quoteRequired && summary.subtotalCents === 0 ? (
                  <p className="support-subtotal">{QUOTE_ONLY_LABEL}</p>
                ) : (
                  <p className="support-subtotal">
                    {SUBTOTAL_LABEL}{" "}
                    <strong>{formatServiceDollars(summary.subtotalCents)}</strong>
                  </p>
                )}
                {summary.quoteRequired && summary.subtotalCents > 0 ? (
                  <p>{QUOTE_SEPARATE_LABEL}</p>
                ) : null}
                <p className="support-pricing-note">{PRICING_NOTE}</p>
                {summary.quoteRequired && summary.fixedBelowMinimum ? (
                  <p>{BELOW_MINIMUM_QUOTE_NOTE}</p>
                ) : null}
                {summary.count > 0 && blockers.services ? (
                  <p className="field-error">{blockers.services}</p>
                ) : null}
              </div>

              {formError ? (
                <div ref={errorRef} tabIndex={-1} className="support-error-summary">
                  <Alert variant="error">{formError}</Alert>
                  {FIELD_ORDER.some((field) => fieldErrors[field]) ? (
                    <ul className="support-error-list">
                      {FIELD_ORDER.filter((field) => fieldErrors[field]).map((field) => (
                        <li key={field}>{fieldErrors[field]}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}

              <Field
                label={VISIT_TYPE_LABEL}
                htmlFor={FIELD_IDS.visitType}
                error={fieldErrors.visitType}
              >
                <Select
                  id={FIELD_IDS.visitType}
                  value={visitType}
                  onChange={(event) =>
                    setVisitType(event.target.value === "recurring" ? "recurring" : "one-time")
                  }
                >
                  {VISIT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <div hidden={visitType !== "recurring"}>
                <Field
                  label={RECURRING_LABEL}
                  htmlFor={FIELD_IDS.recurringPreferences}
                  hint={RECURRING_NOTE}
                  error={fieldErrors.recurringPreferences}
                >
                  <TextArea
                    id={FIELD_IDS.recurringPreferences}
                    value={visitType === "recurring" ? recurringPreferences : ""}
                    placeholder={RECURRING_PLACEHOLDER}
                    disabled={visitType !== "recurring"}
                    rows={4}
                    onChange={(event) => setRecurringPreferences(event.target.value)}
                  />
                </Field>
              </div>

              {flexibleSelected ? (
                <Field
                  label={FLEXIBLE_LABEL}
                  htmlFor={FIELD_IDS.flexibleDescription}
                  error={fieldErrors.flexibleDescription}
                >
                  <TextArea
                    id={FIELD_IDS.flexibleDescription}
                    value={flexibleDescription}
                    placeholder={FLEXIBLE_PLACEHOLDER}
                    rows={4}
                    onChange={(event) => setFlexibleDescription(event.target.value)}
                  />
                </Field>
              ) : null}

              <Field label={NAME_LABEL} htmlFor={FIELD_IDS.name} error={fieldErrors.name}>
                <TextInput
                  id={FIELD_IDS.name}
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Field>
              <Field label={EMAIL_LABEL} htmlFor={FIELD_IDS.email} error={fieldErrors.email}>
                <TextInput
                  id={FIELD_IDS.email}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>
              <Field
                label={POSTAL_LABEL}
                htmlFor={FIELD_IDS.postalCode}
                error={fieldErrors.postalCode}
              >
                <TextInput
                  id={FIELD_IDS.postalCode}
                  name="postal-code"
                  autoComplete="postal-code"
                  inputMode="text"
                  placeholder={POSTAL_PLACEHOLDER}
                  value={postalCode}
                  onChange={(event) => setPostalCode(maskPostalCode(event.target.value))}
                />
              </Field>
              <Field
                label={TIMES_LABEL}
                htmlFor={FIELD_IDS.preferredTimes}
                error={fieldErrors.preferredTimes}
              >
                <TextInput
                  id={FIELD_IDS.preferredTimes}
                  value={preferredTimes}
                  onChange={(event) => setPreferredTimes(event.target.value)}
                />
              </Field>
              <Field
                label={NOTES_LABEL}
                htmlFor={FIELD_IDS.helperNotes}
                error={fieldErrors.helperNotes}
              >
                <TextArea
                  id={FIELD_IDS.helperNotes}
                  value={helperNotes}
                  rows={5}
                  onChange={(event) => setHelperNotes(event.target.value)}
                />
              </Field>

              <p className="support-privacy">
                {PRIVACY_NOTE}{" "}
                <Link href={PRIVACY_PATH} className="text-link">
                  {PRIVACY_LINK_LABEL}
                </Link>
                .
              </p>
              <p className="support-notice">{REQUEST_NOTICE}</p>

              <div className="support-honeypot" aria-hidden="true">
                <label htmlFor="visit-company">Company website</label>
                <input
                  id="visit-company"
                  name="companyWebsite"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={companyWebsite}
                  onChange={(event) => setCompanyWebsite(event.target.value)}
                />
              </div>

              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? SUBMIT_PENDING_LABEL : SUBMIT_LABEL}
              </Button>
            </form>
          )}

          <div className="support-portal">
            <h2>{PORTAL_HEADING}</h2>
            <p>{PORTAL_NOTE}</p>
          </div>
        </section>
      </div>

      {summary.shortcutVisible ? (
        <a className="support-shortcut" href="#request-cart">
          <span className="support-shortcut-count">
            {summary.count === 1 ? "1 service" : `${summary.count} services`}
          </span>
          <span className="support-shortcut-total">
            {summary.quoteRequired && summary.subtotalCents === 0
              ? "Quoted separately"
              : summary.quoteRequired
                ? `${formatServiceDollars(summary.subtotalCents)} plus a separate quote`
                : formatServiceDollars(summary.subtotalCents)}
          </span>
        </a>
      ) : null}
    </main>
  );
}

function CategorySection({
  category,
  selected,
  onToggle,
}: {
  category: CatalogueCategory;
  selected: readonly ServiceId[];
  onToggle: (id: ServiceId) => void;
}) {
  return (
    <section
      id={category.id}
      className="support-category"
      aria-labelledby={`${category.id}-heading`}
    >
      <div className="support-category-copy">
        <h2 id={`${category.id}-heading`}>{category.name}</h2>
        <p className="support-tag">{category.tag}</p>
        <p>{category.intro}</p>
      </div>
      <figure className="support-category-photo">
        <Image
          src={CATEGORY_IMAGES[category.id]}
          alt={category.imageAlt}
          fill
          sizes="(max-width: 800px) calc(100vw - 40px), 960px"
          className="support-photo-image"
        />
      </figure>
      <div className="support-catalogue">
        {category.items.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            shape={index % 4}
            checked={selected.includes(service.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  shape,
  checked,
  onToggle,
}: {
  service: CatalogueService;
  shape: number;
  checked: boolean;
  onToggle: (id: ServiceId) => void;
}) {
  const inputId = `add-${service.id}`;
  return (
    <article
      className={`service-card${checked ? " is-selected" : ""}`}
      data-service-id={service.id}
    >
      <div className="service-heading">
        <span className="service-icon">
          <Image
            src={`/images/our-support/icons/${service.icon}.svg`}
            alt=""
            width={64}
            height={64}
            unoptimized
          />
        </span>
        <div className="service-heading-copy">
          <h3 className="service-name" id={`${service.id}-name`}>
            {service.name}
          </h3>
          {service.priceCents !== null ? (
            <p className="service-price">{formatServiceDollars(service.priceCents)}</p>
          ) : null}
        </div>
      </div>
      <p className={`service-tagline shape-${shape}`}>
        <span>{service.tagline}</span>
      </p>
      <p className="service-copy">{service.copy}</p>
      {service.visibleNote ? (
        <p className="service-essential">{service.visibleNote}</p>
      ) : (
        <div className="service-essential" aria-hidden="true" />
      )}
      {service.note ? (
        <details className="service-notes">
          <summary>{BOOKING_NOTES_LABEL}</summary>
          <p>{service.note}</p>
        </details>
      ) : (
        <div className="service-notes" aria-hidden="true" />
      )}
      <label className="service-add" htmlFor={inputId}>
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(service.id)}
        />
        <span>{ADD_LABEL}</span>
      </label>
    </article>
  );
}
