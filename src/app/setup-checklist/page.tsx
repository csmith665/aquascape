'use client';

import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'aquascape-setup-checklist';

type EnvironmentType =
  | 'freshwater'
  | 'saltwater'
  | 'brackish'
  | 'vivarium'
  | 'terrarium'
  | 'paludarium'
  | 'riparium'
  | 'pond';

type Task = {
  id: string;
  text: string;
  environments?: EnvironmentType[];
};

type Step = {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
};

const ENVIRONMENTS: { value: EnvironmentType; label: string }[] = [
  { value: 'freshwater', label: 'Freshwater Aquarium' },
  { value: 'saltwater', label: 'Saltwater Aquarium' },
  { value: 'brackish', label: 'Brackish Aquarium' },
  { value: 'vivarium', label: 'Vivarium (plants + animals)' },
  { value: 'terrarium', label: 'Terrarium (dry land)' },
  { value: 'paludarium', label: 'Paludarium (water + land)' },
  { value: 'riparium', label: 'Riparium (shoreline plants)' },
  { value: 'pond', label: 'Pond' },
];

const STEPS: Step[] = [
  {
    id: 'plan',
    title: '1. Plan Your Build',
    description: 'Good planning prevents expensive mistakes. Decide what you want before buying anything.',
    tasks: [
      { id: 'plan-type', text: 'Choose the type of environment you want to build.' },
      { id: 'plan-research', text: 'Research the animals and plants you want to keep.' },
      { id: 'plan-compatibility', text: 'Use the Compatibility Checker to verify tank mates get along.' },
      { id: 'plan-size', text: 'Choose an enclosure size appropriate for your livestock as adults.' },
      { id: 'plan-budget', text: 'Set a budget for the tank, equipment, livestock, and ongoing supplies.' },
      { id: 'plan-location', text: 'Pick a safe location away from direct sunlight, drafts, and heavy traffic.' },
    ],
  },
  {
    id: 'equipment',
    title: '2. Gather Equipment',
    description: 'Buy reliable equipment before you start setting up. Skipping essentials leads to problems later.',
    tasks: [
      { id: 'equip-tank', text: 'Acquire the tank or enclosure.' },
      { id: 'equip-stand', text: 'Get a level, weight-bearing stand or cabinet.' },
      { id: 'equip-lid', text: 'Get a lid, cover, or screen to prevent escapes and evaporation.' },
      { id: 'equip-filter', text: 'Choose filtration suited to your setup size.', environments: ['freshwater', 'saltwater', 'brackish', 'paludarium', 'pond', 'riparium'] },
      { id: 'equip-heater', text: 'Choose a heater if your animals need stable warm temperatures.', environments: ['freshwater', 'saltwater', 'brackish', 'paludarium', 'pond', 'riparium'] },
      { id: 'equip-uvb', text: 'Add UVB lighting for reptiles that need it.', environments: ['terrarium', 'vivarium', 'paludarium'] },
      { id: 'equip-light', text: 'Add appropriate lighting for plants and animals.' },
      { id: 'equip-substrate', text: 'Choose safe substrate for your environment and livestock.' },
      { id: 'equip-hardscape', text: 'Gather hardscape (driftwood, rocks, branches, caves, hides).' },
      { id: 'equip-conditioner', text: 'Buy water conditioner to remove chlorine/chloramine.', environments: ['freshwater', 'brackish', 'pond', 'paludarium', 'riparium'] },
      { id: 'equip-salt', text: 'Buy marine salt mix for saltwater.', environments: ['saltwater'] },
      { id: 'equip-test', text: 'Buy a water test kit (ammonia, nitrite, nitrate, pH).' },
      { id: 'equip-food', text: 'Buy appropriate food for each species.' },
      { id: 'equip-tools', text: 'Get basic tools: net, siphon, algae scraper, thermometer.' },
    ],
  },
  {
    id: 'setup',
    title: '3. Set Up the Enclosure',
    description: 'Build the physical environment before adding water or animals.',
    tasks: [
      { id: 'setup-level', text: 'Make sure the stand is level and the tank sits evenly.' },
      { id: 'setup-substrate', text: 'Rinse and add substrate to the desired depth.' },
      { id: 'setup-hardscape', text: 'Arrange hardscape securely so it cannot fall or collapse.' },
      { id: 'setup-equipment', text: 'Install filter, heater, lighting, and any pumps or timers.' },
      { id: 'setup-fill', text: 'Fill with dechlorinated water or mist substrate into place.', environments: ['freshwater', 'saltwater', 'brackish', 'pond', 'paludarium', 'riparium'] },
      { id: 'setup-saltwater', text: 'Mix saltwater to the correct salinity before adding to the tank.', environments: ['saltwater'] },
      { id: 'setup-plant', text: 'Plant aquatic or terrestrial plants before water becomes cloudy.', environments: ['freshwater', 'saltwater', 'brackish', 'paludarium', 'riparium', 'vivarium'] },
      { id: 'setup-hides', text: 'Add hides, climbing branches, and visual barriers for shy species.', environments: ['terrarium', 'vivarium', 'paludarium'] },
    ],
  },
  {
    id: 'cycle',
    title: '4. Cycle or Establish the Environment',
    description: 'Patience here is the difference between success and disaster.',
    tasks: [
      { id: 'cycle-start', text: 'Start the filter and heater and let the system run for 24 hours.' },
      { id: 'cycle-bacteria', text: 'Add a source of beneficial bacteria.', environments: ['freshwater', 'brackish', 'saltwater', 'pond', 'paludarium', 'riparium'] },
      { id: 'cycle-ammonia', text: 'Add an ammonia source to feed the bacteria.', environments: ['freshwater', 'brackish', 'saltwater', 'pond', 'paludarium', 'riparium'] },
      { id: 'cycle-test', text: 'Test ammonia, nitrite, and nitrate every day or two.', environments: ['freshwater', 'brackish', 'saltwater', 'pond', 'paludarium', 'riparium'] },
      { id: 'cycle-wait', text: 'Wait until ammonia and nitrite read 0 ppm and nitrate appears.', environments: ['freshwater', 'brackish', 'saltwater', 'pond', 'paludarium', 'riparium'] },
      { id: 'cycle-stabilize', text: 'Allow temperature and humidity to stabilize for several days.', environments: ['terrarium', 'vivarium'] },
      { id: 'cycle-cuc', text: 'Add a bioactive clean-up crew (springtails, isopods) if building a bioactive setup.', environments: ['terrarium', 'vivarium', 'paludarium'] },
    ],
  },
  {
    id: 'stock',
    title: '5. Add Livestock',
    description: 'Never add all animals at once. Build the community slowly and watch carefully.',
    tasks: [
      { id: 'stock-quarantine', text: 'Set up a quarantine tank or enclosure for new animals.' },
      { id: 'stock-acclimate', text: 'Acclimate new animals slowly to temperature and water chemistry.' },
      { id: 'stock-small-groups', text: 'Add animals in small groups, starting with the hardiest species.' },
      { id: 'stock-observe', text: 'Watch for stress, aggression, or illness for the first few days.' },
      { id: 'stock-schools', text: 'Add schooling fish in groups of 6 or more at once.' },
      { id: 'stock-test-after', text: 'Test water parameters again 24-48 hours after adding livestock.' },
    ],
  },
  {
    id: 'maintain',
    title: '6. Establish a Maintenance Routine',
    description: 'Consistency keeps your environment healthy long-term.',
    tasks: [
      { id: 'maint-feed', text: 'Feed the right amount once or twice daily; remove uneaten food.' },
      { id: 'maint-water-change', text: 'Perform regular water changes (typically 10-25% weekly for aquatic setups).', environments: ['freshwater', 'brackish', 'saltwater', 'pond', 'paludarium', 'riparium'] },
      { id: 'maint-mist', text: 'Mist and monitor humidity daily for tropical setups.', environments: ['terrarium', 'vivarium', 'paludarium'] },
      { id: 'maint-test', text: 'Test water parameters weekly or after any changes.' },
      { id: 'maint-trim', text: 'Trim plants and remove dead leaves.' },
      { id: 'maint-clean', text: 'Clean glass, filters, and decor as needed without killing beneficial bacteria.' },
      { id: 'maint-log', text: 'Log parameters, water changes, feeding, and health observations.' },
    ],
  },
];

