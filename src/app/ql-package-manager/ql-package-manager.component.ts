import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatTabGroup} from '@angular/material/tabs';
import {Package} from '../shared/package.model';
import {IndividualService} from '../shared/individual.service';
import {DisplayableBook} from '../shared/displayableBook.model';
import {Observable} from 'rxjs';
import {Observer} from 'rxjs';
import {Books} from '../shared/books.model';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {QlAddToPackageComponent} from '../ql-add-to-package/ql-add-to-package.component';
import {AngularFireDatabase} from '@angular/fire/database';
import {QlExpandedBookComponent} from '../ql-expanded-book/ql-expanded-book.component';
import {MatSnackBar} from '@angular/material/snack-bar';


const gradeTypes: any[] = ['FM', 'BC', 'E', 'L'];

@Component({
  selector: 'app-ql-package-manager',
  templateUrl: './ql-package-manager.component.html',
  styleUrls: ['./ql-package-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})



export class QlPackageManagerComponent implements OnInit {

  @ViewChild('hosq') hosq: MatTabGroup;
  @ViewChild('add') addToPackage: ElementRef;
  @Output() searchCriteria = new EventEmitter<string>();
  gradeTypes = gradeTypes;
  isDisabled = false;
  searchText;
  selectedGrade = '10';
  selectedTabIndex = 0;
  packageSubjects: any[] = [];
  queriedBooks: any[] = [];
  isSearched = false;
  filteredBook = {};
  copyValue = '';
  allKeys: any[] = [];
  subjectKey: any[] = [];
  numberOfBooksPerStudent = 0;
  description: string;
  typeName: string;
  isHovered = false;
  hoverIndex: number;
  sel5: boolean;
  sel6: boolean;
  sel7: boolean;
  sel8: boolean;
  sel9: boolean;
  sel10: boolean;
  sel11: boolean;
  sel12: boolean;

  constructor(private is: IndividualService, private dialog: MatDialog, private db: AngularFireDatabase, private snackBar: MatSnackBar) { }
  private observers: Map<string, Observer<any>[]> = new Map();

    ngOnInit() {
      this.db.database.ref('Selected Grade').once('value').then(getGrade => {
        this.selectedGrade = getGrade.val();
        if (+this.selectedGrade >= 10) {
          this.isDisabled = false;
          this.db.database.ref('Package Type').set(this.gradeTypes[this.selectedTabIndex]);
          this.db.database.ref('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex] + '/Subjects>')
            .on('value', packageSubjects => {
              this.packageSubjects = Object.values(packageSubjects.val());
              for (let i = 0; i < packageSubjects.numChildren(); i++) {
                this.db.list('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex], allPackage => {
                  return allPackage.orderByChild('Subject').equalTo(this.packageSubjects[i]);
                }).valueChanges().subscribe(response => {
                  this.queriedBooks[i] = response[0];
                });
              }
            });
        } else {
          this.isDisabled = true;
          this.db.database.ref('Package Type').set('S');
          this.db.database.ref('Books/' + this.selectedGrade + 'S' + '/Subjects>')
            .on('value', packageSubjects => {
              this.packageSubjects = Object.values(packageSubjects.val());
              for (let i = 0; i < packageSubjects.numChildren(); i++) {
                this.db.list('Books/' + this.selectedGrade + 'S', allPackage => {
                  return allPackage.orderByChild('Subject').equalTo(this.packageSubjects[i]);
                }).valueChanges().subscribe(response => {
                  this.queriedBooks[i] = response[0];
                });
              }
            });
        }
      });
    }

  public notifyObserver(fieldName: string, value: any): void {
    this.observers.get(fieldName) && this.observers.get(fieldName)
      .forEach(subscriber => !subscriber.closed && subscriber.next(value));
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.selectedTabIndex = tabChangeEvent.index;
    this.typeName = tabChangeEvent.tab.textLabel;
    this.queriedBooks = [];
    this.db.database.ref('Package Type').set(this.gradeTypes[this.selectedTabIndex]);
    this.db.database.ref('Selected Grade').set(this.selectedGrade);
    this.db.database.ref('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex] + '/Subjects>')
      .on('value', packageSubjects => {
        this.packageSubjects = Object.values(packageSubjects.val());
        for (let i = 0; i < packageSubjects.numChildren(); i++) {
          this.db.list('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex], allPackage => {
            return allPackage.orderByChild('Subject').equalTo(this.packageSubjects[i]);
          }).valueChanges().subscribe(response => {
            this.queriedBooks[i] = response[0];
          });
        }
      });

  //   this.description = this.selectedGrade + '-րդ դասարան, ' + this.typeName + ' հոսք';
  //   this.db.database.ref('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex]).update(
  //     {w_Description: this.description}
  // );
  }
  onSearch() {
    if (this.searchText !== '') {
      this.isSearched = true;
      if (+this.selectedGrade >= 10) {
        this.db.list('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex], filterBooks => {
          return filterBooks.orderByChild('ID').equalTo(this.searchText);
        }).valueChanges().subscribe(filteredBook => {
          this.filteredBook = filteredBook[0];
          this.copyValue = filteredBook[0]['w_ID'];
        });
      } else {
        this.db.list('Books/' + this.selectedGrade + 'S', filterBooks => {
          return filterBooks.orderByChild('ID').equalTo(this.searchText);
        }).valueChanges().subscribe(filteredBook => {
          this.filteredBook = filteredBook[0];
          this.copyValue = filteredBook[0]['w_ID'];
        });
      }

    } else {
      this.isSearched = false;
    }

  }
  onSelectGrade(gradeNumber: number) {
    this.db.database.ref('Selected Grade').set(gradeNumber.toString());

    if (gradeNumber === 5) {
      this.sel5 = true;
      this.sel6 = false;
      this.sel7 = false;
      this.sel8 = false;
      this.sel9 = false;
      this.sel10 = false;
      this.sel11 = false;
      this.sel12 = false;
    } else if (gradeNumber === 6) {
      this.sel6 = true;
      this.sel5 = false;
      this.sel7 = false;
      this.sel8 = false;
      this.sel9 = false;
      this.sel10 = false;
      this.sel11 = false;
      this.sel12 = false;
    } else if (gradeNumber === 7) {
      this.sel7 = true;
      this.sel6 = false;
      this.sel5 = false;
      this.sel8 = false;
      this.sel9 = false;
      this.sel10 = false;
      this.sel11 = false;
      this.sel12 = false;
    } else if (gradeNumber === 8) {
      this.sel8 = true;
      this.sel6 = false;
      this.sel7 = false;
      this.sel5 = false;
      this.sel9 = false;
      this.sel10 = false;
      this.sel11 = false;
      this.sel12 = false;
    } else if (gradeNumber === 9) {
      this.sel9 = true;
      this.sel6 = false;
      this.sel7 = false;
      this.sel8 = false;
      this.sel5 = false;
      this.sel10 = false;
      this.sel11 = false;
      this.sel12 = false;
    } else if (gradeNumber === 10) {
      this.sel10 = true;
      this.sel6 = false;
      this.sel7 = false;
      this.sel8 = false;
      this.sel9 = false;
      this.sel5 = false;
      this.sel11 = false;
      this.sel12 = false;
    } else if (gradeNumber === 11) {
      this.sel11 = true;
      this.sel6 = false;
      this.sel7 = false;
      this.sel8 = false;
      this.sel9 = false;
      this.sel10 = false;
      this.sel5 = false;
      this.sel12 = false;
    } else if (gradeNumber === 12) {
      this.sel12 = true;
      this.sel6 = false;
      this.sel7 = false;
      this.sel8 = false;
      this.sel9 = false;
      this.sel10 = false;
      this.sel11 = false;
      this.sel5 = false;
    }

    if (gradeNumber < 10) {
      this.selectedGrade = gradeNumber.toString();
      this.isDisabled = true;
      this.queriedBooks = [];
      this.db.database.ref('Package Type').set('S');
      this.db.database.ref('Books/' + this.selectedGrade + 'S' + '/Subjects>')
        .on('value', packageSubjects => {
          this.packageSubjects = Object.values(packageSubjects.val());
          for (let i = 0; i < packageSubjects.numChildren(); i++) {
            this.db.list('Books/' + this.selectedGrade + 'S', allPackage => {
              return allPackage.orderByChild('Subject').equalTo(this.packageSubjects[i]);
            }).valueChanges().subscribe(response => {
              this.queriedBooks[i] = response[0];
            });
          }
        });
      // this.description = this.selectedGrade + '-րդ դասարան';
      // this.db.database.ref('Books/' + this.selectedGrade + 'S').update(
      //   {w_Description: this.description}
      // );
    } else if (gradeNumber >= 10){
      this.selectedGrade = gradeNumber.toString();
      this.db.database.ref('Package Type').set(this.gradeTypes[this.selectedTabIndex]);
      this.queriedBooks = [];
      this.db.database.ref('Package Type').set(this.gradeTypes[this.selectedTabIndex]);
      this.db.database.ref('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex] + '/Subjects>')
        .on('value', packageSubjects => {
          this.packageSubjects = Object.values(packageSubjects.val());
          for (let i = 0; i < packageSubjects.numChildren(); i++) {
            this.db.list('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex], allPackage => {
              return allPackage.orderByChild('Subject').equalTo(this.packageSubjects[i]);
            }).valueChanges().subscribe(response => {
              this.queriedBooks[i] = response[0];
            });
          }
        });
      // this.description = this.selectedGrade + '-րդ դասարան, ' + this.typeName + ' հոսք';
      // this.db.database.ref('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex]).update(
      //   {w_Description: this.description}
      // );
      this.isDisabled = false;
    }


  }
  displayBooks(i) {
      this.dialog.open(QlExpandedBookComponent, {
        autoFocus: false,
        maxHeight: '90vh',
        width: '1000px',
      });
      this.db.database.ref('Temporary Book Index').set(i);
  }
  onCopy() {
      this.snackBar.open('Գրքի տիրոջ ID-ն պատճենված է', 'Լավ', {
        duration: 3000
      });
  }
  deleteBook(index: number) {
    alert('Վստա՞հ եք, որ ցանկանում եք ջնջել այս գիրքը։ Այս գործեղությունը չեղարկելն անհնար է։');
    if (+this.selectedGrade >= 10) {
      this.db.database.ref('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex]).orderByChild('Subject').equalTo(this.packageSubjects[index]).once('value')
        .then(getAllKeys => {
          this.allKeys = Object.keys(getAllKeys.val());
          for (let j = 0; j < getAllKeys.numChildren(); j++) {
            this.db.database.ref('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex] + '/' + this.allKeys[j]).remove();
          }
        });
      this.db.database.ref('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex] + '/Subjects>').orderByValue().equalTo(this.packageSubjects[index]).once('value')
        .then(getSubject => {
          this.subjectKey = Object.keys(getSubject.val());
          this.db.database.ref('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex] + '/Subjects>/' + this.subjectKey[0]).remove();
        });
      this.db.database.ref('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex] + '/Number of Books per Student').once('value')
        .then(getNumber => {
          this.numberOfBooksPerStudent = getNumber.val();
          this.db.database.ref('Books/' + this.selectedGrade + this.gradeTypes[this.selectedTabIndex]).update({'Number of Books per Student': this.numberOfBooksPerStudent - 1})
        });
      location.reload();
    } else {
      this.db.database.ref('Books/' + this.selectedGrade + 'S').orderByChild('Subject').equalTo(this.packageSubjects[index]).once('value')
        .then(getAllKeys => {
          this.allKeys = Object.keys(getAllKeys.val());
          for (let j = 0; j < getAllKeys.numChildren(); j++) {
            this.db.database.ref('Books/' + this.selectedGrade + 'S' + '/' + this.allKeys[j]).remove();
          }
        });
      this.db.database.ref('Books/' + this.selectedGrade + 'S' + '/Subjects>').orderByValue().equalTo(this.packageSubjects[index]).once('value')
        .then(getSubject => {
          this.subjectKey = Object.keys(getSubject.val());
          this.db.database.ref('Books/' + this.selectedGrade + 'S' + '/Subjects>/' + this.subjectKey[0]).remove();
        });
      this.db.database.ref('Books/' + this.selectedGrade + 'S' + '/Number of Books per Student').once('value')
        .then(getNumber => {
          this.numberOfBooksPerStudent = getNumber.val();
          this.db.database.ref('Books/' + this.selectedGrade + 'S').update({'Number of Books per Student': this.numberOfBooksPerStudent - 1});
        });
      location.reload();
    }

   }
  AddBook() {
    const dialogRef = this.dialog.open(QlAddToPackageComponent, {
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.afterClosed().subscribe(data => {

      this.notifyObserver('Book', data);
    });
  }
}

