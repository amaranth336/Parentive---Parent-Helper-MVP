import type { Metadata } from 'next';
import { LogoLockup, LogoMark, Wordmark } from '@/components/brand/logo';
import { OrganicShape } from '@/components/brand/organic-shape';
import { Icon } from '@/components/brand/icon';
import { Menu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Design system',
  description: 'Internal Parentive 004 design-system reference.',
  robots: { index: false, follow: false },
};

const PALETTE = [
  { name: 'Moss', token: '--moss', value: '#30483B' },
  { name: 'Sage', token: '--sage', value: '#AEBBA6' },
  { name: 'Oat', token: '--oat', value: '#F5F2EA' },
  { name: 'Sand', token: '--sand', value: '#E7DECF' },
  { name: 'Walnut', token: '--walnut', value: '#594B41' },
  { name: 'Honey', token: '--honey', value: '#D5A552' },
];

const SHAPES = [
  'open',
  'drift',
  'lean',
  'pebble',
  'room',
  'sidecar',
  'quiet-edge',
] as const;

export default function DesignSystemPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="section-intro">
          <h1>Parentive design system</h1>
          <p className="lead">
            Internal reference for the locked 004 tokens, brand assets, and
            shared primitives. Surfaces follow Oat → Sand → Sage → Moss, with
            Honey as punctuation. This is not a customer-facing page.
          </p>
        </div>

        <section className="form-section">
          <h2>Logo assets</h2>
          <p>Supplied production files — not reconstructed marks.</p>
          <div className="card-grid cols-2">
            <article className="card">
              <h3 className="card-title">Lockup</h3>
              <LogoLockup />
            </article>
            <article className="card">
              <h3 className="card-title">Mark</h3>
              <LogoMark className="brand-mark-sample" />
            </article>
            <article className="card">
              <h3 className="card-title">Wordmark</h3>
              <Wordmark />
            </article>
          </div>
        </section>

        <section className="form-section">
          <h2>Palette</h2>
          <div className="card-grid cols-2">
            {PALETTE.map((color) => (
              <div key={color.name} className="ds-swatch">
                <div
                  className="ds-swatch-chip"
                  style={{ background: `var(${color.token})` }}
                />
                <strong>{color.name}</strong>
                <span className="text-sm text-muted">{color.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="form-section">
          <h2>Organic shapes</h2>
          <div className="card-grid cols-4">
            {SHAPES.map((shape) => (
              <article key={shape} className="card">
                <OrganicShape shape={shape} color="sage" size="sm" />
                <p className="card-description" style={{ marginTop: 'var(--space-3)' }}>
                  {shape}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="form-section">
          <h2>Actions</h2>
          <div className="cta-row">
            <button type="button" className="btn btn-primary">
              Primary
            </button>
            <button type="button" className="btn btn-secondary">
              Secondary
            </button>
            <button type="button" className="btn btn-ghost">
              Ghost
            </button>
            <a href="#palette" className="text-link">
              Text link
            </a>
            <span className="icon" aria-hidden="true">
              <Icon icon={Menu} />
            </span>
          </div>
        </section>

        <section className="form-section">
          <h2>Surfaces</h2>
          <div className="card-grid cols-2">
            <article className="card">
              <h3 className="card-title">Card / default</h3>
              <p className="card-description">
                Warm light surface. Default for service cards and catalogues.
              </p>
            </article>
            <article className="card card-soft">
              <h3 className="card-title">Card / soft</h3>
              <p className="card-description">
                Sage-derived supporting surface for selected or quiet emphasis.
              </p>
            </article>
            <article className="card card-emphasis">
              <h3 className="card-title">Card / emphasis</h3>
              <p className="card-description">
                Moss brand moment. Use sparingly for CTA or founding moments.
              </p>
            </article>
            <article className="callout">
              <h3 className="callout-title">Callout</h3>
              <p className="callout-body">
                Sand surface with Honey punctuation. Not a dark panel.
              </p>
            </article>
          </div>
        </section>

        <section className="form-section">
          <h2>Section variants</h2>
          <p>Oat default, Sand alternate, Sage support, Moss emphasis.</p>
        </section>
      </div>
    </main>
  );
}
