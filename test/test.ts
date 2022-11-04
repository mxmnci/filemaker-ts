import { FilemakerDataAPI } from '../src/index';
import { getConfig } from './config';

const config = getConfig();

type Sale = {
  job_number: string;
};

export const test = async () => {
  const fm = new FilemakerDataAPI(config);
  fm.setLayout('Sales_DAPI');

  try {
    const { response } = await fm.find.find<Sale>({
      query: [{ job_number: '3000' }],
    });

    console.log(JSON.stringify(response.data, null, 4));
  } catch (err) {
    console.log(err as any);
  }

  await fm.auth.logout();

  console.log('Successfully logged out!');
};

test();
