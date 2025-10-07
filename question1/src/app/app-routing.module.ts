import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CatComponent } from './cat/cat.component';
import { DogComponent } from './dog/dog.component';
import { authGuard } from './auth.guard';
import { catGuard } from './cat.guard';

// Importing all necessary components and guards
const routes: Routes = [
  // Redirects the empty path ("") to /login when the app first loads
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Login page (always accessible, no guard needed)
  { path: 'login', component: LoginComponent },

  // Cat page: protected by TWO guards
  //  - authGuard checks if the user is logged in
  //  - catGuard checks if the user prefers cats
  { path: 'cat', component: CatComponent, canActivate: [authGuard, catGuard]},

  // Dog page: only requires user to be logged in
  { path: 'dog', component: DogComponent, canActivate: [authGuard] },

  // Home page: only requires user to be logged in
  { path: 'home', component: HomeComponent, canActivate: [authGuard]},

  // Wildcard route: if the path doesn’t exist, redirect to /
  { path: '**', redirectTo: '/'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
