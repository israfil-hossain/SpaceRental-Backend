import { ApiProperty } from "@nestjs/swagger";

export class PaginatedResponseDto {
  @ApiProperty({ description: "Total number of records", example: 100 })
  readonly totalRecords: number;

  @ApiProperty({ description: "Current page number", example: 1 })
  readonly currentPage: number;

  @ApiProperty({ description: "Number of items per page", example: 10 })
  readonly pageSize: number;

  @ApiProperty({ description: "Total number of pages", example: 10 })
  readonly totalPages: number;

  @ApiProperty({
    description: "Boolean indicating if there is a previous page",
    example: true,
  })
  readonly hasPreviousPage: boolean;

  @ApiProperty({
    description: "Boolean indicating if there is a next page",
    example: true,
  })
  readonly hasNextPage: boolean;

  @ApiProperty({ description: "Array of data for the current page" })
  readonly data: object[];

  constructor(
    totalRecords: number,
    currentPage: number,
    pageSize: number,
    data: object[] = [],
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
