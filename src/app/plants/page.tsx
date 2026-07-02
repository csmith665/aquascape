import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function PlantsPage() {
  const plants = await prisma.plant.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <>
      <div className="hero">
        <h1>Plant Database</h1>
        <p>Aquatic and terrestrial plants for aquariums, paludariums, and vivariums</p>
      </div>

      <section className="section">
        <div className="grid">
          {plants.map((plant) => (
            <div key={plant.id} className="card">
              <h3>{plant.name}</h3>
              {plant.scientificName && (
                <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#999' }}>
                  {plant.scientificName}
                </p>
              )}
              <p style={{ marginTop: '0.5rem' }}>{plant.description}</p>
              
              <div style={{ marginTop: '1rem' }}>
                <span className={`badge badge-${plant.difficulty.toLowerCase()}`}>
                  {plant.difficulty}
                </span>
                <span className="badge" style={{ background: '#fff4e6', color: '#d97706' }}>
                  {plant.lightRequirement} Light
                </span>
                {plant.co2Required && (
                  <span className="badge" style={{ background: '#fce7f3', color: '#be185d' }}>
                    CO2 Required
                  </span>
                )}
              </div>

              {plant.placement && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                  <strong>Placement:</strong> {plant.placement}
                </p>
              )}

              {plant.growthRate && (
                <p style={{ fontSize: '0.9rem' }}>
                  <strong>Growth:</strong> {plant.growthRate}
                </p>
              )}

              <div style={{ marginTop: '0.75rem' }}>
                {plant.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="badge" style={{ background: '#f0f0f0', color: '#666' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
