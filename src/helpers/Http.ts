import { AuthAPI } from '../apis/AuthAPI';
import { fmAxios, FMAxiosConfig } from './fmAxios';

export class Http {
  private host: string;
  private database: string;
  private authToken: string | null;
  private authTimeout: NodeJS.Timeout | null;
  private authAPI: AuthAPI;
  private user: string;
  private password: string;

  public constructor(options: {
    host: string;
    database: string;
    user: string;
    password: string;
  }) {
    const { host, database, user, password } = options;
    this.host = host;
    this.database = database;
    this.user = user;
    this.password = password;
    this.authAPI = new AuthAPI(this);
    this.authToken = null;
    this.authTimeout = null;
  }

  public async get<T>(url: string, config?: FMAxiosConfig) {
    return fmAxios<T>(
      this.getBaseURL(),
      url,
      'GET',
      await this.getAuthToken(),
      config
    );
  }

  public async post<T>(url: string, config?: FMAxiosConfig) {
    return fmAxios<T>(
      this.getBaseURL(),
      url,
      'POST',
      await this.getAuthToken(),
      config
    );
  }

  public async put<T>(url: string, config?: FMAxiosConfig) {
    return fmAxios<T>(
      this.getBaseURL(),
      url,
      'PUT',
      await this.getAuthToken(),
      config
    );
  }

  public async delete<T>(url: string, config?: FMAxiosConfig) {
    return fmAxios<T>(
      this.getBaseURL(),
      url,
      'DELETE',
      await this.getAuthToken(),
      config
    );
  }

  public getHost() {
    return this.host;
  }

  public setHost(host: string) {
    this.host = host;
  }

  public getDatabase() {
    return this.database;
  }

  public setDatabase(database: string) {
    this.database = database;
  }

  public async getAuthToken() {
    let isNewToken = false;

    // Get a new authtoken from the Filemaker Data API if we don't already have one
    if (!this.authToken) {
      console.log('Getting a new auth token...');
      this.authToken = await this.authAPI.login(this.user, this.password);
      isNewToken = true;
    }

    // Refresh the timeout if a request is made before the token expires
    if (this.authTimeout && !isNewToken) {
      console.log('Refreshing auth token...');
      this.authTimeout.refresh();
    }

    // If a timeout hasn't been created then create one
    if (!this.authTimeout) {
      this.authTimeout = setTimeout(() => {
        this.authToken = null;
      }, 1000 * 60 * 15);
    }

    console.log(`Successfully logged in!\nToken: ${this.authToken}`);
    return this.authToken;
  }

  private getBaseURL() {
    return `${this.host}/fmi/data/v1/databases/${this.database}`;
  }
}
