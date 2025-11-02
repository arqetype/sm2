export class Semaphore {
  private readonly max: number;
  private available: number;
  private queue: Array<() => void> = [];

  constructor(max: number) {
    if (!Number.isFinite(max) || max <= 0) {
      throw new Error(`Semaphore must be initialized with a positive finite number, got: ${max}`);
    }
    this.max = Math.floor(max);
    this.available = this.max;
  }

  async acquire(): Promise<() => void> {
    if (this.available > 0) {
      this.available--;
      return () => this.release();
    }

    return new Promise<() => void>(resolve => {
      this.queue.push(() => {
        this.available--;
        resolve(() => this.release());
      });
    });
  }

  async run<T>(task: () => Promise<T> | T): Promise<T> {
    const release = await this.acquire();
    try {
      return await task();
    } finally {
      release();
    }
  }

  private release(): void {
    this.available++;

    const next = this.queue.shift();
    if (next) {
      this.available--;
      next();
    } else {
      if (this.available > this.max) {
        this.available = this.max;
      }
    }
  }

  get permits(): number {
    return this.available;
  }

  get waiting(): number {
    return this.queue.length;
  }
}
