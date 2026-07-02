import { prisma } from '@/lib/db';
import { Difficulty, AnimalCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function AnimalsPage() {
  const animals = await prisma.animal.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <>
      <div className="hero">
        <h1>Animal Database</h1>
        <p>Browse fish, invertebrates, amphibians, and reptiles for your setup</p>
      </div>

      <section className="section">
        <div className="grid">
          {animals.map((animal) => (
            <div key={animal.id} className="card">
              <h3>{animal.name}</h3>
              {animal.scientificName && (
                <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#999' }}>
                  {animal.scientificName}
                </p>
              )}
              <p style={{ marginTop: '0.5rem' }}>{animal.description}</p>
              
              <div style={{ marginTop: '1rem' }}>
                <span className={`badge badge-${animal.difficulty.toLowerCase()}`}>
                  {animal.difficulty}
                </span>
                {animal.temperament && (
                  <span className="badge" style={{ background: '#e7f3ff', color: '#1a5490' }}>
                    {animal.temperament}
                  </span>
                )}
              </div>

              {animal.minTankSize && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                  <strong>Min Tank:</strong> {animal.minTankSize} gallons
                </p>
              )}

              {animal.tempMin && animal.tempMax && (
                <p style={{ fontSize: '0.9rem' }}>
                  <strong>Temp:</strong> {animal.tempMin}°F - {animal.tempMax}°F
                </p>
              )}

              <div style={{ marginTop: '0.75rem' }}>
                {animal.tags.slice(0, 3).map((tag) => (
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
