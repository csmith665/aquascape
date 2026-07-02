'use server';

import { prisma } from '@/lib/db';
import { CompatibilityLevel } from '@prisma/client';
import { assessCompatibility } from '@/lib/compatibility';

export type CompatibilityResult = {
  level: CompatibilityLevel;
  notes: string;
  animalA: { id: string; name: string; category: string; maxSize: number | null };
  animalB: { id: string; name: string; category: string; maxSize: number | null };
} | null;

export async function checkCompatibility(animalAId: string, animalBId: string): Promise<CompatibilityResult> {
  if (!animalAId || !animalBId || animalAId === animalBId) return null;

  const [animalA, animalB] = await Promise.all([
    prisma.animal.findUnique({ where: { id: animalAId } }),
    prisma.animal.findUnique({ where: { id: animalBId } }),
  ]);

  if (!animalA || !animalB) return null;

  // Check explicit compatibility records in either direction
  const explicit = await prisma.animalCompatibility.findFirst({
    where: {
      OR: [
        { animalAId, animalBId },
        { animalAId: animalBId, animalBId: animalAId },
      ],
    },
  });

  const { level, notes } = assessCompatibility(animalA, animalB, explicit?.level, explicit?.notes);

  return {
    level,
    notes: notes.join(' '),
    animalA: { id: animalA.id, name: animalA.name, category: animalA.category, maxSize: animalA.maxSize },
    animalB: { id: animalB.id, name: animalB.name, category: animalB.category, maxSize: animalB.maxSize },
  };
}
