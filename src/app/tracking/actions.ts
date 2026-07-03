'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { SetupType, EnvironmentStatus, MaintenanceType, HealthStatus } from '@prisma/client';
import { z } from 'zod';

const idSchema = z.string().min(1);

const envSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.nativeEnum(SetupType),
  tankSize: z.coerce.number().min(1).max(10000),
  length: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  status: z.nativeEnum(EnvironmentStatus).optional(),
  startDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export async function createEnvironment(formData: FormData) {
  const raw = envSchema.parse({
    name: formData.get('name'),
    type: formData.get('type'),
    tankSize: formData.get('tankSize'),
    length: formData.get('length') || undefined,
    width: formData.get('width') || undefined,
    height: formData.get('height') || undefined,
    status: formData.get('status') || undefined,
    startDate: formData.get('startDate') || undefined,
    notes: formData.get('notes') || undefined,
  });

  const env = await prisma.tankEnvironment.create({
    data: {
      name: raw.name,
      type: raw.type,
      tankSize: raw.tankSize,
      length: raw.length,
      width: raw.width,
      height: raw.height,
      status: raw.status ?? EnvironmentStatus.SETUP,
      startDate: raw.startDate ? new Date(raw.startDate) : null,
      notes: raw.notes,
    },
  });

  revalidatePath('/tracking');
  redirect(`/tracking/${env.id}`);
}

export async function updateEnvironment(formData: FormData) {
  const id = idSchema.parse(formData.get('id'));
  const raw = envSchema.parse({
    name: formData.get('name'),
    type: formData.get('type'),
    tankSize: formData.get('tankSize'),
    length: formData.get('length') || undefined,
    width: formData.get('width') || undefined,
    height: formData.get('height') || undefined,
    status: formData.get('status') || undefined,
    startDate: formData.get('startDate') || undefined,
    notes: formData.get('notes') || undefined,
  });

  await prisma.tankEnvironment.update({
    where: { id },
    data: {
      name: raw.name,
      type: raw.type,
      tankSize: raw.tankSize,
      length: raw.length,
      width: raw.width,
      height: raw.height,
      status: raw.status ?? EnvironmentStatus.SETUP,
      startDate: raw.startDate ? new Date(raw.startDate) : null,
      notes: raw.notes,
    },
  });

  revalidatePath('/tracking');
  revalidatePath(`/tracking/${id}`);
}

export async function deleteEnvironment(formData: FormData) {
  const id = idSchema.parse(formData.get('id'));
  await prisma.tankEnvironment.delete({ where: { id } });
  revalidatePath('/tracking');
  redirect('/tracking');
}

const waterLogSchema = z.object({
  environmentId: z.string().min(1),
  temperature: z.coerce.number().optional(),
  ph: z.coerce.number().optional(),
  ammonia: z.coerce.number().optional(),
  nitrite: z.coerce.number().optional(),
  nitrate: z.coerce.number().optional(),
  gh: z.coerce.number().optional(),
  kh: z.coerce.number().optional(),
  salinity: z.coerce.number().optional(),
  notes: z.string().max(1000).optional(),
});

export async function addWaterLog(formData: FormData) {
  const data = waterLogSchema.parse({
    environmentId: formData.get('environmentId'),
    temperature: formData.get('temperature') || undefined,
    ph: formData.get('ph') || undefined,
    ammonia: formData.get('ammonia') || undefined,
    nitrite: formData.get('nitrite') || undefined,
    nitrate: formData.get('nitrate') || undefined,
    gh: formData.get('gh') || undefined,
    kh: formData.get('kh') || undefined,
    salinity: formData.get('salinity') || undefined,
    notes: formData.get('notes') || undefined,
  });

  const { environmentId, ...rest } = data;
  const hasValues = Object.values(rest).some((v) => v !== undefined && v !== '');
  if (hasValues) {
    await prisma.waterParameterLog.create({
      data: { environmentId, ...rest },
    });
  }

  revalidatePath(`/tracking/${environmentId}`);
}

export async function deleteWaterLog(formData: FormData) {
  const id = idSchema.parse(formData.get('id'));
  const environmentId = idSchema.parse(formData.get('environmentId'));
  await prisma.waterParameterLog.delete({ where: { id } });
  revalidatePath(`/tracking/${environmentId}`);
}

