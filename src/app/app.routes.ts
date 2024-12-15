import { Routes } from '@angular/router';
import {MainPageComponent} from "../main-page/main-page.component";
import {LoginPageComponent} from "../login-page/login-page.component";

export const routes: Routes = [
  {path: '',  component: MainPageComponent},
  {path: 'login', component: LoginPageComponent}
];
