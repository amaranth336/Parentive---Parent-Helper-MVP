import Link from 'next/link';

export default function ServiceNotFound() {
  return (
    <main className="service-detail-page">
      <div className="service-detail">
        <h1 style={{ marginBottom: 16 }}>Service not found</h1>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24 }}>
          The service you're looking for doesn't exist or may have been moved.
        </p>
        <Link href="/services" className="btn btn-primary">
          Browse all services
        </Link>
      </div>
    </main>
  );
}
