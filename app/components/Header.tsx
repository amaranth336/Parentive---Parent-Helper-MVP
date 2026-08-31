import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          Parentive
        </Link>
        <nav className="site-nav">
          <ul className="nav-links">
            <li>
              <Link href="#services">Services</Link>
            </li>
            <li>
              <Link href="#pricing">Pricing</Link>
            </li>
            <li>
              <Link href="#how-it-works">How It Works</Link>
            </li>
            <li>
              <Link href="#about">About</Link>
            </li>
          </ul>
          <Link href="#request" className="btn btn-primary btn-sm">
            Take it off my plate
          </Link>
        </nav>
      </div>
    </header>
  );
}
