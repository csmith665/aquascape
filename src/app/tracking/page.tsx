import Link from 'next/link';
import { prisma } from '@/lib/db';
import { SetupType, EnvironmentStatus } from '@prisma/client';
import { createEnvironment } from './actions';

export const dynamic = 'force-dynamic';

const statusColors: Record<EnvironmentStatus, { bg: string; color: string }> = {
  SETUP: { bg: '#e7f3ff', color: '#1a5490' },
  CYCLING: { bg: '#fef3c7', color: '#92400e' },
  ACTIVE: { bg: '#d1fae5', color: '#065f46' },
  PROBLEM: { bg: '#fee2e2', color: '#991b1b' },
  ARCHIVED: { bg: '#e5e7eb', color: '#374151' },
};

export default async function TrackingPage() {
  const [environments, livestockCounts] = await Promise.all([
    prisma.tankEnvironment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { project: true, _count: { select: { waterLogs: true, maintenanceLogs: true, feedingLogs: true } } },
    }),
    prisma.trackedLivestock.groupBy({
      by: ['environmentId'],
      where: { dateRemoved: null },
      _count: { _all: true },
    }),
  ]);

  const livestockByEnv = new Map(livestockCounts.map((l) => [l.environmentId, l._count._all]));

  return (
    <>
      <div className="hero">
        <h1>My Tanks</h1>
        <p>Track water parameters, maintenance, feeding, and livestock health</p>
      </div>

      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: '#666', margin: 0 }}>{environments.length} environment(s)</p>
        </div>

        {environments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No Tanks Yet</h3>
            <p style={{ marginTop: '1rem', color: '#666' }}>
              Start tracking your aquarium or vivarium to monitor water quality,
              maintenance schedules, and livestock health over time.
            </p>
          </div>
        ) : (
          <div className="grid" style={{ marginBottom: '2rem' }}>
            {environments.map((env) => {
              const sc = statusColors[env.status];
              const livestock = livestockByEnv.get(env.id) ?? 0;
              return (
                <Link key={env.id} href={`/tracking/${env.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3>{env.name}</h3>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className="badge" style={{ background: '#e7f3ff', color: '#1a5490' }}>
                      {env.type.replace('_', ' ')}
                    </span>
                    <span className="badge" style={{ background: sc.bg, color: sc.color }}>
                      {env.status.toLowerCase()}
                    </span>
                  </div>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                    <p><strong>Size:</strong> {env.tankSize} gal</p>
                    {env.project && <p><strong>Build:</strong> {env.project.name}</p>}
                    <p><strong>Livestock:</strong> {livestock}</p>
                    <p style={{ fontSize: '0.8rem', color: '#999' }}>
                      Logs: {env._count.waterLogs} water · {env._count.maintenanceLogs} maint · {env._count.feedingLogs} feed
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="section">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3>Add a New Environment</h3>
          <p style={{ marginTop: '1rem' }}>
            Create a tracked environment to start logging water parameters, maintenance, feeding, and livestock.
          </p>

          <form action={createEnvironment} style={{ marginTop: '1.5rem' }}>
            <div>
              <label>Name</label>
              <input name="name" type="text" required placeholder="e.g., 55g Community Tank" style={{ width: '100%' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label>Setup Type</label>
                <select name="type" required style={{ width: '100%' }}>
                  {Object.values(SetupType).map((t) => (
                    <option key={t} value={t}>{t.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Status</label>
                <select name="status" style={{ width: '100%' }}>
                  {Object.values(EnvironmentStatus).map((s) => (
                    <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label>Tank Size (gal)</label>
                <input name="tankSize" type="number" required min="1" placeholder="e.g., 20" style={{ width: '100%' }} />
              </div>
              <div>
                <label>Start Date</label>
                <input name="startDate" type="date" style={{ width: '100%' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label>Length (in)</label>
                <input name="length" type="number" min="0" step="0.1" style={{ width: '100%' }} />
              </div>
              <div>
                <label>Width (in)</label>
                <input name="width" type="number" min="0" step="0.1" style={{ width: '100%' }} />
              </div>
              <div>
                <label>Height (in)</label>
                <input name="height" type="number" min="0" step="0.1" style={{ width: '100%' }} />
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label>Notes</label>
              <textarea name="notes" rows={3} placeholder="Optional notes about this environment" style={{ width: '100%' }} />
            </div>

            <button type="submit" className="btn" style={{ marginTop: '1.5rem', width: '100%' }}>
              Create Environment
            </button>
          </form>
        </div>
      </section>
    </>
  );
}