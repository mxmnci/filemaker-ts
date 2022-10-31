import { EntityResponse, FilemakerDataAPI, FindRequestData } from '..';
export class FindAPI {
  private fm: FilemakerDataAPI;

  constructor(fm: FilemakerDataAPI) {
    this.fm = fm;
  }

  public async find<Entity>(findRequest: FindRequestData<Entity>) {
    return this.fm.post<EntityResponse<Entity>, FindRequestData<Entity>>(
      '/_find',
      findRequest
    );
  }
}
