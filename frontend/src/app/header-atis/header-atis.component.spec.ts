import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAtisComponent } from './header-atis.component';

describe('HeaderAtisComponent', () => {
  let component: HeaderAtisComponent;
  let fixture: ComponentFixture<HeaderAtisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderAtisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderAtisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
