import { EntityResponse, FilemakerDataAPI, FindRequestData } from '..';
import { FilemakerTSError } from '../helpers/errors';
export class FindAPI {
  private fm: FilemakerDataAPI;

  constructor(fm: FilemakerDataAPI) {
    this.fm = fm;
  }

  public async find<Entity>(findRequest: FindRequestData<Entity>) {
    if (findRequest.query.length < 1) {
      throw new FilemakerTSError('Please define at least one query field');
    }

    return this.fm.post<EntityResponse<Entity>, FindRequestData<Entity>>(
      '/_find',
      findRequest
    );
  }
}
