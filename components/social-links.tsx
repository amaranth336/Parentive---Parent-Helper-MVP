import { InstagramMark } from "@/components/instagram-mark";
import {
  INSTAGRAM_LINK_LABEL,
  INSTAGRAM_URL,
  SOCIALS_TITLE,
} from "@/lib/social/links";

type SocialLinksProps = {
  className?: string;
};

export function SocialLinks({ className }: SocialLinksProps) {
  const classes = className ? `socials ${className}` : "socials";

  return (
    <section className={classes}>
      <h2 className="socials-title">{SOCIALS_TITLE}</h2>
      <a
        className="socials-link"
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <InstagramMark className="socials-mark" />
        <span className="visually-hidden">{INSTAGRAM_LINK_LABEL}</span>
      </a>
    </section>
  );
}
