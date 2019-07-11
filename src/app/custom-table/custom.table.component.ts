import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import axios from 'axios';


@Component({
    selector: 'app-custom-table',
    templateUrl: './custom.table.component.html',
    styleUrls: ['./custom.table.component.css']
})
export class CustomTable implements OnInit {
    @Input() _mongoDocs;
    @Input() formType: string;
    @Output() messageEvent = new EventEmitter<any>();
    _pageSize: number = 3;
    _numericCount: number = 0;
    _defaultPaginationCount: number = 5;
    _editRowNumber: number = -1;
    _nextCounter: number = 0;
    _selectedPage: number = 0;
    _start: number = 0;
    _cloneDocsData = [];
    _mongoDocsCol = [];
    _paginationCount: number = 5;
    _copy = [];
    _trackData = [];
    ngOnInit() {


        this._cloneDocsData = this._mongoDocs.slice(0, this._pageSize);
        // Set _paginationCount for default
        this._paginationCount = this.get_paginationCount(this._mongoDocs.length);
        this._mongoDocsCol = Object.keys(this._cloneDocsData[0]).map((key) => {
            return {
                headerName: key,
                field: key
            }
        });
        //console.log(this._mongoDocs);
    }

    constructor(private confirmDialogService: ConfirmDialogService) {

    }

    get_paginationCount(dataLength: number): number {
        const totalCount: number = dataLength / this._pageSize;
        this._numericCount = parseInt((dataLength / this._pageSize).toString());
        this._numericCount = totalCount > this._numericCount ? (this._numericCount + 1) : this._numericCount;
        return this._numericCount < this._defaultPaginationCount ? this._numericCount : this._defaultPaginationCount;
    }

    onNextCounter() {
        if (this._editRowNumber !== -1) {
            alert('Please save or cancel');
            return;
        }
        this._nextCounter++;
        this._nextCounter = this._nextCounter > this._numericCount ? this._numericCount : this._nextCounter;
        this._selectedPage = 4;
        this._start = (this._nextCounter + 4) * this._pageSize;
        this._cloneDocsData = this._mongoDocs.slice(this._start, this._start + this._pageSize);
    }

    onPreviousCounter() {
        if (this._editRowNumber !== -1) {
            alert('Please save or cancel');
            return;
        }
        this._nextCounter--;
        this._nextCounter = this._nextCounter < 0 ? 0 : this._nextCounter;
        this._selectedPage = 0;
        this._start = (this._nextCounter) * this._pageSize;
        this._cloneDocsData = this._mongoDocs.slice(this._start, this._start + this._pageSize);
    }

    onFirstSelect() {
        if (this._editRowNumber !== -1) {
            alert('Please save or cancel');
            return;
        }
        this._nextCounter = 0;
        this._start = this._nextCounter * this._pageSize;
        this._cloneDocsData = this._mongoDocs.slice(this._start, this._start + this._pageSize);
        this._selectedPage = 0;
    }
    onLastSelect() {
        if (this._editRowNumber !== -1) {
            alert('Please save or cancel');
            return;
        }
        this._nextCounter = this._numericCount - 5;
        this._nextCounter = this._nextCounter < 0 ? 0 : this._nextCounter;
        this._start = (this._numericCount * this._pageSize) - this._pageSize;
        this._cloneDocsData = this._mongoDocs.slice(this._start);
        this._selectedPage = 4;
    }

    pageSize(e) {
        this._nextCounter = 0;
        this._pageSize = parseInt(e.target.value);
        this._cloneDocsData = this._mongoDocs.slice(0, this._pageSize);
        this._paginationCount = this.get_paginationCount(this._mongoDocs.length);
    }

    onPageSelect(e) {
        if (this._editRowNumber !== -1) {
            alert('Please save or cancel');
            return;
        }
        this._selectedPage = parseInt(e);
        this._start = parseInt(e + this._nextCounter) * this._pageSize;
        this._cloneDocsData = this._mongoDocs.slice(this._start, this._start + this._pageSize);
    }

    // Action Code

    OnEdit(e: any) {
        if (this._editRowNumber !== -1) {
            alert('Please save or cancel');
            return;
        }
        this._copy = Object.assign({}, e);
        this._editRowNumber = e._id;
    }

    OnDelete(e: any, index: number) {
        if (this._editRowNumber !== -1) {
            alert('Please save or cancel');
            return;
        }
        let ref = this;
        this.confirmDialogService.confirmThis("Are you sure to delete?", function () {
            let ee = Object.assign({}, e);
            ee['isDeleted'] = true;
            ref._trackData.push(ee);

            const data = [...ref._mongoDocs];
            let holdIndex: number = data.indexOf(e) - index;

            data.splice(data.indexOf(e), 1);
            ref._mongoDocs = data;
            ref._cloneDocsData = ref._mongoDocs.slice(holdIndex, holdIndex + ref._pageSize);

            if (ref._cloneDocsData.length === 0) {
                console.log(ref._cloneDocsData.length);
                holdIndex = holdIndex - ref._pageSize;
                ref._cloneDocsData = ref._mongoDocs.slice(holdIndex, holdIndex + ref._pageSize);

            }

            // this._nextCounter = this._numericCount - 5;

            // this._nextCounter = this._nextCounter < 0 ? 0 : this._nextCounter;
            // console.log(this._nextCounter);

            let a = ref._numericCount;
            ref._paginationCount = ref.get_paginationCount(ref._mongoDocs.length);
            let b = ref._numericCount;
            ref._nextCounter = ref._nextCounter - (a - b);
            ref._nextCounter = ref._nextCounter < 0 ? 0 : ref._nextCounter;
            // console.log(this._paginationCount);
            // console.log(this._numericCount);

        }, function () {
            ref._editRowNumber = -1;
            //alert("No clicked");
        })



    }

    OnCancel(index) {
        const data = [...this._cloneDocsData];
        data[index] = this._copy;
        this._cloneDocsData = data;
        this._editRowNumber = -1;
    }

    OnSave(d: any) {
        let ee = Object.assign({}, d);
        ee['isDeleted'] = false;
        this._trackData.push(ee);
        this._editRowNumber = -1;
    }
    onUpdateSubmit() {
        this.messageEvent.emit(this._trackData)
        //this.messageEvent.emit(this._mongoDocs)
    }
    async onAddSubmit() {
        // this.messageEvent.emit(this._mongoDocs)
        var today = new Date();
        let chunk_size: number = 4000;//this._filemb <= 1.5 ? this._mongoDocs.length + 1 : (this._mongoDocs.length / (this._filemb * 2));
        // let mongoColName = this._fileName.replace(/[^-a-zA-Z0-9_ ]/g, '') + '_' + today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours() + today.getMinutes() + today.getSeconds();
        let mongoColName = 'XYZ';//this._fileName.replace(/[^-a-zA-Z0-9_ ]/g, '');
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


}