import { RequestQueue } from './requestQueue'; // Update with actual path

describe('RequestQueue', () => {
  let queue: RequestQueue<{}>;
  let manualQueue: RequestQueue<{}>;

  beforeEach(() => {
    queue = new RequestQueue();
    // A queue that does not automatically drain
    manualQueue = new RequestQueue({ automaticDrain: false });
  });

  test('initialize', () => {
    expect(queue).toBeInstanceOf(RequestQueue);
    expect(queue.length).toBe(0);
    expect(queue.isIdle).toBe(true);
  });

  test('enqueue and dequeue', async () => {
    const request = jest.fn().mockResolvedValue('Success');
    manualQueue.enqueue(request);
    expect(manualQueue.length).toBe(1);
    expect(manualQueue.isQueued).toBe(true);

    const dequeuedRequest = manualQueue.dequeue();
    expect(manualQueue.length).toBe(0);
    expect(manualQueue.isQueued).toBe(false);

    if (!dequeuedRequest) throw new Error('Request should not be undefined');
    await expect(dequeuedRequest.request()).resolves.toEqual('Success');
  });

  test('enqueue/dequeue multiple requests', async () => {
    const request1 = jest.fn().mockResolvedValue('Success 1');
    const request2 = jest.fn().mockResolvedValue('Success 2');
    manualQueue.enqueue(request1);
    manualQueue.enqueue(request2);
    expect(manualQueue.length).toBe(2);
    expect(manualQueue.isQueued).toBe(true);

    const dequeuedRequest1 = manualQueue.dequeue();
    expect(manualQueue.length).toBe(1);
    expect(manualQueue.isQueued).toBe(true);

    const dequeuedRequest2 = manualQueue.dequeue();
    expect(manualQueue.length).toBe(0);
    expect(manualQueue.isQueued).toBe(false);

    if (!dequeuedRequest1 || !dequeuedRequest2)
      throw new Error('Request should not be undefined');
    await expect(dequeuedRequest1.request()).resolves.toEqual('Success 1');
    await expect(dequeuedRequest2.request()).resolves.toEqual('Success 2');
  });

  test('drain large N test', async () => {
    const queue = new RequestQueue();
    const request = jest.fn().mockResolvedValue('Success');
    const failure = jest.fn().mockRejectedValue('Error');
    const promises = [];

    for (let i = 0; i < 1000; i++) {
      promises.push(queue.enqueue(request));
      promises.push(queue.enqueue(failure));
    }

    await Promise.allSettled(promises);

    expect(queue.length).toBe(0);
    expect(queue.isIdle).toBe(true);
  });

  test('run with successful request', async () => {
    const request = jest.fn().mockResolvedValue('Success');

    let requestStarted = false;
    let requestFinished = false;

    queue.once('requestStarted', () => {
      requestStarted = true;
      expect(queue.isRunning).toBe(true);
    });

    queue.once('requestFinished', () => {
      requestFinished = true;
      expect(queue.isIdle).toBe(true);
    });

    const promise = queue.enqueue(request);

    await expect(promise).resolves.toEqual('Success');

    // Ensure that both events have been emitted
    expect(requestStarted).toBe(true);
    expect(requestFinished).toBe(true);
  });

  test('run with failed request', async () => {
    const request = jest.fn().mockRejectedValue('Error');
    let requestStarted = false;
    let requestFailed = false;

    queue.once('requestStarted', () => {
      requestStarted = true;
      expect(queue.isRunning).toBe(true);
    });

    queue.once('requestFailed', () => {
      requestFailed = true;
      expect(queue.isIdle).toBe(true);
    });

    try {
      await queue.enqueue(request);
    } catch (e) {
      expect(e).toEqual('Error');
    }

    // Ensure that both events have been emitted
    expect(requestStarted).toBe(true);
    expect(requestFailed).toBe(true);
  });

  test('clear', async () => {
    const request = jest.fn().mockResolvedValue('Success');
    manualQueue.enqueue(request);
    manualQueue.clear();

    expect(manualQueue.length).toBe(0);
    expect(manualQueue.isIdle).toBe(true);
  });

  test('queue overflow', () => {
    const request = jest.fn().mockResolvedValue('Success');
    const queue = new RequestQueue({
      maxQueueSize: 1,
    });
    queue.enqueue(request);
    queue.enqueue(request);

    expect(() => queue.enqueue(request)).toThrow('Queue is full');
  });

  test('dequeue from empty queue', () => {
    expect(() => queue.dequeue()).toThrow('Queue is empty');
  });

  test('drain from empty queue', async () => {
    await expect(queue.drain()).resolves.toBeUndefined();
  });

  test('receive a value from a response', async () => {
    const response = await queue.enqueue(
      () => new Promise(resolve => resolve('This is a test'))
    );
    expect(response).toEqual('This is a test');
  });
});
