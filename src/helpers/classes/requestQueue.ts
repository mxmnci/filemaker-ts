import EventEmitter from 'events';

export class RequestQueue extends EventEmitter {
  private queue: Array<{
    priority: number;
    request: () => Promise<unknown>;
  }> = [];
  private concurrency: number;
  private activeRequests = 0;
  private maxQueueSize: number;

  constructor(concurrency: number = 1, maxQueueSize: number = Infinity) {
    super();
    this.concurrency = concurrency;
    this.maxQueueSize = maxQueueSize;
  }

  public enqueue(request: () => Promise<unknown>, priority = 0) {
    if (this.queue.length >= this.maxQueueSize) {
      throw new Error('Queue is full');
    }
    this.queue.push({ priority, request });
    this.queue.sort((a, b) => b.priority - a.priority); // sort descending
  }

  public dequeue(): (() => Promise<unknown>) | undefined {
    if (this.queue.length === 0) throw new Error('Queue is empty');
    return this.queue.shift()?.request;
  }

  public async drain() {
    while (this.activeRequests < this.concurrency && this.queue.length > 0) {
      this.activeRequests++;
      const request = this.dequeue();
      if (!request) throw new Error('Queue should not be empty');

      try {
        this.emit('requestStarted', request);
        await request();
        this.activeRequests--;
        this.emit('requestFinished', request);
        await this.drain();
      } catch (error) {
        this.activeRequests--;
        this.emit('requestFailed', request, error);
        await this.drain();
      }
    }
  }

  public clear() {
    this.queue = [];
  }

  public get length() {
    return this.queue.length;
  }

  public get isRunning() {
    return this.activeRequests > 0;
  }

  public get isQueued() {
    return this.queue.length > 0;
  }

  public get isIdle() {
    return this.activeRequests === 0 && this.queue.length === 0;
  }
}
