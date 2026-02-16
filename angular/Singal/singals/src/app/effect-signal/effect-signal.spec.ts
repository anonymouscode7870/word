import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectSignal } from './effect-signal';

describe('EffectSignal', () => {
  let component: EffectSignal;
  let fixture: ComponentFixture<EffectSignal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EffectSignal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EffectSignal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
