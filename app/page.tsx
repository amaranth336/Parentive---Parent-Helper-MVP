import type { Metadata } from "next";
import Image from "next/image";
import { homepage } from "@/lib/homepage/content";
import heroPhoto from "@/public/images/home/home-hero-mother-reading-with-children.png";
import supportPhoto from "@/public/images/home/home-2nd-father-homework-with-children.png";
import makeRoomPhoto from "@/public/images/home/home-3rd-wide-after-school.png";

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
  homepage.makeRoom.id,
  homepage.expect.id,
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
            <div className="home-photo home-photo-portrait">
              <Image
                src={heroPhoto}
                alt={hero.photo.alt}
                fill
                priority
                sizes="(max-width: 799px) calc(100vw - 40px), 440px"
                className="home-photo-image"
                style={{ objectFit: "cover", objectPosition: "45% 40%" }}
              />
            </div>
          </figure>
        </div>
      </section>

      <section
        id={homepage.why.id}
        className={bandClass(homepage.why.id)}
        aria-labelledby="home-why-heading"
      >
        <div className="container home-accent-left">
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
        <div className="container home-support-inner">
          <figure className="home-photo-figure home-support-photo">
            <div className="home-photo home-photo-portrait">
              <Image
                src={supportPhoto}
                alt={homepage.support.photo.alt}
                fill
                sizes="(max-width: 799px) calc(100vw - 40px), 720px"
                className="home-photo-image"
                style={{ objectFit: "cover", objectPosition: "center center" }}
              />
            </div>
          </figure>
          <div className="home-support-copy">
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
                  {group.note ? (
                    <p className="home-offering-note">{group.note}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id={homepage.howItWorks.id}
        className={bandClass(homepage.howItWorks.id)}
        aria-labelledby="home-how-heading"
      >
        <div className="container home-accent-right">
          <h2 id="home-how-heading">{homepage.howItWorks.heading}</h2>
          <ol className="home-steps">
            {homepage.howItWorks.steps.map((step) => (
              <li key={step.number}>
                <h3>
                  <span className="home-section-number">{step.number}</span>
                  {step.title}
                </h3>
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
        id={homepage.makeRoom.id}
        className={bandClass(homepage.makeRoom.id)}
        aria-labelledby="home-make-room-heading"
      >
        <div className="container">
          <h2 id="home-make-room-heading">{homepage.makeRoom.heading}</h2>
          <p>{homepage.makeRoom.body}</p>
          <figure className="home-photo-figure home-photo-figure-wide">
            <div className="home-photo home-photo-wide">
              <Image
                src={makeRoomPhoto}
                alt={homepage.makeRoom.photo.alt}
                fill
                sizes="(max-width: 799px) calc(100vw - 40px), 920px"
                className="home-photo-image"
                style={{ objectFit: "cover", objectPosition: "68% center" }}
              />
            </div>
          </figure>
        </div>
      </section>

      <section
        id={homepage.difference.id}
        className={bandClass(homepage.difference.id)}
        aria-labelledby="home-difference-heading"
      >
        <div className="container home-accent-left">
          <h2 id="home-difference-heading">{homepage.difference.heading}</h2>
          {homepage.difference.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
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
          <p className="home-expect-close">{homepage.expect.closing}</p>
        </div>
      </section>
    </main>
  );
}
