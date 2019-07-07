import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { JSONTableModule } from 'angular-json-table';  // import the Module.
import { AgGridModule } from 'ag-grid-angular';





@NgModule({
  declarations: [
    AppComponent,
   
  ],
  imports: [
    BrowserModule,   
    BrowserAnimationsModule,   
    FormsModule,    
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