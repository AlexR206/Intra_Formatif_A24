import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

export const catGuard: CanActivateFn = (route, state) => {
  // Get the stored user information
  const userString = localStorage.getItem('user');
  
  // If no user found, redirect to login (backup check)
  if (!userString) {
    return createUrlTreeFromSnapshot(route, ['/login']);
  }
  
  // Parse the user string into an object
  const user = JSON.parse(userString);
  
  // If the user does NOT prefer cats, redirect to the dog page
  if (!user.prefercat) {
    return createUrlTreeFromSnapshot(route, ['/dog']);
  }
  
  // Otherwise, user can access the cat page
  return true;
};
