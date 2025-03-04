import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from 'src/app/commons/services/home';
import { DataTableComponent } from 'src/app/commons/components';
import { IPhoto } from 'src/app/commons/interfaces';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DataTableComponent, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public data: Array<IPhoto>;

  public constructor(private homeService: HomeService) {
    this.data = new Array<IPhoto>;
  }
  
  ngOnInit(): void {
    this.getDataList();
  }

  getDataList(): void {
    this.homeService.getDataList().subscribe(arr => this.data = arr);
  }

}
