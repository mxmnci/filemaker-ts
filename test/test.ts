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

export const test = async () => {
  const fm = new FilemakerDataAPI({
    host,
    database,
    username,
    password,
    layout,
  });

  try {
    const { response } = await fm.find.find<Client>({
      query: [{ first_name: 'john' }],
    });

    console.log(response.data[0].fieldData);
  } catch (err) {
    console.log(err as any);
  }

  await fm.auth.logout();

  console.log('Successfully logged out!');
};

test();
