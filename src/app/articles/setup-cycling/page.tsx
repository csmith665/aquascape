import Link from 'next/link';

export default function SetupCyclingArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Cycling a New Aquarium</h1>
        <p>The most important step before adding any livestock</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          A new aquatic tank has no beneficial bacteria. Without them, fish waste becomes toxic ammonia within days.
          Cycling is the process of growing that bacteria colony before adding livestock.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>What cycling does</h2>
        <p>
          The nitrogen cycle grows two groups of bacteria. The first converts toxic ammonia into nitrite (also toxic).
          The second converts nitrite into nitrate (much less harmful, removed by water changes and plants).
          A cycled tank reads 0 ammonia, 0 nitrite, and some nitrate.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>How to cycle</h2>
        <ul>
          <li><strong>Fishless cycling (recommended):</strong> Add pure ammonia or fish food. Test daily. Cycle is complete when ammonia and nitrite both read 0 ppm.</li>
          <li><strong>Fish-in cycling:</strong> Add a few hardy fish and do frequent water changes. More stressful on the fish and requires close monitoring.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>How long it takes</h2>
        <p>Typically 2–6 weeks. You can speed it up with bottled bacteria (e.g. Seachem Stability), used filter media from an established tank, warmer water (80–86°F), and good surface agitation.</p>

        <h2 style={{ marginTop: '2.5rem' }}>Stocking after cycling</h2>
        <p>
          Never add all your livestock at once. Add a few hardy fish first and re-test 24 hours later. If ammonia and nitrite
          stay at 0, the biofilter is handling the load — add more slowly over the following weeks.
        </p>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>← Back to Guides</Link>
          <Link href="/articles/nitrogen-cycle" className="btn">Deep dive: The Nitrogen Cycle</Link>
        </div>
      </article>
    </>
  );
}
