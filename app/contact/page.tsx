import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import contactHero from "@/public/images/contact/contact-hero-mother-with-children.png";
import { ContactForm } from "@/components/contact-form";
import {
  CONTACT_HEADING,
  CONTACT_HELPERS_LINK_LABEL,
  CONTACT_HELPERS_NOTE_LEAD,
  CONTACT_SUPPORTING,
  HELPERS_PATH,
} from "@/lib/contact/copy";

export const metadata: Metadata = {
  title: "Contact — Parentive",
  description: CONTACT_SUPPORTING,
};

export default function ContactPage() {
  return (
    <main id="main-content" className="page contact">
      <div className="contact-hero">
        <Image
          src={contactHero}
          alt="Mother talking on the phone while two children play and read in the living room"
          fill
          priority
          sizes="(max-width: 936px) calc(100vw - 40px), 896px"
          className="contact-hero-image"
        />
      </div>
      <h1>{CONTACT_HEADING}</h1>
      <p>{CONTACT_SUPPORTING}</p>
      <ContactForm />
      <p className="contact-helpers-note">
        {CONTACT_HELPERS_NOTE_LEAD}{" "}
        <Link href={HELPERS_PATH} className="text-link">
          {CONTACT_HELPERS_LINK_LABEL}
        </Link>
        .
      </p>
    </main>
  );
}
