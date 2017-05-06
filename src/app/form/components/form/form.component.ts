import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Form, Field } from '../../form.barrel';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @Input() public form: Form;
  @Output() public submit = new EventEmitter<Form>();
  @Output() public reset = new EventEmitter<Form>();
  @Output() public change = new EventEmitter<Form>();

  public constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public onFieldChange(field: Field) {
    if (field instanceof Field) {
      console.log(`Field "${field.name}" has changed.`);
      this.change.emit(this.form);
    }
  }

  public onSubmit() {
    this.submit.emit(this.form);
    console.log(`Form has been submitted.`);
  }

  public onReset() {
    this.reset.emit(this.form);
    console.log(`Form has been reset.`);
  }

}
