import Link from 'next/link';

export default function SetupEnvironmentArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Humidity & Environment</h1>
        <p>Tropical vivariums, desert terrariums, and everything between</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          For terrestrial enclosures, the environment <em>is</em> the setup. Plants, livestock, and microfauna all rely on
          you matching humidity and temperature to the biome they evolved in.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Tropical and cloud forest vivariums</h2>
        <p>
          Tropical vivariums need consistent humidity in the 70–90% range. Use a hygrometer, mist daily or run an automatic
          mister, and ensure ventilation to prevent stagnant air and fungal growth. Cloud forest species tolerate cooler
          temperatures but still need high humidity.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Arid and desert terrariums</h2>
        <p>
          Desert and arid grassland species need a temperature gradient — a basking spot (90–105°F) at one end and a cool
          side (75–80°F) at the other. Humidity should stay low (20–40%) but provide a humid hide for shedding. Use a
          thermostat on every heat source.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Wetland and riparium setups</h2>
        <p>
          Wetland, riparium, and paludarium enclosures blend aquatic and terrestrial zones. The water section needs filtration
          and a heater (if tropical); the land portion needs drainage and plants that tolerate wet feet. Keep the water
          level stable and watch for salt creep if brackish.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Ventilation matters</h2>
        <p>
          High humidity without airflow grows mold. Use a vented top or a small computer fan on a timer to cycle air.
          Stagnant, humid air causes respiratory infections in reptiles and amphibians.
        </p>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>← Back to Guides</Link>
          <Link href="/articles/environments" className="btn">Environments Guide</Link>
        </div>
      </article>
    </>
  );
}
