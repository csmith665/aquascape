import Link from 'next/link';

export default function FirstFreshwaterAquariumArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Setting Up Your First Freshwater Aquarium</h1>
        <p>A complete beginner guide from empty tank to healthy community</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: '#555', lineHeight: 1.7 }}>
          Setting up your first freshwater aquarium is exciting, but rushing the process is the most common cause of failure.
          This guide walks you through each step so you can build a stable, healthy environment for your fish.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Step 1: Choose the Right Tank Size</h2>
        <p>
          Bigger tanks are more forgiving than small ones. A 20-gallon tank is an excellent starting point because it holds
          more water volume, which means parameters change more slowly and mistakes are less deadly. Avoid bowls or tiny
          desktop tanks for beginners.
        </p>
        <ul>
          <li><strong>10 gallons:</strong> Minimum for a single betta or a small shrimp tank.</li>
          <li><strong>20 gallons:</strong> Great for a small community of peaceful fish.</li>
          <li><strong>40 gallons:</strong> Ideal for beginners who want more stocking options and stability.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Step 2: Gather Essential Equipment</h2>
        <p>At minimum, you will need:</p>
        <ul>
          <li><strong>Tank and stand:</strong> Must be level and able to support the full weight of water.</li>
          <li><strong>Filter:</strong> Rated for your tank size or slightly larger. Hang-on-back or sponge filters are beginner-friendly.</li>
          <li><strong>Heater:</strong> Most tropical fish need 75-80°F. Use 3-5 watts per gallon.</li>
          <li><strong>Lighting:</strong> A basic LED is enough for low-light plants and viewing fish.</li>
          <li><strong>Substrate:</strong> Gravel or sand. Rinse thoroughly before adding.</li>
          <li><strong>Water conditioner:</strong> Removes chlorine and chloramine from tap water.</li>
          <li><strong>Test kit:</strong> Liquid tests for ammonia, nitrite, nitrate, and pH are essential.</li>
          <li><strong>Decor and hides:</strong> Caves, driftwood, and plants reduce stress.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Step 3: Place and Prepare the Tank</h2>
        <p>
          Put your tank on a flat, sturdy surface away from direct sunlight and drafts. Sunlight causes algae blooms,
          and drafts can create temperature swings. Place the substrate, hardscape, and decor before adding water.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Step 4: Fill and Start the Filter</h2>
        <p>
          Fill the tank with temperature-matched, dechlorinated water. Start the filter and heater. Let the tank run for
          at least 24 hours to make sure equipment works and temperature stabilizes.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Step 5: Cycle the Tank</h2>
        <p>
          This is the most important step. New tanks have no beneficial bacteria, so fish waste quickly becomes toxic ammonia.
          Cycling establishes a colony of bacteria that converts ammonia to nitrite, then nitrite to relatively safe nitrate.
        </p>
        <p>
          <Link href="/articles/nitrogen-cycle">Read our full nitrogen cycle guide</Link> for detailed instructions.
          Expect cycling to take 2-6 weeks. Do not add fish until ammonia and nitrite read 0 ppm.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Step 6: Choose and Add Fish</h2>
        <p>
          Start with a few hardy, peaceful fish. Add them in small groups over several weeks rather than all at once.
          Each addition increases the bioload, and the bacteria colony needs time to catch up.
        </p>
        <p>Good first fish include:</p>
        <ul>
          <li>Harlequin rasboras</li>
          <li>Corydoras catfish</li>
          <li>Cherry barbs</li>
          <li>Platies</li>
          <li>Zebra danios</li>
          <li>Betta fish (alone or with peaceful tank mates)</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Step 7: Maintain a Routine</h2>
        <p>
          Feed small amounts once or twice daily. Perform 20-25% water changes weekly. Test water parameters regularly,
          especially after adding new fish. Remove uneaten food and debris to keep water quality high.
        </p>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>
            ← Back to Guides
          </Link>
          <Link href="/builder" className="btn">
            Try the Tank Builder
          </Link>
        </div>
      </article>
    </>
  );
}
