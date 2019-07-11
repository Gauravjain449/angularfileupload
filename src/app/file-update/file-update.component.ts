import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-file-update',
  templateUrl: './file-update.component.html',
  styleUrls: ['./file-update.component.css']
})
export class FileUpdateComponent implements OnInit {

  _colName: string = '';
  _mongoCols = [];
  _mongoDocs = [];
  _trackData = [];

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
      this._colName = e.target.value;
      let id = -1;
      let limit = 1;
      let isRecordsExist = true;
      let data = [];
      while (isRecordsExist) {
        await this.getMongoDocs(id, limit, e.target.value).then((res) => {
          if (res['data'].length == 0)
            return isRecordsExist = false;
          id = res['data'][res['data'].length - 1]['_id'];
          if (id === 0) {
            limit = parseInt(res['data'][res['data'].length - 1]['chunk_size']);
          }
          else {
            data.push(res['data']);
          }
        })
      }
      this._mongoDocs = [].concat.apply([], data);
      // console.log(this._mongoDocs);
      // console.log(this._mongoDocs.length);
      // var merged = [].concat.apply([], this._mongoDocs);

      // console.log(merged);
      // if (this._mongoDocs.length > 0)
      //   this._mongoDocs = this._mongoDocs.reduce(function (a, b) {
      //     return a.concat(b);
      //   });

      // this._cloneDocsData = this._mongoDocs.slice(0, this._pageSize);

      // // Set _paginationCount for default
      // this._paginationCount = this.get_paginationCount(this._mongoDocs.length);


      // this._mongoDocsCol = Object.keys(this._cloneDocsData[0]).map((key) => {
      //   return {
      //     headerName: key,
      //     field: key
      //   }
      // });

    }
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











  async receiveMessage($event) {
    console.log($event);
    await this.getTitle($event, this._colName).then((res) => {
      console.log(res);
    })
  }
  async onSubmit() {
    //console.log(this._trackData);
    // await this.getTitle(this._trackData, this._colName).then((res) => {
    //   console.log(res);
    // })
  }

  getTitle = (data, mongoColName) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: 'http://localhost:5000/updelrecords', headers: {},
        data: {
          foo: data,
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
}
