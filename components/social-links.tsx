import { FacebookMark } from "@/components/facebook-mark";
import { InstagramMark } from "@/components/instagram-mark";
import {
  FACEBOOK_LINK_LABEL,
  FACEBOOK_URL,
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
      <a
        className="socials-link"
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FacebookMark className="socials-mark" />
        <span className="visually-hidden">{FACEBOOK_LINK_LABEL}</span>
      </a>
    </section>
  );
}
