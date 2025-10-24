import { handleIpc } from './lib/helper';

export function registerIpcHandlers() {
  // two exemples of handlers, future handlers should be put in ./handlers
  handleIpc('ping', () => {
    return { response: 'pong' };
  });

  handleIpc('getCityTime', (_event, input) => {
    const cityTimezones: Record<string, string> = {
      'New York': 'America/New_York',
      London: 'Europe/London',
      Paris: 'Europe/Paris',
      Tokyo: 'Asia/Tokyo',
      Sydney: 'Australia/Sydney',
      'Los Angeles': 'America/Los_Angeles',
      Berlin: 'Europe/Berlin',
      Dubai: 'Asia/Dubai',
      Singapore: 'Asia/Singapore',
      Mumbai: 'Asia/Kolkata',
      Beijing: 'Asia/Shanghai',
      Moscow: 'Europe/Moscow'
    };

    const timezone = cityTimezones[input.city];

    if (!timezone) {
      throw new Error(
        `Unknown city: ${input.city}. Available cities: ${Object.keys(cityTimezones).join(', ')}`
      );
    }

    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    return {
      city: input.city,
      time,
      timezone
    };
  });
}
