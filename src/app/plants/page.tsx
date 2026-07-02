import { prisma } from '@/lib/db';
import { Difficulty, PlantCategory, LightLevel, Habitat } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function PlantsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const difficulty = typeof searchParams.difficulty === 'string' ? searchParams.difficulty : undefined;
  const light = typeof searchParams.light === 'string' ? searchParams.light : undefined;
  const habitat = typeof searchParams.habitat === 'string' ? searchParams.habitat : undefined;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  const plants = await prisma.plant.findMany({
    where: {
      AND: [
        category ? { category: category as PlantCategory } : {},
        difficulty ? { difficulty: difficulty as Difficulty } : {},
        light ? { lightRequirement: light as LightLevel } : {},
        habitat ? { habitats: { has: habitat as Habitat } } : {},
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
        <h1>Plant Database</h1>
        <p>Aquatic and terrestrial plants for your setup</p>
      </div>

      <section className="section">
        <form className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Search</label>
              <input name="search" defaultValue={search} placeholder="Name, tag..." style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Category</label>
              <select name="category" defaultValue={category} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="">All</option>
                {Object.values(PlantCategory).map((c) => (
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
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Light</label>
              <select name="light" defaultValue={light} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="">All</option>
                {Object.values(LightLevel).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <button type="submit" className="btn">Filter</button>
              <a href="/plants" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>Clear</a>
            </div>
          </div>
        </form>

        <p style={{ marginBottom: '1rem', color: '#666' }}>{plants.length} plant(s) found</p>

        <div className="grid">
          {plants.map((plant) => (
            <div key={plant.id} className="card">
              {plant.imageUrl && (
                <img src={plant.imageUrl} alt={plant.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '1rem' }} />
              )}
              <h3>{plant.name}</h3>
              {plant.scientificName && <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#999' }}>{plant.scientificName}</p>}
              <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{plant.description}</p>
              <div style={{ marginTop: '0.75rem' }}>
                <span className={`badge badge-${plant.difficulty.toLowerCase()}`}>{plant.difficulty}</span>
                <span className="badge" style={{ background: '#fff4e6', color: '#d97706' }}>{plant.lightRequirement} Light</span>
                {plant.co2Required && <span className="badge" style={{ background: '#fce7f3', color: '#be185d' }}>CO2</span>}
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                {plant.placement && <p><strong>Placement:</strong> {plant.placement}</p>}
                {plant.maxHeight && <p><strong>Height:</strong> {plant.maxHeight}"</p>}
              </div>
              {plant.careGuide && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <strong>Care:</strong> {plant.careGuide}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
