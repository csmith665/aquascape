import Link from 'next/link';

export default function NitrogenCycleArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Understanding the Nitrogen Cycle</h1>
        <p>Why cycling is the most important step in aquarium keeping</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: '#555', lineHeight: 1.7 }}>
          The nitrogen cycle is the invisible process that keeps aquarium water safe. Without it, fish waste becomes
          toxic ammonia that can kill livestock within days. Understanding this cycle is the single most important skill
          for any aquarist.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>The Three Stages</h2>
        <p>The nitrogen cycle has three main chemical stages:</p>
        <ol>
          <li>
            <strong>Ammonia (NH3/NH4+):</strong> Produced by fish waste, uneaten food, and decaying plant matter.
            Ammonia is highly toxic even at low levels.
          </li>
          <li>
            <strong>Nitrite (NO2-):</strong> Beneficial bacteria called <em>Nitrosomonas</em> convert ammonia into nitrite.
            Nitrite is also toxic and prevents fish from absorbing oxygen properly.
          </li>
          <li>
            <strong>Nitrate (NO3-):</strong> A second group of bacteria called <em>Nitrobacter</em> and <em>Nitrospira</em>
            convert nitrite into nitrate. Nitrate is much less toxic and is removed through water changes and plant uptake.
          </li>
        </ol>

        <h2 style={{ marginTop: '2.5rem' }}>Why Cycling Matters</h2>
        <p>
          A brand new aquarium starts with none of these beneficial bacteria. If you add fish immediately, ammonia builds
          up faster than the bacteria can process it. This causes ammonia burns, stress, illness, and death.
        </p>
        <p>
          Cycling the tank before adding fish gives the bacteria colony time to grow large enough to handle the waste
          your livestock will produce.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>How to Cycle a Tank</h2>
        <p>There are two common methods:</p>
        <ul>
          <li>
            <strong>Fishless cycling (recommended):</strong> Add a source of pure ammonia or fish food to feed the bacteria.
            Test daily. When ammonia and nitrite both spike and return to 0 ppm, the cycle is complete.
          </li>
          <li>
            <strong>Fish-in cycling:</strong> Add a few very hardy fish and perform frequent water changes to keep ammonia
            and nitrite low. This is more stressful for fish and requires careful monitoring.
          </li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Speeding Up the Cycle</h2>
        <ul>
          <li><strong>Bottled bacteria:</strong> Products like Seachem Stability or Tetra SafeStart can jump-start the colony.</li>
          <li><strong>Used filter media:</strong> Borrowing cycled media from an established tank introduces bacteria immediately.</li>
          <li><strong>Higher temperature:</strong> Bacteria grow faster around 80-86°F during cycling.</li>
          <li><strong>Good oxygen:</strong> Bacteria need oxygen, so surface agitation helps.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>How to Know Cycling Is Complete</h2>
        <p>A cycled tank shows:</p>
        <ul>
          <li>Ammonia: 0 ppm</li>
          <li>Nitrite: 0 ppm</li>
          <li>Nitrate: above 0 ppm (usually 5-20 ppm)</li>
        </ul>
        <p>
          Once you see this pattern, do a large water change to reduce nitrate, then add fish slowly.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Maintaining the Cycle</h2>
        <p>
          Never replace all filter media at once or clean filters with tap water. Chlorine kills beneficial bacteria.
          Rinse mechanical media in old tank water during water changes instead.
        </p>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>
            ← Back to Guides
          </Link>
          <Link href="/setup-checklist" className="btn">
            Setup Checklist
          </Link>
        </div>
      </article>
    </>
  );
}
