import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../Interfaces/_user';
import { UserService } from '../../Services/user';

@Component({
  selector: 'app-dialog-delete-user',
  imports: [MatButtonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './dialog-delete-user.html',
  styleUrl: './dialog-delete-user.css',
})
export class DialogDeleteUser {
  private readonly dialogRef = inject(MatDialogRef<DialogDeleteUser>);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);

  readonly data = inject<User>(MAT_DIALOG_DATA);
  errorMessage = '';

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  confirmDelete(): void {
    this.errorMessage = '';

    this.userService.deleteUser(this.data.id).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error);
        this.snackBar.open(this.errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const apiError = error.error;

    if (typeof apiError === 'string' && apiError.trim()) {
      return apiError;
    }

    if (apiError?.message) {
      return apiError.message;
    }

    if (apiError?.title) {
      return apiError.title;
    }

    if (error.message) {
      return error.message;
    }

    return 'No fue posible eliminar el usuario.';
  }
}
