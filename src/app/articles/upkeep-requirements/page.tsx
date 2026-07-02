import Link from 'next/link';

export default function UpkeepRequirementsArticlePage() {
  return (
    <>
      <div className="hero">
        <h1>Upkeep Requirements for Your Environment</h1>
        <p>Daily, weekly, and monthly care routines for aquariums, vivariums, terrariums, and more</p>
      </div>

      <article className="section" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <p className="lead" style={{ fontSize: '1.125rem', color: '#555', lineHeight: 1.7 }}>
          Building a beautiful enclosure is only the beginning. Every type of environment needs consistent upkeep to stay
          healthy. The good news is that most maintenance tasks are quick once they become routine. This guide breaks down
          what needs to happen daily, weekly, monthly, and seasonally for different setups.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Daily Tasks</h2>
        <p>Most daily tasks take only a few minutes and are about observation and basic care.</p>
        <ul>
          <li><strong>Feed animals:</strong> Offer the right amount of food once or twice daily. Remove uneaten food after a few minutes.</li>
          <li><strong>Check temperature:</strong> Glance at thermometers for both warm and cool zones. Reptiles and amphibians are especially sensitive to swings.</li>
          <li><strong>Observe livestock:</strong> Look for normal behavior, appetite, and activity. Sick or stressed animals often show the first signs early.</li>
          <li><strong>Check equipment:</strong> Make sure filters, heaters, lights, and misters are running.</li>
          <li><strong>Mist if needed:</strong> Tropical vivariums and terrariums often need a light misting to maintain humidity.</li>
          <li><strong>Top off water:</strong> Evaporation lowers water levels in aquariums and paludariums. Use dechlorinated or conditioned water.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Weekly Tasks</h2>
        <p>Weekly maintenance prevents small problems from becoming big ones.</p>
        <ul>
          <li><strong>Water changes (aquatic setups):</strong> Change 10-25% of the water weekly. This removes nitrates and replenishes minerals.</li>
          <li><strong>Test water parameters:</strong> Check ammonia, nitrite, nitrate, and pH. Log results so you can spot trends.</li>
          <li><strong>Clean glass and decor:</strong> Remove algae from aquarium glass and wipe dust from terrarium panels.</li>
          <li><strong>Prune plants:</strong> Trim dead or yellowing leaves. Remove overgrown sections before they block light or flow.</li>
          <li><strong>Check filter media:</strong> Rinse mechanical media in old tank water if flow is slowing. Do not use tap water on biological media.</li>
          <li><strong>Spot-clean waste:</strong> Remove feces, shed skin, leftover food, and dead insects from land areas.</li>
          <li><strong>Refill humidity supplies:</strong> Clean and refill water dishes, misting reservoirs, and drip systems.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Monthly Tasks</h2>
        <p>Monthly chores are deeper maintenance that keeps the system stable over time.</p>
        <ul>
          <li><strong>Deep clean substrate:</strong> Use a gravel vacuum to remove debris from aquarium gravel. Stir and spot-clean terrarium substrate.</li>
          <li><strong>Replace or clean filter components:</strong> Replace filter floss or carbon as needed. Clean impellers and intake tubes.</li>
          <li><strong>Inspect hardscape:</strong> Make sure rocks, driftwood, branches, and hides are secure and not shifting.</li>
          <li><strong>Check light bulbs and UVB tubes:</strong> UVB bulbs lose output over time and should be replaced every 6-12 months for reptiles.</li>
          <li><strong>Calibrate or replace test reagents:</strong> Liquid test kits expire. Check dates and replace when needed.</li>
          <li><strong>Review and adjust feeding:</strong> Make sure animals are not gaining or losing weight unexpectedly.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Seasonal or As-Needed Tasks</h2>
        <ul>
          <li><strong>Major rescape or replant:</strong> Every few months, reassess plant growth and layout. Divide or replace overgrown plants.</li>
          <li><strong>Replace substrate:</strong> Aquarium gravel rarely needs full replacement, but soil-based substrates in vivariums may need refreshing annually.</li>
          <li><strong>Deep disinfect:</strong> If disease occurs, quarantine animals and disinfect decor with dilute bleach or veterinary cleaners, rinsing thoroughly.</li>
          <li><strong>Service heating and cooling:</strong> Clean fans, check heating pads, and verify thermostat accuracy before seasonal temperature shifts.</li>
          <li><strong>Backup equipment:</strong> Have spare heaters, air pumps, and lights on hand for emergencies.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>Upkeep by Enclosure Type</h2>

        <h3>Freshwater Aquarium</h3>
        <p>
          The most important routine is water changes and parameter testing. A stable filter colony does most of the work,
          but you must remove nitrates manually. Algae control comes from balancing light, nutrients, and cleaning.
        </p>

        <h3>Saltwater Aquarium</h3>
        <p>
          Saltwater requires more precision. Top-off with freshwater only to maintain salinity. Test alkalinity, calcium,
          magnesium, and salinity regularly. Water changes help replace trace elements that corals consume.
        </p>

        <h3>Terrarium</h3>
        <p>
          Dry terrariums are lower maintenance. Focus on removing waste, keeping water dishes clean, maintaining heat and UVB,
          and feeding a varied diet. Arid plants need infrequent watering.
        </p>

        <h3>Vivarium</h3>
        <p>
          High-humidity vivariums need daily misting, good airflow, and careful plant care. Watch for mold, fungus gnats,
          and stagnant air. Bioactive setups with springtails and isopods reduce cleaning needs.
        </p>

        <h3>Paludarium and Riparium</h3>
        <p>
          These combine aquatic and terrestrial maintenance. Maintain water quality for the aquatic section while managing
          humidity, airflow, and plant growth on land. Both zones affect each other, so problems in one spread quickly.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>Keep a Maintenance Log</h2>
        <p>
          A simple log makes every task easier. Record water changes, test results, feeding changes, health observations,
          and equipment replacements. Our <Link href="/tracking">My Tanks</Link> tool is built for exactly this.
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>The Bottom Line</h2>
        <p>
          Consistency beats intensity. Five minutes of observation each day and one focused maintenance session per week
          will prevent most common problems. When in doubt, test your water, check your temperatures, and change a little
          water.
        </p>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/guides" className="btn" style={{ marginRight: '1rem' }}>
            ← Back to Guides
          </Link>
          <Link href="/setup-checklist" className="btn">
            Setup Checklist
          </Link>
        </div>
      </article>
    </>
  );
}
