import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { map, Observable, switchMap, take } from 'rxjs';
import { AuthService } from '../../services';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    const updateRequest = request.clone({
      headers: request.headers
        .append('Authorization', `Bearer ${token}`)
    });
    return next.handle(updateRequest);
  }
}
