import { prisma } from '@/lib/db';
import { checkCompatibility } from './actions';

export const dynamic = 'force-dynamic';

export default async function CompatibilityPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const animalAId = typeof searchParams.a === 'string' ? searchParams.a : undefined;
  const animalBId = typeof searchParams.b === 'string' ? searchParams.b : undefined;

  const animals = await prisma.animal.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, category: true },
  });

  const result = animalAId && animalBId ? await checkCompatibility(animalAId, animalBId) : null;

  const levelStyles = {
    COMPATIBLE: { bg: '#d1fae5', color: '#065f46', label: 'Compatible' },
    CAUTION: { bg: '#fef3c7', color: '#92400e', label: 'Caution' },
    INCOMPATIBLE: { bg: '#fee2e2', color: '#991b1b', label: 'Incompatible' },
  };

  return (
    <>
      <div className="hero">
        <h1>Compatibility Checker</h1>
        <p>See whether two animals can live together in the same setup</p>
      </div>

      <section className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <form className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Animal A</label>
              <select name="a" defaultValue={animalAId} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="">Choose an animal</option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name} ({animal.category.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Animal B</label>
              <select name="b" defaultValue={animalBId} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="">Choose an animal</option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name} ({animal.category.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button type="submit" className="btn">Check Compatibility</button>
            </div>
          </div>
        </form>

        {result && (
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>{result.animalA.name} + {result.animalB.name}</h2>
              <span
                className="badge"
                style={{
                  background: levelStyles[result.level].bg,
                  color: levelStyles[result.level].color,
                  fontSize: '1rem',
                  padding: '0.4rem 0.8rem',
                }}
              >
                {levelStyles[result.level].label}
              </span>
            </div>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>{result.notes}</p>
          </div>
        )}

        <div className="card" style={{ marginTop: '1.5rem', background: '#f8fafc' }}>
          <h3>How compatibility is determined</h3>
          <ul style={{ lineHeight: 1.7 }}>
            <li><strong>Explicit rules:</strong> Curated pairings from the database (e.g., neon tetra + angelfish).</li>
            <li><strong>Enclosure type:</strong> Animals needing different habitats are incompatible.</li>
            <li><strong>Temperament:</strong> Aggressive species are flagged as incompatible with peaceful ones.</li>
            <li><strong>Size:</strong> Large size differences may lead to predation.</li>
            <li><strong>Water parameters:</strong> Temperature and pH mismatches trigger cautions or incompatibilities.</li>
          </ul>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Always research individual species before mixing them. This checker is a guide, not a guarantee.
          </p>
        </div>
      </section>
    </>
  );
}
