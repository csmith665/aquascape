'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Biome, CompatibilityLevel, ProductCategory, SetupType } from '@prisma/client';
import { buildRecommendation, saveBuild, BuildResult } from './actions';
import { SavedBuildsList } from './SavedBuildsList';
import { ShoppingListModal, ShoppingItem } from './ShoppingListModal';
import { generateStockingGuidance } from '@/lib/stocking';
import { assessCompatibility } from '@/lib/compatibility';
import { ProductImage } from '@/components/ProductImage';

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const humanize = (s: string) =>
  s
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const PRODUCT_CATEGORY_ORDER: ProductCategory[] = [
  ProductCategory.FILTER,
  ProductCategory.HEATER,
  ProductCategory.LIGHTING,
  ProductCategory.CO2_SYSTEM,
  ProductCategory.AIR_PUMP,
  ProductCategory.TESTING,
  ProductCategory.WATER_TREATMENT,
  ProductCategory.CLEANING,
  ProductCategory.HOSE_TUBING,
  ProductCategory.TOOL,
  ProductCategory.FOOD,
  ProductCategory.SUBSTRATE,
  ProductCategory.HARDSCAPE,
  ProductCategory.DECORATION,
  ProductCategory.SUPPLEMENT,
  ProductCategory.OTHER,
];

