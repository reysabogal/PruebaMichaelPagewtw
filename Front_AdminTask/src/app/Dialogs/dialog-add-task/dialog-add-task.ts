import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { User } from '../../Interfaces/_user';
import { TaskService } from '../../Services/task';
import { UserService } from '../../Services/user';

@Component({
  selector: 'app-dialog-add-task',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-add-task.html',
  styleUrl: './dialog-add-task.css',
})
export class DialogAddTask {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<DialogAddTask>);
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);

  readonly taskForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    userId: [null as number | null, [Validators.required]],
  });

  users: User[] = [];

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users.map((user) => ({
          id: Number(user.id) || 0,
          name: user.name || '',
          email: user.email || '',
        }));
      },
      error: (error) => {
        console.error('Error al obtener usuarios', error);
        this.users = [];
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  onUserSelection(event: MatSelectChange): void {
    const selectedUserId = Number(event.value);
    this.taskForm.controls.userId.setValue(Number.isNaN(selectedUserId) ? null : selectedUserId);
  }

  addTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.getRawValue();
    const additionalData = JSON.stringify({
      priority: 'High',
      estimatedDate: new Date().toISOString(),
    });
    console.log('Formulario válido, creando tarea con datos:', {
      title: formValue.title,
      description: formValue.description,
      userId: formValue.userId,
      additionalData
    });

    this.taskService
      .createTask({
        id: 0,
        title: formValue.title ?? '',
        description: formValue.description ?? '',
        status: 'Pending',
        userId: Number(formValue.userId),
        additionalData: additionalData,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error('Error al registrar la tarea', error),
      });
  }
}
