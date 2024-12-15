import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollListComponent } from './scroll-list.component';

describe('ScrollListComponent', () => {
  let component: ScrollListComponent;
  let fixture: ComponentFixture<ScrollListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
