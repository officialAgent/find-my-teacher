import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CategoriesComponent } from './categories/categories.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AllPostComponent } from './post/all-post/all-post.component';
import { NewPostComponent } from './post/new-post/new-post.component';
import { AuthGuard } from './services/auth.guard';
import { UserAccountComponent } from './user/user-account/user-account.component';
import { MeetingComponent } from './meeting/meeting.component';
import { HomeComponent } from './home/home/home.component';
import { SingleCategoryComponent } from './home/single-category/single-category.component';
import { SinglePostComponent } from './home/single-post/single-post.component';
import { SingleUserComponent } from './home/single-user/single-user.component';
import { PostsComponent } from './home/posts/posts.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'userboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'account', component: UserAccountComponent },
  { path: 'booking', component: CalendarComponent },
  { path: 'meeting', component: MeetingComponent },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [AuthGuard],
  },
  { path: 'posts', component: AllPostComponent, canActivate: [AuthGuard] },
  { path: 'posts/new', component: NewPostComponent, canActivate: [AuthGuard] },

  { path: 'category/:category/:id', component: SingleCategoryComponent },
  { path: 'allposts', component: PostsComponent },
  { path: 'post/:id', component: SinglePostComponent },
  { path: 'user/:id', component: SingleUserComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'user/:id', component: SingleUserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
