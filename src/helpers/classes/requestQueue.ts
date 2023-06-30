import EventEmitter from 'events';

type Request<T> = () => Promise<T>;

interface QueueItem<T> {
  request: Request<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

export class RequestQueue<T> extends EventEmitter {
  private queue: Array<QueueItem<T>> = [];
  private concurrency: number;
  private activeRequests = 0;
  private maxQueueSize: number;
  private automaticDrain: boolean;

  constructor({
    concurrency = 1,
    maxQueueSize = Infinity,
    automaticDrain = true,
  } = {}) {
    super();
    this.concurrency = concurrency;
    this.maxQueueSize = maxQueueSize;
    this.automaticDrain = automaticDrain;
  }

  public enqueue(request: Request<T>): Promise<T> {
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
      resolve: resolve!,
      reject: reject!,
    });

    // If the queue is not already being drained, start draining it
    if (this.automaticDrain && !this.isRunning) {
      this.drain();
    }

    return promise;
  }

  public dequeue(): QueueItem<T> | undefined {
    if (this.queue.length === 0) throw new Error('Queue is empty');
    return this.queue.shift();
  }

  public async drain() {
    if (this.isRunning) {
      return;
    }

    const concurrentRequests: Promise<void>[] = [];

    while (this.activeRequests < this.concurrency && this.queue.length > 0) {
      const queueItem = this.dequeue();
      if (!queueItem) throw new Error('Queue should not be empty');

      const { request, resolve, reject } = queueItem;

      const requestPromise = (async () => {
        this.activeRequests++;
        try {
          this.emit('requestStarted', request);
          const result = await request();
          resolve(result);
          this.activeRequests--;
          this.emit('requestFinished', request);
        } catch (error) {
          reject(error);
          this.activeRequests--;
          this.emit('requestFailed', request, error);
        }
      })();

      concurrentRequests.push(requestPromise);
    }

    await Promise.all(concurrentRequests);

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
    return this.activeRequests > 0;
  }

  public get isQueued() {
    return this.queue.length > 0;
  }

  public get isIdle() {
    return this.activeRequests === 0 && this.queue.length === 0;
  }
}
