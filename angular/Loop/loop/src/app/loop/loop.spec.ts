import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loop } from './loop';

describe('Loop', () => {
  let component: Loop;
  let fixture: ComponentFixture<Loop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Loop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
