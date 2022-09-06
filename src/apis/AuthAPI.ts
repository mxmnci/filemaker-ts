import { encodeToBase64 } from '../helpers/encodeToBase64';
import { Http } from '../helpers/Http';
import { FMRequestBody } from '../types/FMRequestBody';

export type FMAuth = {
  user: string;
  password: string;
  host: string;
  database: string;
  layout: string;
};

export class AuthAPI {
  private http: Http;
  private authToken: string | null;

  constructor(http: Http) {
    this.http = http;
    this.authToken = null;
  }

  getAuthToken() {
    return this.authToken;
  }

  /**
   * Login to the Filemaker Server Data API
   * @param auth
   * @returns {Promise<string>} Promise resolved with the auth token
   */
  async login(auth: FMAuth): Promise<string | null> {
    const { user, password, host, database } = auth;
    const url = `${host}/fmi/data/v1/databases/${database}/sessions`;

    const encodedUserAndPassword = encodeToBase64(`${user}:${password}`);

    try {
      const { messages, response } = await this.http.post<FMRequestBody>(url, {
        baseURL: url,
        headers: {
          Authorization: `Basic ${encodedUserAndPassword}`,
        },
      });

      if (!messages || messages[0].code !== '0') {
        throw new Error('Unable to authenticate');
      }

      const token = response.token as string;
      this.authToken = token;
      return token;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
