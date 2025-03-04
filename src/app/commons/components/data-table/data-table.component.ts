import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableDataSourcePaginator, MatTableModule} from '@angular/material/table';
import { IPhoto } from '../../interfaces';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements AfterViewInit, OnChanges {
  @Input() data!: Array<IPhoto>;

  public displayedColumns: string[] = ['id', 'title', 'albumID', 'url'];
  public dataSource = new MatTableDataSource<IPhoto>;

  @ViewChild(MatPaginator) paginator!: MatTableDataSourcePaginator;

  constructor() {
    this.dataSource = new MatTableDataSource<IPhoto>();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].currentValue) {
      this.dataSource.data = this.data;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
