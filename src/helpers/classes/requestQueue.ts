import EventEmitter from 'events';

type Request<T> = () => Promise<T>;

interface QueueItem<T> {
  request: Request<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

export class RequestQueue extends EventEmitter {
  private queue: Array<QueueItem<unknown>> = [];
  private maxQueueSize: number;
  private automaticDrain: boolean;

  constructor({ maxQueueSize = Infinity, automaticDrain = true } = {}) {
    super();
    this.maxQueueSize = maxQueueSize;
    this.automaticDrain = automaticDrain;
  }

  public enqueue<T>(request: Request<T>): Promise<T> {
    if (this.queue.length >= this.maxQueueSize) {
      throw new Error('Queue is full');
    }

    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: any) => void;

    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    this.queue.push({
      request,
      resolve: resolve! as (value: unknown) => void,
      reject: reject!,
    });

    // If the queue is not already being drained, start draining it
    if (this.automaticDrain && !this.isRunning) {
      this.drain();
    }

    return promise;
  }

  public dequeue(): QueueItem<unknown> | undefined {
    if (this.queue.length === 0) throw new Error('Queue is empty');
    return this.queue.shift();
  }

  public async drain() {
    if (this.isRunning) {
      return;
    }

    const queueItem = this.dequeue();
    if (!queueItem) throw new Error('Queue should not be empty');

    const { request, resolve, reject } = queueItem;

    try {
      this.emit('requestStarted', request);
      const result = await request();
      resolve(result);
      this.emit('requestFinished', request);
    } catch (error) {
      reject(error);
      this.emit('requestFailed', request, error);
    }

    if (this.queue.length > 0) {
      await this.drain();
    }
  }

  public clear() {
    this.queue = [];
  }

  public get length() {
    return this.queue.length;
  }

  public get isRunning() {
    return this.queue.length > 0;
  }

  public get isQueued() {
    return this.queue.length > 0;
  }

  public get isIdle() {
    return this.queue.length === 0;
  }
}
