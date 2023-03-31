import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtisFormComponent } from './atis-form.component';

describe('AtisFormComponent', () => {
  let component: AtisFormComponent;
  let fixture: ComponentFixture<AtisFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtisFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
