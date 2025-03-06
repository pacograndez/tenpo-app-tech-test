import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { homeGuard } from './home.guard';
import { AuthService } from '../../services';

describe('homeGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  const executeGuard: CanActivateFn = (route, state) =>
    TestBed.runInInjectionContext(() => homeGuard(route, state));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['isLogged']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    route = {} as ActivatedRouteSnapshot;
    state = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow activation when user is not logged in', () => {
    authService.isLogged.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => executeGuard(route, state));

    expect(result).toBeTrue();
  });

  it('should prevent activation and navigate to home if user is logged in', () => {
    authService.isLogged.and.returnValue(true);
    const navigateSpy = router.navigate.and.returnValue(Promise.resolve(true));

    const result = TestBed.runInInjectionContext(() => executeGuard(route, state));

    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});
