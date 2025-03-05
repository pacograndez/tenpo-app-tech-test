import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from 'src/app/commons/services/home';
import { DataTableComponent } from 'src/app/commons/components';
import { IPhoto } from 'src/app/commons/interfaces';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthService } from 'src/app/commons/services';
import { map, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DataTableComponent, MatToolbarModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public data: Array<IPhoto>;
  public userName: string;
  public isLoading: boolean;

  private destroy$: Subject<void>;

  public constructor(private homeService: HomeService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userName = '';
    this.data = new Array<IPhoto>;
    this.isLoading = false;
    this.destroy$ = new Subject<void>();
  }
  
  public ngOnInit(): void {
    this.authService.currentUser$.pipe(
      map(r => r?.fullName),
      takeUntil(this.destroy$)
    ).subscribe(r => r ? this.userName = r : this.userName = JSON.parse(localStorage.getItem('dataUser') as string).fullName);
    this.getDataList();
  }

  public onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private getDataList(): void {
    this.isLoading = true;
    this.homeService.getDataList().pipe(takeUntil(this.destroy$)).subscribe(arr => {
      this.data = arr;
      this.isLoading = false;
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    console.log('Component Home is destroyed')
  }

}
