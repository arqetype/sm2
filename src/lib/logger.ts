type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m'
};

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

    let levelColor = colors.reset;
    const contextColor = colors.cyan;

    switch (level) {
      case 'debug':
        levelColor = colors.gray;
        break;
      case 'info':
        levelColor = colors.blue;
        break;
      case 'warn':
        levelColor = colors.yellow;
        break;
      case 'error':
        levelColor = colors.red;
        break;
    }

    const timestamp = `${colors.gray}[${entry.timestamp}]${colors.reset}`;
    const levelStr = `${levelColor}[${level.toUpperCase()}]${colors.reset}`;
    const context = `${contextColor}[${this.context}]${colors.reset}`;
    const prefix = `${timestamp} ${levelStr} ${context}`;
    const output = `${prefix} ${message}`;

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
