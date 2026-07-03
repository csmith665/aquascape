import Link from 'next/link';

export default function SetupTemperatureArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Temperature & Heating</h1>
        <p>Stable temperatures are critical for livestock health</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          Fish and invertebrates are ectothermic — their body temperature tracks the water. Rapid swings stress the immune
          system and invite disease. A stable, appropriately-sized heater is one of the cheapest forms of insurance.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Sizing a heater</h2>
        <p>
          A rough rule is 3–5 watts per gallon for typical rooms. For example, a 20-gallon tank needs roughly a 60–100W heater.
          In a cold room or for saltwater, size up. Always use a separate thermometer — the built-in heater dial drifts over time.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Use a controller for redundancy</h2>
        <p>
          Heaters can stick &quot;on&quot; and cook a tank. For saltwater or any tank with valuable livestock, an external temperature
          controller cuts power if the heater overshoots. Some reef keepers run two smaller heaters instead of one large one
          so a single failure is less catastrophic.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Temperature gradients for terrestrial species</h2>
        <p>
          Arid species (desert, arid grassland) thermoregulate by moving between zones. Provide a basking spot around
          90–105°F at one end and a cool side around 75–80°F at the other. Always use a thermostat on heat mats and
          ceramic heaters — unregulated heat sources can cause burns.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Avoid rapid swings</h2>
        <p>
          Even within an acceptable range, a sudden 5°F drop or rise in a few hours can stress fish. Place heaters near
          filter return flow to distribute warmth evenly, and avoid placing the tank near exterior doors, windows, or HVAC vents.
        </p>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>← Back to Guides</Link>
          <Link href="/articles/fish-diseases" className="btn">Fish Diseases</Link>
        </div>
      </article>
    </>
  );
}
