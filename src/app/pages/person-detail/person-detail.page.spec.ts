import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDetailPage } from './person-detail.page';

describe('PersonDetailPage', () => {
  let component: PersonDetailPage;
  let fixture: ComponentFixture<PersonDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
