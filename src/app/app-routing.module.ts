import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUpdateComponent } from './file-update/file-update.component';

const routes: Routes = [

    { path: 'fileupload', component: FileUploadComponent },
    { path: 'updatefile', component: FileUpdateComponent },
    { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }