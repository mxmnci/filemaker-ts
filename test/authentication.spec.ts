import { FileMakerDataAPI } from '../src';
import { testConfig } from './config.test';

describe('Authentication', () => {
  let client: FileMakerDataAPI;

  beforeEach(() => {
    client = new FileMakerDataAPI(testConfig);
  });
});
