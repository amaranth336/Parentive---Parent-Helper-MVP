"use client";

import { useEffect, useRef, useState } from "react";
import type { Metadata } from "next";
import { EarlyAccessForm } from "@/components/early-access-form";
import { Alert, Card } from "@/components/form";
import {
  EARLY_ACCESS_HEADING,
  EARLY_ACCESS_SUPPORTING,
  EARLY_ACCESS_SUCCESS_MESSAGE,
  POST_SUBMIT_CTA_HREF,
  POST_SUBMIT_CTA_LABEL,
  POST_SUBMIT_HEADING,
  POST_SUBMIT_SUPPORTING,
} from "@/lib/early-access/copy";
import {
  formatPilotCommunityList,
  PILOT_COMMUNITIES,
} from "@/lib/service-area/communities";

export default function EarlyAccessPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const postSubmitHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isSubmitted) {
      postSubmitHeadingRef.current?.focus();
    }
  }, [isSubmitted]);

  if (isSubmitted) {
    return (
      <main id="main-content" className="page early-access">
        <h1 ref={postSubmitHeadingRef} tabIndex={-1}>
          {POST_SUBMIT_HEADING}
        </h1>
        <p>{POST_SUBMIT_SUPPORTING}</p>
        <Card>
          <Alert variant="success">{EARLY_ACCESS_SUCCESS_MESSAGE}</Alert>
        </Card>
        <a href={POST_SUBMIT_CTA_HREF} className="btn btn-primary">
          {POST_SUBMIT_CTA_LABEL}
        </a>
      </main>
    );
  }

  return (
    <main id="main-content" className="page early-access">
      <h1>{EARLY_ACCESS_HEADING}</h1>
      <p>{EARLY_ACCESS_SUPPORTING}</p>
      <p className="early-access-communities">
        We are preparing a pilot in {formatPilotCommunityList(PILOT_COMMUNITIES)}.
      </p>
      <EarlyAccessForm onSuccess={() => setIsSubmitted(true)} />
    </main>
  );
}
