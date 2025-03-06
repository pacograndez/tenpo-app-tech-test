import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<IUser | null>;
  public currentUser$: Observable<IUser | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUser | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public login(email: string, password: string): Observable<IUser> {
    return this.http.post(`${environment.apiAuth}/login`, { email, password }).pipe(
      map((res: any) => {
        return {
          token: res.accessToken,
          name: res.user.name,
          lastName: res.user.lastname,
          fullName: res.user.fullname
        }
      }),
      catchError((error) => {
        console.error('Error login', error);
        return throwError(() => new Error('Credenciales incorrectas o problema de red.'));
      })
    );
  }

  public setDataUser(data: IUser): void {
    this.currentUserSubject.next(data);
    const { token, name, lastName, fullName } = data;
    localStorage.setItem('dataUser', JSON.stringify({name, lastName, fullName}));
    localStorage.setItem('fakeToken', token)
  }

  public isLogged(): boolean {
    const token = localStorage.getItem('fakeToken');
    return token ? true : false;
  }

  public getToken(): string | null {
    const token = localStorage.getItem('fakeToken');
    return token ? token : null;
  }

  public logout(): void {
    this.currentUserSubject.next(null);
    localStorage.clear();
  }
}
