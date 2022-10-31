import QueryString from 'qs';
import { EntityResponse, FilemakerDataAPI, GetRecordRangeParams } from '..';

export class RecordAPI {
  private fm: FilemakerDataAPI;

  constructor(fm: FilemakerDataAPI) {
    this.fm = fm;
  }

  public async getRecord<T>(recordNumber: number) {
    return this.fm.get<EntityResponse<T>>(`/records/${recordNumber}`);
  }

  public async getRecordRange<T>(params: GetRecordRangeParams) {
    const queryString = QueryString.stringify({
      _offset: params.offset || undefined,
      _limit: params.limit || undefined,
    });

    return this.fm.get<EntityResponse<T>>(`/records?${queryString}`);
  }
}
