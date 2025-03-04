import { Injectable } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Injectable()
export class LoginPresenter {
    public form!: FormGroup;
    public email!: FormControl<string | null>;
    public password!: FormControl<string | null>;


    public constructor(private fb: FormBuilder) {
        this.initControlsAndValidators();
        this.initForm();
    }

    private initControlsAndValidators() {
        this.email = new FormControl(null, [Validators.required, Validators.email]);
        this.password = new FormControl(null, [Validators.required]);
    }

    private initForm() {
        this.form = this.fb.group({
            email: this.email,
            password: this.password
        });
    }
}