import { FilemakerDataAPI } from '../src';
import { getConfig } from './config';

const config = getConfig();
const fm = new FilemakerDataAPI(config);

type Client = {
  first_name: string;
  last_name: string;
};

describe('get record', () => {
  test('gets a record from the filemaker data api', async () => {
    const { response } = await fm.records.getRecord<Client>(150000);

    const data = response.data[0].fieldData;

    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('datainfo');
    expect(response).toHaveProperty('data.fieldData');
    expect(data).toHaveProperty('first_name');
    expect(data).toHaveProperty('last_name');
  });
});
