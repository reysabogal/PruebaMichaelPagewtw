import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../Interfaces/_user';
import { UserService } from '../../Services/user';

@Component({
  selector: 'app-dialog-add-edit-user',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-add-edit-user.html',
  styleUrl: './dialog-add-edit-user.css',
})
export class DialogAddEditUser {
  readonly isEditMode: boolean;
  readonly userForm;
  private userData: User;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogAddEditUser>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) userData: User
  )     
  {
    this.userData = userData;
    this.isEditMode = !!this.userData;
    this.userForm = this.formBuilder.nonNullable.group({
     // idUser: [this.userData?.idUser ?? 0],
      name: [this.userData?.name ?? '', [Validators.required]],
      email: [this.userData?.email ?? '', [Validators.required, Validators.email]],
    });
    
  }   
    

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  addUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();
    const newUser: User = {
      id: 0,
      name: formValue.name,
      email: formValue.email,
    };

    this.userService.createUser(newUser).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error) => console.error('Error al crear usuario', error),
    });
  }

  editUser(): void {
    if (!this.userData) {
      this.addUser();
      return;
    }

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();

    const updatedUser: User = {
      id: this.userData.id,
      name: formValue.name,
      email: formValue.email,
    };
    console.log('Updating user with data:', updatedUser);
    console.log('User ID being updated:',this.userData.id);
    this.userService.updateUser(this.userData.id, updatedUser).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error) => console.error('Error al actualizar usuario', error),
    });
  }
}
