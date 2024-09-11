export interface FormatResponse<T> {
  info:
    | {
        total: number;
        currentPage: number;
        nextPage: number | null;
        prevPage: number | null;
        lastPage: number;
      }
    | {};
  data: T[] | T | null;
}
