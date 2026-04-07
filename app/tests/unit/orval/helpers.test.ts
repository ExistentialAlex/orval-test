import { describe, expect, it } from 'vitest';
import { pascalCase } from '../../../orval/helpers';

describe('pascalCase', () => {
  it('capitalizes the first letter of a lowercase word', () => {
    expect(pascalCase('foo')).toBe('Foo');
  });

  it('leaves an already pascal-cased string unchanged', () => {
    expect(pascalCase('Foo')).toBe('Foo');
  });

  it('only changes the first character of a camelCase string', () => {
    expect(pascalCase('fooBar')).toBe('FooBar');
  });

  it('handles a single character', () => {
    expect(pascalCase('a')).toBe('A');
  });

  it('handles an empty string', () => {
    expect(pascalCase('')).toBe('');
  });
});
