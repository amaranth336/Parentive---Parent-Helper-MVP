import type { Metadata } from "next";
import Image from "next/image";
import { BrandLockup } from "@/components/brand-lockup";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Field,
  Radio,
  RadioGroup,
  Select,
  TextArea,
  TextInput,
} from "@/components/form";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Parentive design system",
  robots: { index: false, follow: false },
};

const brandColours = [
  {
    name: "Deep Moss",
    hex: "#30483B",
    tokens: "--brand, --text",
  },
  {
    name: "Soft Sage",
    hex: "#AEBBA6",
    tokens: "--brand-muted",
  },
  {
    name: "Oat",
    hex: "#F5F2EA",
    tokens: "--bg-soft, --panel-muted",
  },
  {
    name: "Warm Sand",
    hex: "#E7DECF",
    tokens: "--border",
  },
  {
    name: "Walnut",
    hex: "#594B41",
    tokens: "--text-muted",
  },
  {
    name: "Muted Honey",
    hex: "#D5A552",
    tokens: "--accent",
  },
  {
    name: "Cream",
    hex: "#FBF8F2",
    tokens: "--bg, --panel",
  },
] as const;

const functionalColours = [
  { name: "Success", hex: "#16a34a", tokens: "--success" },
  { name: "Danger", hex: "#ef4444", tokens: "--danger" },
] as const;

