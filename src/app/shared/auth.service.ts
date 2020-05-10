import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

export class AuthService {
  userData: Observable<any>;
  errorCaught: boolean;


  constructor(private auth: AngularFireAuth, private router: Router) {
    this.userData = auth.authState;
  }

  SignIn(email: string, password: string, snackBar: MatSnackBar, buttonRoute: string, keepSpinning: boolean) {
    this.errorCaught = false;
    this.auth.auth.signInWithEmailAndPassword(email, password).then(res => {
      this.router.navigate(['/grade-manager']);
      keepSpinning = true;
      console.log(keepSpinning.valueOf());
    }).catch(error => {
      snackBar.open('Invalid Email or Password', 'OK', {
        duration: 3000
      });
      keepSpinning = false;
      console.log(keepSpinning.valueOf());
      email = '';
      password = '';
    });
  }
  SignOut() {
    this.auth.auth.signOut();
  }
}
