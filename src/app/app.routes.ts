import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MainComponent } from './components/main/main.component';
import { AdminMemberComponent } from './components/admin-member/admin-member.component';

export const routes: Routes = [
    {path: '', component: LoginComponent },
    {path: 'signup', component: SignupComponent },
    {path: 'main', component: MainComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'adminMember', component: AdminMemberComponent},
];
