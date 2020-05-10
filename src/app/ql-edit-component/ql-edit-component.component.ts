import {Component, ElementRef, Inject,  OnInit, Output, QueryList,  ViewChildren, ViewEncapsulation} from '@angular/core';
import {Book} from '../shared/book.model';
import {DatePipe} from '@angular/common';
import {IndividualService} from '../shared/individual.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AngularFireDatabase} from '@angular/fire/database';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-ql-edit-component',
  templateUrl: './ql-edit-component.component.html',
  styleUrls: ['./ql-edit-component.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QlEditComponentComponent implements OnInit {
  constructor(private datePipe: DatePipe,
              private is: IndividualService,
              private dialogRef: MatDialogRef<QlEditComponentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: number,
              private db: AngularFireDatabase,
              private snackBar: MatSnackBar) {}

  @ViewChildren ('dateTaken') dateTaken: QueryList<ElementRef>;
  @ViewChildren ('dateReturned') dateReturned: QueryList<ElementRef>;
  @Output() numberOfTakenBooks = 0;
  @Output() numberOFReturnedBooks = 0;

  takenBooks: any[] = [];
  studentNameID: string;
  statusTaken: boolean;
  statusReturned: boolean;
  takenDate: string;
  returnedDate: string;
  addedBookID: string;
  idx: number;
  grade: string;
  queriedBooks: any[] = [];
  studentName: string;
  demoDate: any[] = [];
  demoKey: any[] =  [];
  demoDateReturned: any[] = [];
  NumberOfTakenBooks: number;
  NumberOfReturnedBooks: number;
  packageName: string;
  noBooks = false;
  removeCalled = false;
  selectedIndex = '';


  ngOnInit() {
    this.db.database.ref('Temporary Index').on('value', studentIndex => {
      this.idx = studentIndex.val();
      this.db.database.ref('Temporary').on('value', studentGrade => {
        this.selectedIndex = studentGrade.val();
        this.grade = studentGrade.val().substr(0, studentGrade.val().indexOf('-'));
        this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx.toString() + '/Full Name').on('value', studentName => {
          this.studentName = studentName.val();
          this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx.toString() + '/ID').on('value', studentID => {
            this.studentNameID = studentID.val();
            this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Package>').once('value').then(getPackageName => {
              this.packageName = getPackageName.val();
              this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx.toString() + '/Taken Books').on('value', studentBooks => {
                if (studentBooks.val()) {
                  this.takenBooks = Object.keys(studentBooks.val());
                  for (let a = 0; a < studentBooks.numChildren(); a++) {
                    this.db.list('Books/' + this.packageName, ref => {
                      return ref.orderByKey().equalTo(this.takenBooks[a]);
                    }).valueChanges().subscribe(queriedBooks => {
                      if (this.removeCalled === false) {
                        this.queriedBooks[a] = queriedBooks;
                        if (this.queriedBooks[a][0]['Status Taken'] === true) {
                          this.demoDate[a] = this.queriedBooks[a][0]['Taken Date'];
                        }
                        if (this.queriedBooks[a][0]['Status Returned'] === true) {
                          this.demoDateReturned[a] = this.queriedBooks[a][0]['Returned Date'];
                        }
                      }
                    });
                    this.queriedBooks.splice(studentBooks.numChildren());
                  }
                } else {
                  this.noBooks = true;
                }
              });
            });
          });
        });
      });
    });
  }

  onCheckedTaken(book, index: number) {
    this.takenDate = this.datePipe.transform(new Date(), 'd/M/yy');
    this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx.toString() + '/Taken Books').once('value')
      .then(getNumberOfTakenBooks => {
        this.NumberOfTakenBooks = getNumberOfTakenBooks.numChildren();
        this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx.toString() + '/Number of Returned Books').once('value')
          .then(getNOB => {
            this.numberOFReturnedBooks = getNOB.val();
            this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/Status Taken').once('value', statuses => {
              this.statusTaken = statuses.val();
              if (this.statusTaken ===  false) {
                this.db.list('Books/' + this.packageName).update(
                  this.takenBooks[index], {'Taken Date': this.takenDate}
                );
                this.db.list('Books/'  + this.packageName).update(
                  this.takenBooks[index], {'Status Taken': true},
                );
                this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_Owner').set(
                  this.studentName
                );
                this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_ID').set(
                  this.studentNameID
                );
                this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_Grade').set(
                  this.selectedIndex
                );
                this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx.toString()).update(
                  {'Number of Taken Books': this.NumberOfTakenBooks}
                );
                if (this.numberOFReturnedBooks > 0) {
                  this.db.list('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/').update(
                    this.idx.toString(), {'Number of Returned Books': this.numberOFReturnedBooks - 1},
                  );
                }
                this.dateTaken.toArray()[index].nativeElement.value = this.takenDate;
              } else {
                this.db.list('Books/'  + this.packageName).update(
                  this.takenBooks[index], {'Status Taken': false}
                );
                this.db.list('Books/' + this.packageName).update(
                  this.takenBooks[index], {'Taken Date': 'Ամսաթիվ չկա'},
                );
                this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_Owner').set(
                  'Աշակերտ չկա'
                );
                this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_ID').set(
                  'ID չկա'
                );
                this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_Grade').set(
                  'Դասարան չկա'
                );
                this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx.toString()).update(
                  {'Number of Taken Books': this.NumberOfTakenBooks - 1}
                );
                this.dateTaken.toArray()[index].nativeElement.value = '';
              }
            });
          });
          });
  }
  onCheckedReturned(book: Book, index: number) {
    this.returnedDate = this.datePipe.transform(new Date(), 'd/M/yy');
    this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx.toString() + '/Number of Returned Books').once('value')
      .then(getNOB => {
        this.numberOFReturnedBooks = getNOB.val();
        this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx.toString() + '/Number of Taken Books').once('value')
          .then(getNOTB => {
            this.numberOfTakenBooks = getNOTB.val();
            this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/Status Returned').once('value', statuses => {
              this.statusReturned = statuses.val();
              this.db.list('Books/' + this.packageName).update(
                this.takenBooks[index], {'Returned Date': this.returnedDate}
              );
              if (this.statusReturned ===  false) {
                this.db.list('Books/'  + this.packageName).update(
                  this.takenBooks[index], {'Status Returned': true},
                );
                this.db.list('Books/' + this.packageName).update(
                  this.takenBooks[index], {'Returned Date': this.returnedDate},
                );
                this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_Owner').set(
                  'Աշակերտ չկա'
                );
                this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_ID').set(
                  'ID չկա'
                );
                this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_Grade').set(
                  'Դասարան չկա'
                );
                this.dateReturned.toArray()[index].nativeElement.value = this.returnedDate;
              } else {
                this.db.list('Books/' + this.packageName).update(
                  this.takenBooks[index], {'Status Returned': false}
                );
                this.db.list('Books/'  + this.packageName).update(
                  this.takenBooks[index], {'Returned Date': 'Ամսաթիվ չկա'},
                );
                this.returnedDate = '';
                this.dateReturned.toArray()[index].nativeElement.value = this.returnedDate;
                this.demoDateReturned[index] = '';
              }
            });
            if (this.returnedDate !== '') {
              this.db.list('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/').update(
                this.idx.toString(), {'Number of Returned Books': this.numberOFReturnedBooks + 1},
              );
            } else {
              if (this.numberOFReturnedBooks > 0) {
                this.db.list('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/').update( this.idx.toString(),
                  {'Number of Returned Books': this.numberOFReturnedBooks - 1});
              }
              this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_Owner').set(
                this.studentName
              );
              this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_ID').set(
                this.studentNameID
              );
              this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_Grade').set(
                this.selectedIndex
              );
            }
          });



          });

  }
  save() {
    this.snackBar.open('Փոփոխությունները պահպանված են', 'Լավ', {
      duration: 3000
    });
    this.is.setCompleteStatus();
    location.reload();
  }
  add() {
    this.removeCalled = false;
    this.noBooks = false;
    this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx + '/Taken Books').once('value')
      .then(getNumberOfTakenBooks => {
        this.NumberOfTakenBooks = getNumberOfTakenBooks.numChildren();
        this.db.database.ref('Books/' + this.packageName).orderByChild('ID').equalTo(this.addedBookID).once('value').then(getKey => {
          this.demoKey[0] = Object.keys(getKey.val());
          this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx + '/Taken Books/' + this.demoKey[0]).set(
            true
          );
          this.db.database.ref('Books/' + this.packageName + '/' + this.demoKey[0] + '/w_Owner').set(
            this.studentName
          );
          this.db.database.ref('Books/' + this.packageName + '/' + this.demoKey[0] + '/w_ID').set(
            this.studentNameID
          );
          this.db.database.ref('Books/' + this.packageName + '/' + this.demoKey[0] + '/w_Grade').set(
            this.selectedIndex
          );
        });
        this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx).update(
          {'Number of Taken Books': this.NumberOfTakenBooks + 1}
        );
        this.addedBookID = '';
      });

 }
  removeBook(index: number) {
    this.removeCalled = true;
    this.queriedBooks.splice(index, 1);
    if (this.queriedBooks.length === 0) {
      this.noBooks = true;
    } else {
      this.noBooks = false;
    }
    this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx + '/Taken Books').once('value')
      .then(getNumberOfTakenBooks => {
        this.NumberOfTakenBooks = getNumberOfTakenBooks.numChildren();
        this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx + '/Number of Returned Books').once('value')
          .then(getNumberOfReturnedBooks => {
            this.NumberOfReturnedBooks = getNumberOfReturnedBooks.val();
            this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_ID').set(
                  'ID չկա'
                );
            this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_Grade').set(
                  'Դասարան չկա'
                );
            this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/w_Owner').set(
              'Աշակերտ չկա'
            );
            this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/Taken Date').set(
              'Ամսաթիվ չկա'
            );
            this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/Returned Date').set(
              'Ամսաթիվ չկա'
            );
            this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/Status Taken').set(
              false
            );
            this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/Status Returned').set(
              false
            );
            this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx + '/Taken Books/' + this.takenBooks[index]).remove();
            this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx).update(
              {'Number of Taken Books': this.NumberOfTakenBooks - 1}
            );
            if (this.NumberOfReturnedBooks === 0) {
              this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + this.idx).update(
                {'Number of Returned Books': 0}
              );
            }
          });
          });

  }
  setDate(event: KeyboardEvent, index: number) {
    this.demoDate[index] = (event.target as HTMLInputElement).value;
    this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/Status Taken').once('value', statuses => {
      this.statusTaken = statuses.val();
      if (this.statusTaken ===  true) {
        this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index]).update(
          {'Taken Date': this.demoDate[index]}
        );
      } else {
        this.db.database.ref('Books/'  + this.packageName).update(
           {'Status Taken': true}
        );
        this.db.database.ref('Books/' + this.packageName).update(
          {'Taken Date': this.demoDate[index]}
        );
      }
    });
  }
  setDateReturned(event: KeyboardEvent, index: number) {
    this.demoDateReturned[index] = (event.target as HTMLInputElement).value;
    this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index] + '/Status Returned').once('value', statuses => {
      this.statusReturned = statuses.val();
      if (this.statusReturned ===  true) {
        this.db.database.ref('Books/' + this.packageName + '/' + this.takenBooks[index]).update(
          {'Returned Date': this.demoDateReturned[index]}
        );
      } else {
        this.db.database.ref('Books/'  + this.packageName).update(
          {'Status Returned': true}
        );
        this.db.database.ref('Books/' + this.packageName).update(
          {'Returned Date': this.demoDateReturned[index]}
        );
      }
    });
  }
  trackByFunction(book) {
    return book.id;
  }

}

