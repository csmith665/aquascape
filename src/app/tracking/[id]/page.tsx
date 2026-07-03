import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import {
  SetupType,
  EnvironmentStatus,
  MaintenanceType,
  HealthStatus,
} from '@prisma/client';
import {
  updateEnvironment,
  deleteEnvironment,
  addWaterLog,
  deleteWaterLog,
  addMaintenanceLog,
  deleteMaintenanceLog,
  addFeedingLog,
  deleteFeedingLog,
  addLivestock,
  updateLivestockStatus,
  removeLivestock,
} from '../actions';

export const dynamic = 'force-dynamic';

const statusColors: Record<EnvironmentStatus, { bg: string; color: string }> = {
  SETUP: { bg: '#e7f3ff', color: '#1a5490' },
  CYCLING: { bg: '#fef3c7', color: '#92400e' },
  ACTIVE: { bg: '#d1fae5', color: '#065f46' },
  PROBLEM: { bg: '#fee2e2', color: '#991b1b' },
  ARCHIVED: { bg: '#e5e7eb', color: '#374151' },
};

const healthColors: Record<HealthStatus, { bg: string; color: string }> = {
  HEALTHY: { bg: '#d1fae5', color: '#065f46' },
  STRESSED: { bg: '#fef3c7', color: '#92400e' },
  SICK: { bg: '#fee2e2', color: '#991b1b' },
  DECEASED: { bg: '#374151', color: '#ffffff' },
  REMOVED: { bg: '#e5e7eb', color: '#374151' },
};

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString();
}

