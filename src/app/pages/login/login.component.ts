import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPresenter } from './login.presenter';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginPresenter]
})
export class LoginComponent {

  public constructor(public loginPresenter: LoginPresenter,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.loginPresenter.form.valid) {
      return;
    }
    console.log('paco', this.loginPresenter.form.value);
    this.router.navigate(['home']);
  }

}
