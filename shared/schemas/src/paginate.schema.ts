import * as z from 'zod';

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  page_size: z.coerce.number().int().min(5).max(100).optional(),
  search: z.string().optional(),
  sort: z.union([z.string(), z.array(z.string())]).optional(),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const PaginationResponseSchema = <T>(itemSchema: z.ZodType<T>) => {
  return z.object({
    results: z.array(itemSchema),
    count: z.number(),
    page: z.number(),
    next: z.url().optional(),
    previous: z.url().optional(),
  });
};
export type PaginationResponse<T> = z.infer<ReturnType<typeof PaginationResponseSchema<T>>>;

export const ExternalPaginationQuerySchema = z.object({
  page: z.int().min(1).optional(),
  page_size: z.int().min(5).max(100).optional(),
  search: z.string().optional(),
  sort: z.union([z.string(), z.array(z.string())]).optional(),
});
export type ExternalPaginationQuery = z.infer<typeof ExternalPaginationQuerySchema>;

export const ExternalPaginationResponseSchema = <T>(itemSchema: z.ZodType<T>) => {
  return z.object({
    results: z.array(itemSchema),
    count: z.int(),
    page: z.int(),
    page_size: z.int(),
    total_pages: z.int(),
    next: z.url().nullable(),
    previous: z.url().nullable(),
  });
};
export type ExternalPaginationResponse<T> = z.infer<
  ReturnType<typeof ExternalPaginationResponseSchema<T>>
>;
