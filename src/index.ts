import { generateEncodedAuthString } from './helpers/encode';
import { fmAxios } from './helpers/fmAxios';
import { FMAuthMethod, FMAxiosConfig } from './types/FMAxios';
import { AuthAPI } from './apis/AuthAPI';
import { FMRequestBody } from './types/FMRequestBody';

import * as dotenv from "dotenv"
dotenv.config();

type FilemakerDataAPIOptions = {
  host: string;
  database: string;
  layout: string;
  username: string;
  password: string;
};

export class FilemakerDataAPI {
  private host: string;
  private database: string;
  private layout: string;
  private username: string;
  private password: string;
  private baseURL: string;

  private authToken: string;
  private tokenExpired: boolean;

  public auth: AuthAPI;
  // public records: RecordAPI;

  private authTimeout: NodeJS.Timeout;

  constructor(options: FilemakerDataAPIOptions) {
    this.host = options.host;
    this.database = options.database;
    this.layout = options.layout;
    this.username = options.username;
    this.password = options.password;
    this.baseURL = `${this.host}/fmi/data/v1/databases/${this.database}`;

    this.authToken = generateEncodedAuthString(this.username, this.password);
    this.authTimeout = this.createAuthTimeout();
    this.tokenExpired = true;

    this.auth = new AuthAPI(this);
    // this.records = new RecordAPI(this);
  }

  public getHost() {
    return this.host;
  }

  public getDatabase() {
    return this.database;
  }

  public getLayout() {
    return this.layout;
  }

  public getBaseURL() {
    return this.baseURL;
  }

  public setHost(host: string) {
    this.host = host;
  }

  public setDatabase(database: string) {
    this.database = database;
  }

  public setLayout(layout: string) {
    this.layout = layout;
  }

  public setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  public setAuthToken(authToken: string) {
    this.authToken = authToken;
  }

  public async get<T>(url: string, config?: FMAxiosConfig) {
    return fmAxios<T>({
      baseURL: this.baseURL,
      url,
      method: 'GET',
      auth: {
        method: FMAuthMethod.BEARER,
        token: await this.getAuthToken(),
      },
      config,
    });
  }

  public async post<T>(url: string, config?: FMAxiosConfig) {
    return fmAxios<T>({
      baseURL: this.baseURL,
      url,
      method: 'POST',
      auth: {
        method: FMAuthMethod.BEARER,
        token: await this.getAuthToken(),
      },
      config,
    });
  }

  public async put<T>(url: string, config?: FMAxiosConfig) {
    return fmAxios<T>({
      baseURL: this.baseURL,
      url,
      method: 'PUT',
      auth: {
        method: FMAuthMethod.BEARER,
        token: await this.getAuthToken(),
      },
      config,
    });
  }

  public async delete<T>(url: string, config?: FMAxiosConfig) {
    return fmAxios<T>({
      baseURL: this.baseURL,
      url,
      method: 'DELETE',
      auth: {
        method: FMAuthMethod.BEARER,
        token: await this.getAuthToken(),
      },
      config,
    });
  }

  /**
   * Refresh the filemaker auth token if it has exceeded the 15 minute timeout
   * Otherwise, refresh the timeout of the existing token
   * @returns The auth token
   */
  public async getAuthToken() {
    if (this.tokenExpired) {
      console.log('Getting a new auth token...');
      this.authToken = await this.auth.login(this.username, this.password);
      console.log(`Successfully logged in!\nToken: ${this.authToken}`);
      this.tokenExpired = false;
    } else {
      console.log('Refreshing auth token...');
      this.authTimeout.refresh();
      console.log(`Token refreshed!\nToken: ${this.authToken}`);
    }


    return this.authToken;
  }

  private createAuthTimeout() {
    return setTimeout(() => {
      this.tokenExpired = true
    }, 1000 * 60 * 15);
  }
}

const host = process.env.HOST
const database = process.env.DATABASE
const username = process.env.USERNAME
const password = process.env.PASSWORD
const layout = process.env.LAYOUT

if (!host || !database || !username || !password || !layout) {
  throw new Error("Env vars not defined")
}

export const test = async () => {
  const http = new FilemakerDataAPI({
    host,
    database,
    username,
    password,
    layout
  });

  try {
    const response = await http.get<FMRequestBody>('/layouts/Files_DAPI/records/6068');
    console.log(response.response.data);
  } catch (err: any) {
    console.error(err.response.data)
  }
};

test();
