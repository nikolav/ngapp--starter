import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoobarComponent } from './foobar.component';

describe('FoobarComponent', () => {
  let component: FoobarComponent;
  let fixture: ComponentFixture<FoobarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoobarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoobarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
