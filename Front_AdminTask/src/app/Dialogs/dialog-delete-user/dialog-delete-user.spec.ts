import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteUser } from './dialog-delete-user';

describe('DialogDeleteUser', () => {
  let component: DialogDeleteUser;
  let fixture: ComponentFixture<DialogDeleteUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeleteUser],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogDeleteUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
