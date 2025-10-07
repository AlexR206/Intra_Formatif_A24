import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

export const catGuard: CanActivateFn = (route, state) => {
  const userString = localStorage.getItem('user');
  
  if (!userString) {
    return createUrlTreeFromSnapshot(route, ['/login']);
  }
  
  const user = JSON.parse(userString);
  
  if (!user.prefercat) {
    return createUrlTreeFromSnapshot(route, ['/dog']);
  }
  
  return true;
};
