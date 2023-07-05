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

  beforeAll(async () => {
    client = new FileMakerDataAPI(testConfig).createRequestHandler<TestEntity>(
      testLayout
    );
    await client.auth.login();
  });

  afterAll(async () => {
    const response = await client.find.find({
      query: [{ name: '*' }],
    });
    const records = response.response.data;

    await Promise.all(
      records.map(record => client.records.deleteRecord(record.recordId))
    );
  });

  test('create 100 records', async () => {
    for (let i = 0; i < 100; i++) {
      await client.records.createRecord(testEntity);
    }
  });

  test('create 100 records in parallel', async () => {
    const promises: Promise<CreateRecordResponse>[] = [];
    for (let i = 0; i < 100; i++) {
      promises.push(client.records.createRecord(testEntity));
    }
    await Promise.all(promises);
  });
});
