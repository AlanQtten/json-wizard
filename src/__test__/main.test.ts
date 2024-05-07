import { describe, expect, it } from 'vitest';
import { Json } from '../main';

describe('main test', () => {
  it('should work with json.set & get', () => {
    const json = new Json('./src/testJson/test.json').set(
      'name',
      'json-wizard2'
    );

    expect(json.get('name')).toBe('json-wizard2');
  });

  it('should work with json.delete', () => {
    const json = new Json('./src/testJson/test.json')
      .set('name', 'json-wizard2')
      .set('private', true);

    expect(json.get('private')).toBe(true);
    json.delete('private');

    expect(json.get('private')).toBe(undefined);
  });
});
