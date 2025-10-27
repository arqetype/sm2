export async function registerIpcHandlers() {
  await import('./handlers/file-tree/open-directory');
  await import('./handlers/file-tree/scan-directory');
}
