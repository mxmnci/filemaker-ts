import { RequestQueue } from './requestQueue'; // Update with actual path

describe('RequestQueue', () => {
  let queue: RequestQueue;

  beforeEach(() => {
    queue = new RequestQueue();
  });

  test('initialize', () => {
    expect(queue).toBeInstanceOf(RequestQueue);
    expect(queue.length).toBe(0);
    expect(queue.isIdle).toBe(true);
  });

  test('enqueue and dequeue', async () => {
    const request = jest.fn().mockResolvedValue('Success');
    queue.enqueue(request);
    expect(queue.length).toBe(1);
    expect(queue.isQueued).toBe(true);

    const dequeuedRequest = queue.dequeue();
    expect(queue.length).toBe(0);
    expect(queue.isQueued).toBe(false);

    if (!dequeuedRequest) throw new Error('Request should not be undefined');
    await expect(dequeuedRequest()).resolves.toEqual('Success');
  });

  test('enqueue/dequeue multiple requests', async () => {
    const request1 = jest.fn().mockResolvedValue('Success 1');
    const request2 = jest.fn().mockResolvedValue('Success 2');
    queue.enqueue(request1);
    queue.enqueue(request2);
    expect(queue.length).toBe(2);
    expect(queue.isQueued).toBe(true);

    const dequeuedRequest1 = queue.dequeue();
    expect(queue.length).toBe(1);
    expect(queue.isQueued).toBe(true);

    const dequeuedRequest2 = queue.dequeue();
    expect(queue.length).toBe(0);
    expect(queue.isQueued).toBe(false);

    if (!dequeuedRequest1 || !dequeuedRequest2)
      throw new Error('Request should not be undefined');
    await expect(dequeuedRequest1()).resolves.toEqual('Success 1');
    await expect(dequeuedRequest2()).resolves.toEqual('Success 2');
  });

  test('drain stress test', async () => {
    const request = jest.fn().mockResolvedValue('Success');
    for (let i = 0; i < 100; i++) {
      queue.enqueue(request);
    }

    await queue.drain();
    expect(queue.length).toBe(0);
    expect(queue.isIdle).toBe(true);
  });

  test('run with successful request', async () => {
    const request = jest.fn().mockResolvedValue('Success');
    queue.enqueue(request);

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

    await queue.drain();

    // Ensure that both events have been emitted
    expect(requestStarted).toBe(true);
    expect(requestFinished).toBe(true);
  });

  test('run with failed request', async () => {
    const request = jest.fn().mockRejectedValue('Error');
    queue.enqueue(request);
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

    await queue.drain();

    // Ensure that both events have been emitted
    expect(requestStarted).toBe(true);
    expect(requestFailed).toBe(true);
  });

  test('clear', () => {
    const request = jest.fn().mockResolvedValue('Success');
    queue.enqueue(request);
    queue.clear();

    expect(queue.length).toBe(0);
    expect(queue.isIdle).toBe(true);
  });

  test('queue overflow', () => {
    const request = jest.fn().mockResolvedValue('Success');
    queue = new RequestQueue(1, 1);
    queue.enqueue(request);

    expect(() => queue.enqueue(request)).toThrow('Queue is full');
  });

  test('dequeue from empty queue', () => {
    expect(() => queue.dequeue()).toThrow('Queue is empty');
  });

  test('drain from empty queue', async () => {
    await expect(queue.drain()).resolves.toBeUndefined();
  });
});
