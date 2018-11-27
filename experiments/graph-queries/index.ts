import { sqorn } from "../../packages/sqorn-pg/types/sqorn";

type Genre = 'Histroy' | 'Sci-Fi' | 'Fiction'

interface Query {
  <T>(through: Relationship<T>): Query
  from()
  where(arg: { [key: string]: any }): this
  return(...args: any)
}

interface Column<T> {
  name: string
  type: T
}

interface Relationship<T> extends Query {
  name: string
  type: T
}

interface Book extends Query {
  title: Column<string>
  genre: Column<Genre>
  publisher: Relationship<Publisher>
  authors: Relationship<Author>
}

interface Author extends Query {
  firstName: Column<string>
  lastName: Column<string>
  books: Book[]
}

interface Publisher extends Query {
  city: Column<string>
  authors: Relationship<Author>
}

declare let sq: Query;
declare let book: Book;

const b = book
// declare funcution query()

let an: any;

an.asdf.jiji.asdfasdf.asdfk


sq(b)
  .return(
    b.title,
    b.genre,
    sq(b.authors)
      .return(

      )
  ).where({ id: 27 })