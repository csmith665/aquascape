import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { deleteProject } from '../actions';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await prisma.builderProject.findUnique({
    where: { id: params.id },
    include: {
      entries: {
        include: { animal: true, plant: true },
        orderBy: { id: 'asc' },
      },
      environments: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!project) notFound();

  const animalEntries = project.entries.filter((e) => e.animalId);
  const plantEntries = project.entries.filter((e) => e.plantId);

  return (
    <>
      <div className="hero">
        <h1>{project.name}</h1>
        <p>
          {project.type.replace('_', ' ')}
          {project.biome && <> · {project.biome.replace(/_/g, ' ')}</>}
          {' · '}{project.tankSize} gallons
        </p>
      </div>

      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Link href="/projects" className="btn btn-secondary">← All Builds</Link>
          <Link href="/builder" className="btn">New Build</Link>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3>Build Parameters</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginTop: '1rem', fontSize: '0.95rem' }}>
            <div>
              <p style={{ color: '#999', margin: 0 }}>Setup Type</p>
              <p style={{ margin: '0.25rem 0 0' }}>{project.type.replace('_', ' ')}</p>
            </div>
            {project.biome && (
              <div>
                <p style={{ color: '#999', margin: 0 }}>Biome</p>
                <p style={{ margin: '0.25rem 0 0' }}>{project.biome.replace(/_/g, ' ')}</p>
              </div>
            )}
            <div>
              <p style={{ color: '#999', margin: 0 }}>Tank Size</p>
              <p style={{ margin: '0.25rem 0 0' }}>{project.tankSize} gal</p>
            </div>
            <div>
              <p style={{ color: '#999', margin: 0 }}>Skill Level</p>
              <p style={{ margin: '0.25rem 0 0' }}>{project.skillLevel}</p>
            </div>
            <div>
              <p style={{ color: '#999', margin: 0 }}>Maintenance</p>
              <p style={{ margin: '0.25rem 0 0' }}>{project.maintenancePref.toLowerCase()}</p>
            </div>
            {project.budget && (
              <div>
                <p style={{ color: '#999', margin: 0 }}>Budget</p>
                <p style={{ margin: '0.25rem 0 0' }}>{project.budget.replace('_', ' ')}</p>
              </div>
            )}
            <div>
              <p style={{ color: '#999', margin: 0 }}>Created</p>
              <p style={{ margin: '0.25rem 0 0' }}>{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {project.notes && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '6px', fontSize: '0.9rem' }}>
              <strong>Notes:</strong> {project.notes}
            </div>
          )}
        </div>

        <h3 style={{ color: '#1a5490', marginBottom: '1rem' }}>
          Livestock ({animalEntries.length})
        </h3>
        {animalEntries.length === 0 ? (
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>No livestock added to this build.</p>
        ) : (
          <div className="grid" style={{ marginBottom: '1.5rem' }}>
            {animalEntries.map((entry) => (
              <div key={entry.id} className="card">
                <h4>{entry.animal?.name ?? 'Unknown animal'}</h4>
                <p style={{ fontSize: '0.9rem' }}>Quantity: {entry.quantity}</p>
                {entry.animal && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className={`badge badge-${entry.animal.difficulty.toLowerCase()}`}>{entry.animal.difficulty}</span>
                  </div>
                )}
                {entry.notes && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>{entry.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <h3 style={{ color: '#1a5490', marginBottom: '1rem' }}>
          Plants ({plantEntries.length})
        </h3>
        {plantEntries.length === 0 ? (
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>No plants added to this build.</p>
        ) : (
          <div className="grid" style={{ marginBottom: '1.5rem' }}>
            {plantEntries.map((entry) => (
              <div key={entry.id} className="card">
                <h4>{entry.plant?.name ?? 'Unknown plant'}</h4>
                <p style={{ fontSize: '0.9rem' }}>Quantity: {entry.quantity}</p>
                {entry.plant && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className="badge" style={{ background: '#fff4e6', color: '#92400e' }}>
                      {entry.plant.lightRequirement.replace('_', ' ')} Light
                    </span>
                  </div>
                )}
                {entry.notes && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>{entry.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {project.environments.length > 0 && (
          <>
            <h3 style={{ color: '#1a5490', marginBottom: '1rem' }}>
              Tracked Environments ({project.environments.length})
            </h3>
            <div className="grid" style={{ marginBottom: '1.5rem' }}>
              {project.environments.map((env) => (
                <Link key={env.id} href="/tracking" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h4>{env.name}</h4>
                  <p style={{ fontSize: '0.9rem' }}>Type: {env.type.replace('_', ' ')} · {env.tankSize} gal</p>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className="badge" style={{ background: '#e7f3ff', color: '#1a5490' }}>{env.status.toLowerCase()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="card" style={{ marginTop: '2rem', borderColor: '#f5c6cb' }}>
          <h3 style={{ color: '#4a0d12' }}>Delete Build</h3>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Permanently remove this project and all of its entries. This cannot be undone.
          </p>
          <form action={deleteProject} style={{ marginTop: '1rem' }}>
            <input type="hidden" name="id" value={project.id} />
            <button type="submit" className="btn" style={{ background: '#b91c1c' }}>
              Delete Build
            </button>
          </form>
        </div>
      </section>
    </>
  );
}