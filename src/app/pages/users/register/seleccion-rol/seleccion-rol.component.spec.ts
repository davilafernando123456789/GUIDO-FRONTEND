import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionRolComponent } from './seleccion-rol.component';

describe('SeleccionRolComponent', () => {
  let component: SeleccionRolComponent;
  let fixture: ComponentFixture<SeleccionRolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeleccionRolComponent]
    });
    fixture = TestBed.createComponent(SeleccionRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
