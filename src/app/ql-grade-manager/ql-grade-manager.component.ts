import {Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl, FormGroup} from '@angular/forms';
import {AngularFireDatabase} from '@angular/fire/database';
import {GetService} from '../shared/get.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {MatSidenav} from '@angular/material/sidenav';


const gradeNumbers: any[] = [5, 6, 7, 8, 9, 10, 11, 12];

@Component({
  selector: 'app-ql-grade-manager',
  templateUrl: './ql-grade-manager.component.html',
  styleUrls: ['./ql-grade-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class QlGradeManagerComponent implements OnInit {

  dataSource: any[] = [];
  classNameSource: any[] = [];
  gradeNumbers = gradeNumbers;
  Packages: any[] = [];
  selectedTabIndex = 0;
  editMode = false;
  editForm: FormGroup;
  index: number;
  PackageNames: any[] = [];
  sideNavOpen = false;
  buttonName = 'Բացել Փաթեթների ցանկը';
  PackageDescriptions: any[] = [];

  @Input() selectedIndex: number;

  constructor(private snackBar: MatSnackBar, private db: AngularFireDatabase, private getService: GetService) {}

  ngOnInit() {
    this.editForm = new FormGroup({
      package: new FormControl({value: '', disabled: true})
    });
    let i = 0;
    this.db.database.ref('Students/' + this.gradeNumbers[this.selectedTabIndex]).on('value', snapshot => {
      for (this.index = 1; this.index <= snapshot.numChildren(); this.index++) {
        this.db.database.ref('Students/' + this.gradeNumbers[this.selectedTabIndex] + '/' + this.gradeNumbers[this.selectedTabIndex] + '-' + this.index.toString() + '/Package>').once('value').then(
          packages => {
            this.Packages = packages.val();
          }
        );
        this.classNameSource[this.index - 1] = this.db.database.ref('Students/' + this.gradeNumbers[this.selectedTabIndex] + '/' + this.gradeNumbers[this.selectedTabIndex] + '-' + this.index.toString()).key;
        this.db.list('Students/' + this.gradeNumbers[this.selectedTabIndex] + '/' + this.gradeNumbers[this.selectedTabIndex] + '-' + this.index.toString()).valueChanges().subscribe(grades => {
          this.dataSource[i++] = grades;
        });
      }
    });
    this.db.database.ref('Books').once('value').then(getPackageNames => {
        this.PackageNames = Object.keys(getPackageNames.val());
        for (let k = 0; k < getPackageNames.numChildren(); k++) {
          this.db.database.ref('Books/' + this.PackageNames[k] + '/w_Description').once('value').then(getDescriptions => {
            this.PackageDescriptions[k] = getDescriptions.val();
          });
        }
    });
  }
  // async moveFbRecord() {
  //   try {
  //     var snap = await this.db.database.ref('Students/10-7').once('value');
  //     await this.db.database.ref('Students/10/10-7').set(snap.val());
  //     await this.db.database.ref('Students/10-7').set(null);
  //     console.log('Done!');
  //   } catch(err) {
  //     console.log(err.message);
  //   }
  // }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.selectedTabIndex = tabChangeEvent.index;
    let i = 0;
    this.classNameSource = [];
    this.dataSource = [];
    this.db.database.ref('Students/' + this.gradeNumbers[this.selectedTabIndex]).on('value', snapshot => {
      for (this.index = 1; this.index <= snapshot.numChildren(); this.index++) {
        this.db.database.ref('Students/' + this.gradeNumbers[this.selectedTabIndex] + '/' + this.gradeNumbers[this.selectedTabIndex] + '-' + this.index.toString() + '/Package>').once('value').then(
          packages => {
            this.Packages = packages.val();
          }
        );
        this.classNameSource[this.index - 1] = this.db.database.ref('Students/' + this.gradeNumbers[this.selectedTabIndex] + '/' + this.gradeNumbers[this.selectedTabIndex] + '-' + this.index.toString()).key;
        this.db.list('Students/' + this.gradeNumbers[this.selectedTabIndex] + '/' + this.gradeNumbers[this.selectedTabIndex] + '-' + this.index.toString()).valueChanges().subscribe(grades => {
          this.dataSource[i++] = grades;
        });
      }
    });
  }
  onEdit(i: number) {
    this.editMode = !this.editMode;
    this.editForm.get('package').enable();
  }
  onSave(i: number) {
    const idx  = (i + 1).toString();
    this.editMode = !this.editMode;
    this.editForm.get('package').disable();
    this.db.database.ref('Students/' + this.gradeNumbers[this.selectedTabIndex] + '/' + this.gradeNumbers[this.selectedTabIndex] + '-' + idx.toString()).update(
      {'Package>': this.dataSource[i][3]}
    );
    location.reload();
  }
  onClassSelect(event) {
    this.getService.setSelectedGrade(event.target.text);
  }
  openSidenav() {
    this.sideNavOpen = true;
    this.buttonName = 'Բացել Փաթեթների Ցանկը';
  }
  close() {
    this.sideNavOpen = false;
  }
}
