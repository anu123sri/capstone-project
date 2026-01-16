import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { RmCreditService } from '../rm-credit.service';

@Component({
  selector: 'app-create-credit',
  standalone: true,
  templateUrl: './create-credit.html',
  styleUrls: ['./create-credit.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class CreateCreditComponent implements OnInit {

  form!: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private creditService: RmCreditService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      requestAmount: [null, [Validators.required, Validators.min(1)]],
      tenureMonths: [null, [Validators.required, Validators.min(1)]],
      purpose: ['', Validators.required]
    });

    // optional auto-fill
    this.route.queryParams.subscribe(params => {
      if (params['clientId']) {
        this.form.patchValue({ clientId: params['clientId'] });
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    this.creditService.createCreditRequest(this.form.value).subscribe({
      next: () => {
        alert('✅ Credit request submitted successfully');

        // 🔥 VERY IMPORTANT
        // redirect to view credits so RM can SEE it
        this.router.navigate(['/rm/credits']);

        this.submitting = false;
      },
      error: (err) => {
        console.error(err);
        alert('❌ Failed to submit credit request');
        this.submitting = false;
      }
    });
  }
}
