import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';
import {Books} from '../shared/books.model';
import {DisplayableBook} from '../shared/displayableBook.model';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-ql-add-to-package',
  templateUrl: './ql-add-to-package.component.html',
  styleUrls: ['./ql-add-to-package.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class QlAddToPackageComponent implements OnInit {

  @ViewChild('bookID') bookID: ElementRef;
  addedKeys: any[] = [];
  addedIndivBooks: any[] = [];
  enteredID: string;
  enteredAuthor: string;
  enteredTitle: string;
  enteredCover: string;
  currentNumberOfBooks = 0;
  enteredSubject: string;
  enteredNOB: number;
  lineToggle = false;
  clickCount = 0;
  isPushed = false;
  numberOfBooksPerStudent = 0;
  wasDeleted = false;
  selectedGrade: string;
  packageType: string;

  constructor(private snackbar: MatSnackBar, private dialogRef: MatDialogRef<QlAddToPackageComponent>, private db: AngularFireDatabase) { }

  ngOnInit() {
    this.db.database.ref('Selected Grade').once('value').then(getSelectedGrade => {
      this.selectedGrade = getSelectedGrade.val();
      this.db.database.ref('Package Type').once('value').then(getPackageType => {
        this.packageType = getPackageType.val();
      });
    });
  }
  onAdd() {
    if (this.bookID.nativeElement.value !== '') {
      this.lineToggle = true;
      this.isPushed = true;
      if (this.isPushed) {
        this.currentNumberOfBooks++;
      }
      if(this.wasDeleted) {
        this.currentNumberOfBooks--;
      }
      this.isPushed = false;
      this.clickCount++;
      this.db.database.ref('Books/' + this.selectedGrade + this.packageType).push({
        Author: this.enteredAuthor,
        Barcode: '---',
        Cover: this.enteredCover,
        ID: this.enteredID,
        'Number of Books': this.enteredNOB,
        'Returned Date': 'Ամսաթիվ չկա',
        'Status Returned': false,
        'Status Taken': false,
        Subject: this.enteredSubject,
        'Taken Date': 'Ամսաթիվ չկա',
        Title: this.enteredTitle,
        w_Grade: 'Դասարան չկա',
        w_ID: 'ID չկա',
        w_Owner: 'Աշակերտ չկա',
        w_Prefix: this.enteredID.substring(0, 4)
      });
      if (this.clickCount === 1) {
        this.db.database.ref('Books/' + this.selectedGrade + this.packageType + '/Subjects>').push(this.enteredSubject);
      }
      this.addedIndivBooks.push(this.enteredID);
      this.bookID.nativeElement.value = '';
    } else {
      this.snackbar.open('Մուտքագրեք գրքի ID-ն', 'Լավ', {
        duration: 2000,
      });
    }

  }
  onDelete(index: number) {
    this.wasDeleted = true;
    this.db.database.ref('Books/' + this.selectedGrade + this.packageType).orderByChild('Subject').equalTo(this.enteredSubject).once('value')
      .then(getAddedKeys => {
        this.addedKeys = Object.keys(getAddedKeys.val());
        this.db.database.ref('Books/' + this.selectedGrade + this.packageType + '/' + this.addedKeys[index]).remove();
        this.addedIndivBooks.splice(index, 1);
        this.clickCount--;
      }).catch(error => {
        console.log(error);
        console.log('Something went wrong!');
    });
  }
  onClose() {
    this.db.database.ref('Books/' + this.selectedGrade + this.packageType + '/Number of Books per Student').once('value')
      .then(getNumber => {
        this.numberOfBooksPerStudent = getNumber.val();
        this.db.database.ref('Books/'  + this.selectedGrade + this.packageType).update({'Number of Books per Student': this.numberOfBooksPerStudent + 1})
      });
    this.dialogRef.close();
  }
}

