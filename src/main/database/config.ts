import { join } from 'node:path';
import { app } from 'electron';

export const DEV_DATABASE_PATH = './src/main/database/local.db';

export const PROD_DATABASE_PATH = join(app.getPath('userData'), 'main.db');

export const DATABASE_PATH = import.meta.env.DEV ? DEV_DATABASE_PATH : PROD_DATABASE_PATH;
