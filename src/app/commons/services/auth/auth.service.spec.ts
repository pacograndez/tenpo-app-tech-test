import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { IUser } from '../../interfaces';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should login and return user data', () => {
    const mockResponse = {
      accessToken: 'fake-token',
      user: {
        name: 'John',
        lastname: 'Doe',
        fullname: 'John Doe'
      }
    };
    const email = 'test@example.com';
    const password = 'password';

    authService.login(email, password).subscribe(user => {
      expect(user.token).toBe(mockResponse.accessToken);
      expect(user.name).toBe(mockResponse.user.name);
      expect(user.lastName).toBe(mockResponse.user.lastname);
      expect(user.fullName).toBe(mockResponse.user.fullname);
    });

    const req = httpMock.expectOne(`${environment.apiAuth}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    const email = 'test@example.com';
    const password = 'password';
    const errorMessage = 'Credenciales incorrectas o problema de red.';

    authService.login(email, password).subscribe({
      next: () => fail('expected an error, not user data'),
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiAuth}/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: errorMessage }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should set user data and store in localStorage', () => {
    const userData: IUser = {
      token: 'fake-token',
      name: 'John',
      lastName: 'Doe',
      fullName: 'John Doe'
    };

    authService.setDataUser(userData);

    authService.currentUser$.subscribe(user => {
      expect(user).toEqual(userData);
      expect(localStorage.getItem('dataUser')).toBe(JSON.stringify({
        name: userData.name,
        lastName: userData.lastName,
        fullName: userData.fullName
      }));
    });
    expect(localStorage.getItem('fakeToken')).toBe(userData.token);
  });

  it('should return true if user is logged in', () => {
    localStorage.setItem('fakeToken', 'fake-token');

    const isLogged = authService.isLogged();

    expect(isLogged).toBeTrue();
  });

  it('should return false if user is not logged in', () => {
    localStorage.removeItem('fakeToken');

    const isLogged = authService.isLogged();

    expect(isLogged).toBeFalse();
  });

  it('should get token from localStorage', () => {
    const token = 'fake-token';
    localStorage.setItem('fakeToken', token);

    const retrievedToken = authService.getToken();

    expect(retrievedToken).toBe(token);
  });

  it('should return null if no token in localStorage', () => {
    localStorage.removeItem('fakeToken');

    const retrievedToken = authService.getToken();

    expect(retrievedToken).toBeNull();
  });

  it('should clear user data and localStorage on logout', () => {
    localStorage.setItem('fakeToken', 'fake-token');
    localStorage.setItem('dataUser', JSON.stringify({ name: 'John', lastName: 'Doe', fullName: 'John Doe' }));

    authService.logout();

    authService.currentUser$.subscribe(user => {
      expect(user).toBeNull();
      expect(localStorage.getItem('fakeToken')).toBeNull();
      expect(localStorage.getItem('dataUser')).toBeNull();
    });
  });
});
