import type { Context } from 'hono';
import { describe, expect, it } from 'vitest';
import { convertExternalPaginationResponse, paginate } from '@/utils';

describe('paginate Util', () => {
  it('should paginate an array of items', () => {
    const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
    const pageSize = 10;
    const page = 1;

    const paginatedItems = paginate(items, page, pageSize);

    expect(paginatedItems.results).toHaveLength(pageSize);
    expect(paginatedItems.results[0]).toBe('Item 1');
    expect(paginatedItems.results[9]).toBe('Item 10');
  });

  it('should return an empty array for out-of-bounds pages', () => {
    const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
    const pageSize = 10;
    const page = 11; // Out of bounds

    const paginatedItems = paginate(items, page, pageSize);

    expect(paginatedItems.results).toHaveLength(0);
  });

  describe('functions', () => {
    describe('convertExternalPaginationResponse', () => {
      it('should convert the external paginated response to a UI friendly version', () => {
        // Arrange
        const data = {
          results: [{ id: 1 }, { id: 2 }],
          page: 2,
          total_pages: 3,
          count: 5,
          page_size: 2,
          next: null,
          previous: null,
        };

        // Act
        const res = convertExternalPaginationResponse({ req: { url: '' } } as Context, data);

        // Assert
        expect(res.results).toEqual(data.results);
        expect(res.page).toBe(data.page);
        expect(res.count).toBe(data.count);
        expect(res.next).toBe(undefined);
        expect(res.previous).toBe(undefined);
      });

      it('should convert the next and previous URLs into the correct location', () => {
        // Arrange
        const data = {
          results: [{ id: 1 }, { id: 2 }],
          page: 2,
          total_pages: 3,
          count: 5,
          page_size: 2,
          next: 'http://localhost:8000/attribute?page=3&page_size=25',
          previous: 'http://localhost:8000/attribute?page=1&page_size=25',
        };

        // Act
        const res = convertExternalPaginationResponse(
          { req: { url: 'http://localhost:3000/attributes' } } as Context,
          data,
        );

        // Assert
        expect(res.results).toEqual(data.results);
        expect(res.page).toBe(data.page);
        expect(res.count).toBe(data.count);
        expect(res.next).toBe('http://localhost:3000/attributes?page=3&page_size=25');
        expect(res.previous).toBe('http://localhost:3000/attributes?page=1&page_size=25');
      });
    });
  });
});
