import {DisplayableBook} from './displayableBook.model';
import {Book} from './book.model';

export interface Books {
  title: string;
  author: string;
  numberOfBooks: number;
  coverImage: string;
  listOfBooks: DisplayableBook[];
}
