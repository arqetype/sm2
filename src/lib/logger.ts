type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };

    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${this.context}]`;
    const output = data ? `${prefix} ${message}` : `${prefix} ${message}`;

    switch (level) {
      case 'debug':
        console.debug(output, data ?? '');
        break;
      case 'info':
        console.info(output, data ?? '');
        break;
      case 'warn':
        console.warn(output, data ?? '');
        break;
      case 'error':
        console.error(output, data ?? '');
        break;
    }
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data);
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context);
}
