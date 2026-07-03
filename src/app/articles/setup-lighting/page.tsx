import Link from 'next/link';

export default function SetupLightingArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Lighting</h1>
        <p>Photoperiod, planted tanks, and UVB for reptiles</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          Lighting does more than illuminate — it drives plant photosynthesis and, for reptiles, enables calcium metabolism.
          The right intensity and duration matter as much as the fixture itself.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Photoperiod for planted tanks</h2>
        <p>
          Plants need steady light, but too much fuels algae. Start at 6 hours per day and increase to 8 only if plants are
          thriving. A simple outlet timer or the light&apos;s built-in schedule prevents forgetting. Consistency matters more
          than a few extra hours.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Light intensity tiers</h2>
        <ul>
          <li><strong>Low light:</strong> Anubias, Java fern, Java moss, cryptocoryne. Works with basic LEDs.</li>
          <li><strong>Medium light:</strong> Most stem plants, carpet plants in shallow substrates. Needs a dedicated plant LED.</li>
          <li><strong>High light:</strong> HC Cuba, glossostigma, lush carpets. Often paired with CO2 and fertilization.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>UVB for reptiles</h2>
        <p>
          Diurnal reptiles (active during the day) synthesize vitamin D3 from UVB to metabolize calcium. Without it, they
          develop metabolic bone disease — a slow, painful death. Replace UVB bulbs every 6–12 months even if they look fine;
          output drops well before the bulb visibly dims.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Nocturnal species</h2>
        <p>
          Nocturnal species (e.g. many geckos) typically don&apos;t need UVB but still benefit from a day/night cycle.
          Use a low-wattage ceramic heat emitter for nighttime heat if needed — red or colored &quot;night&quot; bulbs
          disrupt their circadian rhythm.
        </p>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>← Back to Guides</Link>
          <Link href="/articles/plant-care-basics" className="btn">Plant Care Basics</Link>
        </div>
      </article>
    </>
  );
}
