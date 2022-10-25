import { FilemakerDataAPI } from '..';
import { FindRequestData } from '../types/request/FindRequestData';
import { EntityResponse } from '../types/response/EntityResponse';

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
