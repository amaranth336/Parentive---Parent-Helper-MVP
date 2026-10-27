type InstagramMarkProps = {
  className?: string;
};

/**
 * Instagram camera glyph drawn in currentColor so it inherits Deep Moss.
 */
export function InstagramMark({ className }: InstagramMarkProps) {
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
        d="M7.5 2.75h9a4.75 4.75 0 0 1 4.75 4.75v9a4.75 4.75 0 0 1-4.75 4.75h-9a4.75 4.75 0 0 1-4.75-4.75v-9A4.75 4.75 0 0 1 7.5 2.75zm8.85 9.25a4.35 4.35 0 1 1-8.7 0 4.35 4.35 0 0 1 8.7 0zm-1.7 0a2.65 2.65 0 1 0-5.3 0 2.65 2.65 0 0 0 5.3 0zM18.05 7.35a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z"
      />
    </svg>
  );
}
