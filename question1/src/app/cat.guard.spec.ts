import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { catGuard } from './cat.guard';

describe('catGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => catGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
