import {
  CreateRecordResponse,
  FileMakerDataAPI,
  FileMakerRequestHandler,
} from '../src';
import { testConfig, testLayout } from './testConfig';

type TestEntity = {
  name: string;
};

const testEntity: TestEntity = {
  name: 'John Doe',
};

jest.setTimeout(30000);

describe('Stress Test', () => {
  let client: FileMakerRequestHandler<TestEntity>;

  beforeEach(() => {
    client = new FileMakerDataAPI(testConfig).createRequestHandler<TestEntity>(
      testLayout
    );
  });

  afterAll(async () => {
    const response = await client.find.find({
      query: [{ name: '*' }],
    });
    const records = response.response.data;
    for (const record of records) {
      await client.records.deleteRecord(record.recordId);
    }
  });

  test('create 100 records', async () => {
    for (let i = 0; i < 100; i++) {
      console.log('Creating record ' + i);
      await client.records.createRecord(testEntity);
    }
  });

  test('create 100 records in parallel', async () => {
    const promises: Promise<CreateRecordResponse>[] = [];
    await client.auth.login();
    for (let i = 0; i < 100; i++) {
      promises.push(client.records.createRecord(testEntity));
    }
    await Promise.all(promises);
  });
});
