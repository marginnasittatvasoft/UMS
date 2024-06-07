import { FormControl } from '@angular/forms';

export type loginForm = {
    userName: FormControl<string | null>;
    password: FormControl<string | null>;
};
