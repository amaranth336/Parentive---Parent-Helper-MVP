import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Icon } from './icon';

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function TextLink({ className = '', children, ...props }: TextLinkProps) {
  return (
    <a className={`text-link ${className}`.trim()} {...props}>
      {children}
    </a>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
}

export function IconButton({
  icon,
  label,
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`header-menu-toggle ${className}`.trim()}
      aria-label={label}
      {...props}
    >
      <Icon icon={icon} size="lg" />
    </button>
  );
}
