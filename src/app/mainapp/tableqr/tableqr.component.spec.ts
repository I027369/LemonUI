import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableqrComponent } from './tableqr.component';

describe('TableqrComponent', () => {
  let component: TableqrComponent;
  let fixture: ComponentFixture<TableqrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableqrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
