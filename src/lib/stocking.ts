import { SetupType } from '@prisma/client';

export type StockingGuidance = {
  animalRule: string;
  animalEstimate: string;
  plantAdvice: string;
  caveats: string[];
};

const roundToNice = (n: number) => Math.round(n / 5) * 5;

export function generateStockingGuidance(type: SetupType, tankSize: number): StockingGuidance {
  const aquaticTypes: SetupType[] = [
    SetupType.FRESHWATER,
    SetupType.BRACKISH,
    SetupType.SALTWATER,
    SetupType.PALUDARIUM,
    SetupType.RIPARIUM,
  ];
  const landTypes: SetupType[] = [SetupType.VIVARIUM, SetupType.TERRARIUM];

  if (type === SetupType.SALTWATER) {
    const inches = tankSize / 5;
    const small = Math.max(3, Math.round(inches / 2));
    const med = Math.max(1, Math.round(inches / 5));
    return {
      animalRule:
        'Saltwater bioload is heavier than freshwater. A conservative rule is about 1 inch of adult fish per 5 gallons.',
      animalEstimate: `A ${tankSize} gallon saltwater tank can comfortably hold about ${Math.floor(
        inches
      )} inches of adult fish — roughly ${small}–${small + 2} small reef-safe fish, or ${Math.max(
        1,
        med - 1
      )}–${med + 1} medium fish.`,
      plantAdvice:
        'In a reef, "livestock" includes corals. Start with a few hardy soft corals (mushrooms, zoas) and add slowly over 8–12 weeks. Macroalgae in a refugium helps with nutrient export.',
      caveats: [
        'Saltwater is less forgiving — stock very slowly and let the biofilter catch up.',
        'A clean-up crew (snails, hermits, maybe a shrimp) counts toward bioload but helps with maintenance.',
      ],
    };
  }

  if (aquaticTypes.includes(type)) {
    const inches = tankSize;
    const smallSchool = Math.max(6, Math.round(inches / 2));
    const smallUpper = smallSchool + 4;
    const mediumLower = Math.max(2, Math.round(inches / 4));
    const mediumUpper = mediumLower + 2;
    const palud = type === SetupType.PALUDARIUM || type === SetupType.RIPARIUM;

    return {
      animalRule:
        'A common beginner rule for freshwater is about 1 inch of adult fish per gallon of water. This is a surface-area / swimming rule, not a strict bioload formula.',
      animalEstimate: `A ${tankSize} gallon ${type
        .toLowerCase()
        .replace('_', ' ')} can comfortably hold about ${roundToNice(
        inches
      )} inches of adult fish. That's roughly ${smallSchool}–${smallUpper} small schooling fish, or ${mediumLower}–${mediumUpper} medium community fish.`,
      plantAdvice: palud
        ? 'For the water area, start with 30–50% plant coverage — about 8–15 plants depending on size. The land area can be planted with humidity-loving species; let them establish before adding climbers.'
        : 'Start with 30–50% plant coverage of the substrate — about 8–15 plants depending on size and growth rate. Fast growers (stem plants, floaters) fill in over 4–6 weeks.',
      caveats: [
        'Schooling fish (tetras, danios, rasboras) need a group of 6+ — count the school as one decision, not 6 separate ones.',
        'Bottom dwellers and mid-water swimmers use different zones, so a community can hold more total fish if they don\'t all compete for the same space.',
        'These are beginner starting points. Stock slowly over the first 6–8 weeks while the tank cycles — add a few fish at a time, not all at once.',
      ],
    };
  }

  if (landTypes.includes(type)) {
    const smallLower = Math.max(1, Math.round(tankSize / 10));
    const smallUpper = Math.max(2, smallLower + 2);
    const mediumLower = Math.max(1, Math.round(tankSize / 20));
    const mediumUpper = Math.max(1, mediumLower + 1);

    return {
      animalRule:
        'For vivariums and terrariums, the constraint is floor space, hides, and temperature gradients — not water volume. Each animal needs at least one secure hide and a way to thermoregulate.',
      animalEstimate: `A ${tankSize} gallon ${type
        .toLowerCase()
        .replace('_', ' ')} can house about ${smallLower}–${smallUpper} small amphibians or reptiles, or ${mediumLower}–${mediumUpper} medium species.`,
      plantAdvice:
        'Aim for dense, well-rooted plants on the land side — they provide cover, hold humidity, and look natural. Start with 5–10 plants depending on floor space; climbing vines (pothos, philodendron) fill vertical space.',
      caveats: [
        'Plan 1–2 hides per animal — they need somewhere to retreat, not just somewhere to be seen.',
        'A temperature gradient (warm side / cool side) is essential for reptiles; a humidity gradient matters for amphibians.',
        'Mix species cautiously — even innocuous-looking animals can stress or predate each other.',
      ],
    };
  }

  // Fallback (shouldn't hit any of the enum values above being false)
  return {
    animalRule:
      'Stocking should match your setup type, filter capacity, and the adult size of the species you choose.',
    animalEstimate: `For a ${tankSize} gallon tank, start small and add slowly over the first 6–8 weeks while the ecosystem matures.`,
    plantAdvice:
      'Start with about 30–50% plant coverage and let the tank find its balance before adding more.',
    caveats: [
      'Stock slowly over the first 6–8 weeks while the tank cycles.',
      'Check adult sizes of any species before buying — the juvenile in the store is not the adult you\'ll be housing.',
    ],
  };
}
