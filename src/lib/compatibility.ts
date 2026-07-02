import { CompatibilityLevel, Temperament } from '@prisma/client';
import type { Animal } from '@prisma/client';

export type CompatibilityAssessment = {
  level: CompatibilityLevel;
  notes: string[];
};

/**
 * Assess compatibility between two animals using both explicit rules (if provided)
 * and derived rules based on habitat, temperament, size, temperature, and pH.
 */
export function assessCompatibility(
  animalA: Animal,
  animalB: Animal,
  explicitLevel?: CompatibilityLevel | null,
  explicitNotes?: string | null
): CompatibilityAssessment {
  const notes: string[] = [];
  let level: CompatibilityLevel = CompatibilityLevel.COMPATIBLE;

  if (explicitLevel) {
    level = explicitLevel;
    if (explicitNotes) {
      notes.push(explicitNotes);
    }
    return { level, notes };
  }

  // Habitat check: completely different enclosure types are incompatible
  const aHabitats = new Set(animalA.habitats);
  const bHabitats = new Set(animalB.habitats);
  const sharedHabitats = [...aHabitats].filter((h) => bHabitats.has(h));
  if (sharedHabitats.length === 0) {
    level = CompatibilityLevel.INCOMPATIBLE;
    notes.push('These animals need completely different enclosure types.');
  }

  // Temperament check
  if (animalA.temperament === Temperament.AGGRESSIVE || animalB.temperament === Temperament.AGGRESSIVE) {
    level = CompatibilityLevel.INCOMPATIBLE;
    notes.push('At least one animal is aggressive and likely to harm the other.');
  } else if (animalA.temperament === Temperament.SEMI_AGGRESSIVE || animalB.temperament === Temperament.SEMI_AGGRESSIVE) {
    if (level === CompatibilityLevel.COMPATIBLE) {
      level = CompatibilityLevel.CAUTION;
    }
    notes.push('One animal is semi-aggressive; monitor closely and provide plenty of space.');
  }

  // Size check: large size difference can mean predator/prey
  if (animalA.maxSize && animalB.maxSize) {
    const ratio = Math.max(animalA.maxSize, animalB.maxSize) / Math.min(animalA.maxSize, animalB.maxSize);
    if (ratio >= 3) {
      const larger = animalA.maxSize > animalB.maxSize ? animalA.name : animalB.name;
      const smaller = animalA.maxSize > animalB.maxSize ? animalB.name : animalA.name;
      if (level === CompatibilityLevel.COMPATIBLE) {
        level = CompatibilityLevel.CAUTION;
      }
      notes.push(`${larger} is much larger than ${smaller} and may see it as prey.`);
    }
  }

  // Temperature overlap
  if (animalA.tempMin != null && animalA.tempMax != null && animalB.tempMin != null && animalB.tempMax != null) {
    const overlapMin = Math.max(animalA.tempMin, animalB.tempMin);
    const overlapMax = Math.min(animalA.tempMax, animalB.tempMax);
    if (overlapMax < overlapMin) {
      level = CompatibilityLevel.INCOMPATIBLE;
      notes.push('Their temperature requirements do not overlap at all.');
    } else if (overlapMax - overlapMin < 3) {
      if (level === CompatibilityLevel.COMPATIBLE) {
        level = CompatibilityLevel.CAUTION;
      }
      notes.push('Their temperature requirements have only a narrow overlap.');
    }
  }

  // pH overlap
  if (animalA.phMin != null && animalA.phMax != null && animalB.phMin != null && animalB.phMax != null) {
    const overlapMin = Math.max(animalA.phMin, animalB.phMin);
    const overlapMax = Math.min(animalA.phMax, animalB.phMax);
    if (overlapMax < overlapMin) {
      level = CompatibilityLevel.INCOMPATIBLE;
      notes.push('Their pH requirements do not overlap.');
    } else if (overlapMax - overlapMin < 0.5) {
      if (level === CompatibilityLevel.COMPATIBLE) {
        level = CompatibilityLevel.CAUTION;
      }
      notes.push('Their pH preferences have only a narrow overlap.');
    }
  }

  if (notes.length === 0) {
    notes.push('No major compatibility concerns detected based on available data.');
  }

  return { level, notes };
}
