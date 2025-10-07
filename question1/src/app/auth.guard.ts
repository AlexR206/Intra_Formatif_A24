import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Retrieve user data from localStorage
  const user = localStorage.getItem('user');
  //const router = inject(Router); // 👈 alternative redirection method

  // If no user is found, block access and redirect to login
  if (!user) {
    alert('You must be logged in to access this page.');
    
    
    //router.navigate(['/login']); // 👈 alternative redirection method
    //return false;

    return createUrlTreeFromSnapshot(route, ['/login']);

  }

  // If user exists, allow navigation
  return true;
};
