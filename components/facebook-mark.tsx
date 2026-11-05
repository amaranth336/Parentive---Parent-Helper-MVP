type FacebookMarkProps = {
  className?: string;
};

/**
 * Facebook glyph drawn in currentColor so it inherits Deep Moss.
 * The rounded square matches the Instagram mark; the f is cut out.
 */
export function FacebookMark({ className }: FacebookMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.5 2.75h9a4.75 4.75 0 0 1 4.75 4.75v9a4.75 4.75 0 0 1-4.75 4.75h-9a4.75 4.75 0 0 1-4.75-4.75v-9A4.75 4.75 0 0 1 7.5 2.75zm9.05 3.15v2.55h-1.7v1.05h2.15v2.5h-2.15v6.2h-2.75v-6.2H8.45v-2.5h3.65V9.1c0-1.85 1.05-3.2 2.7-3.2h1.75z"
      />
    </svg>
  );
}
