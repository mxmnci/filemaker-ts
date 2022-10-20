import { generateEncodedAuthString } from '../helpers/encode';
import { FMRequestBody } from '../types/FMRequestBody';
import { fmAxios } from '../helpers/fmAxios';
import { FMAuthMethod } from '../types/FMAxios';
import { FilemakerDataAPI } from '..';

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
  async login(username: string, password: string): Promise<string> {
    if (!username || !password) {
      throw new Error('Invalid login credentials');
    }

    const encodedUserAndPassword = generateEncodedAuthString(
      username,
      password
    );

    // * Overwrite the authorization header during login to use basic auth
    const { messages, response } = await fmAxios<FMRequestBody>({
      baseURL: this.fm.getBaseURL(),
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
}
