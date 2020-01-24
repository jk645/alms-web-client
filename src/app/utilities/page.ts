export class Page<T> {
  total: number;
  limit: number;
  skip: number;
  data: T[];
}
