export function now(): Date {
  return new Date();
}

export function addDays(base: Date, days: number): Date {
  const msPerDay = 24 * 60 * 60 * 1000;
  return new Date(base.getTime() + days * msPerDay);
}
