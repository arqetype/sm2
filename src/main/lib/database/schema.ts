import { blob, int, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const uiState = sqliteTable(
  'ui-state',
  {
    id: int().primaryKey({ autoIncrement: true }),
    name: text(),
    state: blob({ mode: 'json' })
  },
  table => [uniqueIndex('name_idx').on(table.name)]
);
