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
});

export const test = async () => {
  try {
    const {
      response: { recordId },
    } = await fm.records.createRecord<Client>({
      first_name: 'Mr. Test',
      last_name: 'Fitzgerald',
    });

    const getResponse1 = await fm.records.getRecord<Client>(recordId);

    console.log(getResponse1.response.data);
    console.log(recordId);

    await fm.records.updateRecord<Client>(recordId, {
      last_name: 'Weaver',
    });

    const getResponse2 = await fm.records.getRecord<Client>(recordId);

    console.log(getResponse2.response.data);

    const { messages } = await fm.records.deleteRecord(recordId);

    console.log(messages);
  } catch (err) {
    console.log(err as any);
  }

  await fm.auth.logout();

  console.log('Successfully logged out!');
};

test();
