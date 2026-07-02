'use server';

import { prisma } from '@/lib/db';
import { Difficulty, SetupType, MaintenanceLevel, ProductCategory } from '@prisma/client';
import { z } from 'zod';

const buildSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.nativeEnum(SetupType),
  tankSize: z.coerce.number().min(1).max(1000),
  skillLevel: z.nativeEnum(Difficulty),
  maintenancePref: z.nativeEnum(MaintenanceLevel),
});

export type BuildResult = Awaited<ReturnType<typeof buildRecommendation>>;

export async function buildRecommendation(formData: FormData) {
  const data = buildSchema.parse({
    name: formData.get('name'),
    type: formData.get('type'),
    tankSize: formData.get('tankSize'),
    skillLevel: formData.get('skillLevel'),
    maintenancePref: formData.get('maintenancePref'),
  });

  // Filter animals: tank size fits, difficulty <= skill level (simplified)
  const animals = await prisma.animal.findMany({
    where: {
      minTankSize: { lte: data.tankSize },
    },
    orderBy: { difficulty: 'asc' },
  });

  // Filter out animals too difficult for the selected skill level
  const difficultyRank = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3, EXPERT: 4 };
  const suitableAnimals = animals.filter(
    (a) => difficultyRank[a.difficulty] <= difficultyRank[data.skillLevel] + 1
  );

  // Filter plants: exclude aquatic-only plants for non-aquatic setups, etc.
  const plants = await prisma.plant.findMany({
    orderBy: { difficulty: 'asc' },
  });

  const nonAquaticTypes: SetupType[] = [SetupType.VIVARIUM, SetupType.TERRARIUM];
  const suitablePlants = plants.filter((p) => {
    if (nonAquaticTypes.includes(data.type) && String(p.category) === 'AQUATIC') return false;
    if (data.type === SetupType.FRESHWATER && String(p.category) === 'TERRESTRIAL') return false;
    return difficultyRank[p.difficulty] <= difficultyRank[data.skillLevel] + 1;
  });

  // Recommend products based on setup type
  const productCategories: ProductCategory[] = [
    ProductCategory.FILTER,
    ProductCategory.HEATER,
    ProductCategory.LIGHTING,
    ProductCategory.SUBSTRATE,
    ProductCategory.TESTING,
    ProductCategory.WATER_TREATMENT,
  ];
  const products = await prisma.product.findMany({
    where: { category: { in: productCategories } },
    orderBy: { rating: 'desc' },
    take: 12,
  });

  // Build compatibility warnings for recommended animals
  const animalIds = suitableAnimals.map((a) => a.id);
  const compatibilities = await prisma.animalCompatibility.findMany({
    where: {
      OR: [
        { animalAId: { in: animalIds }, animalBId: { in: animalIds } },
      ],
    },
  });

  // Create a project record
  const project = await prisma.builderProject.create({
    data: {
      name: data.name,
      type: data.type,
      tankSize: data.tankSize,
      skillLevel: data.skillLevel,
      maintenancePref: data.maintenancePref,
    },
  });

  return {
    project,
    params: data,
    animals: suitableAnimals.slice(0, 8),
    plants: suitablePlants.slice(0, 8),
    products: products.slice(0, 8),
    compatibilities,
    warnings: generateWarnings(data, suitableAnimals),
  };
}

function generateWarnings(
  data: z.infer<typeof buildSchema>,
  animals: Awaited<ReturnType<typeof prisma.animal.findMany>>
) {
  const warnings: string[] = [];

  if (data.type === 'SALTWATER' && data.tankSize < 30) {
    warnings.push('Saltwater aquariums typically need at least 30 gallons for stability. Consider a larger tank.');
  }

  if (data.type === 'SALTWATER' && data.skillLevel === 'BEGINNER') {
    warnings.push('Saltwater aquariums are challenging for beginners. Consider starting with freshwater.');
  }

  if (data.maintenancePref === 'LOW' && data.type === 'SALTWATER') {
    warnings.push('Saltwater setups require high maintenance. Your preference may not match this setup.');
  }

  const schoolingFish = animals.filter((a) => a.tags.includes('schooling'));
  if (schoolingFish.length > 0 && data.tankSize < 10) {
    warnings.push('Schooling fish need adequate swimming space. Consider a larger tank for active swimmers.');
  }

  return warnings;
}
