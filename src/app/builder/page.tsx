export default function BuilderPage() {
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

          <div style={{ marginTop: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Setup Type
            </label>
            <select style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}>
              <option>Freshwater Aquarium</option>
              <option>Saltwater Aquarium</option>
              <option>Paludarium</option>
              <option>Vivarium</option>
              <option>Terrarium</option>
            </select>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Tank Size (gallons)
            </label>
            <input 
              type="number" 
              placeholder="e.g., 20"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Your Experience Level
            </label>
            <select style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Maintenance Preference
            </label>
            <select style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}>
              <option>Low Maintenance</option>
              <option>Moderate Maintenance</option>
              <option>High Maintenance</option>
            </select>
          </div>

          <button className="btn" style={{ marginTop: '2rem', width: '100%' }}>
            Get Recommendations
          </button>
        </div>
      </section>
    </>
  );
}
