import type { Result } from '../src';
import { describe, expect, it } from 'vitest';
import { consolidateDoublet } from '../src';

describe('doublet', () => {
  describe('functions', () => {
    describe('consolidateDoublet', () => {
      it('should consolidate all the errors and results', () => {
        // Arrange
        const doubletResults: Result<{ id: number }, Error>[] = [
          [null, { id: 1 }],
          [new Error('test error'), null],
          [null, { id: 2 }],
          [new Error('test error 2'), null],
          [null, { id: 3 }],
        ];

        // Act
        const [errors, results] = consolidateDoublet(doubletResults);

        // Assert
        expect(errors.length).toBe(2);
        expect(results.length).toBe(3);
      });
    });
  });
});
