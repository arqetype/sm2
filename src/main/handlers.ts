export async function registerIpcHandlers() {
  await import('./features/file-tree/handlers/open-directory');
  await import('./features/file-tree/handlers/scan-directory');
}
