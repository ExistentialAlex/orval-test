import { describe, expect, it } from 'vitest';
import { addProperty, filterKeys, findItem, findTargetArray } from '@/object.util';

describe('object Utilities', () => {
  describe('functions', () => {
    describe('addProperty', () => {
      it('should add a new property to the input object if the condition is true', () => {
        // Arrange
        const input = {
          test: 1,
        };

        // Act
        const res = addProperty(input, 'added', 'some value', true);

        // Assert
        expect(res).toEqual({ test: 1, added: 'some value' });
      });

      it('should not add a new property to the input object if the condition is false', () => {
        // Arrange
        const input = {
          test: 1,
        };

        // Act
        const res = addProperty(input, 'added', 'some value', false);

        // Assert
        expect(res).toEqual({ test: 1 });
      });
    });

    describe('filterKeys', () => {
      it('should filter the keys from the input object', () => {
        // Arrange
        const structure = {
          key1: {},
          remove: 1,
        };

        // Act
        const res = filterKeys(structure, ['remove']);

        // Assert
        expect(res).toEqual({
          key1: {},
        });
      });

      it('should filter the specified keys from the input json structure', () => {
        // Arrange
        const structure = {
          key1: {
            remove: 1,
          },
          key2: [
            {
              test: 1,
              remove: 2,
            },
          ],
          remove: 1,
        };

        // Act
        const res = filterKeys(structure, ['remove']);

        // Assert
        expect(res).toEqual({
          key1: {},
          key2: [
            {
              test: 1,
            },
          ],
        });
      });
    });

    describe('findItem', () => {
      it('should find the given item in the nested array', () => {
        // Arrange
        const structure = [
          {
            id: '1',
            children: [
              {
                id: '2',
              },
              {
                id: '3',
                children: [
                  {
                    id: '4',
                  },
                ],
              },
            ],
          },
        ];

        // Act
        const res = findItem(structure, '3', 'id', 'children');

        // Assert
        expect(res?.item).toEqual({ id: '3', children: [{ id: '4' }] });
      });

      it('should return null if the item cannot be found', () => {
        // Arrange
        const structure = [
          {
            id: '1',
            children: [
              {
                id: '2',
              },
              {
                id: '3',
                children: [
                  {
                    id: '4',
                  },
                ],
              },
            ],
          },
          'test',
        ];

        // Act
        const res = findItem(structure, '5', 'id', 'children');

        // Assert
        expect(res).toBe(null);
      });
    });

    describe('findTargetArray', () => {
      it('should find the given item in the nested array', () => {
        // Arrange
        const structure = [
          {
            id: '1',
            children: [
              {
                id: '2',
              },
              {
                id: '3',
                children: [
                  {
                    id: '4',
                  },
                ],
              },
            ],
          },
        ];

        // Act
        const res = findTargetArray(structure, '3', 'id', 'children');

        // Assert
        expect(res).toEqual([{ id: '4' }]);
      });

      it('should return null if the item cannot be found', () => {
        // Arrange
        const structure = [
          {
            id: '1',
            children: [
              {
                id: '2',
              },
              {
                id: '3',
                children: [
                  {
                    id: '4',
                  },
                ],
              },
            ],
          },
          'test',
        ];

        // Act
        const res = findTargetArray(structure, '5', 'id', 'children');

        // Assert
        expect(res).toBe(null);
      });

      it('should return null if the child key accessed is not an array', () => {
        // Arrange
        const structure = [
          {
            id: '1',
            children: [
              {
                id: '2',
              },
              {
                id: '3',
                children: [
                  {
                    id: '4',
                    children: '',
                  },
                ],
              },
            ],
          },
        ];

        // Act
        const res = findTargetArray(structure, '4', 'id', 'children');

        // Assert
        expect(res).toBe(null);
      });
    });
  });
});
