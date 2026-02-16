import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutComputedSignal } from './without-computed-signal';

describe('WithoutComputedSignal', () => {
  let component: WithoutComputedSignal;
  let fixture: ComponentFixture<WithoutComputedSignal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithoutComputedSignal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithoutComputedSignal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
