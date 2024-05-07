import { describe, expect, it } from 'vitest';
import { Json } from '../main';

describe('main test', () => {
  it('should work', () => {
    const json = new Json('./src/testJson/test.json');

    json.set('name', 'json-wizard2');
    expect(json.get('name')).toBe('json-wizard2');
    json.write();
  });
});
