import { CreateRecordResponse, EntityResponse, GetRecordRangeParams } from '..';
import {
  CreateRecordRequest,
  DeleteRecordResponse,
  EmptyResponse,
  UpdateRecordRequest,
  UpdateRecordResponse,
} from '../types';
import { FileMakerRequestHandler } from '../requestHandler';
import { encodeObjectAsQueryString } from '../helpers/utils/encode.util';

export class RecordAPI<Entity> {
  private fm: FileMakerRequestHandler<Entity>;

  constructor(fm: FileMakerRequestHandler<Entity>) {
    this.fm = fm;
  }

  /**
   * This method gets a record from the current layout
   * @param recordId The ID of the record to retrieve on the current layout
   * @returns EntityResponse
   */
  public async getRecord(recordId: string): Promise<EntityResponse<Entity>> {
    return this.fm.get<EntityResponse<Entity>>(`/records/${recordId}`);
  }

  /**
   * This method gets a range of records from the current layout
   * @param params Specify the offset and limit of the range
   * @returns EntityResponse
   */
  public async getRecordRange(
    params: GetRecordRangeParams
  ): Promise<EntityResponse<Entity>> {
    const queryString = encodeObjectAsQueryString({
      _offset: params.offset !== undefined ? params.offset.toString() : '1',
      _limit: params.limit !== undefined ? params.limit.toString() : '',
    });

    return this.fm.get<EntityResponse<Entity>>(`/records?${queryString}`);
  }

  /**
   * This method creates a record in the current layout
   * @param record The entity to create on the current layout
   * @returns CreateRecordResponse
   */
  public async createRecord(fieldData: Entity): Promise<CreateRecordResponse> {
    return this.fm.post<CreateRecordResponse, CreateRecordRequest<Entity>>(
      `/records`,
      { fieldData }
    );
  }

  /**
   * This method updates the record with the provided record ID in
   * the current layout
   * @param recordId The ID of the record to be updated
   * @param fieldData The fields to update
   * @returns UpdateRecordResponse
   */
  public async updateRecord(
    recordId: string,
    fieldData: Partial<Entity>
  ): Promise<UpdateRecordResponse> {
    return this.fm.patch<UpdateRecordResponse, UpdateRecordRequest<Entity>>(
      `/records/${recordId}`,
      { fieldData }
    );
  }

  /**
   * This method deletes the record with the provided record ID in
   * the current layout
   * @param recordId The ID of the record to be deleted
   * @returns EmptyResponse
   */
  public async deleteRecord(recordId: string): Promise<DeleteRecordResponse> {
    return this.fm.delete<EmptyResponse>(`/records/${recordId}`);
  }
}
