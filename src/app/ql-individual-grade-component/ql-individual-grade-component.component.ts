import {Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {IndividualService} from '../shared/individual.service';
import {GetService} from '../shared/get.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Students} from '../shared/students.model';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-ql-individual-grade-component',
  templateUrl: './ql-individual-grade-component.component.html',
  styleUrls: ['./ql-individual-grade-component.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QlIndividualGradeComponentComponent implements OnInit, OnDestroy {

  @ViewChildren('phoneNumber') phoneNumber: QueryList<ElementRef>;
  @ViewChildren('Address') Address: QueryList<ElementRef>;
  @ViewChildren('Comments') Comments: QueryList<ElementRef>;
  @ViewChildren('Email') Email: QueryList<ElementRef>;
  @ViewChildren('Name') Name: QueryList<ElementRef>;
  @ViewChildren('ID') ID: QueryList<ElementRef>;

  dataSource: any[] = [];
  filteredDataSource = {};
  numberOfTakenBooks = 0;
  searchText = '';
  isReady: boolean;
  numberOfStudents: number;
  packageName: string;
  i: number;
  isNotNull: boolean;

  isEditing = true;
  cancelled = false;
  newName = '';
  newAddress = '';
  newID = '';
  newEmail = '';
  newPhone = '';
  newComment = '';

  isInAddMode = false;

  newStudentName = '';
  newStudentPhone = '';
  newStudentID = '';
  newStudentAddress = '';
  newStudentEmail = '';

  isQueried = false;
  filteredIndex: string;
  childLength: number;
  selectedIndex: string;
  totalBooks: number;
  sumOfTaken = 0;
  sumOfReturned = 0;
  grade = '';

  constructor(private is: IndividualService, private get: GetService, private db: AngularFireDatabase, private snackbar: MatSnackBar) {}

  ngOnInit() {
    let k = 1;
    let x = 0;
    this.db.database.ref('Temporary').once('value').then(selectedIndex => {
      this.selectedIndex = selectedIndex.val();
      this.grade = selectedIndex.val().substr(0, selectedIndex.val().indexOf('-'));
      this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Package>').on('value', qlPackage => {
        this.packageName = qlPackage.val();
        this.db.database.ref('Books/' + this.packageName + '/Number of Books per Student').on('value', quantity => {
          this.totalBooks = quantity.val();
          if (this.searchText === '') {
            this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>').on('value', snapshot => {
              this.numberOfStudents = snapshot.numChildren();
              for (k = 1; k <= this.numberOfStudents; k++) {
                this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + k).once('value', snap => {
                  if (snap.val() !== null) {
                    this.db.list<Students>('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + k).valueChanges()
                      .subscribe(students => {
                        this.dataSource[x] = students;
                        x++;
                        this.isReady = true;
                        this.isQueried = false;
                      });
                  } else {
                    this.isNotNull = false;
                  }
                });
              }
            });
          }
        });
      });
        });

        }

filterStudents() {
    for (let a = 1; a <= this.dataSource.length + 1; a++) {
      if (this.searchText !== '') {
        this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>').orderByChild('ID').equalTo(this.searchText)
          .on('value', snapshot => {
            this.childLength = snapshot.numChildren();
            snapshot.forEach(childSnapshot => {
              this.filteredIndex = childSnapshot.key;
            });
          });
        return this.db.list('Students/' + this.grade + '/' + this.selectedIndex + '/Students>', ref => {
          const k =  ref.orderByChild('ID').equalTo(this.searchText);
          return k;
        }).valueChanges().subscribe(
          filteredStudents => {
            this.isQueried = true;
            this.filteredDataSource = filteredStudents[0];
          });
      } else {
        // location.reload();
        this.isQueried = false;
      }
    }
  }
  openEdit(index) {
    this.get.setSelectedIndex(index + 1);
    this.is.openEdit(index).subscribe(data => {
      this.numberOfTakenBooks = data;
    });
  }
  openEditFiltered() {
    this.db.database.ref().update({'Temporary Index': this.filteredIndex});
    this.is.openEdit(this.filteredIndex).subscribe(data => {
      this.numberOfTakenBooks = data;
    });
  }
  saveChanges(index: number) {
    this.isEditing = true;
    let idx: string;
    if (this.isQueried) {
      idx = this.filteredIndex;
    } else {
      idx = (index + 1).toString();
    }
    this.newPhone = this.phoneNumber.toArray()[index].nativeElement.value;
    this.newName = this.Name.toArray()[index].nativeElement.value;
    this.newAddress = this.Address.toArray()[index].nativeElement.value;
    this.newEmail = this.Email.toArray()[index].nativeElement.value;
    this.newID = this.ID.toArray()[index].nativeElement.value;
    this.newComment = this.Comments.toArray()[index].nativeElement.value;
    this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + idx).update({
       Address: this.newAddress,
       'Full Name': this.newName,
       Email: this.newEmail,
       ID: this.newID,
      'Phone Number': this.newPhone,
       w_Comment: this.newComment
    });
    location.reload();
  }
  editStudentInfo() {
    this.isEditing = !this.isEditing;
    this.cancelled = true;
  }
  viewAddStudent() {
    this.isInAddMode = !this.isInAddMode;
    this.newStudentAddress = '';
    this.newStudentName = '';
    this.newStudentEmail = '';
    this.newStudentID = '';
    this.newStudentPhone = '';
  }
  addStudent() {
    this.isInAddMode = false;
    const idx = (this.dataSource.length + 1).toString();
    this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Students>/' + idx).set({
      Address: this.newStudentAddress,
      Email: this.newStudentEmail,
      'Full Name': this.newStudentName,
      ID: this.newStudentID,
      'Phone Number': this.newStudentPhone,
      'Number of Taken Books': 0,
      'Number of Returned Books': 0,
      'Taken Books': 0,
      'Returned Books': 0,
      w_Comment: 'Մեկնաբանություն ավելացված չէ'
    });
    this.snackbar.open('Student Number ' + idx + ' Added!', 'Okay', {
      duration: 3000
    });
    this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex + '/Number of Students>').set(
      this.dataSource.length + 1
    );
    location.reload();
  }
  manageDisable() {
    if (this.newStudentAddress !== '' &&
      this.newStudentName !== '' &&
      this.newStudentPhone !== '' &&
      this.newStudentID !== '' &&
      this.newStudentEmail !== '') {
      return  true;
    } else {
      return false;
    }
  }
  ngOnDestroy() {
    for (let k = 0; k < this.dataSource.length; k++) {
      this.sumOfReturned = this.sumOfReturned + this.dataSource[k][4];
      this.sumOfTaken = this.sumOfTaken + this.dataSource[k][5];
    }
    if (this.sumOfReturned === this.sumOfTaken && this.sumOfTaken !== 0 && this.sumOfTaken !== 0) {
      this.db.database.ref('Students/' + this.grade + '/' + this.selectedIndex).update(
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

