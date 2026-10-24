import type { Metadata } from "next";
import { OurSupportExperience } from "@/components/our-support-experience";
import {
  OUR_SUPPORT_DESCRIPTION,
  OUR_SUPPORT_TITLE,
} from "@/lib/our-support/copy";

export const metadata: Metadata = {
  title: OUR_SUPPORT_TITLE,
  description: OUR_SUPPORT_DESCRIPTION,
  openGraph: {
    title: OUR_SUPPORT_TITLE,
    description: OUR_SUPPORT_DESCRIPTION,
  },
};

export default function OurSupportPage() {
  return <OurSupportExperience />;
}
