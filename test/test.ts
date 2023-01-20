import { FilemakerDataAPI } from '../src/index';

const host = process.env.HOST;
const database = process.env.DATABASE;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const layout = process.env.LAYOUT;

if (!host || !database || !username || !password || !layout) {
  throw new Error('Env vars not defined');
}

type Client = {
  first_name: string;
  last_name: string;
};

const fm = new FilemakerDataAPI({
  host,
  database,
  username,
  password,
  layout,
  config: {
    logDebugToConsole: true,
  },
});

export const test = async () => {
  try {
    const createResponse = await fm.records.createRecord<Client>({
      first_name: 'Mr. Test',
      last_name: 'Fitzgerald',
    });

    if (!createResponse) throw new Error('Unable to create record');
    const recordId = createResponse.response.recordId;

    const getResponse1 = await fm.records.getRecord<Client>(recordId);

    if (!getResponse1) throw new Error('Unable to get record');

    await fm.records.updateRecord<Client>(recordId, {
      last_name: 'Weaver',
    });

    const getResponse2 = await fm.records.getRecord<Client>(recordId);

    if (!getResponse2) throw new Error('Unable to get record 2');

    const deleteResponse = await fm.records.deleteRecord(recordId);

    if (!deleteResponse) throw new Error('Unable to delete records');
  } catch (err) {
    console.log(err as any);
  }
};

test();
