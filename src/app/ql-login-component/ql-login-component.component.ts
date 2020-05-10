import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-ql-login-component',
  templateUrl: './ql-login-component.component.html',
  styleUrls: ['./ql-login-component.component.scss']
})
export class QlLoginComponentComponent implements OnInit {
  email = '';
  password = '';
  buttonRoute = '';
  keepSpinning: boolean;
  constructor(private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }
  signIn() {
    this.authService.SignIn(this.email, this.password, this.snackBar, this.buttonRoute, this.keepSpinning);
  }
}
