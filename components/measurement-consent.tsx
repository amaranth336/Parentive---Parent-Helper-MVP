"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/form";
import {
  CONSENT_VERSION,
  readStoredConsent,
  writeStoredConsent,
  type MeasurementConsent,
} from "@/lib/analytics/consent";
import { MEASUREMENT_PRIVACY_HREF, MEASUREMENT_UI } from "@/lib/analytics/copy";
import { applyMeasurementConsent } from "@/lib/analytics/track";
import { MeasurementTracker } from "@/components/measurement-tracker";

type MeasurementContextValue = {
  ready: boolean;
  consent: MeasurementConsent | null;
  dialogOpen: boolean;
  openChoices: () => void;
  closeChoices: () => void;
  save: (consent: MeasurementConsent) => void;
};

const MeasurementContext = createContext<MeasurementContextValue | null>(null);

function useMeasurement(): MeasurementContextValue {
  const value = useContext(MeasurementContext);
  if (!value) {
    throw new Error("Privacy choices are rendered inside MeasurementRoot");
  }
  return value;
}

export function MeasurementRoot({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<MeasurementConsent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setConsent(readStoredConsent(window.localStorage));
    setReady(true);
  }, []);

  function save(next: MeasurementConsent) {
    writeStoredConsent(window.localStorage, next);
    applyMeasurementConsent(next);
    setConsent(next);
    setDialogOpen(false);
  }

  function openChoices() {
    if (!consent) {
      const banner = document.getElementById("measurement-banner");
      banner?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      banner?.focus();
      return;
    }
    setDialogOpen(true);
  }

  return (
    <MeasurementContext.Provider
      value={{
        ready,
        consent,
        dialogOpen,
        openChoices,
        closeChoices: () => setDialogOpen(false),
        save,
      }}
    >
      {children}
      <MeasurementTracker consent={consent} ready={ready} />
    </MeasurementContext.Provider>
  );
}

export function MeasurementBanner() {
  const { ready, consent, dialogOpen, closeChoices, save } = useMeasurement();
  if (!ready) return null;
  return (
    <MeasurementPanel
      consent={consent}
      dialogOpen={dialogOpen}
      onClose={closeChoices}
      onSave={save}
    />
  );
}

export function PrivacyChoicesButton() {
  const { openChoices } = useMeasurement();
  return (
    <button type="button" className="site-footer-choice" onClick={openChoices}>
      {MEASUREMENT_UI.footerLabel}
    </button>
  );
}

function MeasurementActions({
  onSave,
}: {
  onSave: (consent: MeasurementConsent) => void;
}) {
  return (
    <>
      <div className="measurement-actions">
        <Button
          type="button"
          onClick={() =>
            onSave({ analytics: true, advertising: true, version: CONSENT_VERSION })
          }
        >
          {MEASUREMENT_UI.acceptCookies}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            onSave({ analytics: false, advertising: false, version: CONSENT_VERSION })
          }
        >
          {MEASUREMENT_UI.rejectCookies}
        </Button>
      </div>
      <p className="measurement-note">
        <a className="text-link" href={MEASUREMENT_PRIVACY_HREF}>
          {MEASUREMENT_UI.privacyLink}
        </a>
      </p>
    </>
  );
}

function MeasurementPanel({
  consent,
  dialogOpen,
  onClose,
  onSave,
}: {
  consent: MeasurementConsent | null;
  dialogOpen: boolean;
  onClose: () => void;
  onSave: (consent: MeasurementConsent) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (dialogOpen && !dialog.open) dialog.showModal();
    if (!dialogOpen && dialog.open) dialog.close();
  }, [dialogOpen]);

  if (!consent && !dialogOpen) {
    return (
      <section
        id="measurement-banner"
        className="measurement-banner"
        aria-labelledby="measurement-banner-heading"
        tabIndex={-1}
      >
        <div className="measurement-panel">
          <h2 id="measurement-banner-heading">{MEASUREMENT_UI.heading}</h2>
          <p>{MEASUREMENT_UI.body}</p>
          <MeasurementActions onSave={onSave} />
        </div>
      </section>
    );
  }

  return (
    <dialog
      ref={dialogRef}
      className="measurement-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
    >
      <div className="measurement-panel">
        <h2 id={titleId}>{MEASUREMENT_UI.dialogLabel}</h2>
        <p>{MEASUREMENT_UI.body}</p>
        <MeasurementActions onSave={onSave} />
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          {MEASUREMENT_UI.closeLabel}
        </button>
      </div>
    </dialog>
  );
}
