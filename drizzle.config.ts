import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/main/lib/database/generated',
  schema: './src/main/lib/database/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: './src/main/lib/database/local.db'
  }
});
