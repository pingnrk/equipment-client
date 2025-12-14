import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Equipments } from './equipments';

describe('Equipments', () => {
  let component: Equipments;
  let fixture: ComponentFixture<Equipments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Equipments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Equipments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
