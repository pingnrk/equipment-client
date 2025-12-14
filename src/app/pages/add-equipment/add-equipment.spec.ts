import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEquipment } from './add-equipment';

describe('AddEquipment', () => {
  let component: AddEquipment;
  let fixture: ComponentFixture<AddEquipment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEquipment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEquipment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
