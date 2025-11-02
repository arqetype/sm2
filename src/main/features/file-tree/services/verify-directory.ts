import fs from 'node:fs/promises';
import { normalize } from 'node:path';

export type VerifyDirectoryReturn = { success: true } | { success: false; message: string };

export async function verifyDirectory(path: string): Promise<VerifyDirectoryReturn> {
  const normalizedPath = normalize(path);

  try {
    const stats = await fs.stat(normalizedPath);
    if (!stats.isDirectory()) {
      return {
        success: false,
        message: 'This path is a file, not a folder'
      };
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occured while reading the files';

    return {
      success: false,
      message: `${message}`
    };
  }

  return { success: true };
}
