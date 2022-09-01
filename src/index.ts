type FilemakerDataApiOptions = {};

export class FileMakerDataApi {
  private http: Http;

  constructor(options?: FilemakerDataApiOptions) {
    this.http = new Http(options?.accessToken ?? '');
  }
}
