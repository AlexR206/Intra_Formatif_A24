import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

// --- 1️⃣ Custom validator for postal code ---
export function postalCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // if empty, it's optional — no error
    const regex = /^[A-Z][0-9][A-Z][ ]?[0-9][A-Z][0-9]$/;
    return regex.test(value) ? null : { invalidPostal: true };
  };
}

// --- 2️⃣ Custom validator to check comment has at least 10 words ---
export function minWordsValidator(minWords: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // optional
    const words = value.trim().split(/\s+/); // split on spaces
    return words.length >= minWords ? null : { notEnoughWords: true };
  };
}

// --- 3️⃣ Validator for entire form: comment must not contain the name ---
export function commentNotContainName(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const name = control.get('name')?.value;
    const comment = control.get('comments')?.value;

    if (!name || !comment) return null; // only check when both exist

    if (comment.toLowerCase().includes(name.toLowerCase())) {
      // Add the error to the comments field
      control.get('comments')?.setErrors({ ...control.get('comments')?.errors, nameInComment: true });
      return { nameInComment: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
  ],
})
export class AppComponent {
  title = 'reactive.form';
  formGroup: FormGroup; // holds all form controls

  constructor(private formBuilder: FormBuilder) {
    // --- 🧱 Build the form group ---
    this.formGroup = this.formBuilder.group(
      {
        name: ['', [Validators.required]], // required
        roadnumber: ['',[Validators.required, Validators.min(1000), Validators.max(9999)],], // required, between 1000 and 9999
        street: [''], // no validation required
        postalcode: ['', [postalCodeValidator()]], // optional, but must match regex if filled
        comments: ['', [minWordsValidator(10)]], // optional, but must have >=10 words
      },
      { validators: commentNotContainName() } // group-level validator
    );
  }
}
