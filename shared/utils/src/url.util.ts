/**
 * Appends the query string and hash fragment from `sourceUrl` to `baseUrl` (including its path).
 *
 * @param baseUrl - The base URL, including its path (e.g., 'https://example.com/foo/bar')
 * @param sourceUrl - The URL whose query and hash will be appended (e.g., '?a=1#section')
 * @returns The base URL with the query and hash from sourceUrl appended
 */
export function appendQueryAndHash(baseUrl: string, sourceUrl: string): string {
  try {
    // Parse the base URL (may only be a path so add dummy protocol)
    const base = new URL(baseUrl, 'resolve://');

    // Parse the source URL
    const source = new URL(sourceUrl);

    // Copy search and hash from source
    base.search = source.search;
    base.hash = source.hash;

    // Remove dummy protocol if used
    if (base.protocol === 'resolve:') {
      return base.href.replace(/^resolve:\/\//, '');
    }

    return base.href;
  }
  catch {
    // Fallback: just return baseUrl if parsing fails
    return baseUrl;
  }
}
