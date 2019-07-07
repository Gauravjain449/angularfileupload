import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Papa from 'papaparse';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  _filemb: number = 0;
  _fileName = '';
  _columns = [];
  _data = [];
  _dataErrors = [];
  _showCSVDataError = false;
  _cloneData = [];
  customHeaders: any = [];
  _show = false;
  _start: number = 0;
  _pageSize: number = 3;

  constructor() { }


  ngOnInit() {
    // this.loadData();
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
  async onSubmit() {
    var today = new Date();
    let chunk_size: number = this._filemb <= 1.5 ? this._data.length : (this._data.length / (this._filemb * 2));
    // let mongoColName = this._fileName.replace(/[^-a-zA-Z0-9_ ]/g, '') + '_' + today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours() + today.getMinutes() + today.getSeconds();
    let mongoColName = this._fileName.replace(/[^-a-zA-Z0-9_ ]/g, '');
    console.log(mongoColName);
    console.log(mongoColName.length);
    let arrData = []
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
        row.data['0'] = i;
        row.data['Error'] = 'Passed';
        if (row.errors.length > 0)
          row.data['Error'] = 'Failed:' + JSON.stringify(row.errors);
        ref._data.push(row.data);
        i++;
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

