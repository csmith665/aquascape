import Link from 'next/link';

export default function SetupStockingArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Stocking Your Tank</h1>
        <p>Add livestock slowly, with testing between additions</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          Every fish you add increases bioload. A tank that handled five fish fine may spike ammonia when you add the sixth.
          The trick is to add slowly and test between additions.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Add livestock in stages</h2>
        <p>
          Start with the hardiest species. Add a few fish at a time, then test ammonia and nitrite 24–48 hours after each
          addition. If both stay at 0, the biofilter is keeping up and you can add more. If either rises, do a water change
          and wait before adding anything else.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Quarantine new fish</h2>
        <p>
          New fish can carry parasites and bacterial infections that wipe out an established tank. Quarantine every new
          arrival for 2–4 weeks in a separate tank with its own filter and equipment. Treat proactively for common parasites
          during quarantine.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Small tanks (under 10 gallons)</h2>
        <p>
          Small volumes swing fast. Stock lightly — 1 inch of adult fish per gallon is a rough ceiling, not a target.
          Avoid schooling fish that need swimming room. Test more often than a large tank; a missed water change is more costly.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Schooling fish need groups</h2>
        <p>
          Tetras, danios, rasboras, barbs, and similar schooling fish need a group of 6+ to feel secure. Single or paired
          schooling fish become stressed, hide, and die young. Count the school as one stocking decision, not as 6 separate fish.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Beginner-friendly species</h2>
        <p>
          Guppies, platies, danios, bettas, and corydoras tolerate beginner mistakes in water quality. Avoid sensitive
          species (discus, rams, shrimp) until you have stable parameters for several months.
        </p>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>← Back to Guides</Link>
          <Link href="/articles/choosing-compatible-fish" className="btn">Choosing Compatible Fish</Link>
        </div>
      </article>
    </>
  );
}
