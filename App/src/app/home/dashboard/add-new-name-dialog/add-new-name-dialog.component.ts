import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-name-dialog',
  templateUrl: './add-new-name-dialog.component.html',
  styleUrls: ['./add-new-name-dialog.component.scss']
})
export class AddNewNameDialogComponent implements OnInit {

  dialogAction: string = "Add";

  form: FormGroup;

  constructor(private dialogRef: MatDialogRef<AddNewNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddNewNameDialogData,
    private formBuilder: FormBuilder
    ) {
      this.form = formBuilder.group({
        name: [data.currentValue, [Validators.required]]
      })
    }

  ngOnInit(): void {
    if (this.data.currentValue) {
      this.dialogAction = "Save";
    }
  }

  close() {
    this.dialogRef.close(null);
  }

  closeAndReturnValue() {
    this.dialogRef.close(this.form.get("name")?.value);
  }

  onEnter(): void {
    if (!this.form.invalid) {
      this.closeAndReturnValue();
    }
  }

}
export interface AddNewNameDialogData {
  dialogName: string,
  currentValue: string,
  forbiddenChars: RegExp,
  maxLength: number
}
