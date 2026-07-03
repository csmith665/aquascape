'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Biome, ProductCategory } from '@prisma/client';
import { buildRecommendation, saveBuild, BuildResult } from './actions';
import { SavedBuildsList } from './SavedBuildsList';
import { ShoppingListModal, ShoppingItem } from './ShoppingListModal';
import { generateStockingGuidance } from '@/lib/stocking';

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
  ProductCategory.FOOD,
  ProductCategory.SUBSTRATE,
  ProductCategory.HARDSCAPE,
  ProductCategory.DECORATION,
  ProductCategory.TOOL,
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
          <p style={{ color: '#5f6f81', marginBottom: '1.5rem' }}>
            {result.params.type.replace('_', ' ')}
            {result.params.biome && (
              <> · {result.params.biome.replace(/_/g, ' ')}</>
            )}
            {' · '}{result.params.tankSize} gallons
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              className="btn"
              disabled={totalSelected === 0}
              onClick={() => setShowShoppingList(true)}
              style={{ opacity: totalSelected === 0 ? 0.6 : 1 }}
            >
              Generate Shopping List{totalSelected > 0 ? ` (${totalSelected})` : ''}
            </button>
          </div>
          {totalSelected === 0 && (
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '-0.5rem', marginBottom: '1.5rem' }}>
              Select items below to build your shopping list.
            </p>
          )}

          {savedId && (
            <div className="card" style={{ background: '#d1fae5', color: '#065f46', marginBottom: '1.5rem' }}>
              <h3>Build saved!</h3>
              <p style={{ marginBottom: '1rem' }}>
                {livestockCount} animal(s) and {plantCount} plant(s) saved to your build.
                {' '}
                <span style={{ fontSize: '0.85rem', color: '#047857' }}>
                  (Saved builds store livestock and plants. Use the Shopping List to capture equipment, substrate, and hardscape.)
                </span>
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

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3>How many can fit in this tank?</h3>
            <p style={{ color: '#666', marginTop: '0.25rem', marginBottom: '1rem' }}>
              Beginner-friendly guidance based on your tank size and setup type.
            </p>
            {(() => {
              const guide = generateStockingGuidance(result.params.type, result.params.tankSize);
              return (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', background: '#f0f7ff', borderRadius: '6px' }}>
                    <strong style={{ color: '#1a5490' }}>Livestock</strong>
                    <p style={{ fontSize: '0.95rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>{guide.animalRule}</p>
                    <p style={{ fontSize: '0.95rem', marginTop: 0, marginBottom: 0, fontWeight: 600 }}>{guide.animalEstimate}</p>
                  </div>
                  <div style={{ padding: '0.75rem', background: '#f0fff4', borderRadius: '6px' }}>
                    <strong style={{ color: '#065f46' }}>Plants</strong>
                    <p style={{ fontSize: '0.95rem', marginTop: '0.25rem', marginBottom: 0 }}>{guide.plantAdvice}</p>
                  </div>
                  <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '6px' }}>
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

          {result.setupNotes.length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3>Need to Know — Setup Notes</h3>
              <p style={{ color: '#666', marginTop: '0.25rem', marginBottom: '1rem' }}>
                Key things to get right for this kind of build.
              </p>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {result.setupNotes.map((note, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '6px' }}>
                    <strong style={{ color: '#1a5490' }}>{note.title}</strong>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.25rem', marginBottom: 0 }}>{note.body}</p>
                    {note.guide && (
                      <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                        <a href={note.guide.href} style={{ fontSize: '0.85rem', fontWeight: 600 }}>{note.guide.label} →</a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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

              <p style={{ marginBottom: '1rem', color: '#666' }}>
                Check the items you want to include — animals and plants are saved with the build; everything you check here counts toward your shopping list.
              </p>

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
                          <img src={item.product.imageUrl} alt={item.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.75rem' }} />
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
                          <img src={item.product.imageUrl} alt={item.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.75rem' }} />
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

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn"
                >
                  {saving ? 'Saving...' : `Save Build${totalSelected > 0 ? ` (${totalSelected} selected)` : ''}`}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={totalSelected === 0}
                  onClick={() => setShowShoppingList(true)}
                  style={{ opacity: totalSelected === 0 ? 0.6 : 1 }}
                >
                  Generate Shopping List{totalSelected > 0 ? ` (${totalSelected})` : ''}
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                The Shopping List captures everything you&apos;ve checked across all sections. Saved builds persist your livestock and plants; the shopping list is for printing or buying now.
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
