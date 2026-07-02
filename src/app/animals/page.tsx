import { prisma } from '@/lib/db';
import { Difficulty, AnimalCategory, Habitat, Biome } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function AnimalsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const difficulty = typeof searchParams.difficulty === 'string' ? searchParams.difficulty : undefined;
  const habitat = typeof searchParams.habitat === 'string' ? searchParams.habitat : undefined;
  const biome = typeof searchParams.biome === 'string' ? searchParams.biome : undefined;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  const animals = await prisma.animal.findMany({
    where: {
      AND: [
        category ? { category: category as AnimalCategory } : {},
        difficulty ? { difficulty: difficulty as Difficulty } : {},
        habitat ? { habitats: { has: habitat as Habitat } } : {},
        biome ? { biome: biome as Biome } : {},
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { scientificName: { contains: search, mode: 'insensitive' } },
                { tags: { has: search.toLowerCase() } },
              ],
            }
          : {},
      ],
    },
    orderBy: { name: 'asc' },
  });

  return (
    <>
      <div className="hero">
        <h1>Animal Database</h1>
        <p>Browse fish, invertebrates, amphibians, and reptiles</p>
      </div>

      <section className="section">
        <form className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Search</label>
              <input name="search" defaultValue={search} placeholder="Name, scientific name, tag..." style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Category</label>
              <select name="category" defaultValue={category} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="">All</option>
                {Object.values(AnimalCategory).map((c) => (
                  <option key={c} value={c}>{c.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Difficulty</label>
              <select name="difficulty" defaultValue={difficulty} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="">All</option>
                {Object.values(Difficulty).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Habitat</label>
              <select name="habitat" defaultValue={habitat} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="">All</option>
                {Object.values(Habitat).map((h) => (
                  <option key={h} value={h}>{h.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Environment / Biome</label>
              <select name="biome" defaultValue={biome} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="">All</option>
                {Object.values(Biome).map((b) => (
                  <option key={b} value={b}>{b.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <button type="submit" className="btn">Filter</button>
              <a href="/animals" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>Clear</a>
            </div>
          </div>
        </form>

        <p style={{ marginBottom: '1rem', color: '#666' }}>{animals.length} animal(s) found</p>

        <div className="grid">
          {animals.map((animal) => (
            <div key={animal.id} className="card">
              {animal.imageUrl && (
                <img src={animal.imageUrl} alt={animal.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '1rem' }} />
              )}
              <h3>{animal.name}</h3>
              {animal.scientificName && <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#999' }}>{animal.scientificName}</p>}
              <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{animal.description}</p>
              <div style={{ marginTop: '0.75rem' }}>
                <span className={`badge badge-${animal.difficulty.toLowerCase()}`}>{animal.difficulty}</span>
                <span className="badge" style={{ background: '#e7f3ff', color: '#1a5490' }}>{animal.category.replace('_', ' ')}</span>
                {animal.habitats.map((h) => (
                  <span key={h} className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>{h.replace('_', ' ')}</span>
                ))}
                {animal.biome && (
                  <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>{animal.biome.replace(/_/g, ' ')}</span>
                )}
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                {animal.minTankSize && <p><strong>Min Tank:</strong> {animal.minTankSize} gal</p>}
                {animal.tempMin && animal.tempMax && <p><strong>Temp:</strong> {animal.tempMin}°F - {animal.tempMax}°F</p>}
                {animal.phMin && animal.phMax && <p><strong>pH:</strong> {animal.phMin} - {animal.phMax}</p>}
              </div>
              {animal.careGuide && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <strong>Care:</strong> {animal.careGuide}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
