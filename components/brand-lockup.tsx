import Image from "next/image";
import Link from "next/link";

const LOCKUP_WIDTH = 2500;
const LOCKUP_HEIGHT = 850;

interface BrandLockupProps {
  href?: string | null;
  priority?: boolean;
}

export function BrandLockup({ href = "/", priority = true }: BrandLockupProps) {
  const image = (
    <Image
      src="/brand/parentive-lockup.png"
      alt="Parentive"
      width={LOCKUP_WIDTH}
      height={LOCKUP_HEIGHT}
      priority={priority}
      className="brand-lockup-image"
      sizes="220px"
    />
  );

  if (href) {
    return (
      <Link href={href} className="brand-lockup" aria-label="Parentive">
        {image}
      </Link>
    );
  }

  return <span className="brand-lockup">{image}</span>;
}
