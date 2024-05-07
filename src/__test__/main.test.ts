import { describe, expect, it } from 'vitest';
import { Json } from '../main';

describe('main test', () => {
  it('should work', () => {
    const json = new Json('./src/testJson/test.json');

    // expect(json.get('name')).toBe('json-wizard');
    // expect(json.get('scripts.dev')).toBe('vite');
    // expect(json.get('supportEngine')).toStrictEqual([1, 2, 3]);

    json.set('name', 'json-wizard2');
    expect(json.get('name')).toBe('json-wizard2');
    json.write();
  });
});
