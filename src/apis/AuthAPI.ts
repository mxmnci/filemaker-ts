import { encodeToBase64 } from '../helpers/encodeToBase64';
import { Http } from '../helpers/Http';
import { FMRequestBody } from '../types/FMRequestBody';

export class AuthAPI {
  private http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  /**
   * Login to the Filemaker Server Data API
   * @param auth
   * @returns {Promise<string>} Promise resolved with the auth token
   */
  async login(user: string, password: string): Promise<string> {
    if (!user || !password) {
      throw new Error('Invalid login credentials');
    }

    const encodedUserAndPassword = encodeToBase64(`${user}:${password}`);

    // * Overwrite the authorization header during login to use basic auth
    const { messages, response } = await this.http.post<FMRequestBody>(
      '/sessions',
      {
        headers: {
          Authorization: `Basic ${encodedUserAndPassword}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response);

    if (!messages || messages[0].code !== '0') {
      throw new Error('Unable to authenticate');
    }

    const token = response.token as string;

    return token;
  }
}
