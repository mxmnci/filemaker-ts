import { generateEncodedAuthString } from '../helpers/encode';
import { fmAxios } from '../helpers/fmAxios';
import { FMAuthMethod } from '../types/response/FMAxios';
import { FilemakerDataAPI } from '..';
import { AuthResponse } from '../types/response/AuthResponse';
import { EmptyResponse } from '../types/response/EmptyResponse';

export class AuthAPI {
  private fm;

  constructor(fm: FilemakerDataAPI) {
    this.fm = fm;
  }

  /**
   * Login to the Filemaker Server Data API
   * @returns {Promise<string>} Promise resolved with the auth token
   * @param username
   * @param password
   */
  public async login(username: string, password: string): Promise<string> {
    if (!username || !password) {
      throw new Error('Invalid login credentials');
    }

    const encodedUserAndPassword = generateEncodedAuthString(
      username,
      password
    );

    // * Switch to BASIC authorization method during login
    const { messages, response } = await fmAxios<AuthResponse>({
      baseURL: this.fm.getBaseURL({ withoutLayout: true }),
      url: `/sessions`,
      method: 'POST',
      auth: {
        method: FMAuthMethod.BASIC,
        token: encodedUserAndPassword,
      },
    });

    if (!messages || messages[0].code !== '0') {
      throw new Error('Unable to authenticate');
    }

    return response.token as string;
  }

  public async logout() {
    const response = await fmAxios<EmptyResponse>({
      baseURL: this.fm.getBaseURL({ withoutLayout: true }),
      url: `/sessions/${await this.fm.getAuthToken()}`,
      method: 'DELETE',
      auth: {
        method: FMAuthMethod.NONE,
      },
    });

    return response;
  }
}
