import {Students} from './students.model';
import {Observable} from 'rxjs';
import {QlEditComponentComponent} from '../ql-edit-component/ql-edit-component.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {QlAddToPackageComponent} from '../ql-add-to-package/ql-add-to-package.component';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';


export class IndividualService {
   sumOfReturned = 0;
   sumOfTaken = 0;
   totalBooks: number;
   packageName: string;
   selectedIndex: string;
   dataSource: any[] = [];
   index: number;
   numberOfStudents: number;
   grade: string;

   constructor(public dialog: MatDialog, private db: AngularFireDatabase) {
     this.db.database.ref('Temporary').once('value').then(selectedIndex => {
       this.selectedIndex = selectedIndex.val();
       this.grade = selectedIndex.val().substr(0, selectedIndex.val().indexOf('-'));
       let i = 0;

       this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex +  '/Package>').on('value', qlPackage => {
         this.packageName = qlPackage.val();
         this.db.database.ref('Books/' + this.packageName + '/Number of Books per Student').on('value', quantity => {
           this.totalBooks = quantity.val();
           this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex +  '/Students>').on('value', snapshot => {
               this.numberOfStudents = snapshot.numChildren();
               for (this.index = 1; this.index <= this.numberOfStudents; this.index++) {
                 this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex +  '/Students>/' + this.index).once('value', snap => {
                   if (snap.val() !== null) {
                     this.db.list<Students>('/Students/' + this.selectedIndex + '/Students>/' + this.index).valueChanges()
                       .subscribe(students => {
                         this.dataSource[i++] = students;

                       });
                   }
                 });
               }
             });
         });
       });
     });
   }

  openEdit(index): Observable<any> {
    const dialogRef = this.dialog.open(QlEditComponentComponent, {
        autoFocus: false,
        maxHeight: '90vh',
        width: '800px',
        id: index
    });
    return dialogRef.afterClosed();
  }

  setCompleteStatus() {
    for (let k = 0; k < this.dataSource.length; k++) {
      this.sumOfReturned = this.sumOfReturned + this.dataSource[k][4];
      this.sumOfTaken = this.sumOfTaken + this.dataSource[k][5];
    }
    if (this.sumOfReturned === this.sumOfTaken && this.sumOfTaken !== 0 && this.sumOfTaken !== 0) {
      this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/').update(
        {'Complete Status>': true }
      );
    } else if (this.sumOfTaken === 0) {
      this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex).update(
        {'Complete Status>': 'none' }
      );
    } else {
      this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex).update(
        {'Complete Status>': false }
      );
    }
  }
}
