import {Books} from './books.model';


export interface Package {
  name: string;
  books: Books[];
}
