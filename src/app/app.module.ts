import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { JSONTableModule } from 'angular-json-table';  // import the Module.
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from './app-routing.module';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUpdateComponent } from './file-update/file-update.component';
import { PipeNumber } from './pipe/pipe.number';
import { ConfirmDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmDialogService } from './confirmation-dialog/confirmation-dialog.service';





@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    FileUpdateComponent,
    PipeNumber,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
    JSONTableModule


  ],
  entryComponents: [

  ],
  providers: [
    ConfirmDialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }