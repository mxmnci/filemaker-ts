import { AUTH_TIME_LIMIT, AuthAPI } from '../src/apis/AuthAPI';
import { testConfig } from './testConfig';

// Create a mock access token
const createMockAccessToken = () => 'mock-token';

describe('AuthAPI', () => {
  let authAPI: AuthAPI;

  beforeEach(() => {
    authAPI = new AuthAPI(testConfig);
  });

  describe('getAccessToken', () => {
    it('should return the access token', async () => {
      const mockAccessToken = createMockAccessToken();
      authAPI['accessToken'] = mockAccessToken;
      const accessToken = authAPI.getAccessToken();
      expect(typeof accessToken).toBe('string');
      expect(accessToken).toBe(mockAccessToken);
    });

    it('should return null if the access token does not exist', async () => {
      const accessToken = authAPI.getAccessToken();
      expect(accessToken).toBeNull();
    });
  });

  describe('getAccessTokenTimestamp', () => {
    it('should return the access token timestamp', async () => {
      const timestamp = Date.now();
      authAPI['accessTokenTimestamp'] = timestamp;
      const accessTokenTimestamp = authAPI.getAccessTokenTimestamp();
      expect(accessTokenTimestamp).toEqual(timestamp);
    });

    it('should return 0 if the access token does not exist', async () => {
      const accessTokenTimestamp = authAPI.getAccessTokenTimestamp();
      expect(accessTokenTimestamp).toBe(0);
    });
  });

  describe('login', () => {
    it('should return the access token if it exists and is valid', async () => {
      const mockAccessToken = createMockAccessToken();
      authAPI['accessToken'] = mockAccessToken;
      authAPI['accessTokenTimestamp'] = Date.now();
      const accessToken = await authAPI.login();
      expect(accessToken).toBe(mockAccessToken);
    });

    it('should return a new access token if the existing token is expired', async () => {
      const mockAccessToken = createMockAccessToken();
      authAPI['accessToken'] = mockAccessToken;
      authAPI['accessTokenTimestamp'] = Date.now() - AUTH_TIME_LIMIT; // 15 minutes ago
      const accessToken = await authAPI.login();
      expect(accessToken).not.toBe(mockAccessToken);
    });

    it('should throw an error if the username or password is null', async () => {
      authAPI['username'] = null as any;
      await expect(authAPI.login()).rejects.toThrow(
        'Missing username or password!'
      );
    });

    it('should return a token of a certain length', async () => {
      const accessToken = await authAPI.login();
      expect(typeof accessToken).toBe('string');
      expect(accessToken.length).toBeGreaterThan(0);
    });
  });

  describe('logout', () => {
    it('should clear the access token and reset the timestamp', async () => {
      await authAPI.login();
      expect(authAPI['accessToken']).not.toBeNull();
      expect(authAPI['accessTokenTimestamp']).not.toBe(0);
      await authAPI.logout();
      expect(authAPI['accessToken']).toBeNull();
      expect(authAPI['accessTokenTimestamp']).toBe(0);
    });
  });
});
