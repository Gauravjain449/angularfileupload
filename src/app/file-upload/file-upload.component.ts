import { Component, OnInit } from '@angular/core';
import Papa from 'papaparse';
import axios from 'axios';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  _filemb: number = 0;
  _fileName = '';
  _columns = [];
  _data = [];
  _dataErrorsCount = 0;
  _showCSVDataError = false;
  _cloneData = [];
  customHeaders: any = [];
  _show = false;
  _start: number = 0;
  _pageSize: number = 3;
  _showAll = true;
  _mongoCols = [];
  _mongoDocs = [];
  _mongoDocsCol = [];
  _cloneDocsData = [];
  constructor() { }

  ngOnInit() {
  }
  pageSize(e) {
    this._pageSize = parseInt(e.target.value);
    this._cloneData = this._data.slice(this._start, this._start + this._pageSize);
  }
  onPageSelect(e) {
    this._start = parseInt(e) * this._pageSize;
    this._cloneData = this._data.slice(this._start, this._start + this._pageSize);
  }
  onFirstSelect() {
    this._cloneData = this._data.slice(0, this._pageSize);
  }
  onLastSelect() {
    this._cloneData = this._data.slice(this._data.length - this._pageSize);
  }
  showError() {
    this._showCSVDataError = !this._showCSVDataError;
  }
  showErrorResults() {
    if (this._showAll) {
      this._cloneData = this._data.slice(0, this._pageSize);
    }
    else {
      this._cloneData = this._data.slice(0, this._pageSize);
    }

    this._showAll = !this._showAll;
  }
  async onSubmit() {
    var today = new Date();
    let chunk_size: number = this._filemb <= 1.5 ? this._data.length + 1 : (this._data.length / (this._filemb * 2));
    // let mongoColName = this._fileName.replace(/[^-a-zA-Z0-9_ ]/g, '') + '_' + today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours() + today.getMinutes() + today.getSeconds();
    let mongoColName = this._fileName.replace(/[^-a-zA-Z0-9_ ]/g, '');
    let arrData = []
    this._data.unshift({ '_id': 0, 'chunk_size': chunk_size })
    for (let index = 0; index < this._data.length; index += chunk_size) {
      arrData.push(this._data.slice(index, index + chunk_size));
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
        if (row.data.length === undefined) {
          row.data['Error'] = 'Passed';
          if (row.errors.length > 0) {
            ref._dataErrorsCount++;
            row.data['Error'] = 'Failed:' + JSON.stringify(row.errors);
            console.log(i);
          }
          row.data['_id'] = i;
          ref._data.push(row.data);
          i++;
        }
        else {
          console.log(row.data);
        }
      },
      complete: function () {
        ref._columns = Object.keys(ref._data[0]).map((key) => {
          return {
            headerName: key === '0' ? 'ID' : key,
            field: key
          }
          // ref._columns.push(key);     
          // });
          // ref.customHeaders = {
          //   thead: ref._columns, // the Column Name in table head.
          //   displayed: ref._columns // the data it should populate in table.
          // };
          // Object.keys(ref._data[0]).map((key) => {

          //   ref._columns.push(key);
        });
        console.log(ref._columns);
        console.log(ref._data);
        ref._cloneData = ref._data.slice(0, 3);
        ref._show = true;
      }
    });
  }


}
