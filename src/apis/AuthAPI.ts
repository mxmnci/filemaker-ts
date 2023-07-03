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
   * Get the access token
   * @returns {string | null} The access token or null if it isn't set
   */
  public getAccessToken() {
    return this.accessToken;
  }

  /**
   * Get the access token timestamp
   * @returns {number} The access token timestamp or 0 if it isn't set
   */
  public getAccessTokenTimestamp() {
    return this.accessTokenTimestamp;
  }

  /**
   * Login to the Filemaker Server Data API
   * @returns {Promise<string>} Promise resolved with the auth token
   * @param username
   * @param password
   */
  public async login(): Promise<string> {
    let accessToken;
    accessToken = this.getExistingAccessToken();
    if (!accessToken) {
      logger.debug(
        'Auth API - Access token not found! Retrieving a new one...'
      );
      accessToken = await this.loginWithBasicAuth();
      this.accessToken = accessToken;
    } else {
      logger.debug(
        'Auth API - Stored access token is valid! Using cached access token.'
      );
      // Update the timestamp each time the the access token is used
      this.accessTokenTimestamp = Date.now();
    }

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
   * Clear the access token and reset the timestamp
   */
  private clearAccessToken() {
    this.accessToken = null;
    this.accessTokenTimestamp = 0;
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

    this.clearAccessToken();

    return response;
  }
}
