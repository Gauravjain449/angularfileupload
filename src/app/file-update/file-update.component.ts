import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-file-update',
  templateUrl: './file-update.component.html',
  styleUrls: ['./file-update.component.css']
})
export class FileUpdateComponent implements OnInit {
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
    axios({
      method: 'get',
      url: 'http://localhost:5000/getCollections', headers: {}
    }).then(response => {
      response.data.collections.map((x) => {
        this._mongoCols.push(x);
      })
      console.log(this._mongoCols);
      console.log(response.data);
    })
      .catch(error => {
        console.log(error.message)
      })
  }
  async onColsSelect(e) {
    if (e.target.value !== '') {
      console.log(e.target.value);
      // axios({
      //   method: 'get',
      //   url: 'http://localhost:5000/getColDocs',
      //   params: {
      //     first: 1,
      //     last: 5000 // This is the body part          
      //   }
      // }).then(response => {
      //   console.log(response);
      // });
      //   this._mongoDocs = response.data.data;
      //   this._cloneDocsData = this._mongoDocs.slice(0, 3);
      //   this._mongoDocsCol = Object.keys(this._mongoDocs[0]).map((key) => {
      //     return {
      //       headerName: key,
      //       field: key
      //     }
      //   });
      //   console.log(this._mongoDocsCol);
      //   console.log(this._mongoDocs);
      // })
      //   .catch(error => {
      //     console.log(error.message)
      //   })

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
            console.log(limit);
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
      console.log(this._mongoDocs);

      this._cloneDocsData = this._mongoDocs.slice(0, 3);
      this._mongoDocsCol = Object.keys(this._cloneDocsData[0]).map((key) => {
        return {
          headerName: key,
          field: key
        }
      });
      // console.log(this._mongoDocsCol);
      // console.log(this._mongoDocs.flat());

    }
  }

  getMongoDocs = (id, limit, colName) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: 'http://localhost:5000/getColDocs',
        params: {
          id: id,
          limit: limit, // This is the body part    
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
}
