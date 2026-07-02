import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <div className="hero">
        <h1>Aquascape</h1>
        <p>Plan, build, and track your aquariums and vivariums</p>
      </div>

      <section className="section">
        <h2>Get Started</h2>
        <div className="grid">
          <div className="card">
            <h3>Animal Database</h3>
            <p>Browse fish, invertebrates, reptiles, and more. Filter by difficulty, temperament, and tank requirements.</p>
            <Link href="/animals" className="btn" style={{ marginTop: '1rem' }}>
              Browse Animals
            </Link>
          </div>

          <div className="card">
            <h3>Plant Database</h3>
            <p>Find aquatic and terrestrial plants. Filter by light needs, growth rate, and placement.</p>
            <Link href="/plants" className="btn" style={{ marginTop: '1rem' }}>
              Browse Plants
            </Link>
          </div>

          <div className="card">
            <h3>Tank Builder</h3>
            <p>Design your setup with compatibility checking. Get recommendations based on your skill level.</p>
            <Link href="/builder" className="btn" style={{ marginTop: '1rem' }}>
              Start Building
            </Link>
          </div>

          <div className="card">
            <h3>Saved Builds</h3>
            <p>Revisit your tank builder projects, review parameters, and revisit recommendations.</p>
            <Link href="/projects" className="btn" style={{ marginTop: '1rem' }}>
              My Builds
            </Link>
          </div>

          <div className="card">
            <h3>Product Guide</h3>
            <p>Find the right filters, heaters, lighting, and more. Curated recommendations by budget.</p>
            <Link href="/products" className="btn" style={{ marginTop: '1rem' }}>
              View Products
            </Link>
          </div>

          <div className="card">
            <h3>Compatibility Checker</h3>
            <p>Check whether two animals can live together based on temperament, size, and water needs.</p>
            <Link href="/compatibility" className="btn" style={{ marginTop: '1rem' }}>
              Check Pairings
            </Link>
          </div>

          <div className="card">
            <h3>Setup Checklist</h3>
            <p>Follow a step-by-step interactive checklist to plan, build, and stock your first environment.</p>
            <Link href="/setup-checklist" className="btn" style={{ marginTop: '1rem' }}>
              Start Checklist
            </Link>
          </div>

          <div className="card">
            <h3>Track Your Tanks</h3>
            <p>Log water parameters, maintenance, and feeding. Monitor livestock health over time.</p>
            <Link href="/tracking" className="btn" style={{ marginTop: '1rem' }}>
              My Tanks
            </Link>
          </div>

          <div className="card">
            <h3>Beginner Guides</h3>
            <p>New to the hobby? Start here with step-by-step guides for setting up your first tank.</p>
            <Link href="/guides" className="btn" style={{ marginTop: '1rem' }}>
              Read Guides
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
