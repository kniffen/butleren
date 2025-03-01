import { onError } from "./onError";

describe('Discord: onError', () => {
  test('It should console.error the error', () => {
    const err = new Error('Test error');
    onError(err);
    expect(console.error).toHaveBeenCalledWith(err);
  });
});