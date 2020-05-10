import {Pipe, PipeTransform} from '@angular/core';
import {DisplayableBook} from '../shared/displayableBook.model';


@Pipe({
  name: 'bookIDFilter'
})

export class BookIDFilterPipe implements PipeTransform {

  transform(expandedBookList: DisplayableBook[], searchText: string, index: number) {
    if (!expandedBookList || !searchText) {
      return expandedBookList;
    }

    return expandedBookList.filter(book =>
      book.id.indexOf(searchText) !== -1);
  }
}

