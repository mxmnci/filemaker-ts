import { FileMakerDataAPI, FileMakerRequestHandler } from '../src';
import { testConfig, testLayout } from './testConfig';

type TestEntity = {
  name: string;
};

const testEntity: TestEntity = {
  name: 'John Doe',
};

describe('RecordAPI', () => {
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

  test('create a record and retrieve it', async () => {
    const response = await client.records.createRecord(testEntity);
    const recordId = response.response.recordId;
    const getRecordRespose = await client.records.getRecord(recordId);
    const entity = getRecordRespose.response.data[0].fieldData;
    expect(response).toBeDefined();
    expect(entity).toMatchObject(testEntity);
  });

  test('get a range of records', async () => {
    await client.records.createRecord(testEntity);
    const response = await client.records.getRecordRange({
      limit: 1000,
    });
    expect(response).toBeDefined();
    expect(response.response.data[0].fieldData).toMatchObject(testEntity);
  });

  test('update a record', async () => {
    const createRecordResponse = await client.records.createRecord(testEntity);
    const recordId = createRecordResponse.response.recordId;

    const updateRecordEntity = {
      name: 'Jane Doe',
    };
    const updateRecordResponse = await client.records.updateRecord(
      recordId,
      updateRecordEntity
    );
    expect(updateRecordResponse).toBeDefined();

    const getRecordResponse = await client.records.getRecord(recordId);
    const entity = getRecordResponse.response.data[0].fieldData;
    expect(entity).toMatchObject(updateRecordEntity);
  });

  test('delete a record', async () => {
    const response = await client.records.createRecord({
      name: 'Rick Astley',
    });
    const recordId = response.response.recordId;
    const deleteRecordResponse = await client.records.deleteRecord(recordId);
    expect(deleteRecordResponse).toBeDefined();
  });
});
