import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {QlLoginComponentComponent} from './ql-login-component/ql-login-component.component';
import {QlGradeManagerComponent} from './ql-grade-manager/ql-grade-manager.component';
import {QlIndividualGradeComponentComponent} from './ql-individual-grade-component/ql-individual-grade-component.component';
import {QlPackageManagerComponent} from './ql-package-manager/ql-package-manager.component';

const appRoutes: Routes = [
  {path: '', component: QlLoginComponentComponent},
  {path: 'login', component: QlLoginComponentComponent},
  {path: 'grade-manager', component: QlGradeManagerComponent},
  {path: 'individual-grade', component: QlIndividualGradeComponentComponent},
  {path: 'package-manager', component: QlPackageManagerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class RoutingModule {

}
