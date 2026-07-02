import Link from 'next/link';

export default function PlantCareBasicsArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Aquarium Plant Care Basics</h1>
        <p>Lighting, nutrients, CO2, and simple maintenance for healthy plants</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: '#555', lineHeight: 1.7 }}>
          Healthy plants make an aquarium more beautiful, more stable, and more natural for fish. Plants absorb ammonia,
          nitrate, and carbon dioxide while producing oxygen. Keeping them healthy comes down to balancing light,
          nutrients, and carbon.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Light Is the Engine</h2>
        <p>
          Light drives plant growth. Too little and plants stop growing. Too much without enough nutrients and CO2
          causes algae. Most beginner plants do well under low to medium light.
        </p>
        <ul>
          <li><strong>Low light:</strong> Java fern, anubias, cryptocoryne, java moss, hornwort.</li>
          <li><strong>Medium light:</strong> Amazon sword, water wisteria, vallisneria, Ludwigia.</li>
          <li><strong>High light:</strong> Monte Carlo, dwarf hairgrass, Rotala, carpeting plants.</li>
        </ul>
        <p>
          Use a timer to provide 6-8 hours of light per day at first. Increase gradually if plants grow well and algae
          stays under control.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Nutrients: What Plants Need</h2>
        <p>
          Plants need macronutrients (nitrogen, phosphorus, potassium) and micronutrients (iron, magnesium, trace minerals).
          Fish waste provides some nitrogen, but other nutrients often run low over time.
        </p>
        <ul>
          <li><strong>Root feeders:</strong> Amazon swords and cryptocoryne benefit from root tabs near their roots.</li>
          <li><strong>Water column feeders:</strong> Java fern and anubias absorb nutrients from the water; liquid fertilizer helps.</li>
          <li><strong>All-in-one liquid fertilizers:</strong> Easy to dose and good for low-tech tanks.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Carbon Dioxide (CO2)</h2>
        <p>
          CO2 is often the limiting factor in plant growth. Low-tech tanks without CO2 can still grow many plants,
          especially low-light species. High-tech tanks with injected CO2 allow dense, fast-growing carpets but require
          more maintenance and balance.
        </p>
        <p>
          For beginners, focus on low-tech plants first. Add CO2 only after you understand how light and nutrients
          interact in your tank.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Substrate Matters</h2>
        <p>
          Plants root better in fine gravel or aquarium soil than in large pebbles. Aquarium soil lowers pH and releases
          nutrients over time. Inert substrates like sand or gravel work fine if you use root tabs.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Planting Tips</h2>
        <ul>
          <li>Rinse new plants gently and remove damaged leaves before planting.</li>
          <li>Do not bury the rhizome of anubias or java fern. Attach them to rock or wood instead.</li>
          <li>Plant stem plants in groups of several stems for a fuller look.</li>
          <li>Give fast-growing plants room to spread.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Maintenance</h2>
        <ul>
          <li>Remove yellow or dying leaves promptly.</li>
          <li>Trim stem plants and replant the cuttings to propagate.</li>
          <li>Clean algae from plant leaves with a soft brush or by hand.</li>
          <li>Expect some melting after planting or moving; new growth usually follows.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Common Problems</h2>
        <ul>
          <li><strong>Yellow leaves:</strong> Often a nitrogen or iron deficiency.</li>
          <li><strong>Stunted growth:</strong> Usually insufficient light, CO2, or nutrients.</li>
          <li><strong>Algae on leaves:</strong> Too much light or imbalance between light and nutrients.</li>
          <li><strong>Melting:</strong> Normal for crypts; trim old leaves and wait for new growth.</li>
        </ul>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>
            ← Back to Guides
          </Link>
          <Link href="/plants" className="btn">
            Browse Plants
          </Link>
        </div>
      </article>
    </>
  );
}
