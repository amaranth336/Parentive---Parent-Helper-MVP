import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li>
                <Link href="#services">All Services</Link>
              </li>
              <li>
                <Link href="#services">Home Resets</Link>
              </li>
              <li>
                <Link href="#services">Food & Prep</Link>
              </li>
              <li>
                <Link href="#services">Kids & Family</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li>
                <Link href="#about">About</Link>
              </li>
              <li>
                <Link href="#how-it-works">How It Works</Link>
              </li>
              <li>
                <Link href="#pricing">Pricing</Link>
              </li>
              <li>
                <Link href="#faq">FAQ</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Join Us</h4>
            <ul className="footer-links">
              <li>
                <Link href="#join">Join the Hive</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li>
                <Link href="#privacy">Privacy</Link>
              </li>
              <li>
                <Link href="#terms">Terms</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Parentive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
