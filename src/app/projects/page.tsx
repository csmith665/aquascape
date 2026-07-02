import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await prisma.builderProject.findMany({
    include: { _count: { select: { entries: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <div className="hero">
        <h1>Saved Builds</h1>
        <p>Review, revisit, and manage your tank builder projects</p>
      </div>

      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: '#666', margin: 0 }}>{projects.length} saved build(s)</p>
          <Link href="/builder" className="btn">New Build</Link>
        </div>

        {projects.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No Saved Builds Yet</h3>
            <p style={{ marginTop: '1rem', color: '#666' }}>
              Use the Tank Builder to design a setup. Your saved projects will appear here
              so you can revisit recommendations later.
            </p>
            <Link href="/builder" className="btn" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
              Start Building
            </Link>
          </div>
        ) : (
          <div className="grid">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>{project.name}</h3>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className="badge" style={{ background: '#e7f3ff', color: '#1a5490' }}>
                    {project.type.replace('_', ' ')}
                  </span>
                  {project.biome && (
                    <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                      {project.biome.replace(/_/g, ' ')}
                    </span>
                  )}
                  <span className={`badge badge-${project.skillLevel.toLowerCase()}`}>
                    {project.skillLevel}
                  </span>
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                  <p><strong>Tank Size:</strong> {project.tankSize} gal</p>
                  <p><strong>Maintenance:</strong> {project.maintenancePref.toLowerCase()}</p>
                  <p><strong>Entries:</strong> {project._count.entries}</p>
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#999' }}>
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}