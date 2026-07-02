import Link from 'next/link';

export default function WaterTestingArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Water Testing and Parameter Management</h1>
        <p>How to test your water, read the results, and keep parameters stable</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: '#555', lineHeight: 1.7 }}>
          Water testing is the only way to know what is really happening inside your tank. Fish cannot tell you when
          something is wrong, but test results can. Learning to test and respond to results separates successful
          aquarists from struggling ones.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>What to Test</h2>
        <p>Every freshwater aquarist should be able to measure:</p>
        <ul>
          <li><strong>Ammonia (NH3/NH4+):</strong> Should be 0 ppm. Any detectable ammonia is dangerous.</li>
          <li><strong>Nitrite (NO2-):</strong> Should be 0 ppm. Toxic and stressful to fish.</li>
          <li><strong>Nitrate (NO3-):</strong> Should stay below 20-40 ppm. Controlled by water changes and plants.</li>
          <li><strong>pH:</strong> Stability matters more than the exact number. Most community fish tolerate 6.5-7.5.</li>
        </ul>
        <p>
          Optional but useful tests include general hardness (GH), carbonate hardness (KH), and phosphate.
          These become more important for planted tanks, breeding, or sensitive species.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Liquid Test Kits vs. Test Strips</h2>
        <p>
          Liquid test kits are more accurate and reliable than strips. The API Freshwater Master Test Kit is a popular
          choice for beginners. Test strips are convenient for quick checks but can be less precise.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>When to Test</h2>
        <ul>
          <li><strong>During cycling:</strong> Test ammonia, nitrite, and nitrate daily or every other day.</li>
          <li><strong>New tank:</strong> Test several times a week for the first month.</li>
          <li><strong>After adding fish:</strong> Test daily for the first week, then weekly.</li>
          <li><strong>Routine:</strong> Test weekly or biweekly in established tanks.</li>
          <li><strong>When fish look sick:</strong> Test immediately before treating.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>How to Fix Common Problems</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Parameter</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Issue</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Solution</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>Ammonia</td>
              <td style={{ padding: '0.5rem' }}>Above 0 ppm</td>
              <td style={{ padding: '0.5rem' }}>Partial water change, reduce feeding, check filter, use conditioner.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>Nitrite</td>
              <td style={{ padding: '0.5rem' }}>Above 0 ppm</td>
              <td style={{ padding: '0.5rem' }}>Partial water change; tank may still be cycling.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>Nitrate</td>
              <td style={{ padding: '0.5rem' }}>Above 40 ppm</td>
              <td style={{ padding: '0.5rem' }}>Increase water changes, reduce bioload, add fast-growing plants.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>pH</td>
              <td style={{ padding: '0.5rem' }}>Swinging up and down</td>
              <td style={{ padding: '0.5rem' }}>Check KH; add buffer if needed; avoid sudden chemical adjustments.</td>
            </tr>
          </tbody>
        </table>

        <h2 style={{ marginTop: '2.5rem' }}>Stability Is More Important Than Perfection</h2>
        <p>
          Fish adapt to a wide range of parameters if those parameters stay stable. Avoid chasing a perfect pH number
          with chemicals. Sudden changes in pH, temperature, or hardness are usually more harmful than the original value.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Keep a Log</h2>
        <p>
          Write down your test results over time. A log helps you spot trends, remember when you last changed water,
          and diagnose problems faster. Use our <Link href="/tracking">My Tanks</Link> feature to keep digital records.
        </p>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>
            ← Back to Guides
          </Link>
          <Link href="/tracking" className="btn">
            Track Parameters
          </Link>
        </div>
      </article>
    </>
  );
}
