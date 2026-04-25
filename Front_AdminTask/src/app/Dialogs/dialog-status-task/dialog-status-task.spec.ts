import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStatusTask } from './dialog-status-task';

describe('DialogStatusTask', () => {
  let component: DialogStatusTask;
  let fixture: ComponentFixture<DialogStatusTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogStatusTask],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogStatusTask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
