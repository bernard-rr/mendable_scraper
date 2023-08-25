import axios from 'axios';
import * as yaml from 'js-yaml';
import { fetchWithRetry, scrapeOpenApiYaml } from './yaml';

// Mock axios and type it as a jest-mocked module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// URLs for testing
const VALID_URL = 'https://petstore.swagger.io/v2/swagger.yaml';
const FAIL_ALWAYS_URL = 'http://test-url.com/fail-always';
const VALID_YAML_URL = 'https://petstore.swagger.io/v2/swagger.yaml';
const ERROR_404_URL = 'http://test-url.com/error-404';

describe('fetchWithRetry', () => {

  it('should fetch data successfully', async () => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: 'data' });
    const result = await fetchWithRetry(VALID_URL);
    expect(result).toEqual('data');
  });

  it('should fail after maximum retries', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));
    await expect(fetchWithRetry(FAIL_ALWAYS_URL)).rejects.toThrow('Network error');
  });

});

describe('scrapeOpenApiYaml', () => {

  it('should parse valid YAML and convert it into sections', async () => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: 'key1: value1\nkey2: value2' });
    const result = await scrapeOpenApiYaml(VALID_YAML_URL);
    expect(result).toEqual([
      { content: 'key1: value1\n', source: VALID_YAML_URL },
      { content: 'key2: value2\n', source: VALID_YAML_URL }
    ]);
  });

  it('should return an empty array for a 404 or other error', async () => {
    mockedAxios.get.mockResolvedValue({ status: 404, data: 'Not Found' });
    const result = await scrapeOpenApiYaml(ERROR_404_URL);
    expect(result).toEqual([]);
  });

});
