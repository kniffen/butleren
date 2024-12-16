import { describe, test } from 'node:test';
import assert from 'node:assert';
import { parseSeconds } from "./parseSeconds.ts";

describe('parseSeconds', () => {
  test('it should return the correct time string', () => {
    assert.strictEqual(parseSeconds(0),            '00:00:00');
    assert.strictEqual(parseSeconds(1),            '00:00:01');
    assert.strictEqual(parseSeconds(60),           '00:01:00');
    assert.strictEqual(parseSeconds(3600),         '01:00:00');
    assert.strictEqual(parseSeconds(86400), '1 days 00:00:00');
    assert.strictEqual(parseSeconds(90061), '1 days 01:01:01');
  });
});