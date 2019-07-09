import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { JSONTableModule } from 'angular-json-table';  // import the Module.
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule }     from './app-routing.module';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUpdateComponent } from './file-update/file-update.component';
import { PipeNumber } from './pipe/pipe.number';





@NgModule({
  declarations: [
    AppComponent,
  
    FileUploadComponent,
    FileUpdateComponent,
    PipeNumber   
  ],
  imports: [
    BrowserModule,   
    BrowserAnimationsModule,   
    FormsModule,   
    AppRoutingModule, 
    ReactiveFormsModule,
    AgGridModule.withComponents([]) ,
    JSONTableModule
    
   
  ],
  entryComponents: [
  
  ],
  providers: [
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }