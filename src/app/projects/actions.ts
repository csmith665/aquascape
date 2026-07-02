'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const idSchema = z.string().min(1);

export async function deleteProject(formData: FormData) {
  const id = idSchema.parse(formData.get('id'));
  await prisma.builderProject.delete({ where: { id } });
  revalidatePath('/projects');
  redirect('/projects');
}