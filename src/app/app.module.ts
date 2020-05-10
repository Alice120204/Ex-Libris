// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

// Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {
  MatNativeDateModule, NativeDateAdapter, DateAdapter,
  MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material/core';
import {ClipboardModule} from '@angular/cdk/clipboard';

// Components
import {QlLoginComponentComponent} from './ql-login-component/ql-login-component.component';
import {QlGradeManagerComponent} from './ql-grade-manager/ql-grade-manager.component';
import {QlIndividualGradeComponentComponent} from './ql-individual-grade-component/ql-individual-grade-component.component';
import {QlEditComponentComponent} from './ql-edit-component/ql-edit-component.component';
import {QlPackageManagerComponent} from './ql-package-manager/ql-package-manager.component';
import {QlAddToPackageComponent} from './ql-add-to-package/ql-add-to-package.component';
import {QlExpandedBookComponent} from './ql-expanded-book/ql-expanded-book.component';

// Pipes
import {BookIDFilterPipe} from './Pipes/bookIDFilter.pipe';
import {StudentFilterPipe} from './Pipes/studentFilter.pipe';
import {DatePipe} from '@angular/common';

// Modules
import {RoutingModule} from './routing.module';

// Services
import {IndividualService} from './shared/individual.service';
import {GetService} from './shared/get.service';
import {AuthService} from './shared/auth.service';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireAuthGuard} from '@angular/fire/auth-guard';

// Barcode
import { NgxBarcodeModule } from 'ngx-barcode';



@NgModule({
  declarations: [
    // Components
    AppComponent,
    QlLoginComponentComponent,
    QlGradeManagerComponent,
    QlIndividualGradeComponentComponent,
    QlEditComponentComponent,
    QlPackageManagerComponent,
    QlAddToPackageComponent,
    QlExpandedBookComponent,
    // Pipes
    BookIDFilterPipe,
    StudentFilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    RoutingModule,
    MatNativeDateModule,
    AngularFireModule.initializeApp(environment),
    AngularFireDatabaseModule,
    HttpClientModule,
    AngularFireAuthModule,
    NgxBarcodeModule,
    ClipboardModule
  ],
  exports: [
    MatDialogModule
  ],
  providers: [IndividualService, DatePipe, AngularFireAuth, AuthService, AngularFireAuthGuard, { provide: MAT_DATE_LOCALE, useValue: 'fr' }],
  bootstrap: [AppComponent],
  entryComponents: [
    QlEditComponentComponent,
    QlAddToPackageComponent,
    QlExpandedBookComponent
  ]
})
export class AppModule { }
