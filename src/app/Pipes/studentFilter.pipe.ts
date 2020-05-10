import {Pipe, PipeTransform} from '@angular/core';
import {Students} from '../shared/students.model';
import {AngularFireDatabase} from '@angular/fire/database';

@Pipe({
  name: 'studentFilter'
})
export class StudentFilterPipe implements PipeTransform {
  constructor(private db: AngularFireDatabase) {}
  transform(searchText: string, index: number) {
    const idx = (index + 1).toString()
    if (!searchText) {
      return this.db.database.ref('Students/10-1/Students>');
    }
    return this.db.database.ref('Students/10-1/Students>/' + idx + '/Full Name').equalTo(searchText);
  }
}
