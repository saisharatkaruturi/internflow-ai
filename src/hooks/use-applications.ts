// Persisted application list (per user) keyed by user id in localStorage.

const KEY_PREFIX = "internguard.applications";

const readKey = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
};

const writeKey = (key: string, value: string[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
};

export const getApplications = (userId: string): string[] =>
  readKey(`${KEY_PREFIX}.${userId}`);

export const hasApplied = (userId: string, internshipId: string): boolean =>
  readKey(`${KEY_PREFIX}.${userId}`).includes(internshipId);

export const recordApplication = (userId: string, internshipId: string): string[] => {
  const current = readKey(`${KEY_PREFIX}.${userId}`);
  if (current.includes(internshipId)) return current;
  const next = [...current, internshipId];
  writeKey(`${KEY_PREFIX}.${userId}`, next);
  return next;
};

export const removeApplication = (userId: string, internshipId: string): string[] => {
  const current = readKey(`${KEY_PREFIX}.${userId}`);
  const next = current.filter((id) => id !== internshipId);
  writeKey(`${KEY_PREFIX}.${userId}`, next);
  return next;
};
