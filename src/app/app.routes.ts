import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MainComponent } from './components/main/main.component';
import { AdminMemberComponent } from './components/admin-member/admin-member.component';
import { EditComponent } from './components/edit/edit.component';
import { RankingComponent } from './components/ranking/ranking.component';

export const routes: Routes = [
    {path: '', component: MainComponent},
    {path: 'login', component: LoginComponent },
    {path: 'signup', component: SignupComponent },
    {path: 'profile', component: ProfileComponent},
    {path: 'adminMember', component: AdminMemberComponent},
    {path: 'edit', component: EditComponent},
    {path: 'ranking', component: RankingComponent},
];
