'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import { createLink, updateLink, deleteLink } from '@/data/links';

const CreateLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL.'),
  slug: z
    .string()
    .max(50, 'Slug must be 50 characters or fewer.')
    .regex(
      /^[a-zA-Z0-9_-]*$/,
      'Slug may only contain letters, numbers, hyphens, and underscores.',
    )
    .optional(),
});

type CreateLinkInput = z.infer<typeof CreateLinkSchema>;

export async function createLinkAction(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = CreateLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const slug = parsed.data.slug?.trim() || nanoid(8);

  try {
    await createLink({ url: parsed.data.url, slug, userId });
  } catch {
    return { error: 'A link with that slug already exists.' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

const UpdateLinkSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().url('Please enter a valid URL.'),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .max(50, 'Slug must be 50 characters or fewer.')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Slug may only contain letters, numbers, hyphens, and underscores.',
    ),
});

type UpdateLinkInput = z.infer<typeof UpdateLinkSchema>;

export async function updateLinkAction(input: UpdateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = UpdateLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  try {
    await updateLink({ ...parsed.data, userId });
  } catch {
    return { error: 'A link with that slug already exists.' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

const DeleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

type DeleteLinkInput = z.infer<typeof DeleteLinkSchema>;

export async function deleteLinkAction(input: DeleteLinkInput) {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = DeleteLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  await deleteLink({ id: parsed.data.id, userId });

  revalidatePath('/dashboard');
  return { success: true };
}
