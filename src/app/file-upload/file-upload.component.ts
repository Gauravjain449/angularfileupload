import { Component, OnInit } from '@angular/core';
import Papa from 'papaparse';
import axios from 'axios';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  // _copy = [];
  _filemb: number = 0;
  _fileName = '';
  // _mongoDocsCol = [];
  _mongoDocs = [];
  _dataErrors = [];

  _dataErrorsCount = 0;
  // _showCSVDataError = false;
  // _cloneData = [];
  // customHeaders: any = [];
  // _show = false;
  // _start: number = 0;
  // _pageSize: number = 3;
  // _showAll = true;
  // _mongoCols = [];
  // _cloneDocsData = [];
  // _paginationCount: number = 5;
  // _numericCount: number = 0;
  // _defaultPaginationCount: number = 5;
  constructor() { }

  ngOnInit() {
  }
  // pageSize(e) {
  //   this._pageSize = parseInt(e.target.value);
  //   this._cloneData = this._data.slice(this._start, this._start + this._pageSize);
  // }
  // onPageSelect(e) {
  //   this._start = parseInt(e) * this._pageSize;
  //   this._cloneData = this._data.slice(this._start, this._start + this._pageSize);
  // }
  // onFirstSelect() {
  //   this._cloneData = this._data.slice(0, this._pageSize);
  // }
  // onLastSelect() {
  //   this._cloneData = this._data.slice(this._data.length - this._pageSize);
  // }
  // showError() {
  //   this._showCSVDataError = !this._showCSVDataError;
  // }
  // showErrorResults() {
  //   if (this._showAll) {
  //     this._cloneData = this._mongoDocs.slice(0, this._pageSize);
  //   }
  //   else {
  //     this._cloneData = this._mongoDocs.slice(0, this._pageSize);
  //   }

  //   this._showAll = !this._showAll;
  // }
  async onSubmit() {
    var today = new Date();
    let chunk_size: number = this._filemb <= 1.5 ? this._mongoDocs.length + 1 : (this._mongoDocs.length / (this._filemb * 2));
    // let mongoColName = this._fileName.replace(/[^-a-zA-Z0-9_ ]/g, '') + '_' + today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours() + today.getMinutes() + today.getSeconds();
    let mongoColName = this._fileName.replace(/[^-a-zA-Z0-9_ ]/g, '');
    let arrData = []
    chunk_size = 999; // Size depend on row allow per api limit request in cloud ... e.g My basic plan allow only 999 rows per request

    this._mongoDocs.unshift({ '_id': 0, 'chunk_size': chunk_size })
    console.log(this._dataErrorsCount);
    console.log(this._dataErrors);
    for (let index = 0; index < this._mongoDocs.length; index += chunk_size) {
      arrData.push(this._mongoDocs.slice(index, index + chunk_size));

    }
    for (let i = 0; i < arrData.length; i++) {
      await this.getTitle(arrData[i], i, mongoColName).then((res) => {
        console.log(res);
      })
    }
  }

  async receiveMessage($event) {
    console.log($event);
    this._mongoDocs = $event;
    var today = new Date();
    let chunk_size: number = this._filemb <= 1.5 ? this._mongoDocs.length + 1 : (this._mongoDocs.length / (this._filemb * 2));
    // let mongoColName = this._fileName.replace(/[^-a-zA-Z0-9_ ]/g, '') + '_' + today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours() + today.getMinutes() + today.getSeconds();
    let mongoColName = this._fileName.replace(/[^-a-zA-Z0-9_ ]/g, '');
    let arrData = []
    this._mongoDocs.unshift({ '_id': 0, 'chunk_size': chunk_size })
    for (let index = 0; index < this._mongoDocs.length; index += chunk_size) {
      arrData.push(this._mongoDocs.slice(index, index + chunk_size));
    }
    for (let i = 0; i < arrData.length; i++) {
      await this.getTitle(arrData[i], i, mongoColName).then((res) => {
        console.log(res);
      })
    }
  }

  getTitle = (rows, index, mongoColName) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: 'http://localhost:5000/addrecords', headers: {},
        data: {
          foo: rows,
          index: index, // This is the body part
          mongoColName: mongoColName
        }
      }).then(response => {
        return resolve(response.data)
      })
        .catch(error => {
          return reject(error.message)
        })
    })
  }

  fileChange(e) {
    let ref = this;
    ref._fileName = e.target.files[0].name;
    ref._filemb = e.target.files[0].size / 1000000;
    let i = 1;
    Papa.parse(e.target.files[0], {
      worker: ref._filemb > 50 ? true : false,
      header: true,
      step: function (row) {
        if (row.data.length === undefined) { // Skip the blank rows
          // row.data['Error'] = 'Passed';
          row.data['_id'] = i;
          if (row.errors.length > 0) {
            let err = {};
            ref._dataErrorsCount++;
            err['_id'] = i;
            err['Error'] = 'Failed:' + JSON.stringify(row.errors);
            ref._dataErrors.push(err);
            //console.log(i);
          }

          ref._mongoDocs.push(row.data);
          i++;
        }
        else {
          //console.log(row.data);
        }
      },
      complete: function () {
        console.log('Completed');
        // ref._mongoDocs = ref._csvData;
        // // Set _paginationCount for default
        // ref._paginationCount = ref.get_paginationCount(ref._mongoDocs.length);
        // ref._mongoDocsCol = Object.keys(ref._cloneDocsData[0]).map((key) => {
        //   return {
        //     headerName: key,
        //     field: key
        //   }
        // });
        // ref._mongoDocsCol = Object.keys(ref._mongoDocs[0]).map((key) => {
        //   return {
        //     headerName: key === '0' ? 'ID' : key,
        //     field: key
        //   }
        // ref._columns.push(key);     
        // });
        // ref.customHeaders = {
        //   thead: ref._columns, // the Column Name in table head.
        //   displayed: ref._columns // the data it should populate in table.
        // };
        // Object.keys(ref._data[0]).map((key) => {

        //   ref._columns.push(key);
        // });
        //console.log(ref._mongoDocsCol);
        //console.log(ref._mongoDocs);
        // ref._cloneData = ref._mongoDocs.slice(0, 3);
        // ref._show = true;
      }
    });
  }



}
