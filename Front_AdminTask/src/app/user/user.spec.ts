import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { UserComponent } from './user';
import { UserService } from '../Services/user';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  const openSpy = vi.fn(() => ({
    afterClosed: () => of(false),
  }));

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: openSpy,
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

    fixture = TestBed.createComponent(User);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the add user dialog when addUser is called', () => {
    const openUserDialogSpy = vi.spyOn(component, 'openUserDialog').mockImplementation(() => {});

    component.addUser();

    expect(openUserDialogSpy).toHaveBeenCalled();
  });
});