export default function BuilderPage() {
  const [result, setResult] = useState<BuildResult | null>(null);
  const [pending, setPending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setSavedId(null);
    const res = await buildRecommendation(formData);
    setResult(res);
    setShoppingList([]);
    setShowShoppingList(false);
    setPending(false);
  }

  function toggleItem(item: ShoppingItem, checked: boolean) {
    setShoppingList((prev) => {
      if (checked) {
        return prev.some((p) => p.id === item.id) ? prev : [...prev, item];
      }
      return prev.filter((p) => p.id !== item.id);
    });
  }

  function updateQuantity(id: string, qty: number) {
    setShoppingList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, Math.min(999, qty)) } : p))
    );
  }

  async function handleSave(formData: FormData) {
    setSaving(true);
    const res = await saveBuild(formData);
    setSavedId(res.projectId);
    setSaving(false);
  }

  const livestockCount = shoppingList.filter((i) => i.section === 'livestock').length;
  const plantCount = shoppingList.filter((i) => i.section === 'plants').length;
  const totalSelected = shoppingList.length;

  // Live pairwise compatibility across the animals the user has actually checked.
  // Uses the explicit rules pre-fetched in BuildResult plus the rule-based
  // assessment in src/lib/compatibility.ts.
  const compatAssessments = useMemo(() => {
    if (!result) return [];
    const selectedAnimals = shoppingList
      .filter((i) => i.section === 'livestock')
      .map((i) => {
        const a = result.animals.find((x) => x.id === i.id.replace('animal-', ''));
        return a ? { id: a.id, name: a.name, animal: a, qty: i.quantity } : null;
      })
      .filter((x): x is { id: string; name: string; animal: typeof result.animals[number]; qty: number } => x !== null);

    const ruleKey = (a: string, b: string) => [a, b].sort().join('|');
    const rules = new Map(
      (result.compatRules ?? []).map((r) => [ruleKey(r.aId, r.bId), r])
    );

    const out: { aName: string; bName: string; level: CompatibilityLevel; notes: string[]; explicit: boolean }[] = [];
    for (let i = 0; i < selectedAnimals.length; i++) {
      for (let j = i + 1; j < selectedAnimals.length; j++) {
        const a = selectedAnimals[i].animal;
        const b = selectedAnimals[j].animal;
        const rule = rules.get(ruleKey(a.id, b.id));
        const { level, notes, explicit } = assessCompatibility(a, b, rule?.level, rule?.notes);
        if (level !== CompatibilityLevel.COMPATIBLE) {
          out.push({ aName: a.name, bName: b.name, level, notes, explicit });
        }
      }
    }
    return out;
  }, [shoppingList, result]);

  const incompatibleCount = compatAssessments.filter((c) => c.level === CompatibilityLevel.INCOMPATIBLE).length;
  const cautionCount = compatAssessments.filter((c) => c.level === CompatibilityLevel.CAUTION).length;

  return (
    <>
      <div className="hero">
        <h1>Tank Builder</h1>
        <p>Design your aquarium or vivarium with compatibility checking</p>
      </div>

      <section className="section">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3>Start a New Build</h3>
          <p style={{ marginTop: '1rem' }}>
            Answer a few questions and we&apos;ll help you create a compatible setup
            tailored to your skill level and maintenance preferences.
          </p>

          <form action={handleSubmit}>
            <div style={{ marginTop: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Build Name
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="e.g., My First Community Tank"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Setup Type
              </label>
              <select
                name="type"
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
              >
                <option value="FRESHWATER">Freshwater Aquarium</option>
                <option value="SALTWATER">Saltwater Aquarium</option>
                <option value="BRACKISH">Brackish Aquarium</option>
                <option value="PALUDARIUM">Paludarium</option>
                <option value="VIVARIUM">Vivarium</option>
                <option value="TERRARIUM">Terrarium</option>
                <option value="RIPARIUM">Riparium</option>
              </select>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Environment / Biome <span style={{ fontWeight: 400, color: '#666' }}>(optional)</span>
              </label>
              <select
                name="biome"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
              >
                <option value="">Any environment</option>
                {Object.values(Biome).map((b) => (
                  <option key={b} value={b}>
                    {b.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                Narrow results to a specific environment like Desert, Tropical Rainforest, or River.
              </p>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Tank Size (gallons)
              </label>
              <input
                name="tankSize"
                type="number"
                required
                min="1"
                max="1000"
                placeholder="e.g., 20"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Your Experience Level
              </label>
              <select
                name="skillLevel"
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Maintenance Preference
              </label>
              <select
                name="maintenancePref"
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
              >
                <option value="LOW">Low Maintenance</option>
                <option value="MODERATE">Moderate Maintenance</option>
                <option value="HIGH">High Maintenance</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="btn"
              style={{ marginTop: '2rem', width: '100%' }}
            >
              {pending ? 'Generating...' : 'Get Recommendations'}
            </button>
          </form>
        </div>
      </section>

      <section className="section">
        <h2>Your Saved Builds</h2>
        <SavedBuildsList />
      </section>

      {result && (
        <section className="section">
          <h2>Recommendations for {result.params.name}</h2>
          {savedId && (
            <div className="card" style={{ background: 'var(--color-success-soft)', color: 'var(--color-success)', marginBottom: '1.5rem' }}>
              <h3>Build saved!</h3>
              <p style={{ marginBottom: '0.5rem' }}>
                {livestockCount} animal{livestockCount === 1 ? '' : 's'} and {plantCount} plant{plantCount === 1 ? '' : 's'} saved to your build.
              </p>
              {livestockCount > 1 && (
                <p style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  {incompatibleCount > 0 || cautionCount > 0 ? (
                    <>
                      <strong style={{ color: incompatibleCount > 0 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                        Compatibility:
                      </strong>{' '}
                      {incompatibleCount > 0 && `${incompatibleCount} incompatible pair${incompatibleCount === 1 ? '' : 's'}`}
                      {incompatibleCount > 0 && cautionCount > 0 ? ', ' : ''}
                      {cautionCount > 0 && `${cautionCount} caution${cautionCount === 1 ? '' : 's'}`}
                      {' — review in Selections above.'}
                    </>
                  ) : (
                    <span style={{ color: 'var(--color-success)' }}>No compatibility conflicts among selected livestock.</span>
                  )}
                </p>
              )}
              <p style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Saved builds store livestock and plants. Use the Shopping List to capture equipment, substrate, and hardscape.
              </p>
              <Link href={`/projects/${savedId}`} className="btn" style={{ display: 'inline-block' }}>
                View saved build →
              </Link>
            </div>
          )}

          {result.warnings.length > 0 && (
            <div className="card" style={{ background: '#fff3cd', color: '#856404', marginBottom: '1.5rem' }}>
              <h3>⚠️ Important Considerations</h3>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                {result.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <details className="callout" open>
            <summary>How many can fit in this tank?</summary>
            <div className="callout-body">
              <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem', marginBottom: '1rem' }}>
                Beginner-friendly guidance based on your tank size and setup type.
              </p>
              {(() => {
                const guide = generateStockingGuidance(result.params.type, result.params.tankSize);
                return (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ padding: '0.85rem 1rem', background: 'var(--color-info-soft)', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: 'var(--color-info)' }}>Livestock</strong>
                      <p style={{ fontSize: '0.95rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>{guide.animalRule}</p>
                      <p style={{ fontSize: '0.95rem', marginTop: 0, marginBottom: 0, fontWeight: 600 }}>{guide.animalEstimate}</p>
                    </div>
                    <div style={{ padding: '0.85rem 1rem', background: 'var(--color-success-soft)', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: 'var(--color-success)' }}>Plants</strong>
                      <p style={{ fontSize: '0.95rem', marginTop: '0.25rem', marginBottom: 0 }}>{guide.plantAdvice}</p>
                    </div>
                    <div style={{ padding: '0.85rem 1rem', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                      <strong>Things to keep in mind</strong>
                      <ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                        {guide.caveats.map((c, i) => (
                          <li key={i} style={{ marginBottom: '0.25rem' }}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </div>
          </details>

          {(() => {
            const aquaticTypes: SetupType[] = [
              SetupType.FRESHWATER, SetupType.SALTWATER, SetupType.BRACKISH,
              SetupType.PALUDARIUM, SetupType.RIPARIUM,
            ];
            const terrTypes: SetupType[] = [SetupType.VIVARIUM, SetupType.TERRARIUM];
            const aq = aquaticTypes.includes(result.params.type);
            const terr = terrTypes.includes(result.params.type);
            const isReef = result.params.biome === Biome.REEF || result.params.biome === Biome.MARINE;
            const guideLinks: { href: string; label: string }[] = [];
            if (aq) {
              guideLinks.push({ href: '/articles/setup-cycling', label: 'Cycling the tank' });
              guideLinks.push({ href: '/articles/setup-water', label: isReef ? 'Water chemistry (reef)' : 'Water chemistry' });
              guideLinks.push({ href: '/articles/setup-temperature', label: 'Temperature & heating' });
            }
            const plantedTypes: SetupType[] = [SetupType.FRESHWATER, SetupType.PALUDARIUM, SetupType.RIPARIUM];
            if (plantedTypes.includes(result.params.type) || terr) {
              guideLinks.push({ href: '/articles/setup-lighting', label: 'Lighting' });
            }
            if (terr) {
              guideLinks.push({ href: '/articles/setup-environment', label: 'Humidity & environment' });
            }
            guideLinks.push({ href: '/articles/setup-stocking', label: 'Stocking your tank' });
            guideLinks.push({ href: '/articles/setup-maintenance', label: 'Maintenance philosophy' });
            guideLinks.push({ href: '/articles/setup-safety', label: 'Safety & setup' });
            return (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3>Setup notes — further reading</h3>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                  Tailored to your {result.params.type.replace('_', ' ').toLowerCase()} build. Open in a new tab to keep your selections in place.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {guideLinks.map((g) => (
                    <a
                      key={g.href}
                      href={g.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
                    >
                      {g.label} →
                    </a>
                  ))}
                </div>
              </div>
            );
          })()}

          {result.animals.length === 0 && result.plants.length === 0 && result.substrates.length === 0 && result.hardscape.length === 0 && result.products.length === 0 ? (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3>No recommendations match your filters</h3>
              <p style={{ color: '#666' }}>Try a different setup type, biome, or skill level.</p>
            </div>
          ) : (
            <form action={handleSave}>
              <input type="hidden" name="name" value={result.params.name} />
              <input type="hidden" name="type" value={result.params.type} />
              {result.params.biome && <input type="hidden" name="biome" value={result.params.biome} />}
              <input type="hidden" name="tankSize" value={result.params.tankSize} />
              <input type="hidden" name="skillLevel" value={result.params.skillLevel} />
              <input type="hidden" name="maintenancePref" value={result.params.maintenancePref} />

              <div className="action-bar">
                <div className="action-bar-info">
                  <span className="badge badge-info">{result.params.type.replace('_', ' ')}</span>
                  {result.params.biome && (
                    <span className="badge badge-success">{result.params.biome.replace(/_/g, ' ')}</span>
                  )}
                  <span className="badge" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)' }}>
                    {result.params.tankSize} gal
                  </span>
                  {totalSelected > 0 && (
                    <span className="badge badge-warning">{totalSelected} selected</span>
                  )}
                </div>
                <div className="action-bar-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={totalSelected === 0}
                    onClick={() => setShowShoppingList(true)}
                  >
                    Shopping List{totalSelected > 0 ? ` (${totalSelected})` : ''}
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : `Save Build${totalSelected > 0 ? ` (${totalSelected})` : ''}`}
                  </button>
                </div>
              </div>

              <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Check items to include them — animals and plants are saved with the build; everything you check also counts toward your shopping list.
              </p>

              {livestockCount > 0 && (
                <div
                  className="card"
                  style={{
                    marginBottom: '1.25rem',
                    borderColor: incompatibleCount > 0
                      ? 'var(--color-danger)'
                      : cautionCount > 0
                        ? 'var(--color-warning)'
                        : 'var(--color-border)',
                    background: incompatibleCount > 0
                      ? 'var(--color-danger-soft)'
                      : cautionCount > 0
                        ? 'var(--color-warning-soft)'
                        : 'var(--color-surface)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: compatAssessments.length > 0 ? '0.75rem' : 0 }}>
                    <h3 style={{ margin: 0, color: incompatibleCount > 0 ? 'var(--color-danger)' : cautionCount > 0 ? 'var(--color-warning)' : 'var(--color-primary-dark)' }}>
                      Your selections
                    </h3>
                    {compatAssessments.length > 0 ? (
                      <span style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {incompatibleCount > 0 && (
                          <span className="badge" style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger)', margin: 0 }}>
                            {incompatibleCount} incompatible pair{incompatibleCount === 1 ? '' : 's'}
                          </span>
                        )}
                        {cautionCount > 0 && (
                          <span className="badge" style={{ background: 'var(--color-warning-soft)', color: 'var(--color-warning)', margin: 0 }}>
                            {cautionCount} caution{cautionCount === 1 ? '' : 's'}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="badge badge-success" style={{ margin: 0 }}>
                        No conflicts
                      </span>
                    )}
                  </div>
                  {livestockCount > 0 && (
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {livestockCount} animal{livestockCount === 1 ? '' : 's'} selected
                      {plantCount > 0 ? ` · ${plantCount} plant${plantCount === 1 ? '' : 's'}` : ''}
                    </p>
                  )}
                  {compatAssessments.length > 0 && (
                    <ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.25rem' }}>
                      {compatAssessments.map((c, i) => (
                        <li key={i} style={{ marginBottom: '0.4rem', fontSize: '0.92rem' }}>
                          <strong style={{ color: c.level === CompatibilityLevel.INCOMPATIBLE ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                            {c.level === CompatibilityLevel.INCOMPATIBLE ? 'Incompatible' : 'Caution'}{!c.explicit && ' (estimated)'}:
                          </strong>{' '}
                          {c.aName} + {c.bName} — {c.notes.join(' ')}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <h3 style={{ color: '#1a5490', marginBottom: '1rem' }}>Recommended Animals</h3>
              {result.animals.length === 0 ? (
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>No animals match these filters.</p>
              ) : (
                <div className="grid" style={{ marginBottom: '1.5rem' }}>
                  {result.animals.map((animal) => {
                    const itemId = `animal-${animal.id}`;
                    return (
                      <div key={animal.id} className="card">
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            name={itemId}
                            value="on"
                            onChange={(e) => toggleItem({
                              id: itemId,
                              section: 'livestock',
                              name: animal.name,
                              quantity: 1,
                              category: animal.category,
                            }, e.target.checked)}
                            style={{ marginTop: '0.25rem', flexShrink: 0 }}
                          />
                          <span>
                            <h4>{animal.name}</h4>
                            <p style={{ fontSize: '0.9rem' }}>{animal.description?.slice(0, 120)}...</p>
                          </span>
                        </label>
                        <div style={{ marginTop: '0.75rem', marginLeft: '1.5rem' }}>
                          <span className="badge" style={{ background: '#e5e7eb', color: '#374151' }}>{animal.category.replace(/_/g, ' ')}</span>
                          <span className={`badge badge-${animal.difficulty.toLowerCase()}`}>{animal.difficulty}</span>
                          {animal.minTankSize && (
                            <span className="badge" style={{ background: '#e7f3ff', color: '#1a5490' }}>
                              Min {animal.minTankSize} gal
                            </span>
                          )}
                        </div>
                        <div style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                          <label style={{ fontSize: '0.85rem', marginRight: '0.5rem' }}>Qty:</label>
                          <input
                            type="number"
                            name={`qty-animal-${animal.id}`}
                            min="1"
                            max="999"
                            defaultValue="1"
                            onChange={(e) => updateQuantity(itemId, Number(e.target.value))}
                            style={{ width: '70px', padding: '0.25rem 0.5rem' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <h3 style={{ color: '#1a5490', margin: '2rem 0 1rem' }}>Recommended Plants</h3>
              {result.plants.length === 0 ? (
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>No plants match these filters.</p>
              ) : (
                <div className="grid" style={{ marginBottom: '1.5rem' }}>
                  {result.plants.map((plant) => {
                    const itemId = `plant-${plant.id}`;
                    return (
                      <div key={plant.id} className="card">
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            name={itemId}
                            value="on"
                            onChange={(e) => toggleItem({
                              id: itemId,
                              section: 'plants',
                              name: plant.name,
                              quantity: 1,
                              category: plant.category,
                            }, e.target.checked)}
                            style={{ marginTop: '0.25rem', flexShrink: 0 }}
                          />
                          <span>
                            <h4>{plant.name}</h4>
                            <p style={{ fontSize: '0.9rem' }}>{plant.description?.slice(0, 120)}...</p>
                          </span>
                        </label>
                        <div style={{ marginTop: '0.75rem', marginLeft: '1.5rem' }}>
                          <span className="badge" style={{ background: '#e5e7eb', color: '#374151' }}>{plant.category.replace(/_/g, ' ')}</span>
                          <span className={`badge badge-${plant.difficulty.toLowerCase()}`}>{plant.difficulty}</span>
                          <span className="badge" style={{ background: '#fff4e6', color: '#92400e' }}>
                            {plant.lightRequirement} Light
                          </span>
                        </div>
                        <div style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                          <label style={{ fontSize: '0.85rem', marginRight: '0.5rem' }}>Qty:</label>
                          <input
                            type="number"
                            name={`qty-plant-${plant.id}`}
                            min="1"
                            max="999"
                            defaultValue="1"
                            onChange={(e) => updateQuantity(itemId, Number(e.target.value))}
                            style={{ width: '70px', padding: '0.25rem 0.5rem' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <h3 style={{ color: '#1a5490', margin: '2rem 0 1rem' }}>Recommended Substrate</h3>
              {result.substrates.length === 0 ? (
                <p style={{ color: '#666' }}>No specific substrate recommendations for this setup.</p>
              ) : (
                <div className="grid" style={{ marginBottom: '1.5rem' }}>
                  {result.substrates.map((item) => {
                    const itemId = `substrate-${slug(item.name)}`;
                    return (
                      <div key={item.name} className="card">
                        {item.product?.imageUrl && (
                          <ProductImage src={item.product.imageUrl} alt={item.name} />
                        )}
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            onChange={(e) => toggleItem({
                              id: itemId,
                              section: 'substrate',
                              name: item.name,
                              quantity: 1,
                              category: 'Substrate',
                              priceRange: item.product?.priceRange ?? null,
                            }, e.target.checked)}
                            style={{ marginTop: '0.25rem', flexShrink: 0 }}
                          />
                          <span>
                            <h4>{item.name}</h4>
                            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{item.why}</p>
                          </span>
                        </label>
                        <div style={{ marginTop: '0.75rem', marginLeft: '1.5rem' }}>
                          <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>Substrate</span>
                          {item.product?.priceRange && (
                            <span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>
                              {item.product.priceRange.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                        <div style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                          <label style={{ fontSize: '0.85rem', marginRight: '0.5rem' }}>Qty:</label>
                          <input
                            type="number"
                            min="1"
                            max="999"
                            defaultValue="1"
                            onChange={(e) => updateQuantity(itemId, Number(e.target.value))}
                            style={{ width: '70px', padding: '0.25rem 0.5rem' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <h3 style={{ color: '#1a5490', margin: '2rem 0 1rem' }}>Recommended Rocks &amp; Hardscape</h3>
              {result.hardscape.length === 0 ? (
                <p style={{ color: '#666' }}>No specific hardscape recommendations for this setup.</p>
              ) : (
                <div className="grid" style={{ marginBottom: '1.5rem' }}>
                  {result.hardscape.map((item) => {
                    const itemId = `hardscape-${slug(item.name)}`;
                    const kindLabel = item.kind === 'rock' ? 'Rock' : item.kind === 'wood' ? 'Wood' : 'Hardscape';
                    return (
                      <div key={item.name} className="card">
                        {item.product?.imageUrl && (
                          <ProductImage src={item.product.imageUrl} alt={item.name} />
                        )}
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            onChange={(e) => toggleItem({
                              id: itemId,
                              section: 'hardscape',
                              name: item.name,
                              quantity: 1,
                              category: kindLabel,
                              priceRange: item.product?.priceRange ?? null,
                            }, e.target.checked)}
                            style={{ marginTop: '0.25rem', flexShrink: 0 }}
                          />
                          <span>
                            <h4>{item.name}</h4>
                            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{item.why}</p>
                          </span>
                        </label>
                        <div style={{ marginTop: '0.75rem', marginLeft: '1.5rem' }}>
                          <span className="badge" style={{ background: '#e7f3ff', color: '#1a5490' }}>{kindLabel}</span>
                          {item.product?.priceRange && (
                            <span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>
                              {item.product.priceRange.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                        <div style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                          <label style={{ fontSize: '0.85rem', marginRight: '0.5rem' }}>Qty:</label>
                          <input
                            type="number"
                            min="1"
                            max="999"
                            defaultValue="1"
                            onChange={(e) => updateQuantity(itemId, Number(e.target.value))}
                            style={{ width: '70px', padding: '0.25rem 0.5rem' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <h3 style={{ color: '#1a5490', margin: '2rem 0 1rem' }}>Recommended Equipment</h3>
              {result.products.length === 0 ? (
                <p style={{ color: '#666' }}>No equipment recommendations for this setup.</p>
              ) : (
                (() => {
                  const present = PRODUCT_CATEGORY_ORDER.filter((cat) =>
                    result.products.some((p) => p.category === cat)
                  );
                  return present.map((category) => {
                    const products = result.products.filter((p) => p.category === category);
                    return (
                      <div key={category} style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ color: '#374151', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                          {humanize(category)} ({products.length})
                        </h4>
                        <div className="grid">
                          {products.map((product) => {
                            const itemId = `product-${product.id}`;
                            return (
                              <div key={product.id} className="card">
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                                  <input
                                    type="checkbox"
                                    onChange={(e) => toggleItem({
                                      id: itemId,
                                      section: 'equipment',
                                      name: product.name,
                                      quantity: 1,
                                      category: product.category,
                                      priceRange: product.priceRange ?? null,
                                    }, e.target.checked)}
                                    style={{ marginTop: '0.25rem', flexShrink: 0 }}
                                  />
                                  <span>
                                    <h4>{product.name}</h4>
                                    <p style={{ fontSize: '0.9rem' }}>{product.description?.slice(0, 120)}...</p>
                                  </span>
                                </label>
                                <div style={{ marginTop: '0.75rem', marginLeft: '1.5rem' }}>
                                  <span className="badge" style={{ background: '#e7f3ff', color: '#1a5490' }}>
                                    {humanize(product.category)}
                                  </span>
                                  {product.priceRange && (
                                    <span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>
                                      {product.priceRange.replace('_', ' ')}
                                    </span>
                                  )}
                                  {product.rating && (
                                    <span className="badge" style={{ background: '#fff4e6', color: '#92400e' }}>★ {product.rating}</span>
                                  )}
                                </div>
                                <div style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                                  <label style={{ fontSize: '0.85rem', marginRight: '0.5rem' }}>Qty:</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="999"
                                    defaultValue="1"
                                    onChange={(e) => updateQuantity(itemId, Number(e.target.value))}
                                    style={{ width: '70px', padding: '0.25rem 0.5rem' }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()
              )}

              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
                Tip: the Shopping List at the top captures everything you&apos;ve checked across all sections. Saved builds persist your livestock and plants; print or save the shopping list separately for buying.
              </p>
            </form>
          )}
        </section>
      )}

      {showShoppingList && result && (
        <ShoppingListModal
          items={shoppingList}
          buildName={result.params.name}
          onClose={() => setShowShoppingList(false)}
        />
      )}
    </>
  );
}
