import { setPassword, getPassword, deletePassword, findCredentials } from 'keytar';
import { SECRET_SERVICE_NAME } from '../config/secrets';
import { type RemoteAiProviderKey, remoteAiProviderKeys } from '../../_shared/config/ai-provider';

export async function saveAiCredentials(
  providerId: RemoteAiProviderKey,
  value: string
): Promise<boolean> {
  if (value.trim().length === 0) return false;
  await setPassword(SECRET_SERVICE_NAME, providerId, value);
  return true;
}

export async function getAiCredentials(providerId: RemoteAiProviderKey): Promise<string> {
  const result = await getPassword(SECRET_SERVICE_NAME, providerId);
  if (result === null) throw new Error();
  return result;
}

export async function deleteAiCredentials(providerId: RemoteAiProviderKey): Promise<boolean> {
  return await deletePassword(SECRET_SERVICE_NAME, providerId);
}

export async function hasAiCredentials(providerId: RemoteAiProviderKey): Promise<boolean> {
  const result = await getPassword(SECRET_SERVICE_NAME, providerId);
  if (result) return true;
  return false;
}

export async function listProvidersWithCredentials(): Promise<RemoteAiProviderKey[]> {
  const result = await findCredentials(SECRET_SERVICE_NAME);
  return result
    .filter(c => (remoteAiProviderKeys as readonly string[]).includes(c.account))
    .map(c => c.account as RemoteAiProviderKey);
}
