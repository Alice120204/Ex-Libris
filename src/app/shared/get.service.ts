import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class GetService {

  index;
  constructor(private db: AngularFireDatabase) {}

  setSelectedGrade(index) {
    this.index = index;
    this.db.database.ref('Temporary').set(this.index);
  }
  setSelectedIndex(index) {
    this.index = index;
    this.db.database.ref('Temporary Index').set(this.index);
  }

}
