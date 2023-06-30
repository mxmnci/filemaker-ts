import { FileMakerDataAPI } from '../src';
import { testConfig } from './testConfig';

describe('Authentication', () => {
  let client: FileMakerDataAPI;

  beforeEach(() => {
    client = new FileMakerDataAPI(testConfig);
  });

  test('login', async () => {
    const response = await client.auth.login();
    expect(response).toHaveProperty('token');
  });
});
