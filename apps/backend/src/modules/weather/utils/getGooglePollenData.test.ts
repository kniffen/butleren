import fetch, { Response } from 'node-fetch';
import { getGooglePollenData } from './getGooglePollenData';

describe('getGooglePollenData()', () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should fetch pollen data from Google', async () => {
    fetchMock.mockResolvedValue({
      ok:   true,
      json: async () => ['foo', 'bar']
    } as unknown as Response);


    const data = await getGooglePollenData(35, 139);

    expect(fetchMock).toHaveBeenCalledWith('https://pollen.googleapis.com/v1/forecast:lookup?key=GOOGLE_API_KEY&location.latitude=35&location.longitude=139&days=1');
    expect(data).toEqual(['foo', 'bar']);
  });

  test('It should throw an error if the fetch request fails', async () => {
    fetchMock.mockResolvedValue({
      ok:         false,
      status:     500,
      statusText: 'Internal Server Error',
      text:       async () => 'Error message'
    } as unknown as Response);

    await expect(getGooglePollenData(35, 139)).rejects.toThrow('Unable to fetch pollen data: 500 Internal Server Error');
  });
});