export default function SetupChecklistPage() {
  const [environment, setEnvironment] = useState<EnvironmentType>('freshwater');
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setEnvironment(parsed.environment || 'freshwater');
        setChecked(new Set(parsed.checked || []));
      }
    } catch {
      // ignore corrupted storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ environment, checked: Array.from(checked) })
    );
  }, [environment, checked, loaded]);

  const visibleTasks = useMemo(() => {
    return STEPS.map((step) => ({
      ...step,
      tasks: step.tasks.filter(
        (task) => !task.environments || task.environments.includes(environment)
      ),
    }));
  }, [environment]);

  const totalTasks = useMemo(
    () => visibleTasks.reduce((sum, step) => sum + step.tasks.length, 0),
    [visibleTasks]
  );

  const completedTasks = useMemo(
    () => visibleTasks.reduce((sum, step) => sum + step.tasks.filter((t) => checked.has(t.id)).length, 0),
    [visibleTasks, checked]
  );

  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const toggleTask = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetProgress = () => {
    if (confirm('Clear all checklist progress?')) {
      setChecked(new Set());
    }
  };

  if (!loaded) return null;

  return (
    <>
      <div className="hero">
        <h1>Setup Checklist</h1>
        <p>A step-by-step guide to building your first healthy environment</p>
      </div>

      <section className="section" style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            What type of environment are you building?
          </label>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as EnvironmentType)}
            style={{ width: '100%', maxWidth: '320px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            {ENVIRONMENTS.map((env) => (
              <option key={env.value} value={env.value}>
                {env.label}
              </option>
            ))}
          </select>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>Progress</span>
              <span>{completedTasks} of {totalTasks} tasks ({progress}%)</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: '#e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: progress === 100 ? '#16a34a' : '#1a5490',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          <button onClick={resetProgress} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Reset Progress
          </button>
        </div>

        {visibleTasks.map((step) => (
          <div key={step.id} className="card" style={{ marginBottom: '1.5rem' }}>
            <h2>{step.title}</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{step.description}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {step.tasks.map((task) => {
                const isChecked = checked.has(task.id);
                return (
                  <li
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      borderRadius: '6px',
                      background: isChecked ? '#f0fdf4' : '#f9fafb',
                      border: `1px solid ${isChecked ? '#bbf7d0' : '#e5e7eb'}`,
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleTask(task.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleTask(task.id)}
                      style={{ marginTop: '0.25rem', flexShrink: 0 }}
                    />
                    <span style={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? '#166534' : 'inherit' }}>
                      {task.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {progress === 100 && (
          <div className="card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <h2>All done!</h2>
            <p>
              You have worked through the full beginner setup process. Remember that consistency in maintenance
              matters more than perfection. Keep testing parameters, observe your livestock daily, and adjust
              slowly when something needs changing.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
