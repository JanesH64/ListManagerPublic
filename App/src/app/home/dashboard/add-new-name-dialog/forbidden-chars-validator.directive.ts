import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
    selector: '[appForbiddenChars]',
    providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenCharsDirective, multi: true}]
  })
export class ForbiddenCharsDirective implements Validator {
    @Input('appForbiddenChars') forbiddenCharsRegex: RegExp;

    validate(control: AbstractControl): ValidationErrors | null {
        if (!this.forbiddenCharsRegex)
        {
            return null;
        }
        const forbidden = this.forbiddenCharsRegex.test(control.value);
        const chars = this.forbiddenCharsRegex.exec(control.value);
        return forbidden ? {forbiddenChar: {value: `Invalid characters found: '${chars}'.`}} : null;
    }
}