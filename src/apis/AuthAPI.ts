import { generateEncodedAuthString } from '../helpers/utils/encode.util';
import { fmAxios } from '../helpers/fmAxios';
import { FMAuthMethod } from '../types/FMAxios';
import { AuthResponse, EmptyResponse } from '..';
import { logger } from '../logger';
import { getBaseURL } from '../helpers/utils/url.util';

const TIME_LIMIT = 1000 * 60 * 15;

export type AuthAPIOptions = {
  host: string;
  database: string;
  username: string;
  password: string;
};

export class AuthAPI {
  private accessToken: string | null;
  private accessTokenTimestamp: number;
  private host: string;
  private database: string;
  private username: string;
  private password: string;

  constructor(options: AuthAPIOptions) {
    this.host = options.host;
    this.database = options.database;
    this.username = options.username;
    this.password = options.password;

    this.accessToken = null;
    this.accessTokenTimestamp = 0;
  }

  /**
   * Login to the Filemaker Server Data API
   * @returns {Promise<string>} Promise resolved with the auth token
   * @param username
   * @param password
   */
  public async login(): Promise<string> {
    let accessToken;

    // TODO: Ensure that access token check is working properly
    accessToken = this.getExistingAccessToken();

    logger.debug('Auth API - Access token not found! Retrieving a new one...');

    // Continue with BASIC auth if no cached access token
    accessToken = await this.loginWithBasicAuth();

    this.accessToken = accessToken;

    return accessToken as string;
  }

  /**
   * Check if the stored access token is valid
   * @returns {boolean} True if the access token is valid
   */
  private isStoredAccessTokenValid(): boolean {
    const timeElapsedSinceTokenRefresh = Date.now() - this.accessTokenTimestamp;
    const isTimeLimitExceeded = timeElapsedSinceTokenRefresh > TIME_LIMIT;
    return !isTimeLimitExceeded && this.accessToken ? true : false;
  }

  /**
   * Get the existing access token if it is valid
   * @returns {string | null} The access token or null if it is invalid
   */
  private getExistingAccessToken(): string | null {
    const isAccessTokenValid = this.isStoredAccessTokenValid();
    if (isAccessTokenValid) {
      logger.debug(
        'Auth API - Stored access token is valid! Using cached access token.'
      );
      return this.accessToken;
    }
    return null;
  }

  /**
   * Login to the Filemaker Server Data API using basic auth
   * @param username The username
   * @param password The password
   * @returns {Promise<string>} Promise resolved with the auth token
   */
  private async loginWithBasicAuth(): Promise<string> {
    if (!this.username || !this.password) {
      throw new Error('Missing username or password!');
    }

    const encodedUserAndPassword = generateEncodedAuthString(
      this.username,
      this.password
    );

    const response = await fmAxios<AuthResponse>({
      baseURL: getBaseURL({
        host: this.host,
        database: this.database,
      }),
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

    this.accessTokenTimestamp = Date.now();

    return response.response.token;
  }

  /**
   * Set the access token timer to the current time
   */
  public async resetAccessTokenTimer() {
    this.accessTokenTimestamp = Date.now();
  }

  /**
   * Logout of the Filemaker Server Data API
   * @param authToken The auth token
   * @returns {Promise<EmptyResponse>} Promise resolved with the response
   */
  public async logout(authToken: string): Promise<EmptyResponse> {
    const response = await fmAxios<EmptyResponse>({
      baseURL: getBaseURL({
        host: this.host,
        database: this.database,
      }),
      url: `/sessions/${authToken}`,
      method: 'DELETE',
      auth: {
        method: FMAuthMethod.NONE,
      },
    });

    return response;
  }
}
