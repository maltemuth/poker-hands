/**
 * Create standardized API response
 */
export function createApiResponse<T>(dataOrError: T | string): T | string {
  return dataOrError;
}
