import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/commons/services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { IUser } from 'src/app/commons/interfaces';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['login', 'setDataUser']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should noty call authService.login when form is invalid', () => {
    component.loginPresenter.form.setValue({ email: '', password: '' });

    component.onLogin();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call authService.login when form is valid', () => {
    const user = { name: 'Test User', lastName: 'Test Last Name', fullName: 'Test Full Name'} as IUser;
    component.loginPresenter.form.setValue({ email: 'test@gmail.com', password: '123456' });
    authService.login.and.returnValue(of(user));

    component.onLogin();

    expect(authService.login).toHaveBeenCalledWith('test@gmail.com', '123456');
    expect(authService.setDataUser).toHaveBeenCalledWith(user);
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should set errorMessage when login fails', () => {
    component.loginPresenter.form.setValue({ email: 'test2@gmail.com', password: '123456' });
    authService.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

    component.onLogin();

    expect(authService.login).toHaveBeenCalledWith('test2@gmail.com', '123456');
    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('should complete destroy$ on ngDestroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  })
});
