import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { AuthService, HomeService } from 'src/app/commons/services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from 'src/app/commons/components';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let homeService: jasmine.SpyObj<HomeService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser$: of({ fullName: 'Test User' })
    });

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        CommonModule,
        DataTableComponent,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: HomeService, useValue: jasmine.createSpyObj('HomeService', ['getDataList']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    homeService = TestBed.inject(HomeService) as jasmine.SpyObj<HomeService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    homeService.getDataList.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize  userName from authService', () => {
    const userName = 'Test User';

    component.ngOnInit();

    expect(component.userName).toBe(userName);
  });

  /* it('should initialize userName from localStorage when authService currentUser$ is null', () => {
    const dataUser = JSON.parse(localStorage.getItem('dataUser') as string);
    authService.currentUser$ = of(null);

    component.ngOnInit();

    expect(component.userName).toBe(dataUser.fullName);
  }); */

  /* it('should set isLoading to true and then to false after data is loaded', () => {
    const mockData: Array<IPhoto> = [{ id: 1, title: 'Test Photo', url: 'test-url', albumID: 1 }];
    homeService.getDataList.and.returnValue(of(mockData));

    component.ngOnInit();

    expect(component.isLoading).toBe(true);
    fixture.detectChanges();
    expect(component.data).toEqual(mockData);
    expect(component.isLoading).toBe(false);
  }); */

  it('should call authService.logout and navigate to login on logout', () => {
    component.onLogout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
