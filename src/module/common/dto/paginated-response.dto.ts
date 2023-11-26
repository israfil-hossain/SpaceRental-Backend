export class PaginatedResponseDto {
  readonly totalRecords: number;
  readonly currentPage: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
  readonly data: any[];

  constructor(
    totalRecords: number,
    currentPage: number,
    pageSize: number,
    data: any[] = [],
  ) {
    this.totalRecords = totalRecords;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(totalRecords / pageSize);
    this.hasPreviousPage = currentPage > 1;
    this.hasNextPage = currentPage < this.totalPages;
    this.data = data;
  }
}
