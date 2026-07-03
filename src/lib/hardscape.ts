import { SetupType, Biome } from '@prisma/client';

export type HardscapeKind = 'substrate' | 'rock' | 'wood' | 'other';

export type HardscapeRecommendation = {
  name: string;
  kind: HardscapeKind;
  why: string;
  setupTypes: SetupType[];
  biomes?: Biome[];
  productMatch?: string[];
};

export const HARDSCAPE_RECOMMENDATIONS: HardscapeRecommendation[] = [
  // ---- Substrates ----
  {
    name: 'CaribSea Eco-Complete',
    kind: 'substrate',
    why: 'Volcanic basalt planted substrate. Porous for root growth and colonized with beneficial bacteria.',
    setupTypes: [SetupType.FRESHWATER, SetupType.RIPARIUM],
    productMatch: ['eco-complete', 'caribsea eco-complete'],
  },
  {
    name: 'ADA Aqua Soil Amazonia',
    kind: 'substrate',
    why: 'Premium aquasoil that softens water and lowers pH — ideal for planted tanks and shrimp.',
    setupTypes: [SetupType.FRESHWATER, SetupType.RIPARIUM],
    productMatch: ['ada aqua soil', 'amazonia'],
  },
  {
    name: 'Seachem Flourite Black',
    kind: 'substrate',
    why: 'Clay-based planted substrate that never needs replacing. Rinse well before use.',
    setupTypes: [SetupType.FRESHWATER, SetupType.RIPARIUM],
    productMatch: ['flourite', 'seachem flourite'],
  },
  {
    name: 'Pool Filter Sand',
    kind: 'substrate',
    why: 'Inert, inexpensive sand. Good for community tanks, cichlids, and bottom dwellers.',
    setupTypes: [SetupType.FRESHWATER, SetupType.BRACKISH],
    productMatch: ['pool filter sand'],
  },
  {
    name: 'Aragonite Sand',
    kind: 'substrate',
    why: 'Calcium-carbonate sand that buffers pH to 8.1+ and supports a healthy marine buffer system.',
    setupTypes: [SetupType.SALTWATER, SetupType.BRACKISH],
    biomes: [Biome.REEF, Biome.MARINE, Biome.MANGROVE, Biome.BRACKISH_ESTUARY],
  },
  {
    name: 'Live Rock / Dry Rock',
    kind: 'rock',
    why: 'Porous carbonate rock that provides biofiltration and natural structure. Base of every saltwater aquascape.',
    setupTypes: [SetupType.SALTWATER],
    biomes: [Biome.REEF, Biome.MARINE],
  },
  {
    name: 'Crushed Coral',
    kind: 'substrate',
    why: 'Buffers pH and hardness upward — useful for African cichlid and brackish setups.',
    setupTypes: [SetupType.FRESHWATER, SetupType.BRACKISH],
    biomes: [Biome.LAKE, Biome.BRACKISH_ESTUARY],
  },
  {
    name: 'Coco Coir',
    kind: 'substrate',
    why: 'Moisture-retentive, mold-resistant fiber. The standard land substrate for vivariums and terrariums.',
    setupTypes: [SetupType.VIVARIUM, SetupType.TERRARIUM, SetupType.PALUDARIUM],
    biomes: [Biome.TROPICAL_RAINFOREST, Biome.CLOUD_FOREST, Biome.WETLAND, Biome.SWAMP],
  },
  {
    name: 'ABG Mix',
    kind: 'substrate',
    why: 'Bioactive blend of orchid bark, sphagnum, charcoal, peat, and tree fern fiber for dart frogs and tropical vivariums.',
    setupTypes: [SetupType.VIVARIUM, SetupType.PALUDARIUM],
    biomes: [Biome.TROPICAL_RAINFOREST, Biome.CLOUD_FOREST],
  },
  {
    name: 'Desert Sand',
    kind: 'substrate',
    why: 'Dry, loose sand for arid species. Allows burrowing and holds burrow structure without collapsing.',
    setupTypes: [SetupType.TERRARIUM],
    biomes: [Biome.DESERT, Biome.ARID_GRASSLAND, Biome.SAVANNA],
  },
  {
    name: 'Sphagnum Moss',
    kind: 'substrate',
    why: 'Holds moisture and resists decay. Great top layer or nesting material for humid vivariums.',
    setupTypes: [SetupType.VIVARIUM, SetupType.PALUDARIUM],
    biomes: [Biome.CLOUD_FOREST, Biome.TROPICAL_RAINFOREST, Biome.WETLAND],
  },
  {
    name: 'Gravel (pea)',
    kind: 'substrate',
    why: 'Inert, easy to clean, and good for the water side of paludariums and ripariums.',
    setupTypes: [SetupType.PALUDARIUM, SetupType.RIPARIUM, SetupType.FRESHWATER],
  },

  // ---- Rocks ----
  {
    name: 'Seiryu Stone',
    kind: 'rock',
    why: 'Dramatic gray-blue aquascaping stone with deep crevices. Raises pH/hardness slightly — avoid for soft-water species.',
    setupTypes: [SetupType.FRESHWATER, SetupType.PALUDARIUM, SetupType.RIPARIUM],
    productMatch: ['seiryu stone'],
  },
  {
    name: 'Dragon Stone (Seiryu Ohko)',
    kind: 'rock',
    why: 'Lightweight, inert clay stone with a textured, holey surface. Safe for shrimp and soft-water planted tanks.',
    setupTypes: [SetupType.FRESHWATER, SetupType.PALUDARIUM, SetupType.RIPARIUM, SetupType.BRACKISH],
    productMatch: ['dragon stone'],
  },
  {
    name: 'Lava Rock',
    kind: 'rock',
    why: 'Porous, inert, and very light. Excellent biofiltration surface and stacking for caves and hideouts.',
    setupTypes: [SetupType.FRESHWATER, SetupType.SALTWATER, SetupType.BRACKISH, SetupType.TERRARIUM, SetupType.PALUDARIUM],
  },
  {
    name: 'River Rock',
    kind: 'rock',
    why: 'Smooth, inert stones for natural creek beds, basking platforms, and stable stacking.',
    setupTypes: [SetupType.FRESHWATER, SetupType.BRACKISH, SetupType.PALUDARIUM, SetupType.RIPARIUM, SetupType.TERRARIUM],
  },
  {
    name: 'Slate',
    kind: 'rock',
    why: 'Flat, stackable, inert stone. Useful for basking shelves and dry hides in arid terrariums.',
    setupTypes: [SetupType.TERRARIUM, SetupType.VIVARIUM, SetupType.PALUDARIUM],
    biomes: [Biome.DESERT, Biome.ARID_GRASSLAND, Biome.SAVANNA, Biome.TEMPERATE_FOREST],
  },
  {
    name: 'Sandstone',
    kind: 'rock',
    why: 'Warm-toned, porous rock that suits desert and arid enclosures and holds heat well.',
    setupTypes: [SetupType.TERRARIUM],
    biomes: [Biome.DESERT, Biome.ARID_GRASSLAND, Biome.SAVANNA],
  },

  // ---- Wood / Other hardscape ----
  {
    name: 'Driftwood (Spider/Mopani)',
    kind: 'wood',
    why: 'Natural aquarium wood that releases tannins (softens water) and provides grazing for plecos and shrimp.',
    setupTypes: [SetupType.FRESHWATER, SetupType.PALUDARIUM, SetupType.RIPARIUM],
    productMatch: ['driftwood'],
  },
  {
    name: 'Manzanita Wood',
    kind: 'wood',
    why: 'Branchy, smooth hardwood safe for both aquariums and terrariums. Great for climbing and perches.',
    setupTypes: [SetupType.FRESHWATER, SetupType.VIVARIUM, SetupType.TERRARIUM, SetupType.PALUDARIUM, SetupType.RIPARIUM],
    productMatch: ['manzanita wood'],
  },
  {
    name: 'Cork Bark',
    kind: 'other',
    why: 'Lightweight bark tubes and flats for hides, background walls, and climbing in vivariums and terrariums.',
    setupTypes: [SetupType.VIVARIUM, SetupType.TERRARIUM, SetupType.PALUDARIUM],
  },
  {
    name: 'Grapevine / Branches',
    kind: 'wood',
    why: 'Climbing structure and visual interest for arboreal reptiles and amphibians. Allow to dry fully before use.',
    setupTypes: [SetupType.VIVARIUM, SetupType.TERRARIUM],
  },
  {
    name: 'Leaf Litter (Indian Almond / Oak)',
    kind: 'other',
    why: 'Decaying leaves provide hiding spots, tannins, and a food source for bioactive clean-up crews.',
    setupTypes: [SetupType.VIVARIUM, SetupType.TERRARIUM, SetupType.PALUDARIUM],
    biomes: [Biome.TROPICAL_RAINFOREST, Biome.CLOUD_FOREST, Biome.WETLAND, Biome.TEMPERATE_FOREST],
  },
  {
    name: 'Spider Wood',
    kind: 'wood',
    why: 'Twisted, root-like wood popular in aquascapes. Sinks after soaking and adds dramatic branching structure.',
    setupTypes: [SetupType.FRESHWATER, SetupType.PALUDARIUM, SetupType.RIPARIUM],
  },
];

export function recommendHardscape(type: SetupType, biome?: Biome): HardscapeRecommendation[] {
  return HARDSCAPE_RECOMMENDATIONS.filter((item) => {
    if (!item.setupTypes.includes(type)) return false;
    if (biome && item.biomes && !item.biomes.includes(biome)) return false;
    return true;
  });
}

export type HardscapeProduct = {
  id: string;
  name: string;
  imageUrl: string | null;
  priceRange: string | null;
  rating: number | null;
};

export type HardscapeSuggestion = HardscapeRecommendation & {
  product?: HardscapeProduct;
};

export function matchHardscapeProducts(
  recs: HardscapeRecommendation[],
  products: { id: string; name: string; imageUrl: string | null; priceRange: string | null; rating: number | null }[]
): HardscapeSuggestion[] {
  return recs.map((rec) => {
    const matches = rec.productMatch ?? [];
    const product = products.find((p) =>
      matches.some((m) => p.name.toLowerCase().includes(m.toLowerCase()))
    );
    return product ? { ...rec, product } : { ...rec };
  });
}