export default async function EnvironmentDetailPage({ params }: { params: { id: string } }) {
  const env = await prisma.tankEnvironment.findUnique({
    where: { id: params.id },
    include: {
      project: true,
      waterLogs: { orderBy: { date: 'desc' }, take: 20 },
      maintenanceLogs: { orderBy: { date: 'desc' }, take: 20 },
      feedingLogs: { orderBy: { date: 'desc' }, take: 20 },
      livestock: { orderBy: { dateAdded: 'desc' }, include: { animal: true, plant: true } },
    },
  });

  if (!env) notFound();

  const [animals, plants] = await Promise.all([
    prisma.animal.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.plant.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ]);

  const sc = statusColors[env.status];

  return (
    <>
      <div className="hero">
        <h1>{env.name}</h1>
        <p>
          {env.type.replace('_', ' ')} · {env.tankSize} gal
          {env.project && <> · linked to {env.project.name}</>}
        </p>
      </div>

      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Link href="/tracking" className="btn btn-secondary">← All Tanks</Link>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3>Environment Details</h3>
              <div style={{ marginTop: '0.5rem' }}>
                <span className="badge" style={{ background: '#e7f3ff', color: '#1a5490' }}>{env.type.replace('_', ' ')}</span>
                <span className="badge" style={{ background: sc.bg, color: sc.color }}>{env.status.toLowerCase()}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1rem', fontSize: '0.9rem' }}>
            <div><p style={{ color: '#999', margin: 0 }}>Size</p><p style={{ margin: '0.25rem 0 0' }}>{env.tankSize} gal</p></div>
            {env.length && <div><p style={{ color: '#999', margin: 0 }}>Length</p><p style={{ margin: '0.25rem 0 0' }}>{env.length}&quot;</p></div>}
            {env.width && <div><p style={{ color: '#999', margin: 0 }}>Width</p><p style={{ margin: '0.25rem 0 0' }}>{env.width}&quot;</p></div>}
            {env.height && <div><p style={{ color: '#999', margin: 0 }}>Height</p><p style={{ margin: '0.25rem 0 0' }}>{env.height}&quot;</p></div>}
            {env.startDate && <div><p style={{ color: '#999', margin: 0 }}>Started</p><p style={{ margin: '0.25rem 0 0' }}>{fmtDate(env.startDate)}</p></div>}
            <div><p style={{ color: '#999', margin: 0 }}>Created</p><p style={{ margin: '0.25rem 0 0' }}>{fmtDate(env.createdAt)}</p></div>
          </div>
          {env.notes && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '6px', fontSize: '0.9rem' }}>
              <strong>Notes:</strong> {env.notes}
            </div>
          )}
        </div>

        {/* Edit + Delete */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3>Edit Environment</h3>
          <form action={updateEnvironment} style={{ marginTop: '1rem' }}>
            <input type="hidden" name="id" value={env.id} />
            <div>
              <label>Name</label>
              <input name="name" type="text" required defaultValue={env.name} style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label>Setup Type</label>
                <select name="type" required defaultValue={env.type} style={{ width: '100%' }}>
                  {Object.values(SetupType).map((t) => (
                    <option key={t} value={t}>{t.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Status</label>
                <select name="status" defaultValue={env.status} style={{ width: '100%' }}>
                  {Object.values(EnvironmentStatus).map((s) => (
                    <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label>Tank Size (gal)</label>
                <input name="tankSize" type="number" required min="1" defaultValue={env.tankSize} style={{ width: '100%' }} />
              </div>
              <div>
                <label>Start Date</label>
                <input name="startDate" type="date" defaultValue={env.startDate ? new Date(env.startDate).toISOString().slice(0, 10) : ''} style={{ width: '100%' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label>Length (in)</label>
                <input name="length" type="number" min="0" step="0.1" defaultValue={env.length ?? ''} style={{ width: '100%' }} />
              </div>
              <div>
                <label>Width (in)</label>
                <input name="width" type="number" min="0" step="0.1" defaultValue={env.width ?? ''} style={{ width: '100%' }} />
              </div>
              <div>
                <label>Height (in)</label>
                <input name="height" type="number" min="0" step="0.1" defaultValue={env.height ?? ''} style={{ width: '100%' }} />
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label>Notes</label>
              <textarea name="notes" rows={2} defaultValue={env.notes ?? ''} style={{ width: '100%' }} />
            </div>
            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Save Changes</button>
          </form>

          <form action={deleteEnvironment} style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e1e8ed' }}>
            <input type="hidden" name="id" value={env.id} />
            <button type="submit" className="btn" style={{ background: '#b91c1c' }}>
              Delete Environment
            </button>
          </form>
        </div>

        {/* Water Parameters */}
        <h3 style={{ color: '#1a5490', marginBottom: '1rem' }}>Water Parameters</h3>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <form action={addWaterLog}>
            <input type="hidden" name="environmentId" value={env.id} />
            <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Log a reading</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
              <div><label>Temp (°F)</label><input name="temperature" type="number" step="0.1" style={{ width: '100%' }} /></div>
              <div><label>pH</label><input name="ph" type="number" step="0.1" style={{ width: '100%' }} /></div>
              <div><label>Ammonia</label><input name="ammonia" type="number" step="0.01" style={{ width: '100%' }} /></div>
              <div><label>Nitrite</label><input name="nitrite" type="number" step="0.01" style={{ width: '100%' }} /></div>
              <div><label>Nitrate</label><input name="nitrate" type="number" step="0.1" style={{ width: '100%' }} /></div>
              <div><label>GH</label><input name="gh" type="number" step="0.1" style={{ width: '100%' }} /></div>
              <div><label>KH</label><input name="kh" type="number" step="0.1" style={{ width: '100%' }} /></div>
              <div><label>Salinity</label><input name="salinity" type="number" step="0.001" style={{ width: '100%' }} /></div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <label>Notes</label>
              <input name="notes" type="text" style={{ width: '100%' }} />
            </div>
            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Add Reading</button>
          </form>
        </div>

        {env.waterLogs.length === 0 ? (
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>No water parameter logs yet.</p>
        ) : (
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th><th>Temp</th><th>pH</th><th>NH3</th><th>NO2</th><th>NO3</th><th>GH</th><th>KH</th><th>Sal</th><th></th>
                </tr>
              </thead>
              <tbody>
                {env.waterLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{fmtDate(log.date)}</td>
                    <td>{log.temperature ?? '-'}</td>
                    <td>{log.ph ?? '-'}</td>
                    <td>{log.ammonia ?? '-'}</td>
                    <td>{log.nitrite ?? '-'}</td>
                    <td>{log.nitrate ?? '-'}</td>
                    <td>{log.gh ?? '-'}</td>
                    <td>{log.kh ?? '-'}</td>
                    <td>{log.salinity ?? '-'}</td>
                    <td>
                      <form action={deleteWaterLog}>
                        <input type="hidden" name="id" value={log.id} />
                        <input type="hidden" name="environmentId" value={env.id} />
                        <button type="submit" style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', padding: 0 }}>✕</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Maintenance */}
        <h3 style={{ color: '#1a5490', marginBottom: '1rem' }}>Maintenance</h3>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <form action={addMaintenanceLog}>
            <input type="hidden" name="environmentId" value={env.id} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Type</label>
                <select name="type" required style={{ width: '100%' }}>
                  {Object.values(MaintenanceType).map((t) => (
                    <option key={t} value={t}>{t.replace('_', ' ').toLowerCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Water Change %</label>
                <input name="waterChangePercent" type="number" min="0" max="100" placeholder="e.g., 25" style={{ width: '100%' }} />
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <label>Description</label>
              <input name="description" type="text" style={{ width: '100%' }} />
            </div>
            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Log Maintenance</button>
          </form>
        </div>

        {env.maintenanceLogs.length === 0 ? (
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>No maintenance logs yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
            {env.maintenanceLogs.map((log) => (
              <li key={log.id} className="card" style={{ marginBottom: '0.75rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{log.type.replace('_', ' ').toLowerCase()}</strong>
                    {log.waterChangePercent != null && <> · {log.waterChangePercent}% water change</>}
                    <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>{fmtDate(log.date)}{log.description && <> — {log.description}</>}</p>
                  </div>
                  <form action={deleteMaintenanceLog}>
                    <input type="hidden" name="id" value={log.id} />
                    <input type="hidden" name="environmentId" value={env.id} />
                    <button type="submit" style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' }}>✕</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Feeding */}
        <h3 style={{ color: '#1a5490', marginBottom: '1rem' }}>Feeding</h3>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <form action={addFeedingLog}>
            <input type="hidden" name="environmentId" value={env.id} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Food Type</label>
                <input name="foodType" type="text" required placeholder="e.g., Flakes, Bloodworms" style={{ width: '100%' }} />
              </div>
              <div>
                <label>Amount</label>
                <input name="amount" type="text" placeholder="e.g., 2 pinches" style={{ width: '100%' }} />
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <label>Notes</label>
              <input name="notes" type="text" style={{ width: '100%' }} />
            </div>
            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Log Feeding</button>
          </form>
        </div>

        {env.feedingLogs.length === 0 ? (
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>No feeding logs yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
            {env.feedingLogs.map((log) => (
              <li key={log.id} className="card" style={{ marginBottom: '0.75rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{log.foodType}</strong>{log.amount && <> · {log.amount}</>}
                    <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>{fmtDate(log.date)}{log.notes && <> — {log.notes}</>}</p>
                  </div>
                  <form action={deleteFeedingLog}>
                    <input type="hidden" name="id" value={log.id} />
                    <input type="hidden" name="environmentId" value={env.id} />
                    <button type="submit" style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' }}>✕</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Livestock */}
        <h3 style={{ color: '#1a5490', marginBottom: '1rem' }}>Livestock</h3>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <form action={addLivestock}>
            <input type="hidden" name="environmentId" value={env.id} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Animal (from database)</label>
                <select name="animalId" style={{ width: '100%' }}>
                  <option value="">— None —</option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Plant (from database)</label>
                <select name="plantId" style={{ width: '100%' }}>
                  <option value="">— None —</option>
                  {plants.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
              <div>
                <label>Or custom name</label>
                <input name="name" type="text" placeholder="If not in DB" style={{ width: '100%' }} />
              </div>
              <div>
                <label>Quantity</label>
                <input name="quantity" type="number" min="1" defaultValue={1} style={{ width: '100%' }} />
              </div>
              <div>
                <label>Health</label>
                <select name="healthStatus" defaultValue="HEALTHY" style={{ width: '100%' }}>
                  {Object.values(HealthStatus).map((h) => (
                    <option key={h} value={h}>{h.charAt(0) + h.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <label>Notes</label>
              <input name="notes" type="text" style={{ width: '100%' }} />
            </div>
            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Add Livestock</button>
          </form>
        </div>

        {env.livestock.length === 0 ? (
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>No livestock tracked yet.</p>
        ) : (
          <div className="grid" style={{ marginBottom: '1.5rem' }}>
            {env.livestock.map((item) => {
              const hc = healthColors[item.healthStatus];
              const displayName = item.animal?.name ?? item.plant?.name ?? item.name ?? 'Unknown';
              return (
                <div key={item.id} className="card">
                  <h4>{displayName}</h4>
                  <p style={{ fontSize: '0.9rem' }}>Quantity: {item.quantity}</p>
                  <p style={{ fontSize: '0.85rem', color: '#999' }}>Added {fmtDate(item.dateAdded)}{item.dateRemoved && <> · removed {fmtDate(item.dateRemoved)}</>}</p>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className="badge" style={{ background: hc.bg, color: hc.color }}>{item.healthStatus.toLowerCase()}</span>
                  </div>
                  {item.notes && <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>{item.notes}</p>}
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <form action={updateLivestockStatus}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="environmentId" value={env.id} />
                      <select name="healthStatus" defaultValue={item.healthStatus} style={{ fontSize: '0.85rem', padding: '0.3rem' }}>
                        {Object.values(HealthStatus).map((h) => (
                          <option key={h} value={h}>{h.charAt(0) + h.slice(1).toLowerCase()}</option>
                        ))}
                      </select>
                      <button type="submit" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', marginLeft: '0.5rem' }}>Update</button>
                    </form>
                    <form action={removeLivestock}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="environmentId" value={env.id} />
                      <button type="submit" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>Remove</button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}