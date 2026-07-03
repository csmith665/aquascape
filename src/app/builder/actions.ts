'use server';

import { prisma } from '@/lib/db';
import { Difficulty, SetupType, MaintenanceLevel, ProductCategory, Habitat, Biome } from '@prisma/client';
import { assessCompatibility } from '@/lib/compatibility';
import { recommendHardscape, matchHardscapeProducts } from '@/lib/hardscape';
import { z } from 'zod';

const buildSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.nativeEnum(SetupType),
  biome: z.nativeEnum(Biome).optional(),
  tankSize: z.coerce.number().min(1).max(1000),
  skillLevel: z.nativeEnum(Difficulty),
  maintenancePref: z.nativeEnum(MaintenanceLevel),
});

const setupToHabitat: Record<SetupType, Habitat[]> = {
  [SetupType.FRESHWATER]: [Habitat.FRESHWATER],
  [SetupType.SALTWATER]: [Habitat.SALTWATER],
  [SetupType.BRACKISH]: [Habitat.BRACKISH],
  [SetupType.PALUDARIUM]: [Habitat.PALUDARIUM, Habitat.FRESHWATER],
  [SetupType.VIVARIUM]: [Habitat.VIVARIUM],
  [SetupType.TERRARIUM]: [Habitat.TERRARIUM],
  [SetupType.RIPARIUM]: [Habitat.RIPARIUM, Habitat.FRESHWATER],
};

export type BuildResult = Awaited<ReturnType<typeof buildRecommendation>>;

export async function buildRecommendation(formData: FormData) {
  const data = buildSchema.parse({
    name: formData.get('name'),
    type: formData.get('type'),
    biome: formData.get('biome') || undefined,
    tankSize: formData.get('tankSize'),
    skillLevel: formData.get('skillLevel'),
    maintenancePref: formData.get('maintenancePref'),
  });

  const allowedHabitats = setupToHabitat[data.type];
  const difficultyRank = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3, EXPERT: 4 };

  // Animals matching setup habitat, biome, and tank size
  const animals = await prisma.animal.findMany({
    where: {
      habitats: { hasSome: allowedHabitats },
      minTankSize: { lte: data.tankSize },
      biome: data.biome ? data.biome : undefined,
    },
    orderBy: { difficulty: 'asc' },
  });

  const suitableAnimals = animals.filter(
    (a) => difficultyRank[a.difficulty] <= difficultyRank[data.skillLevel] + 1
  );

  // Plants matching setup habitat, biome, and skill level
  const plants = await prisma.plant.findMany({
    where: {
      habitats: { hasSome: allowedHabitats },
      biome: data.biome ? data.biome : undefined,
    },
    orderBy: { difficulty: 'asc' },
  });

  const suitablePlants = plants.filter(
    (p) => difficultyRank[p.difficulty] <= difficultyRank[data.skillLevel] + 1
  );

  // Equipment products relevant to setup (substrate/hardscape handled separately)
  const productCategories: ProductCategory[] = [
    ProductCategory.FILTER,
    ProductCategory.HEATER,
    ProductCategory.LIGHTING,
    ProductCategory.TESTING,
    ProductCategory.WATER_TREATMENT,
  ];

  if (data.type === SetupType.SALTWATER) productCategories.push(ProductCategory.AIR_PUMP);
  const plantedTankTypes: SetupType[] = [SetupType.FRESHWATER, SetupType.PALUDARIUM];
  if (plantedTankTypes.includes(data.type)) {
    productCategories.push(ProductCategory.CO2_SYSTEM);
  }

  const products = await prisma.product.findMany({
    where: { category: { in: productCategories } },
    orderBy: { rating: 'desc' },
    take: 12,
  });

  // Substrate & hardscape recommendations tailored to setup type + biome
  const hardscapeProducts = await prisma.product.findMany({
    where: { category: { in: [ProductCategory.SUBSTRATE, ProductCategory.HARDSCAPE, ProductCategory.DECORATION] } },
    select: { id: true, name: true, imageUrl: true, priceRange: true, rating: true },
  });

  const allHardscape = recommendHardscape(data.type, data.biome);
  const withProducts = matchHardscapeProducts(allHardscape, hardscapeProducts);
  const substrates = withProducts.filter((h) => h.kind === 'substrate');
  const hardscape = withProducts.filter((h) => h.kind !== 'substrate');

  const project = await prisma.builderProject.create({
    data: {
      name: data.name,
      type: data.type,
      biome: data.biome,
      tankSize: data.tankSize,
      skillLevel: data.skillLevel,
      maintenancePref: data.maintenancePref,
    },
  });

  const warnings = await generateWarnings(data, suitableAnimals.slice(0, 8));

  return {
    project,
    params: data,
    animals: suitableAnimals.slice(0, 8),
    plants: suitablePlants.slice(0, 8),
    products: products.slice(0, 8),
    substrates,
    hardscape,
    warnings,
  };
}

async function generateWarnings(
  data: z.infer<typeof buildSchema>,
  animals: Awaited<ReturnType<typeof prisma.animal.findMany>>
) {
  const warnings: string[] = [];

  if (data.type === SetupType.SALTWATER && data.tankSize < 30) {
    warnings.push('Saltwater aquariums typically need at least 30 gallons for stability.');
  }
  if (data.type === SetupType.SALTWATER && data.skillLevel === Difficulty.BEGINNER) {
    warnings.push('Saltwater is challenging for beginners. Consider starting with freshwater.');
  }
  if (data.maintenancePref === MaintenanceLevel.LOW && data.type === SetupType.SALTWATER) {
    warnings.push('Saltwater setups require high maintenance.');
  }
  if (animals.some((a) => a.tags.includes('schooling')) && data.tankSize < 10) {
    warnings.push('Schooling fish need adequate swimming space. Consider a larger tank.');
  }
  const vivariumTypes: SetupType[] = [SetupType.VIVARIUM, SetupType.TERRARIUM];
  if (vivariumTypes.includes(data.type) && data.tankSize < 10) {
    warnings.push('Vivariums/terrariums benefit from more space for temperature gradients and hiding spots.');
  }

  // Check compatibility between recommended animals
  if (animals.length > 1) {
    const animalIds = animals.map((a) => a.id);
    const explicitRules = await prisma.animalCompatibility.findMany({
      where: {
        animalAId: { in: animalIds },
        animalBId: { in: animalIds },
      },
    });

    const ruleKey = (a: string, b: string) => [a, b].sort().join('|');
    const rules = new Map(explicitRules.map((r) => [ruleKey(r.animalAId, r.animalBId), r]));

    for (let i = 0; i < animals.length; i++) {
      for (let j = i + 1; j < animals.length; j++) {
        const a = animals[i];
        const b = animals[j];
        const key = ruleKey(a.id, b.id);
        const rule = rules.get(key);
        const { level, notes } = assessCompatibility(a, b, rule?.level, rule?.notes);
        if (level !== 'COMPATIBLE') {
          warnings.push(`${a.name} + ${b.name}: ${notes.join(' ')}`);
        }
      }
    }
  }

  return warnings;
}
