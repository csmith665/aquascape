'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSavedBuilds, SavedBuild } from './actions';

export function SavedBuildsList() {
  const [builds, setBuilds] = useState<SavedBuild[] | null>(null);

  useEffect(() => {
    getSavedBuilds().then(setBuilds).catch(() => setBuilds([]));
  }, []);

  if (!builds) return null;

  if (builds.length === 0) {
    return (
      <p style={{ color: '#666' }}>No saved builds yet — generate one above to get started.</p>
    );
  }

  return (
    <div className="grid">
      {builds.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h4>{project.name}</h4>
          <div style={{ marginTop: '0.4rem' }}>
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
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
            <p style={{ margin: 0 }}>{project.tankSize} gal · {project.maintenancePref.toLowerCase()} maintenance</p>
            <p style={{ fontSize: '0.8rem', color: '#999', margin: '0.25rem 0 0' }}>
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
