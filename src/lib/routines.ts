import { SetupType, MaintenanceType, RoutineFrequency } from '@prisma/client';

export type RoutineSeed = {
  task: string;
  frequency: RoutineFrequency;
  type: MaintenanceType;
  notes?: string;
};

const WATER_TYPES: SetupType[] = [
  SetupType.FRESHWATER,
  SetupType.SALTWATER,
  SetupType.BRACKISH,
  SetupType.PALUDARIUM,
  SetupType.RIPARIUM,
];

const TERR_TYPES: SetupType[] = [SetupType.TERRARIUM, SetupType.VIVARIUM];

export function defaultRoutines(type: SetupType): RoutineSeed[] {
  const routines: RoutineSeed[] = [];

  if (WATER_TYPES.includes(type)) {
    routines.push(
      { task: 'Feed livestock', frequency: RoutineFrequency.DAILY, type: MaintenanceType.OTHER, notes: 'Adjust amount to what is eaten in ~2 minutes.' },
      { task: 'Check temperature and visual health check', frequency: RoutineFrequency.DAILY, type: MaintenanceType.EQUIPMENT_CHECK },
      { task: 'Top off evaporated water', frequency: RoutineFrequency.WEEKLY, type: MaintenanceType.OTHER },
      { task: 'Water change (10-25%)', frequency: RoutineFrequency.WEEKLY, type: MaintenanceType.WATER_CHANGE, notes: 'Match temperature and dechlorinate new water.' },
      { task: 'Test water parameters (ammonia, nitrite, nitrate, pH)', frequency: RoutineFrequency.WEEKLY, type: MaintenanceType.OTHER },
      { task: 'Clean glass / remove algae', frequency: RoutineFrequency.WEEKLY, type: MaintenanceType.GLASS_CLEAN },
      { task: 'Trim plants and remove dead leaves', frequency: RoutineFrequency.WEEKLY, type: MaintenanceType.PLANT_TRIM },
      { task: 'Vacuum substrate during water change', frequency: RoutineFrequency.BIWEEKLY, type: MaintenanceType.SUBSTRATE_VACUUM },
      { task: 'Rinse/clean filter media (in tank water)', frequency: RoutineFrequency.MONTHLY, type: MaintenanceType.FILTER_CLEAN, notes: 'Never use tap water — kills beneficial bacteria.' },
      { task: 'Deep equipment check (heater, filter impeller, tubing)', frequency: RoutineFrequency.MONTHLY, type: MaintenanceType.EQUIPMENT_CHECK },
      { task: 'Replace chemical filter media (carbon/GFO)', frequency: RoutineFrequency.MONTHLY, type: MaintenanceType.FILTER_CLEAN }
    );
  }

  if (type === SetupType.SALTWATER) {
    routines.push(
      { task: 'Test salinity / specific gravity', frequency: RoutineFrequency.WEEKLY, type: MaintenanceType.OTHER },
      { task: 'Check protein skimmer and clean cup', frequency: RoutineFrequency.WEEKLY, type: MaintenanceType.FILTER_CLEAN },
      { task: 'Inspect for pests (aiptasia, nuisance algae)', frequency: RoutineFrequency.MONTHLY, type: MaintenanceType.OTHER }
    );
  }

  if (type === SetupType.BRACKISH) {
    routines.push(
      { task: 'Test salinity (brackish range ~1.005-1.015)', frequency: RoutineFrequency.WEEKLY, type: MaintenanceType.OTHER }
    );
  }

  if (TERR_TYPES.includes(type)) {
    routines.push(
      { task: 'Mist for humidity', frequency: RoutineFrequency.DAILY, type: MaintenanceType.OTHER, notes: 'Frequency depends on species — tropical species need more.' },
      { task: 'Feed and observe livestock', frequency: RoutineFrequency.DAILY, type: MaintenanceType.OTHER },
      { task: 'Spot-clean waste and shed', frequency: RoutineFrequency.DAILY, type: MaintenanceType.OTHER },
      { task: 'Check temperature gradient and humidity gauges', frequency: RoutineFrequency.WEEKLY, type: MaintenanceType.EQUIPMENT_CHECK },
      { task: 'Refresh water dish and clean bowl', frequency: RoutineFrequency.WEEKLY, type: MaintenanceType.OTHER },
      { task: 'Trim and prune plants', frequency: RoutineFrequency.MONTHLY, type: MaintenanceType.PLANT_TRIM },
      { task: 'Clean glass and decor', frequency: RoutineFrequency.MONTHLY, type: MaintenanceType.GLASS_CLEAN },
      { task: 'Replace UVB bulb if applicable', frequency: RoutineFrequency.QUARTERLY, type: MaintenanceType.EQUIPMENT_CHECK, notes: 'UVB output drops before the bulb visibly dims.' }
    );
  }

  if (type === SetupType.PALUDARIUM) {
    routines.push(
      { task: 'Mist land section', frequency: RoutineFrequency.DAILY, type: MaintenanceType.OTHER },
      { task: 'Prune terrestrial plants', frequency: RoutineFrequency.MONTHLY, type: MaintenanceType.PLANT_TRIM }
    );
  }

  if (routines.length === 0) {
    routines.push(
      { task: 'Daily observation of livestock and environment', frequency: RoutineFrequency.DAILY, type: MaintenanceType.OTHER }
    );
  }

  return routines;
}
