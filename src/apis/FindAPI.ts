import { EntityResponse, FindRequestParams } from '..';
import { FileMakerRequestHandler } from '../requestHandler';
import { FilemakerTSException } from '../types/exceptions';
export class FindAPI<Entity> {
  private fm: FileMakerRequestHandler<Entity>;

  constructor(fm: FileMakerRequestHandler<Entity>) {
    this.fm = fm;
  }

  public async find(
    findRequest: FindRequestParams<Entity>
  ): Promise<EntityResponse<Entity>> {
    if (findRequest.query.length < 1) {
      throw new FilemakerTSException('Please define at least one query field');
    }

    const response = await this.fm.post<
      EntityResponse<Entity>,
      FindRequestParams<Entity>
    >('/_find', findRequest);

    return response;
  }
}
