import { db } from '@main/database';
import { uiState } from '@main/database/schema';
import { UIState } from '@shared/types/super-memo';
import { eq } from 'drizzle-orm';

export async function getOrCreateUiStateValues(): Promise<UIState> {
  const existing = await db.select().from(uiState).where(eq(uiState.id, 1)).limit(1);
  if (existing.length > 0) return existing[0];

  const inserted = await db.insert(uiState).values({ id: 1 }).returning();

  if (inserted.length > 0) return inserted[0];

  throw new Error("Couldn't read the state Value");
}

export async function updateOpenedDirectory(path: string): Promise<void> {
  await getOrCreateUiStateValues();
  db.update(uiState).set({ openedFolder: path }).where(eq(uiState.id, 1)).run();
}

export async function getOpenedDirectoryOrNull(): Promise<string | null> {
  const result = await db.select().from(uiState).where(eq(uiState.id, 1)).limit(1);
  return result[0].openedFolder;
}
