import Link from 'next/link';

export default function SetupMaintenanceArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Maintenance Philosophy</h1>
        <p>Low-maintenance vs. high-maintenance setups</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          There is no such thing as a no-maintenance tank — only a low-maintenance one. The bioload determines how often
          you work on the tank. Match your stocking plan to the maintenance level you can actually sustain.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Low-maintenance setups</h2>
        <p>
          A low-maintenance tank works when bioload is well below the filter&apos;s capacity. Stock at 50–70% of the
          theoretical maximum, use hardy plants (Anubias, Java fern, cryptocoryne), and avoid heavy feeders.
          You will still need weekly water changes — just smaller ones (15–20%).
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>High-maintenance setups</h2>
        <p>
          Densely planted tanks, reef tanks, and high-bioload community tanks need daily observation and frequent water
          changes (25–50% weekly). The payoff is lush growth, vivid color, and a wider species selection. If you can&apos;t
          commit to daily checks, choose a lower-bioload setup instead.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>What weekly maintenance looks like</h2>
        <ul>
          <li>Test water (pH, ammonia, nitrite, nitrate) before the water change</li>
          <li>25–30% water change with dechlorinated, temperature-matched water</li>
          <li>Trim dead leaves and prune overgrown plants</li>
          <li>Wipe the glass, rinse filter mechanical media in old tank water</li>
          <li>Top off evaporation, feed as usual</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Monthly tasks</h2>
        <ul>
          <li>Deep clean filter — never replace all media at once</li>
          <li>Vacuum substrate in unplanted areas</li>
          <li>Check equipment: heater, thermometer, light timer, filter flow</li>
          <li>Review livestock — any fish showing stress, illness, or aggression?</li>
        </ul>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>← Back to Guides</Link>
          <Link href="/articles/upkeep-requirements" className="btn">Upkeep Requirements</Link>
        </div>
      </article>
    </>
  );
}
