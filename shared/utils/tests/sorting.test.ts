import type { ColumnSort } from '<project-name>-types';
import { describe, expect, it } from 'vitest';
import { convertQuerySortToColumnSort, convertSortToQuerySort } from '../src/sorting.util';

describe('sorting Util', () => {
  describe('convertSortToQuerySort', () => {
    it('returns empty string for empty array', () => {
      // Arrange
      const sort: ColumnSort[] = [];
      // Act
      const result = convertSortToQuerySort(sort);
      // Assert
      expect(result).toEqual([]);
    });

    it('returns correct string for ascending sort', () => {
      // Arrange
      const sort: ColumnSort[] = [{ id: 'name', desc: false }];
      // Act
      const result = convertSortToQuerySort(sort);
      // Assert
      expect(result).toEqual(['name']);
    });

    it('returns correct string for descending sort', () => {
      // Arrange
      const sort: ColumnSort[] = [{ id: 'age', desc: true }];
      // Act
      const result = convertSortToQuerySort(sort);
      // Assert
      expect(result).toEqual(['-age']);
    });

    it('returns correct string for multiple sorts', () => {
      // Arrange
      const sort: ColumnSort[] = [
        { id: 'name', desc: false },
        { id: 'age', desc: true },
        { id: 'height', desc: false },
      ];
      // Act
      const result = convertSortToQuerySort(sort);
      // Assert
      expect(result).toEqual(['name', '-age', 'height']);
    });
  });

  describe('convertQuerySortToColumnSort', () => {
    it('returns empty array for empty string', () => {
      // Arrange
      const queryString = '';
      // Act
      const result = convertQuerySortToColumnSort(queryString);
      // Assert
      expect(result).toEqual([]);
    });

    it('parses ascending sort', () => {
      // Arrange
      const queryString = 'name';
      // Act
      const result = convertQuerySortToColumnSort(queryString);
      // Assert
      expect(result).toEqual([{ id: 'name', desc: false }]);
    });

    it('parses descending sort', () => {
      // Arrange
      const queryString = '-age';
      // Act
      const result = convertQuerySortToColumnSort(queryString);
      // Assert
      expect(result).toEqual([{ id: 'age', desc: true }]);
    });

    it('parses multiple sorts', () => {
      // Arrange
      const queryString = ['name', '-age', 'height'];
      // Act
      const result = convertQuerySortToColumnSort(queryString);
      // Assert
      expect(result).toEqual([
        { id: 'name', desc: false },
        { id: 'age', desc: true },
        { id: 'height', desc: false },
      ]);
    });
  });
});
