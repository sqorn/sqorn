export interface Buildable {
  _build(ctx: any): string;
  query: { text: string, args: any[] };
  unparameterized: string;
}
