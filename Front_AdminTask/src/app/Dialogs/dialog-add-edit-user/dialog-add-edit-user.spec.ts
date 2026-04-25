import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { DialogAddEditUser } from './dialog-add-edit-user';
import { UserService } from '../../Services/user';

describe('DialogAddEditUser', () => {
  let component: DialogAddEditUser;
  let fixture: ComponentFixture<DialogAddEditUser>;
  const closeSpy = vi.fn();
  const createUserSpy = vi.fn(() => of({ idUser: 1, name: 'Ana', email: 'ana@mail.com' }));
  const updateUserSpy = vi.fn(() => of({}));

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [DialogAddEditUser],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: closeSpy },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: null,
        },
        {
          provide: UserService,
          useValue: {
            createUser: createUserSpy,
            updateUser: updateUserSpy,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAddEditUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a user with form values when addUser is called', () => {
    component.userForm.patchValue({
      name: 'Ana',
      email: 'ana@mail.com',
    });

    component.addUser();

    expect(createUserSpy).toHaveBeenCalledWith({
      idUser: 0,
      name: 'Ana',
      email: 'ana@mail.com',
    });
    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('should update a user preserving idUser when editUser is called', async () => {
    await TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [DialogAddEditUser],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: closeSpy },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            idUser: 8,
            name: 'Luis',
            email: 'luis@mail.com',
          },
        },
        {
          provide: UserService,
          useValue: {
            createUser: createUserSpy,
            updateUser: updateUserSpy,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAddEditUser);
    component = fixture.componentInstance;
    await fixture.whenStable();

    component.userForm.patchValue({
      name: 'Luis Actualizado',
      email: 'luis.actualizado@mail.com',
    });

    component.editUser();

    expect(updateUserSpy).toHaveBeenCalledWith(8, {
      idUser: 8,
      name: 'Luis Actualizado',
      email: 'luis.actualizado@mail.com',
    });
    expect(closeSpy).toHaveBeenCalledWith(true);
  });
});
