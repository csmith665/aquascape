export default function TrackingPage() {
  return (
    <>
      <div className="hero">
        <h1>My Tanks</h1>
        <p>Track water parameters, maintenance, and livestock health</p>
      </div>

      <section className="section">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No Tanks Yet</h3>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Start tracking your aquarium or vivarium to monitor water quality,
            maintenance schedules, and livestock health over time.
          </p>
          <button className="btn" style={{ marginTop: '1.5rem' }}>
            Add Your First Tank
          </button>
        </div>
      </section>

      <section className="section">
        <h2>What You Can Track</h2>
        <div className="grid">
          <div className="card">
            <h3>Water Parameters</h3>
            <p>Log temperature, pH, ammonia, nitrite, nitrate, and more. Spot trends before they become problems.</p>
          </div>

          <div className="card">
            <h3>Maintenance</h3>
            <p>Track water changes, filter cleanings, substrate vacuuming, and equipment checks.</p>
          </div>

          <div className="card">
            <h3>Feeding</h3>
            <p>Log what and when you feed. Get reminders for consistent feeding schedules.</p>
          </div>

          <div className="card">
            <h3>Livestock Health</h3>
            <p>Monitor the health status of your animals and plants. Track additions and removals.</p>
          </div>
        </div>
      </section>
    </>
  );
}
