import { FileMakerDataAPI, FileMakerRequestHandler } from '../src';
import { testConfig, testLayout } from './testConfig';

type TestEntity = {
  name: string;
};

const testEntity: TestEntity = {
  name: 'John Doe',
};

describe('FindAPI', () => {
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

  test('find records with criteria', async () => {
    await client.records.createRecord(testEntity);

    const response = await client.find.find({
      query: [
        {
          name: 'John Doe',
        },
      ],
    });

    expect(response.response.data[0].fieldData).toMatchObject(testEntity);
  });
});
