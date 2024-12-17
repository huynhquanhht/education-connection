
export class PaginationResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto

  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
export class PaginationMetaDto {
  page: number;

  size: number;

  itemCount: number;

  pageCount: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;

  constructor(page: number, size: number, itemCount: number) {
    this.page = page;
    this.size = size;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.size);
    this.hasPreviousPage = page > 1;
    this.hasNextPage = this.page < this.pageCount;;
  }
}