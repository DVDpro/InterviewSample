import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatevaluesComponent } from './privatevalues.component';

describe('PrivatevaluesComponent', () => {
  let component: PrivatevaluesComponent;
  let fixture: ComponentFixture<PrivatevaluesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivatevaluesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivatevaluesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
