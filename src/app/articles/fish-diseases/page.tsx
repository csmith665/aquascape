import Link from 'next/link';

export default function FishDiseasesArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Common Fish Diseases and Treatments</h1>
        <p>How to spot, treat, and prevent the most common aquarium illnesses</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: '#555', lineHeight: 1.7 }}>
          Most fish diseases are preventable with good water quality and careful observation. When illness does appear,
          early treatment gives the best chance of recovery. Always test your water before treating, because poor water
          conditions often cause or worsen disease.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Prevention First</h2>
        <ul>
          <li>Cycle the tank before adding fish.</li>
          <li>Perform regular water changes.</li>
          <li>Do not overfeed.</li>
          <li>Quarantine new fish for 2-4 weeks.</li>
          <li>Avoid sudden temperature changes.</li>
          <li>Use a gentle net and acclimate new arrivals slowly.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Ich (White Spot Disease)</h2>
        <p>
          <strong>Symptoms:</strong> Tiny white spots resembling grains of salt, scratching against decor, rapid breathing,
          clamped fins.
        </p>
        <p>
          <strong>Cause:</strong> A parasite that often appears after stress or temperature swings.
        </p>
        <p>
          <strong>Treatment:</strong> Raise temperature gradually to 86°F if fish tolerate it, and use an ich medication
          containing malachite green or copper. Treat the entire tank because the parasite has multiple life stages.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Fin Rot</h2>
        <p>
          <strong>Symptoms:</strong> Tattered, frayed, or receding fins, often with redness or white edges.
        </p>
        <p>
          <strong>Cause:</strong> Bacterial infection usually triggered by poor water quality or fin nipping.
        </p>
        <p>
          <strong>Treatment:</strong> Improve water quality with frequent water changes. Remove aggressive tank mates.
          Use a broad-spectrum antibacterial medication if clean water alone does not help.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Fungal Infections</h2>
        <p>
          <strong>Symptoms:</strong> Cotton-like white or gray growths on the body, fins, or mouth.
        </p>
        <p>
          <strong>Cause:</strong> Fungus often infects wounds or stressed fish.
        </p>
        <p>
          <strong>Treatment:</strong> Treat with an antifungal medication. Address underlying stressors such as poor
          water quality or aggression.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Swim Bladder Disease</h2>
        <p>
          <strong>Symptoms:</strong> Difficulty swimming upright, floating at the surface, sinking to the bottom,
          swimming upside down or sideways.
        </p>
        <p>
          <strong>Cause:</strong> Often constipation, overeating, or physical injury rather than infection.
        </p>
        <p>
          <strong>Treatment:</strong> Fast the fish for 24-48 hours, then feed a small amount of cooked pea (skin removed)
          for omnivores. Improve water quality and reduce feeding portions.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Velvet</h2>
        <p>
          <strong>Symptoms:</strong> Fine yellow or gold dust on the body, scratching, lethargy, rapid breathing.
        </p>
        <p>
          <strong>Cause:</strong> A parasite similar to ich but smaller and often more dangerous.
        </p>
        <p>
          <strong>Treatment:</strong> Dim the lights, raise temperature gradually, and use a copper-based medication
          or velvet-specific treatment.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Dropsy</h2>
        <p>
          <strong>Symptoms:</strong> Bloated body, raised scales that look like a pinecone, lethargy, loss of appetite.
        </p>
        <p>
          <strong>Cause:</strong> Usually a symptom of internal organ failure, often from bacterial infection.
        </p>
        <p>
          <strong>Treatment:</strong> Difficult to treat. Isolate the fish, improve water quality, and try a broad-spectrum
          antibiotic. Dropsy often has a poor prognosis.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>General Treatment Tips</h2>
        <ul>
          <li>Test water and fix any ammonia, nitrite, or nitrate problems first.</li>
          <li>Use a quarantine tank whenever possible to avoid medicating healthy fish.</li>
          <li>Remove carbon from the filter during medication; it absorbs treatments.</li>
          <li>Follow medication instructions exactly and complete the full course.</li>
          <li>Increase aeration during treatment; some medications reduce oxygen.</li>
        </ul>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>
            ← Back to Guides
          </Link>
          <Link href="/water-testing" className="btn">
            Water Testing Guide
          </Link>
        </div>
      </article>
    </>
  );
}
