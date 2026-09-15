import Link from "next/link";

export default function ServiceNotFound() {
  return (
    <main className="section">
      <div className="container narrow">
        <h1>We couldn’t find that service</h1>
        <p className="lead">
          That page isn’t part of the current Parentive pilot catalogue.
        </p>
        <div className="cta-row">
          <Link href="/services" className="btn btn-primary">
            See services
          </Link>
        </div>
      </div>
    </main>
  );
}