export default function DesignSystemPage() {
  return (
    <main id="main-content" className="page">
      <h1>Design system</h1>
      <p>Internal review of the Parentive v2 coded foundation.</p>

      <section className="ds-block" aria-labelledby="ds-identity">
        <h2 id="ds-identity">Identity</h2>
        <p className="ds-note">
          Official lockup, mark, and wordmark files only. The lockup PNG keeps
          its opaque light square behind the mark.
        </p>
        <div className="ds-identity-row">
          <div className="ds-identity-item">
            <BrandLockup href={null} priority />
            <span className="ds-identity-caption">Lockup</span>
          </div>
          <div className="ds-identity-item">
            <Image
              src="/brand/parentive-mark.png"
              alt="Parentive mark"
              width={1200}
              height={1200}
              className="ds-mark-image"
            />
            <span className="ds-identity-caption">Mark</span>
          </div>
          <div className="ds-identity-item">
            <div className="ds-identity-panel">
              <Image
                src="/brand/parentive-wordmark.png"
                alt="Parentive wordmark"
                width={1181}
                height={268}
                className="ds-wordmark-image"
              />
            </div>
            <span className="ds-identity-caption">
              Wordmark, shown on Oat because the official file is transparent
            </span>
          </div>
        </div>
      </section>

      <section className="ds-block" aria-labelledby="ds-palette">
        <h2 id="ds-palette">Palette</h2>
        <p className="ds-note">
          Muted Honey is punctuation, never a fill. Soft Sage is for tints, not
          small text. Success and danger stay functional and separate from the
          brand palette.
        </p>
        <div className="ds-swatch-grid">
          {brandColours.map((colour) => (
            <div className="ds-swatch" key={colour.hex}>
              <div
                className="ds-swatch-chip"
                style={{ background: colour.hex }}
              />
              <div className="ds-swatch-meta">
                <strong>{colour.name}</strong>
                {colour.hex}
                <br />
                {colour.tokens}
              </div>
            </div>
          ))}
        </div>
        <h3>Functional status</h3>
        <div className="ds-swatch-grid">
          {functionalColours.map((colour) => (
            <div className="ds-swatch" key={colour.hex}>
              <div
                className="ds-swatch-chip"
                style={{ background: colour.hex }}
              />
              <div className="ds-swatch-meta">
                <strong>{colour.name}</strong>
                {colour.hex}
                <br />
                {colour.tokens}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ds-block" aria-labelledby="ds-type">
        <h2 id="ds-type">Typography</h2>
        <p className="ds-note">
          Manrope for headings, Inter for body and UI. Loaded weights are
          400, 500, and 600.
        </p>
        <p
          className="ds-type-sample"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "1.25rem",
          }}
        >
          Manrope 400 — Heading sample
        </p>
        <p
          className="ds-type-sample"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "1.25rem",
          }}
        >
          Manrope 500 — Heading sample
        </p>
        <p
          className="ds-type-sample"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "1.25rem",
          }}
        >
          Manrope 600 — Heading sample
        </p>
        <p
          className="ds-type-sample"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "1.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          Page heading <span className="ds-type-meta">h1 / Manrope 600</span>
        </p>
        <p
          className="ds-type-sample"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "1.25rem",
            letterSpacing: "-0.01em",
          }}
        >
          Section heading <span className="ds-type-meta">h2 / Manrope 600</span>
        </p>
        <p
          className="ds-type-sample"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "1.0625rem",
          }}
        >
          Subheading <span className="ds-type-meta">h3 / Manrope 500</span>
        </p>
        <p
          className="ds-type-sample"
          style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
        >
          Inter 400 — Body text for interface reading.
        </p>
        <p
          className="ds-type-sample"
          style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
        >
          Inter 500 — Body text for interface reading.
        </p>
        <p
          className="ds-type-sample"
          style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}
        >
          Inter 600 — Body text for interface reading.
        </p>
      </section>

      <section className="ds-block" aria-labelledby="ds-buttons">
        <h2 id="ds-buttons">Buttons and links</h2>
        <p className="ds-note">
          Primary actions use Deep Moss. Honey is not used as a button fill.
        </p>
        <div className="ds-stack">
          <Button type="button">Primary</Button>
          <Button type="button" variant="secondary">
            Secondary
          </Button>
          <Button type="button" variant="ghost">
            Ghost
          </Button>
          <Button type="button" size="sm">
            Small
          </Button>
          <Button type="button" disabled>
            Disabled
          </Button>
          <Button type="button" variant="secondary" aria-disabled="true">
            Unavailable
          </Button>
          <a href="#main-content" className="text-link">
            Text link
          </a>
        </div>
        <div className="ds-stack-col" style={{ marginTop: 16 }}>
          <Button type="button" block>
            Block primary
          </Button>
        </div>
      </section>

      <section className="ds-block" aria-labelledby="ds-forms">
        <h2 id="ds-forms">Form controls</h2>
        <Card>
          <Field label="Display name" htmlFor="ds-name" hint="Shown on your profile.">
            <TextInput id="ds-name" name="displayName" autoComplete="off" />
          </Field>
          <Field
            label="Notes"
            htmlFor="ds-notes"
            error="Enter a short note to continue."
          >
            <TextArea
              id="ds-notes"
              name="notes"
              error
              defaultValue=""
            />
          </Field>
          <Field label="Preferred day" htmlFor="ds-day">
            <Select id="ds-day" name="preferredDay" defaultValue="">
              <option value="" disabled>
                Choose one
              </option>
              <option value="weekday">Weekday</option>
              <option value="weekend">Weekend</option>
            </Select>
          </Field>
          <Checkbox
            label="Send email updates"
            hint="You can change this later."
            name="emailUpdates"
          />
          <RadioGroup>
            <Radio
              label="Weekday mornings"
              name="sampleWindow"
              value="mornings"
              defaultChecked
            />
            <Radio
              label="Weekend afternoons"
              name="sampleWindow"
              value="afternoons"
            />
          </RadioGroup>
        </Card>
      </section>

      <section className="ds-block" aria-labelledby="ds-cards">
        <h2 id="ds-cards">Cards and surfaces</h2>
        <div className="ds-surface-grid">
          <Card>
            <h3>Card</h3>
            <p>Cream panel, Warm Sand border, moss-tinted shadow.</p>
          </Card>
          <Card className="card-muted">
            <h3>Muted surface</h3>
            <p>Oat surface using the panel-muted token.</p>
          </Card>
        </div>
      </section>

      <section className="ds-block" aria-labelledby="ds-alerts">
        <h2 id="ds-alerts">Alerts</h2>
        <Alert variant="info">A short informational note.</Alert>
        <Alert variant="warning">A warning that uses Honey as a tint only.</Alert>
        <Alert variant="error">An error that needs a correction.</Alert>
        <Alert variant="success">A confirmation that the action finished.</Alert>
      </section>

      <section className="ds-block" aria-labelledby="ds-layout">
        <h2 id="ds-layout">Layout rhythm</h2>
        <p className="ds-note">
          .container and .section share --container-max (960px), matching .page.
        </p>
        <div className="ds-layout-demo">
          <div className="container">Container</div>
          <div className="section">Section</div>
        </div>
      </section>

      <section className="ds-block" aria-labelledby="ds-header">
        <h2 id="ds-header">Header</h2>
        <p className="ds-note">
          The live header is at the top of the page. The customer header only
          links available destinations, so Home is the lockup and no extra links
          or menu button appear yet. Narrow the viewport below 640px on the
          specimen below, then use Menu to open the push-down list. Escape
          closes it. Services and Early Access are shown as unavailable, without
          links.
        </p>
        <div className="ds-specimen">
          <SiteHeader previewUnavailable />
        </div>
      </section>

      <section className="ds-block" aria-labelledby="ds-footer">
        <h2 id="ds-footer">Footer</h2>
        <p className="ds-note">
          The live footer is at the bottom of the page. It uses the official
          lockup and the line “Trusted, flexible help for real life.”
        </p>
      </section>
    </main>
  );
}
