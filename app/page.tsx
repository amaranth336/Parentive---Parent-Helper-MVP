import type { Metadata } from "next";
import { Alert } from "@/components/form";
import { homepage } from "@/lib/homepage/content";

export const metadata: Metadata = {
  title: homepage.metadata.title,
  description: homepage.metadata.description,
  openGraph: {
    title: homepage.metadata.title,
    description: homepage.metadata.description,
  },
};

const oatBandIds = new Set<string>([
  homepage.why.id,
  homepage.howItWorks.id,
  homepage.difference.id,
  homepage.area.id,
  homepage.earlyAccess.id,
]);

function bandClass(id: string): string {
  return oatBandIds.has(id) ? "home-band home-band-oat" : "home-band";
}

export default function Home() {
  const { hero } = homepage;

  return (
    <main id="main-content" className="home">
      <section className="home-band home-hero" aria-labelledby="home-hero-heading">
        <div className="container home-hero-inner">
          <div className="home-hero-copy">
            <p className="home-kicker">{hero.kicker}</p>
            <h1 id="home-hero-heading">{hero.heading}</h1>
            <p>{hero.support}</p>
            <p>{hero.launchLine}</p>
            <div className="home-cta">
              <a
                className="btn btn-primary btn-block"
                href={hero.primaryCta.href}
              >
                {hero.primaryCta.label}
              </a>
              <a
                className="btn btn-secondary btn-block"
                href={hero.secondaryCta.href}
              >
                {hero.secondaryCta.label}
              </a>
            </div>
          </div>
          <figure className="home-photo-figure">
            <div
              className="home-photo home-photo-a"
              role="img"
              aria-label={hero.photo.alt}
            />
            <figcaption className="home-photo-caption">
              {hero.photo.caption}
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        id={homepage.why.id}
        className={bandClass(homepage.why.id)}
        aria-labelledby="home-why-heading"
      >
        <div className="container">
          <h2 id="home-why-heading">{homepage.why.heading}</h2>
          <p>{homepage.why.body}</p>
          <p className="home-belief">{homepage.why.belief}</p>
        </div>
      </section>

      <section
        id={homepage.support.id}
        className={bandClass(homepage.support.id)}
        aria-labelledby="home-support-heading"
      >
        <div className="container">
          <h2 id="home-support-heading">{homepage.support.heading}</h2>
          <p className="home-lead">{homepage.support.lead}</p>
          <div className="home-offering-groups">
            {homepage.support.groups.map((group) => (
              <div key={group.id} className="home-offering-group">
                <h3>{group.title}</h3>
                <ul className="home-offering-list">
                  {group.names.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
                {group.note ? <p className="home-offering-note">{group.note}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id={homepage.howItWorks.id}
        className={bandClass(homepage.howItWorks.id)}
        aria-labelledby="home-how-heading"
      >
        <div className="container">
          <h2 id="home-how-heading">{homepage.howItWorks.heading}</h2>
          <ol className="home-steps">
            {homepage.howItWorks.steps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id={homepage.supportModel.id}
        className={bandClass(homepage.supportModel.id)}
        aria-labelledby="home-model-heading"
      >
        <div className="container">
          <h2 id="home-model-heading">{homepage.supportModel.heading}</h2>
          {homepage.supportModel.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="home-cadence">{homepage.supportModel.cadence}</p>
        </div>
      </section>

      <section
        id={homepage.difference.id}
        className={bandClass(homepage.difference.id)}
        aria-labelledby="home-difference-heading"
      >
        <div className="container">
          <h2 id="home-difference-heading">{homepage.difference.heading}</h2>
          {homepage.difference.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        id={homepage.makeRoom.id}
        className={bandClass(homepage.makeRoom.id)}
        aria-labelledby="home-make-room-heading"
      >
        <div className="container">
          <h2 id="home-make-room-heading">{homepage.makeRoom.heading}</h2>
          <p>{homepage.makeRoom.body}</p>
        </div>
        <figure className="home-photo-figure home-photo-figure-bleed">
          <div
            className="home-photo home-photo-b"
            role="img"
            aria-label={homepage.makeRoom.photo.alt}
          />
          <figcaption className="container home-photo-caption">
            {homepage.makeRoom.photo.caption}
          </figcaption>
        </figure>
      </section>

      <section
        id={homepage.area.id}
        className={bandClass(homepage.area.id)}
        aria-labelledby="home-area-heading"
      >
        <div className="container">
          <h2 id="home-area-heading">{homepage.area.heading}</h2>
          <p>{homepage.area.body}</p>
        </div>
      </section>

      <section
        id={homepage.expect.id}
        className={bandClass(homepage.expect.id)}
        aria-labelledby="home-expect-heading"
      >
        <div className="container">
          <h2 id="home-expect-heading">{homepage.expect.heading}</h2>
          <ul className="home-expect">
            {homepage.expect.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id={homepage.earlyAccess.id}
        className={bandClass(homepage.earlyAccess.id)}
        aria-labelledby="home-early-access-heading"
      >
        <div className="container">
          <h2 id="home-early-access-heading">{homepage.earlyAccess.heading}</h2>
          <p>{homepage.earlyAccess.body}</p>
          <div className="home-cta">
            <a
              className="btn btn-primary btn-block"
              href={homepage.hero.primaryCta.href}
            >
              {homepage.hero.primaryCta.label}
            </a>
          </div>
          <Alert variant="info">{homepage.earlyAccess.alert}</Alert>
        </div>
      </section>

      <section
        id={homepage.faq.id}
        className={bandClass(homepage.faq.id)}
        aria-labelledby="home-faq-heading"
      >
        <div className="container">
          <h2 id="home-faq-heading">{homepage.faq.heading}</h2>
          <dl className="home-faq">
            {homepage.faq.items.map((item) => (
              <div className="home-faq-item" key={item.question}>
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
