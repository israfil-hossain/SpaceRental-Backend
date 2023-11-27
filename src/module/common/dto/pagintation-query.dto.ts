export class PaginationQuery {
  readonly Page?: number;
  readonly PageSize?: number;

  private constructor(query: Partial<PaginationQuery> = {}) {
    this.Page = PaginationQuery.parseNumber(query.Page, 1);
    this.PageSize = PaginationQuery.parseNumber(query.PageSize, 10);
  }

  private static parseNumber(value: any, defaultValue: number): number {
    if (value === undefined || value === null || isNaN(Number(value))) {
      return defaultValue;
    }
    return Number(value);
  }

  public static from(query: Partial<PaginationQuery>): PaginationQuery {
    return new PaginationQuery(query);
  }
}
