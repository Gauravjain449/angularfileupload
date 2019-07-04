import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginator, MatSort} from '@angular/material';

import {DataSource} from '@angular/cdk/collections';

import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  displayedColumns = [];
  exampleDatabase:  null;
  dataSource:  null;
  index: number;
  id: number;

  constructor() {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
   // this.loadData();
  }

  refresh() {
   // this.loadData();
  }
    public loadData() {
    this.exampleDatabase = null;
    this.dataSource = null;
    
  }
}

