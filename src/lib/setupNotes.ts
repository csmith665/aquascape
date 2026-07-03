import { SetupType, Biome, Difficulty, MaintenanceLevel } from '@prisma/client';

export type SetupNote = {
  category: 'cycling' | 'water' | 'temperature' | 'lighting' | 'stocking' | 'maintenance' | 'environment' | 'safety';
  title: string;
  body: string;
  guide?: { href: string; label: string };
};

const WATER_TYPES: SetupType[] = [
  SetupType.FRESHWATER,
  SetupType.SALTWATER,
  SetupType.BRACKISH,
  SetupType.PALUDARIUM,
  SetupType.RIPARIUM,
];

const TERR_TYPES: SetupType[] = [SetupType.TERRARIUM, SetupType.VIVARIUM];

export function generateSetupNotes(
  type: SetupType,
  biome: Biome | null | undefined,
  skillLevel: Difficulty,
  maintenancePref: MaintenanceLevel,
  tankSize: number,
): SetupNote[] {
  const notes: SetupNote[] = [];

  // ---- Cycling (aquatic) ----
  if (WATER_TYPES.includes(type)) {
    notes.push({
      category: 'cycling',
      title: 'Cycle the tank before adding fish',
      body: `A new aquatic tank has no beneficial bacteria. Add an ammonia source and test daily until ammonia and nitrite read 0 ppm and nitrate appears — typically 2-6 weeks. Never add all your livestock at once; add a few hardy fish first and re-test 24 hours later.`,
      guide: { href: '/articles/nitrogen-cycle', label: 'Read: The Nitrogen Cycle' },
    });
  }

  // ---- Water chemistry by type ----
  if (type === SetupType.SALTWATER) {
    notes.push({
      category: 'water',
      title: 'Mix saltwater to the correct salinity',
      body: 'Target specific gravity 1.023-1.025 (about 35 ppt). Mix marine salt with RO/DI water 24 hours ahead and aerate before adding to the tank. Top off evaporation with fresh water only — salt does not evaporate.',
    });
    notes.push({
      category: 'water',
      title: 'Use RO/DI water',
      body: 'Tap water contains chlorine, chloramine, phosphates, and silicates that fuel algae and harm inverts. A RO/DI unit is strongly recommended for saltwater and reef tanks.',
    });
  }

  if (type === SetupType.BRACKISH) {
    notes.push({
      category: 'water',
      title: 'Maintain brackish salinity (1.005-1.015 SG)',
      body: 'Brackish water sits between freshwater and marine. Use a refractometer to measure. Many brackish species (mollies, puffers, archerfish) tolerate a range but stability matters more than an exact number.',
    });
  }

  if (WATER_TYPES.includes(type) && type !== SetupType.SALTWATER) {
    notes.push({
      category: 'water',
      title: 'Dechlorinate all new water',
      body: 'Chlorine and chloramine in tap water kill beneficial bacteria and damage gills. Add a water conditioner (e.g. Seachem Prime) to every batch of new water before it touches the tank.',
      guide: { href: '/articles/water-testing', label: 'Read: Water Testing Guide' },
    });
  }

  // ---- Biome-specific ----
  if (biome === Biome.REEF || biome === Biome.MARINE) {
    notes.push({
      category: 'water',
      title: 'Monitor calcium, alkalinity, and magnesium',
      body: 'Reef tanks consume calcium and alkalinity as corals grow. Test weekly and dose as needed. Stable Alk (7-11 dKH) matters more than chasing a specific number.',
    });
  }

  if (biome === Biome.TROPICAL_RAINFOREST || biome === Biome.CLOUD_FOREST) {
    notes.push({
      category: 'environment',
      title: 'Maintain high humidity (70-90%)',
      body: 'Tropical vivariums need consistent moisture. Use a hygrometer, mist daily or run an automatic mister, and ensure ventilation to prevent stagnant air and fungal growth.',
    });
  }

  if (biome === Biome.DESERT || biome === Biome.ARID_GRASSLAND) {
    notes.push({
      category: 'temperature',
      title: 'Create a temperature gradient',
      body: 'Arid species thermoregulate by moving. Provide a basking spot (90-105°F) at one end and a cool side (75-80°F) at the other. Use a thermostat on heat sources — unregulated heat mats can cause burns.',
    });
  }

  // ---- Temperature (aquatic) ----
  if (WATER_TYPES.includes(type)) {
    notes.push({
      category: 'temperature',
      title: 'Match heater wattage to tank size',
      body: `Roughly 3-5 watts per gallon for typical rooms. For a ${tankSize} gallon tank, aim for a ${Math.ceil(tankSize * 3)}-${Math.ceil(tankSize * 5)}W heater. Use a separate thermometer — built-in heater dials drift. For saltwater, consider a controller for redundancy.`,
    });
  }

  // ---- Lighting ----
  const plantedTypes: SetupType[] = [SetupType.FRESHWATER, SetupType.PALUDARIUM, SetupType.RIPARIUM];
  if (plantedTypes.includes(type)) {
    notes.push({
      category: 'lighting',
      title: 'Set a consistent photoperiod (6-8 hours)',
      body: 'Plants need steady light but too much fuels algae. Start at 6 hours/day and increase if plants are thriving. A simple outlet timer or the light\'s built-in schedule prevents forgetting.',
      guide: { href: '/articles/plant-care-basics', label: 'Read: Plant Care Basics' },
    });
  }

  if (TERR_TYPES.includes(type)) {
    notes.push({
      category: 'lighting',
      title: 'Provide UVB for reptiles that need it',
      body: 'Diurnal reptiles (daytime active) synthesize vitamin D3 from UVB to metabolize calcium. Without it they develop metabolic bone disease. Replace UVB bulbs every 6-12 months — output drops before the bulb visibly dims.',
    });
  }

  // ---- Stocking ----
  notes.push({
    category: 'stocking',
    title: 'Stock slowly — never all at once',
    body: 'Add livestock in small groups over weeks, starting with the hardiest species. Each addition increases the bio-load; test water 24-48 hours after each addition. Quarantine new fish for 2-4 weeks in a separate tank to prevent introducing disease.',
    guide: { href: '/articles/choosing-compatible-fish', label: 'Read: Choosing Compatible Fish' },
  });

  if (tankSize < 10 && WATER_TYPES.includes(type)) {
    notes.push({
      category: 'stocking',
      title: 'Small tanks are less forgiving',
      body: 'Under 10 gallons, water parameters swing fast. Stock lightly (1 inch of adult fish per gallon is a rough ceiling), avoid schooling fish that need swimming room, and test more often.',
    });
  }

  // ---- Skill-level specific ----
  if (skillLevel === Difficulty.BEGINNER) {
    notes.push({
      category: 'safety',
      title: 'Start with hardy species',
      body: 'Beginner-friendly fish (guppies, platies, danios, bettas) tolerate beginner mistakes in water quality. Avoid sensitive species (discus, rams, shrimp) until you have stable parameters for several months.',
      guide: { href: '/articles/first-freshwater-aquarium', label: 'Read: First Freshwater Aquarium' },
    });
  }

  if (skillLevel === Difficulty.BEGINNER && type === SetupType.SALTWATER) {
    notes.push({
      category: 'safety',
      title: 'Saltwater is demanding for beginners',
      body: 'Consider starting with a freshwater tank first. Saltwater adds salinity management, more sensitive livestock, higher cost, and slower cycles. If you proceed, go larger (30+ gallons) for stability and pick hardy fish (clowns, damsels).',
    });
  }

  // ---- Maintenance preference ----
  if (maintenancePref === MaintenanceLevel.LOW) {
    notes.push({
      category: 'maintenance',
      title: 'Low-maintenance means understocking',
      body: 'A low-maintenance tank works when bioload is well below the filter\'s capacity. Stock at 50-70% of the theoretical maximum, use hardy plants, and avoid heavy feeders. You will still need weekly water changes — just smaller ones.',
      guide: { href: '/articles/upkeep-requirements', label: 'Read: Upkeep Requirements' },
    });
  }

  if (maintenancePref === MaintenanceLevel.HIGH) {
    notes.push({
      category: 'maintenance',
      title: 'High-maintenance setups reward attention',
      body: 'Densely planted tanks, reef tanks, and high-bioload community tanks need daily observation and frequent water changes. The payoff is lush growth, vivid color, and a wider species selection.',
    });
  }

  // ---- General safety ----
  notes.push({
    category: 'safety',
    title: 'Never use soap or chemicals near the tank',
    body: 'Residue from cleaning products, perfumes, or lotions on your hands can kill livestock. Wash hands with water only before working in the tank. Keep a dedicated siphon, net, and bucket that never touch household cleaners.',
  });

  if (WATER_TYPES.includes(type) && tankSize >= 30) {
    notes.push({
      category: 'safety',
      title: 'Water is heavy — ~8.3 lbs per gallon',
      body: `A ${tankSize} gallon tank weighs over ${Math.ceil(tankSize * 8.3 + 50)} lbs when filled. Ensure your stand is rated for the load and the floor can support it. A 55g+ tank on an upper floor may need to sit across multiple joists.`,
    });
  }

  return notes;
}
