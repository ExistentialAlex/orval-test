import type { LocationQuery, RouteLocationNormalizedGeneric } from 'vue-router';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useQueryParams } from '@/composables';

vi.stubGlobal('open', vi.fn());
vi.mock('@/utils', () => {
  return {
    $fetch: vi.fn(),
  };
});

describe('useQueryParams', () => {
  let composable: ReturnType<typeof useQueryParams>;

  beforeEach(() => {
    setActivePinia(createTestingPinia());
    composable = useQueryParams();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('functions', () => {
    describe('getQueryParamValue', () => {
      it('should return the converted value if the query parameter exists', () => {
        const route = {
          query: { testKey: 'testValue' },
        } as unknown as RouteLocationNormalizedGeneric;
        const result = composable.getQueryParamValue(
          route,
          'testKey',
          (v) => (Array.isArray(v) ? v.map((s) => s.toUpperCase()) : v.toUpperCase()),
          'defaultValue',
        );
        expect(result).toBe('TESTVALUE');
      });

      it('should return the default value if the query parameter does not exist', () => {
        const route = { query: {} } as unknown as RouteLocationNormalizedGeneric;
        const result = composable.getQueryParamValue(
          route,
          'nonExistentKey',
          (v) => (Array.isArray(v) ? v.map((s) => s.toUpperCase()) : v.toUpperCase()),
          'defaultValue',
        );
        expect(result).toBe('defaultValue');
      });

      it('should handle array values', () => {
        const route = {
          query: { testKey: ['value1', 'value2'] },
        } as unknown as RouteLocationNormalizedGeneric;
        const result = composable.getQueryParamValue(
          route,
          'testKey',
          (v) => (Array.isArray(v) ? v.map((s) => s.toUpperCase()) : v.toUpperCase()),
          'defaultValue',
        );
        expect(result).toEqual(['VALUE1', 'VALUE2']);
      });
    });

    describe('normalizeQueryParams', () => {
      it('should return string values unchanged', () => {
        // Arrange
        const query: LocationQuery = {
          status: 'active',
          category: 'electronics',
        };

        // Act
        const result = composable.normalizeQueryParams(query);

        // Assert
        expect(result).toEqual({
          status: 'active',
          category: 'electronics',
        });
      });

      it('should preserve array values from string arrays', () => {
        // Arrange
        const query: LocationQuery = {
          tags: ['tag1', 'tag2', 'tag3'],
          categories: ['cat1', 'cat2'],
        };

        // Act
        const result = composable.normalizeQueryParams(query);

        // Assert
        expect(result).toEqual({
          tags: ['tag1', 'tag2', 'tag3'],
          categories: ['cat1', 'cat2'],
        });
      });

      it('should handle mixed single and array values', () => {
        // Arrange
        const query: LocationQuery = {
          filters: ['active', 'premium'],
          singleValue: 'test',
        };

        // Act
        const result = composable.normalizeQueryParams(query);

        // Assert
        expect(result).toEqual({
          filters: ['active', 'premium'],
          singleValue: 'test',
        });
      });

      it('should exclude null values', () => {
        // Arrange
        const query: LocationQuery = {
          status: 'active',
          category: null,
          type: 'product',
        };

        // Act
        const result = composable.normalizeQueryParams(query);

        // Assert
        expect(result).toEqual({
          status: 'active',
          type: 'product',
        });
      });

      it('should exclude undefined values', () => {
        // Arrange - Test with a missing property (which Vue Router represents as undefined)
        const query = {
          status: 'active',
          type: 'product',
        } as LocationQuery;

        // Act
        const result = composable.normalizeQueryParams(query);

        // Assert
        expect(result).toEqual({
          status: 'active',
          type: 'product',
        });
      });

      it('should filter out null values from arrays', () => {
        // Arrange
        const query: LocationQuery = {
          tags: [null, 'validTag', 'anotherTag'],
          categories: ['cat1', null, 'cat2'],
        };

        // Act
        const result = composable.normalizeQueryParams(query);

        // Assert
        expect(result).toEqual({
          tags: ['validTag', 'anotherTag'],
          categories: ['cat1', 'cat2'],
        });
      });

      it('should exclude arrays with all null values', () => {
        // Arrange
        const query: LocationQuery = {
          status: 'active',
          tags: [null, null],
          category: 'electronics',
        };

        // Act
        const result = composable.normalizeQueryParams(query);

        // Assert
        expect(result).toEqual({
          status: 'active',
          category: 'electronics',
        });
      });

      it('should handle empty string values', () => {
        // Arrange
        const query: LocationQuery = {
          search: '',
          filter: 'active',
        };

        // Act
        const result = composable.normalizeQueryParams(query);

        // Assert
        expect(result).toEqual({
          search: '',
          filter: 'active',
        });
      });

      it('should handle empty arrays', () => {
        // Arrange
        const query: LocationQuery = {
          status: 'active',
          tags: [],
          category: 'electronics',
        };

        // Act
        const result = composable.normalizeQueryParams(query);

        // Assert
        expect(result).toEqual({
          status: 'active',
          category: 'electronics',
        });
      });

      it('should handle mixed types correctly', () => {
        // Arrange
        const query: LocationQuery = {
          singleString: 'value1',
          arrayWithValues: ['first', 'second'],
          nullValue: null,
          emptyString: '',
          arrayWithNulls: [null, 'validValue'],
          allNullArray: [null, null],
          emptyArray: [],
        };

        // Act
        const result = composable.normalizeQueryParams(query);

        // Assert
        expect(result).toEqual({
          singleString: 'value1',
          arrayWithValues: ['first', 'second'],
          emptyString: '',
          arrayWithNulls: ['validValue'],
        });
      });

      it('should return empty object for empty query', () => {
        // Arrange
        const query: LocationQuery = {};

        // Act
        const result = composable.normalizeQueryParams(query);

        // Assert
        expect(result).toEqual({});
      });

      it('should return empty object when all values are null or undefined', () => {
        // Arrange
        const query: LocationQuery = {
          nullValue: null,
          allNullArray: [null, null],
        };

        // Act
        const result = composable.normalizeQueryParams(query);

        // Assert
        expect(result).toEqual({});
      });

      it('should handle realistic URL query scenarios', () => {
        // Arrange - Simulates: ?page=1&page_size=25&search=test&tags=vue&tags=typescript&status=&missing
        const query: LocationQuery = {
          page: '1',
          page_size: '25',
          search: 'test',
          tags: ['vue', 'typescript'],
          status: '',
          missing: null,
        };

        // Act
        const result = composable.normalizeQueryParams(query);

        // Assert
        expect(result).toEqual({
          page: '1',
          page_size: '25',
          search: 'test',
          tags: ['vue', 'typescript'],
          status: '',
        });
      });
    });
  });
});
