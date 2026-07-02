import Link from 'next/link';

export default function EnvironmentsArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Enclosure Types Explained</h1>
        <p>Aquarium, terrarium, vivarium, paludarium, and more — what makes each one unique?</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: '#555', lineHeight: 1.7 }}>
          One of the first choices every hobbyist faces is deciding what kind of enclosed environment they want to build.
          The terms aquarium, terrarium, vivarium, paludarium, and riparium are often used interchangeably, but each
          describes a different balance of water, land, plants, and animals. Understanding the difference helps you pick
          the right enclosure, equipment, and livestock for your goals.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Aquarium</h2>
        <p>
          An aquarium is a fully aquatic enclosure — water from top to bottom, designed to house fish, invertebrates,
          aquatic plants, and sometimes corals. This is the most common starting point in the hobby because equipment
          and information are widely available.
        </p>
        <ul>
          <li><strong>Water volume:</strong> 100% aquatic.</li>
          <li><strong>Typical inhabitants:</strong> Fish, shrimp, snails, aquatic plants, aquatic corals (saltwater).</li>
          <li><strong>Equipment:</strong> Filter, heater, lighting, possibly CO2 injection for plants.</li>
          <li><strong>Best for:</strong> Beginners who want a classic underwater garden or community tank.</li>
        </ul>
        <p>
          Freshwater aquariums are generally more forgiving and less expensive than saltwater setups. A planted
          freshwater tank can be a stunning display while still being beginner-friendly.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Terrarium</h2>
        <p>
          A terrarium is a mostly dry, land-based enclosure. The name comes from the Latin word <em>terra</em>, meaning
          earth. Terrariums are built for terrestrial plants and animals that live on land with little or no standing
          water.
        </p>
        <ul>
          <li><strong>Water volume:</strong> None or minimal; humidity is controlled by misting.</li>
          <li><strong>Typical inhabitants:</strong> Succulents, cacti, air plants, reptiles like leopard geckos, tarantulas, scorpions.</li>
          <li><strong>Equipment:</strong> Heating, UVB lighting for reptiles, drainage layer, ventilation.</li>
          <li><strong>Best for:</strong> Desert or arid species and people who prefer low-water plant displays.</li>
        </ul>
        <p>
          Closed terrariums can recycle their own moisture and become nearly self-sustaining. Open terrariums are better
          for plants that need airflow and drier conditions.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Vivarium</h2>
        <p>
          A vivarium is a living enclosure that combines plants and animals in a more naturalistic setting. The word
          comes from <em>vivus</em>, meaning alive. Many hobbyists use “vivarium” specifically for enclosures that
          include live plants and animals, especially amphibians, small reptiles, or invertebrates.
        </p>
        <ul>
          <li><strong>Water volume:</strong> Usually minimal; focuses on high humidity and living plants.</li>
          <li><strong>Typical inhabitants:</strong> Frogs, geckos, small lizards, millipedes, isopods, springtails.</li>
          <li><strong>Equipment:</strong> Humidity control, grow lighting, ventilation, drainage layer.</li>
          <li><strong>Best for:</strong> Keepers who want a lush, planted display with live animals.</li>
        </ul>
        <p>
          Vivariums often include a bioactive clean-up crew of springtails and isopods that break down waste and keep
          the enclosure healthier.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Paludarium</h2>
        <p>
          A paludarium blends land and water in the same enclosure. The name comes from <em>palus</em>, meaning swamp.
          These setups recreate the edges of ponds, streams, or mangroves where aquatic and terrestrial habitats meet.
        </p>
        <ul>
          <li><strong>Water volume:</strong> Partial — usually the bottom portion is water and the top portion is land.</li>
          <li><strong>Typical inhabitants:</strong> Semi-aquatic animals such as fire-bellied toads, newts, crabs, mudskippers; aquatic and terrestrial plants.</li>
          <li><strong>Equipment:</strong> Filter for the water area, water pump, heating, lighting for both land and water sections.</li>
          <li><strong>Best for:</strong> Hobbyists who want the challenge and visual interest of both worlds.</li>
        </ul>
        <p>
          Paludariums are beautiful and dynamic, but they require careful planning. Water quality must be maintained,
          and the land area must stay humid without becoming waterlogged.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Riparium</h2>
        <p>
          A riparium focuses on the shallow water and shoreline plants at the edge of a body of water. Unlike a
          paludarium, a riparium usually has no real dry land area; instead, plants are suspended at the waterline
          with their roots growing down into the water.
        </p>
        <ul>
          <li><strong>Water volume:</strong> Mostly aquatic with marginal plants at the surface.</li>
          <li><strong>Typical inhabitants:</strong> Fish, shrimp, snails, marginal plants like peace lily or pothos.</li>
          <li><strong>Equipment:</strong> Filter, lighting, plant hangers or foam supports.</li>
          <li><strong>Best for:</strong> Aquarists who want to add shoreline plants without building a land section.</li>
        </ul>
        <p>
          Ripariums are a great middle ground. They add vertical plant growth and natural filtration while staying
          simpler than a paludarium.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Other Specialized Enclosures</h2>
        <dl>
          <dt><strong>Formicarium</strong></dt>
          <dd>An ant farm or ant enclosure with tunnels and chambers, designed for keeping ant colonies.</dd>

          <dt><strong>Insectarium</strong></dt>
          <dd>An enclosure built for insects, such as stick insects, praying mantises, or beetles.</dd>

          <dt><strong>Serpentarium</strong></dt>
          <dd>A large enclosure designed specifically for snakes.</dd>

          <dt><strong>Aviary</strong></dt>
          <dd>A large bird enclosure, usually much bigger than a typical home enclosure.</dd>

          <dt><strong>Orchidarium</strong></dt>
          <dd>A humidity-controlled enclosure specialized for growing orchids.</dd>

          <dt><strong>Selva / Cloud Forest Tank</strong></dt>
          <dd>A high-humidity, cool enclosure that mimics cloud forest conditions for sensitive species.</dd>
        </dl>

        <h2 style={{ marginTop: '2.5rem' }}>How to Choose the Right Enclosure</h2>
        <p>Ask yourself a few questions before choosing:</p>
        <ol>
          <li><strong>What animal or plant do I want to keep?</strong> Its natural habitat should drive the enclosure type.</li>
          <li><strong>How much maintenance am I comfortable with?</strong> Fully aquatic and fully terrestrial setups are usually simpler than hybrid setups.</li>
          <li><strong>What is my budget?</strong> Paludariums and vivariums often need more specialized equipment.</li>
          <li><strong>How much space do I have?</strong> Larger water volumes are more stable but take up more room.</li>
        </ol>

        <div className="card" style={{ marginTop: '2.5rem', background: '#f8fafc' }}>
          <h3>Quick Comparison</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Water</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Focus</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>Aquarium</td>
                <td style={{ padding: '0.5rem' }}>Full</td>
                <td style={{ padding: '0.5rem' }}>Fish, aquatic plants</td>
                <td style={{ padding: '0.5rem' }}>Beginner–Advanced</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>Terrarium</td>
                <td style={{ padding: '0.5rem' }}>None–low</td>
                <td style={{ padding: '0.5rem' }}>Dry land plants/reptiles</td>
                <td style={{ padding: '0.5rem' }}>Beginner</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>Vivarium</td>
                <td style={{ padding: '0.5rem' }}>Low</td>
                <td style={{ padding: '0.5rem' }}>Live plants + animals</td>
                <td style={{ padding: '0.5rem' }}>Intermediate</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>Paludarium</td>
                <td style={{ padding: '0.5rem' }}>Partial</td>
                <td style={{ padding: '0.5rem' }}>Water + land</td>
                <td style={{ padding: '0.5rem' }}>Advanced</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>Riparium</td>
                <td style={{ padding: '0.5rem' }}>Mostly full</td>
                <td style={{ padding: '0.5rem' }}>Marginal shoreline plants</td>
                <td style={{ padding: '0.5rem' }}>Intermediate</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 style={{ marginTop: '2.5rem' }}>Final Thoughts</h2>
        <p>
          There is no single “best” enclosure type. The right choice depends on the species you want to keep, your
          budget, and how much time you can invest. Beginners often do well with a simple freshwater aquarium or a dry
          terrarium. As your skills grow, vivariums, paludariums, and ripariums offer exciting ways to create more
          complex, naturalistic displays.
        </p>
        <p>
          Whatever you choose, research your livestock first and build the environment around their needs. A healthy,
          thriving enclosure is always more rewarding than one that only looks good for a short time.
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
