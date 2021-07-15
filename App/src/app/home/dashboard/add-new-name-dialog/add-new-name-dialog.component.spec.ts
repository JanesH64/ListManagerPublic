import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewNameDialogComponent } from './add-new-name-dialog.component';

describe('AddCategoryDialogComponent', () => {
  let component: AddNewNameDialogComponent;
  let fixture: ComponentFixture<AddNewNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewNameDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
