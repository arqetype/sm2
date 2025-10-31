import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/main/database/generated',
  schema: './src/main/database/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: './src/main/database/local.db'
  }
});
