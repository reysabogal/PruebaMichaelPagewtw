import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Task } from '../../Interfaces/_task';
import { TaskService } from '../../Services/task';

@Component({
  selector: 'app-dialog-status-task',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './dialog-status-task.html',
  styleUrl: './dialog-status-task.css',
})
export class DialogStatusTask {
  private readonly dialogRef = inject(MatDialogRef<DialogStatusTask>);
  private readonly taskService = inject(TaskService);
  private readonly snackBar = inject(MatSnackBar);

  readonly data = inject<Task>(MAT_DIALOG_DATA);

  selectedStatus = '';
  errorMessage = '';
  statusOptions = ['Pending', 'InProgress', 'Done'];

  constructor() {
    this.selectedStatus = this.data.status || 'Pending';
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  updateStatus(): void {
    this.errorMessage = '';

    this.taskService.updateTask(this.data.id, this.selectedStatus).subscribe({
      next: (response) => {
        this.snackBar.open(
          `Estado actualizado con éxito: ${this.selectedStatus}`,
          'Cerrar',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error);
        this.snackBar.open(
          `Error: ${this.errorMessage}`,
          'Cerrar',
          { duration: 3000 }
        );
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

    return 'Error al actualizar el estado de la tarea';
  }
}