const maintenanceSchema = z.object({
  environmentId: z.string().min(1),
  type: z.nativeEnum(MaintenanceType),
  description: z.string().max(1000).optional(),
  waterChangePercent: z.coerce.number().min(0).max(100).optional(),
});

export async function addMaintenanceLog(formData: FormData) {
  const data = maintenanceSchema.parse({
    environmentId: formData.get('environmentId'),
    type: formData.get('type'),
    description: formData.get('description') || undefined,
    waterChangePercent: formData.get('waterChangePercent') || undefined,
  });

  const { environmentId, ...rest } = data;
  await prisma.maintenanceLog.create({ data: { environmentId, ...rest } });
  revalidatePath(`/tracking/${environmentId}`);
}

export async function deleteMaintenanceLog(formData: FormData) {
  const id = idSchema.parse(formData.get('id'));
  const environmentId = idSchema.parse(formData.get('environmentId'));
  await prisma.maintenanceLog.delete({ where: { id } });
  revalidatePath(`/tracking/${environmentId}`);
}

const feedingSchema = z.object({
  environmentId: z.string().min(1),
  foodType: z.string().min(1).max(100),
  amount: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
});

export async function addFeedingLog(formData: FormData) {
  const data = feedingSchema.parse({
    environmentId: formData.get('environmentId'),
    foodType: formData.get('foodType'),
    amount: formData.get('amount') || undefined,
    notes: formData.get('notes') || undefined,
  });

  const { environmentId, ...rest } = data;
  await prisma.feedingLog.create({ data: { environmentId, ...rest } });
  revalidatePath(`/tracking/${environmentId}`);
}

export async function deleteFeedingLog(formData: FormData) {
  const id = idSchema.parse(formData.get('id'));
  const environmentId = idSchema.parse(formData.get('environmentId'));
  await prisma.feedingLog.delete({ where: { id } });
  revalidatePath(`/tracking/${environmentId}`);
}

const livestockSchema = z.object({
  environmentId: z.string().min(1),
  animalId: z.string().optional(),
  plantId: z.string().optional(),
  name: z.string().max(100).optional(),
  quantity: z.coerce.number().min(1).max(10000).optional(),
  healthStatus: z.nativeEnum(HealthStatus).optional(),
  notes: z.string().max(1000).optional(),
});

export async function addLivestock(formData: FormData) {
  const data = livestockSchema.parse({
    environmentId: formData.get('environmentId'),
    animalId: formData.get('animalId') || undefined,
    plantId: formData.get('plantId') || undefined,
    name: formData.get('name') || undefined,
    quantity: formData.get('quantity') || undefined,
    healthStatus: formData.get('healthStatus') || undefined,
    notes: formData.get('notes') || undefined,
  });

  const { environmentId, ...rest } = data;
  if (!rest.animalId && !rest.plantId && !rest.name) return;

  await prisma.trackedLivestock.create({
    data: {
      environmentId,
      animalId: rest.animalId || null,
      plantId: rest.plantId || null,
      name: rest.name || null,
      quantity: rest.quantity ?? 1,
      healthStatus: rest.healthStatus ?? HealthStatus.HEALTHY,
      notes: rest.notes,
    },
  });

  revalidatePath(`/tracking/${environmentId}`);
}

export async function updateLivestockStatus(formData: FormData) {
  const id = idSchema.parse(formData.get('id'));
  const environmentId = idSchema.parse(formData.get('environmentId'));
  const status = z.nativeEnum(HealthStatus).parse(formData.get('healthStatus'));

  await prisma.trackedLivestock.update({
    where: { id },
    data: {
      healthStatus: status,
      dateRemoved: status === HealthStatus.REMOVED || status === HealthStatus.DECEASED ? new Date() : null,
    },
  });

  revalidatePath(`/tracking/${environmentId}`);
}

export async function removeLivestock(formData: FormData) {
  const id = idSchema.parse(formData.get('id'));
  const environmentId = idSchema.parse(formData.get('environmentId'));
  await prisma.trackedLivestock.delete({ where: { id } });
  revalidatePath(`/tracking/${environmentId}`);
}
