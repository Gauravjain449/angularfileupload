import { Component, Input } from '@angular/core';
import { ConfirmDialogService } from "./confirmation-dialog.service";

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: 'confirmation-dialog.component.html',
    styleUrls: ['confirmation-dialog.component.css']
})
export class ConfirmDialogComponent {
    message: any;
    constructor(
        private confirmDialogService: ConfirmDialogService
    ) { }

    ngOnInit() {
        //this function waits for a message from alert service, it gets   
        //triggered when we call this from any other component  
        this.confirmDialogService.getMessage().subscribe(message => {
            this.message = message;
        });
    }
}