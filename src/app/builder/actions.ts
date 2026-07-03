'use server';

import { prisma } from '@/lib/db';
import { Difficulty, SetupType, MaintenanceLevel, ProductCategory, Habitat, Biome } from '@prisma/client';
import { recommendHardscape, matchHardscapeProducts } from '@/lib/hardscape';
import { generateSetupNotes } from '@/lib/setupNotes';
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

export type SavedBuild = {
  id: string;
  name: string;
  type: SetupType;
  biome: Biome | null;
  tankSize: number;
  skillLevel: Difficulty;
  maintenancePref: MaintenanceLevel;
  createdAt: Date;
};

export async function getSavedBuilds(): Promise<SavedBuild[]> {
  const projects = await prisma.builderProject.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      type: true,
      biome: true,
      tankSize: true,
      skillLevel: true,
      maintenancePref: true,
      createdAt: true,
    },
  });
  return projects;
}

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
    ProductCategory.CLEANING,
    ProductCategory.HOSE_TUBING,
    ProductCategory.TOOL,
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

  const recommendedAnimals = suitableAnimals.slice(0, 8);

  // Fetch explicit compat rules among the recommended animals so the client
  // can run live pairwise checks against the user's actual selections.
  const animalIds = recommendedAnimals.map((a) => a.id);
  const explicitRules = animalIds.length > 1
    ? await prisma.animalCompatibility.findMany({
        where: { animalAId: { in: animalIds }, animalBId: { in: animalIds } },
      })
    : [];

  const warnings = await generateWarnings(data, recommendedAnimals);
  const setupNotes = generateSetupNotes(data.type, data.biome, data.skillLevel, data.maintenancePref, data.tankSize);

  // Return recommendations WITHOUT creating a project — the user selects
  // what they want and calls saveBuild separately.
  return {
    params: data,
    animals: recommendedAnimals,
    plants: suitablePlants.slice(0, 8),
    products: products.slice(0, 8),
    substrates,
    hardscape,
    setupNotes,
    warnings,
    compatRules: explicitRules.map((r) => ({
      aId: r.animalAId,
      bId: r.animalBId,
      level: r.level,
      notes: r.notes,
    })),
  };
}

const saveSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.nativeEnum(SetupType),
  biome: z.nativeEnum(Biome).optional(),
  tankSize: z.coerce.number().min(1).max(1000),
  skillLevel: z.nativeEnum(Difficulty),
  maintenancePref: z.nativeEnum(MaintenanceLevel),
});

export type SaveResult = { projectId: string };

export async function saveBuild(formData: FormData): Promise<SaveResult> {
  const data = saveSchema.parse({
    name: formData.get('name'),
    type: formData.get('type'),
    biome: formData.get('biome') || undefined,
    tankSize: formData.get('tankSize'),
    skillLevel: formData.get('skillLevel'),
    maintenancePref: formData.get('maintenancePref'),
  });

  // Collect selected animal entries: animalId -> quantity
  const animalEntries: { animalId: string; quantity: number }[] = [];
  const plantEntries: { plantId: string; quantity: number }[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith('animal-') && value === 'on') {
      const id = key.slice('animal-'.length);
      const qty = Number(formData.get(`qty-animal-${id}`) || 1);
      if (id) animalEntries.push({ animalId: id, quantity: Math.max(1, Math.min(999, qty)) });
    }
    if (key.startsWith('plant-') && value === 'on') {
      const id = key.slice('plant-'.length);
      const qty = Number(formData.get(`qty-plant-${id}`) || 1);
      if (id) plantEntries.push({ plantId: id, quantity: Math.max(1, Math.min(999, qty)) });
    }
  }

  const entries = [
    ...animalEntries.map((a) => ({ animalId: a.animalId, plantId: null, quantity: a.quantity })),
    ...plantEntries.map((p) => ({ animalId: null, plantId: p.plantId, quantity: p.quantity })),
  ];

  const project = await prisma.builderProject.create({
    data: {
      name: data.name,
      type: data.type,
      biome: data.biome,
      tankSize: data.tankSize,
      skillLevel: data.skillLevel,
      maintenancePref: data.maintenancePref,
      entries: entries.length > 0 ? { create: entries } : undefined,
    },
  });

  return { projectId: project.id };
}

/**
 * Setup-level warnings only — depend on build params, not on the specific
 * animals the user picks. Pairwise animal compatibility is assessed
 * client-side against the user's actual selections (see src/app/builder/page.tsx).
 */
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

  return warnings;
}
