import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {IndividualService} from '../shared/individual.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-ql-expanded-book',
  templateUrl: './ql-expanded-book.component.html',
  styleUrls: ['./ql-expanded-book.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QlExpandedBookComponent implements OnInit {

  allKeys: any[] = [];
  packageSubjects: any[] = [];
  queriedBooks: any[] = [];
  newBookID: string;
  newBookIDPrefix: string;
  i: number;
  includedBooks: any[] = [];
  bookToBeRemovedKey: string[] = [];
  packageSubjectBooks: any[] = [];
  booksOfSubject: any[] = [];
  selectedGrade: string;
  packageType: string;

  constructor(private db: AngularFireDatabase, private is: IndividualService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit()  {
    let a = 0;
    this.db.database.ref('Selected Grade').once('value').then(getSelectedGrade => {
      this.selectedGrade = getSelectedGrade.val();
      this.db.database.ref('Package Type').once('value').then(getPackageType => {
        this.packageType = getPackageType.val();
        this.db.database.ref('Temporary Book Index').on('value', getIndex => {
          this.i = getIndex.val();
          this.db.database.ref('Books/' + this.selectedGrade + this.packageType).once('value').then(getAllKeys => {
            this.allKeys = Object.keys(getAllKeys.val());
            this.db.database.ref('Books/' + this.selectedGrade + this.packageType + '/Subjects>')
              .on('value', packageSubjects => {
                this.packageSubjects = Object.values(packageSubjects.val());
                this.packageSubjectBooks = packageSubjects.val();
                for (let k = 0; k < packageSubjects.numChildren(); k++) {
                  this.db.list('Books/' + this.selectedGrade + this.packageType, allPackage => {
                    return allPackage.orderByChild('Subject').equalTo(this.packageSubjects[k]);
                  }).valueChanges().subscribe(response => {
                    this.queriedBooks[a++] = response;
                    if (response !== [] && this.queriedBooks[k][0]['Subject']) {
                      this.db.list('Books/' + this.selectedGrade + this.packageType, queryBySubject => {
                        return queryBySubject.orderByChild('Subject').equalTo(this.queriedBooks[k][0]['Subject']);
                      }).valueChanges().subscribe(includedBooks => {
                        this.includedBooks[k] = includedBooks;
                      });
                    }
                  });
                }
              });
          });
        });
      });
    });

  }

  addBookToPackage() {
    this.newBookIDPrefix = this.newBookID.substring(0, 4);
    this.db.database.ref('Books/' + this.selectedGrade + this.packageType).orderByChild('Subject').equalTo(this.includedBooks[this.i][0].Subject).once('value')
      .then(getSubjectBooks => {
        this.booksOfSubject = Object.keys(getSubjectBooks.val());
        for (let k = 0; k < getSubjectBooks.numChildren(); k++) {
          this.db.database.ref('Books/' +  this.selectedGrade + this.packageType + '/' + this.booksOfSubject[k]).update({'Number of Books': getSubjectBooks.numChildren() + 1});
        }
      });
    this.db.database.ref('Books/' + this.selectedGrade + this.packageType).push({
      Author: this.includedBooks[this.i][0].Author,
      Barcode: '',
      Cover: this.includedBooks[this.i][0].Cover,
      ID: this.newBookID,
      'Number of Books': this.includedBooks[this.i][0]['Number of Books'] + 1,
      'Returned Date': 'Ամսաթիվ չկա',
      'Status Returned': false,
      'Status Taken': false,
      Subject: this.includedBooks[this.i][0].Subject,
      'Taken Date': 'Ամսաթիվ չկա',
      Title: this.includedBooks[this.i][0].Title,
      w_Grade: 'Դասարան չկա',
      w_ID: 'ID չկա',
      w_Owner: 'Աշակերտ չկա',
      'w-Prefix': this.newBookIDPrefix
    });
    this.newBookID = '';
  }
  save() {
    this.dialog.closeAll();
  }
  removeBook(index: number) {
      if (this.includedBooks[this.i][index].w_Owner === 'Աշակերտ չկա') {
        this.db.database.ref('Books/' + this.selectedGrade + this.packageType).orderByChild('Subject').equalTo(this.includedBooks[this.i][index].Subject).once('value')
          .then(getSubjectBooks => {
            this.booksOfSubject = Object.values(getSubjectBooks.val());
            for (let k = 0; k < getSubjectBooks.numChildren(); k++) {
              this.db.database.ref('Books/' + this.selectedGrade + this.packageType + '/' + this.booksOfSubject[k]).update({'Number of Books': getSubjectBooks.numChildren() - 1});
            }
          });
        this.db.database.ref('Books/' + this.selectedGrade + this.packageType).orderByChild('ID').equalTo(this.includedBooks[this.i][index].ID).once('value').then(test => {
          this.bookToBeRemovedKey = Object.keys(test.val());
          this.db.database.ref('Books/' + this.selectedGrade + this.packageType + '/' + this.bookToBeRemovedKey).remove();
        });
      } else {
        this.snackBar.open('Այս գիրքը հիմա գտնվում է աշակերտի մոտ։ Հետ ստացեք այն, և ապա ջնջեք', 'Լավ', {
          duration: 5000
        });
      }
    }
}
