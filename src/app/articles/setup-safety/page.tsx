import Link from 'next/link';

export default function SetupSafetyArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Safety & Setup Considerations</h1>
        <p>Chemicals, weight, and equipment — what to know before you fill the tank</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          A few minutes of setup care prevents most disasters. Chemicals and weight are the two killers of livestock and
          floors — both are easy to manage if you plan ahead.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Never use soap or chemicals near the tank</h2>
        <p>
          Residue from cleaning products, perfumes, or lotions on your hands can kill livestock. Wash hands with water only
          before working in the tank. Keep a dedicated siphon, net, and bucket that never touch household cleaners.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Water is heavy — ~8.3 lbs per gallon</h2>
        <p>
          A 55-gallon tank weighs over 500 lbs when filled. Ensure your stand is rated for the load and the floor can support it.
          A 55g+ tank on an upper floor may need to sit across multiple joists, perpendicular to the floorboards. Wall-mounted
          tanks need studs rated for the load, not just drywall anchors.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Saltwater is demanding for beginners</h2>
        <p>
          Saltwater adds salinity management, more sensitive livestock, higher cost, and slower cycles. Consider starting
          with a freshwater tank first. If you proceed with saltwater, go larger (30+ gallons) for stability and pick hardy
          fish — clownfish and damselfish tolerate beginner mistakes.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Equipment safety</h2>
        <ul>
          <li>Use a drip loop on every electrical cord — water follows the lowest point of the cord, not into the outlet.</li>
          <li>Never submerge a heater that isn&apos;t plugged in and running — glass heaters can crack when exposed to air while hot.</li>
          <li>Keep a thermometer separate from the heater&apos;s built-in thermostat — dials drift.</li>
          <li>GFCI outlets near water are a good investment, especially for saltwater.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Schooling fish need swimming room</h2>
        <p>
          Schooling fish (tetras, danios, rasboras) need to swim back and forth. Tanks under 10 gallons don&apos;t have
          enough horizontal space — choose a longer tank over a taller one for schooling species.
        </p>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>← Back to Guides</Link>
          <Link href="/articles/first-freshwater-aquarium" className="btn">First Freshwater Aquarium</Link>
        </div>
      </article>
    </>
  );
}
