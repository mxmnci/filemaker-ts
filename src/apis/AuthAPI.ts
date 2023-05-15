import { generateEncodedAuthString } from '../helpers/encode';
import { fmAxios } from '../helpers/fmAxios';
import { FMAuthMethod } from '../types/FMAxios';
import { AuthResponse, EmptyResponse } from '..';
import { logger } from '../logger';
import { FileMakerRequestHandler } from '../request-handler';

const TIME_LIMIT = 1000 * 60 * 15;

export class AuthAPI {
  private fm: FileMakerRequestHandler;
  private accessToken: string | null;
  private accessTokenTimestamp: number;

  constructor(fm: FileMakerRequestHandler) {
    this.fm = fm;
    this.accessToken = null;
    this.accessTokenTimestamp = 0;
  }

  /**
   * Login to the Filemaker Server Data API
   * @returns {Promise<string>} Promise resolved with the auth token
   * @param username
   * @param password
   */
  public async login(username: string, password: string): Promise<string> {
    const timeElapsedSinceTokenRefresh = Date.now() - this.accessTokenTimestamp;

    logger.debug(
      `Auth API - Time elapsed since access token refresh: ${timeElapsedSinceTokenRefresh}ms`
    );

    const isTimeLimitExceeded = timeElapsedSinceTokenRefresh > TIME_LIMIT;

    // Use the cached access token if time limit hasn't been exceeded
    if (!isTimeLimitExceeded && this.accessToken) {
      logger.debug('Auth API - Access token found! Using cached access token.');
      this.accessTokenTimestamp = Date.now();
      return this.accessToken;
    }

    logger.debug('Auth API - Access token not found! Retrieving a new one...');

    // Continue with BASIC auth if no cached access token
    if (!username || !password) {
      throw new Error('Invalid login credentials');
    }

    const encodedUserAndPassword = generateEncodedAuthString(
      username,
      password
    );

    // * Switch to BASIC authorization method during login
    const response = await fmAxios<AuthResponse>({
      baseURL: this.fm.getBaseURL(),
      url: `/sessions`,
      method: 'POST',
      auth: {
        method: FMAuthMethod.BASIC,
        token: encodedUserAndPassword,
      },
    });

    if (!response) {
      throw new Error('Unable to authenticate');
    }

    const accessToken = response.response.token;

    this.accessToken = accessToken;
    this.accessTokenTimestamp = Date.now();

    return accessToken as string;
  }

  public async logout(authToken: string) {
    const response = await fmAxios<EmptyResponse>({
      baseURL: this.fm.getBaseURL(),
      url: `/sessions/${authToken}`,
      method: 'DELETE',
      auth: {
        method: FMAuthMethod.NONE,
      },
    });

    return response;
  }
}
