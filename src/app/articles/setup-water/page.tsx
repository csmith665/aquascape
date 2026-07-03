import Link from 'next/link';

export default function SetupWaterArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Water Chemistry & Treatment</h1>
        <p>Source water, conditioning, salinity, and reef parameters</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          Getting source water right is the single biggest predictor of long-term stability in any aquarium.
          Different setup types have different requirements — fresh, brackish, and marine all need specific treatment.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Dechlorinate all tap water</h2>
        <p>
          Chlorine and chloramine in tap water kill beneficial bacteria and damage fish gills. Add a water conditioner
          (e.g. Seachem Prime) to every batch of new water <em>before</em> it touches the tank. This applies to every
          freshwater tank, every water change.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Saltwater salinity</h2>
        <p>
          Target specific gravity 1.023–1.025 (about 35 ppt). Mix marine salt with RO/DI water 24 hours ahead and aerate
          before adding to the tank. Top off evaporation with fresh water only — salt does not evaporate, so topping off
          with saltwater will raise salinity over time.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>RO/DI for saltwater and reef</h2>
        <p>
          Tap water contains chlorine, chloramine, phosphates, and silicates that fuel algae and harm inverts.
          An RO/DI unit is strongly recommended for any saltwater tank — and essential for reef tanks.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Brackish water</h2>
        <p>
          Brackish sits between freshwater and marine. Use a refractometer (not a hydrometer) to measure salinity.
          Many brackish species (mollies, puffers, archerfish) tolerate a range, but stability matters more than an exact number.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Reef parameters</h2>
        <p>
          Reef tanks consume calcium and alkalinity as corals grow. Test weekly and dose as needed. Stable alkalinity
          (7–11 dKH) matters more than chasing any specific number. Magnesium should be ~1300 ppm.
        </p>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>← Back to Guides</Link>
          <Link href="/articles/water-testing" className="btn">Water Testing Guide</Link>
        </div>
      </article>
    </>
  );
}
