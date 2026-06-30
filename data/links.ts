import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export async function createLink({
  slug,
  url,
  userId,
}: {
  slug: string;
  url: string;
  userId: string;
}) {
  return db.insert(links).values({ slug, url, userId }).returning();
}

export async function getLinksByUser() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  return db.select().from(links).where(eq(links.userId, userId)).orderBy(desc(links.updatedAt));
}

export async function updateLink({
  id,
  url,
  slug,
  userId,
}: {
  id: number;
  url: string;
  slug: string;
  userId: string;
}) {
  return db
    .update(links)
    .set({ url, slug, updatedAt: new Date() })
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
}

export async function deleteLink({ id, userId }: { id: number; userId: string }) {
  return db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
}

export async function getLinkBySlug(slug: string) {
  const result = await db.select().from(links).where(eq(links.slug, slug)).limit(1);
  return result[0] ?? null;
}
