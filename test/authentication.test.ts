import { FileMakerDataAPI } from '../src';
import { testConfig } from './testConfig';

function isValidFileMakerAccessToken(token: string) {
  const tokenRegex = /^[a-f0-9]*$/i;
  return tokenRegex.test(token);
}

describe('Authentication', () => {
  let client: FileMakerDataAPI;

  beforeEach(() => {
    client = new FileMakerDataAPI(testConfig);
  });

  test('login', async () => {
    const accessToken = await client.auth.login();
    expect(isValidFileMakerAccessToken(accessToken)).toBe(true);
    expect(client.auth.getAccessToken()).toBe(accessToken);
    expect(client.auth.getAccessTokenTimestamp()).toBeLessThanOrEqual(
      Date.now()
    );
    await client.auth.logout();
  });

  test('logout', async () => {
    await client.auth.login();
    await client.auth.logout();
    expect(client.auth.getAccessToken()).toBeNull();
    expect(client.auth.getAccessTokenTimestamp()).toBe(0);
  });
});
