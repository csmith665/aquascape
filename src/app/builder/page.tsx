'use client';

import { useState } from 'react';
import { buildRecommendation, BuildResult } from './actions';

export default function BuilderPage() {
  const [result, setResult] = useState<BuildResult | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const res = await buildRecommendation(formData);
    setResult(res);
    setPending(false);
  }

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
            Answer a few questions and we'll help you create a compatible setup
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
                <option value="PALUDARIUM">Paludarium</option>
                <option value="VIVARIUM">Vivarium</option>
                <option value="TERRARIUM">Terrarium</option>
              </select>
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

      {result && (
        <section className="section">
          <h2>Recommendations for {result.project.name}</h2>

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

          <h3 style={{ color: '#1a5490', marginBottom: '1rem' }}>Recommended Animals</h3>
          <div className="grid">
            {result.animals.map((animal) => (
              <div key={animal.id} className="card">
                <h4>{animal.name}</h4>
                <p style={{ fontSize: '0.9rem' }}>{animal.description?.slice(0, 120)}...</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <span className={`badge badge-${animal.difficulty.toLowerCase()}`}>{animal.difficulty}</span>
                  {animal.minTankSize && (
                    <span className="badge" style={{ background: '#e7f3ff', color: '#1a5490' }}>
                      Min {animal.minTankSize} gal
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ color: '#1a5490', margin: '2rem 0 1rem' }}>Recommended Plants</h3>
          <div className="grid">
            {result.plants.map((plant) => (
              <div key={plant.id} className="card">
                <h4>{plant.name}</h4>
                <p style={{ fontSize: '0.9rem' }}>{plant.description?.slice(0, 120)}...</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <span className={`badge badge-${plant.difficulty.toLowerCase()}`}>{plant.difficulty}</span>
                  <span className="badge" style={{ background: '#fff4e6', color: '#d97706' }}>
                    {plant.lightRequirement} Light
                  </span>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ color: '#1a5490', margin: '2rem 0 1rem' }}>Recommended Products</h3>
          <div className="grid">
            {result.products.map((product) => (
              <div key={product.id} className="card">
                <h4>{product.name}</h4>
                <p style={{ fontSize: '0.9rem' }}>{product.description?.slice(0, 120)}...</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <span className="badge" style={{ background: '#e7f3ff', color: '#1a5490' }}>
                    {product.category.replace('_', ' ')}
                  </span>
                  {product.priceRange && (
                    <span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>
                      {product.priceRange.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
