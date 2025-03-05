import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPresenter } from './login.presenter';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/commons/services';
import { IUser } from 'src/app/commons/interfaces';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginPresenter]
})
export class LoginComponent implements OnDestroy {

  private destroy$: Subject<void>;

  public constructor(public loginPresenter: LoginPresenter,
    private authService: AuthService,
    private router: Router
  ) {
    this.destroy$ = new Subject<void>();
  }

  public onLogin(): void {
    if (!this.loginPresenter.form.valid) {
      return;
    }

    const {email, password} = this.loginPresenter.form.getRawValue();

    this.authService.login(email, password).pipe(takeUntil(this.destroy$)).subscribe((res: IUser) => {
      this.authService.setDataUser(res);
      this.router.navigate(['home']);
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    console.log('Component Login is destroyed')
  }

}
