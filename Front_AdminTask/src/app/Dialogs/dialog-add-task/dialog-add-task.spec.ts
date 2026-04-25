import { of } from 'rxjs';
import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DialogAddTask } from './dialog-add-task';
import { TaskService } from '../../Services/task';
import { UserService } from '../../Services/user';

describe('DialogAddTask', () => {
  let component: DialogAddTask;
  let fixture: ComponentFixture<DialogAddTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddTask],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: vi.fn() },
        },
        {
          provide: TaskService,
          useValue: {
            createTask: () => of({}),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUsers: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAddTask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate user selection correctly', () => {
    component.taskForm.markAllAsTouched();
    expect(component.taskForm.controls.userId.hasError('required')).toBe(true);

    component.taskForm.patchValue({
      title: 'Tarea',
      description: 'Descripcion',
      userId: 1,
    });

    expect(component.taskForm.controls.userId.hasError('required')).toBe(false);
    expect(component.taskForm.valid).toBe(true);
  });

  it('should assign the selected user id to the form control', () => {
    component.onUserSelection({ value: '7' } as MatSelectChange);

    expect(component.taskForm.controls.userId.value).toBe(7);
  });
});
