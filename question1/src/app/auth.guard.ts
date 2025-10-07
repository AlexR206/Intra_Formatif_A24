import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('user');
  if (!user) {
    alert('You must be logged in to access this page.');
    return createUrlTreeFromSnapshot(route, ['/login']);
  }
  
  return true;
};
