import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-file-update',
  templateUrl: './file-update.component.html',
  styleUrls: ['./file-update.component.css']
})
export class FileUpdateComponent implements OnInit {
  _mongoCols = [];
  _mongoDocs = [];
  _mongoDocsCol = [];
  _cloneDocsData = [];
  _paginationCount: number = 5;
  _defaultPaginationCount: number = 5;
  _pageSize: number = 3;
  _numericCount: number = 0;
  _nextCounter: number = 0;
  _start: number = 0;
  _selectedPage: number = 0;

  constructor() { }

  ngOnInit() {
    axios({
      method: 'get',
      url: 'http://localhost:5000/getCollections', headers: {}
    }).then(response => {
      response.data.collections.map((x) => {
        this._mongoCols.push(x);
      });
    })
      .catch(error => {
        console.log(error.message)
      })
  }
  async onColsSelect(e) {
    if (e.target.value !== '') {
      let id = -1;
      let limit = 1;
      let isRecordsExist = true;

      while (isRecordsExist) {
        await this.getMongoDocs(id, limit, e.target.value).then((res) => {
          if (res['data'].length == 0)
            return isRecordsExist = false;
          id = res['data'][res['data'].length - 1]['_id'];
          if (id === 0) {
            limit = parseInt(res['data'][res['data'].length - 1]['chunk_size']);
          }
          else {
            this._mongoDocs.push(res['data']);
          }
        })
      }
      if (this._mongoDocs.length > 0)
        this._mongoDocs = this._mongoDocs.reduce(function (a, b) {
          return a.concat(b);
        });

      this._cloneDocsData = this._mongoDocs.slice(0, this._pageSize);
      // Set _paginationCount for default
      this._paginationCount = this.get_paginationCount(this._mongoDocs.length);


      this._mongoDocsCol = Object.keys(this._cloneDocsData[0]).map((key) => {
        return {
          headerName: key,
          field: key
        }
      });

    }
  }

  get_paginationCount(dataLength: number): number {
    console.log(dataLength / this._pageSize)
    console.log(parseInt((dataLength / this._pageSize).toString()));
    let totalCount: number = dataLength / this._pageSize;
    this._numericCount = parseInt((dataLength / this._pageSize).toString());
    this._numericCount = totalCount > this._numericCount ? (this._numericCount + 1) : this._numericCount;
    return this._numericCount < this._defaultPaginationCount ? this._numericCount : this._defaultPaginationCount;
  }

  getMongoDocs = (id: number, limit: number, colName: string) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: 'http://localhost:5000/getColDocs',
        params: {
          id: id,
          limit: limit,
          colName: colName
        }
      }).then(response => {
        return resolve(response.data)
      })
        .catch(error => {
          return reject(error.message)
        })
    })
  }
  onNextCounter() {
    this._nextCounter++;
    this._nextCounter = this._nextCounter > this._numericCount ? this._numericCount : this._nextCounter;
    this._selectedPage=4;


  }
  onPreviousCounter() {
    this._nextCounter--;
    this._nextCounter = this._nextCounter < 0 ? 0 : this._nextCounter;
    this._selectedPage=0;


  }
  onFirstSelect() {
    this._nextCounter = 0;

    this._start = this._nextCounter * this._pageSize;
    this._cloneDocsData = this._mongoDocs.slice(this._start, this._start + this._pageSize);
    this._selectedPage=0;

  }
  onLastSelect() {
    this._nextCounter = this._numericCount - 5;

    this._nextCounter = this._nextCounter < 0 ? 0 : this._nextCounter;
    this._start = (this._numericCount * this._pageSize) - this._pageSize;
    this._cloneDocsData = this._mongoDocs.slice(this._start);
    this._selectedPage=4;

  }
  pageSize(e) {
    this._nextCounter = 0;
    this._pageSize = parseInt(e.target.value);
    this._cloneDocsData = this._mongoDocs.slice(0, this._pageSize);
    this._paginationCount = this.get_paginationCount(this._mongoDocs.length);
  }
  onPageSelect(e) {
    
    this._selectedPage = parseInt(e);    
    this._start = parseInt(e + this._nextCounter) * this._pageSize;
    this._cloneDocsData = this._mongoDocs.slice(this._start, this._start + this._pageSize);

  }
}
