import { TestBed } from '@angular/core/testing';

import { TokenInterceptor } from './token.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services';

describe('TokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: AuthService;

  beforeEach(() => {
    const authServiceMock = {
      getToken: jasmine.createSpy('getToken').and.returnValue('test-token')
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /* it('should be created', () => {
    const interceptor: TokenInterceptor = TestBed.inject(HTTP_INTERCEPTORS).find(i => i instanceof TokenInterceptor) as TokenInterceptor;
    expect(interceptor).toBeTruthy();
  }); */

  it('should add an Authorization header', () => {
    const testUrl = '/test';

    httpClient.get(testUrl).subscribe();

    const req = httpMock.expectOne(testUrl);
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('should call AuthService.getToken', () => {
    const testUrl = '/test';
    
    httpClient.get(testUrl).subscribe();

    expect(authService.getToken).toHaveBeenCalled();

    const req = httpMock.expectOne(testUrl);
    req.flush({});
  });
});
