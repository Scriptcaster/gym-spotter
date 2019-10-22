import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    animal: string;
    name: string;
}

@Component({
    selector: 'dialog-new-exercise',
    templateUrl: 'dialog-new-exercise.html',
})
export class DialogNewExercise {

    constructor(
        public dialogRef: MatDialogRef<DialogNewExercise>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
