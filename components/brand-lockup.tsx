import Image from "next/image";
import Link from "next/link";

const MARK_SIZE = 1200;
const WORDMARK_WIDTH = 1181;
const WORDMARK_HEIGHT = 268;

interface BrandLockupProps {
  href?: string | null;
  priority?: boolean;
}

export function BrandLockup({ href = "/", priority = true }: BrandLockupProps) {
  const content = (
    <>
      <Image
        src="/brand/parentive-mark.png"
        alt=""
        width={MARK_SIZE}
        height={MARK_SIZE}
        priority={priority}
        className="brand-lockup-mark"
        sizes="(max-width: 640px) 40px, 52px"
      />
      <Image
        src="/brand/parentive-wordmark.png"
        alt="Parentive"
        width={WORDMARK_WIDTH}
        height={WORDMARK_HEIGHT}
        priority={priority}
        className="brand-lockup-wordmark"
        sizes="(max-width: 640px) 120px, 140px"
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className="brand-lockup" aria-label="Parentive">
        {content}
      </Link>
    );
  }

  return <span className="brand-lockup">{content}</span>;
}
