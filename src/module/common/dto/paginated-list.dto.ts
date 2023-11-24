export class PaginatedListDto<TEntity> {
  readonly totalRecords: number;
  readonly currentPage: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
  readonly items: TEntity[];

  constructor(
    totalRecords: number,
    currentPage: number,
    pageSize: number,
    items: TEntity[] = [],
  ) {
    this.totalRecords = totalRecords;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(totalRecords / pageSize);
    this.hasPreviousPage = currentPage > 1;
    this.hasNextPage = currentPage < this.totalPages;
    this.items = items;
  }
}
