"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import heroPhoto from "@/public/images/early-access/early-access-hero-woman-coffee.png";
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

const HERO_ALT = "A woman sitting at a kitchen table, holding a coffee mug.";

export function EarlyAccessPageContent() {
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

  const heroFrameStyle = {
    "--early-access-hero-aspect": `${heroPhoto.width} / ${heroPhoto.height}`,
  } as CSSProperties;

  return (
    <main id="main-content" className="page early-access">
      <div className="early-access-intro">
        <div className="early-access-intro-copy">
          <h1>{EARLY_ACCESS_HEADING}</h1>
          <p>{EARLY_ACCESS_SUPPORTING}</p>
          <p className="early-access-communities">
            We&apos;re preparing a pilot in {formatPilotCommunityList(PILOT_COMMUNITIES)}.
          </p>
        </div>
        <div className="early-access-hero-photo" style={heroFrameStyle}>
          <Image
            src={heroPhoto}
            alt={HERO_ALT}
            fill
            priority
            sizes="(max-width: 799px) calc(100vw - 40px), 440px"
            className="early-access-hero-photo-image"
            style={{ objectFit: "cover", objectPosition: "center 38%" }}
          />
        </div>
      </div>
      <div className="early-access-form-wrap">
        <EarlyAccessForm onSuccess={() => setIsSubmitted(true)} />
      </div>
    </main>
  );
}
