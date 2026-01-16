import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalystDashboard } from './analyst-dashboard';

describe('AnalystDashboard', () => {
  let component: AnalystDashboard;
  let fixture: ComponentFixture<AnalystDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalystDashboard]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalystDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers template rendering
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render analyst dashboard text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent)
      .toContain('Analyst Dashboard');
  });
});
