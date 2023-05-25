import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { AllPostComponent } from './post/all-post/all-post.component';
import { NewPostComponent } from './post/new-post/new-post.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserAccountComponent } from './user/user-account/user-account.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MeetingComponent } from './meeting/meeting.component';
import { HomeComponent } from './home/home/home.component';
import { PostsComponent } from './home/posts/posts.component';
import { SingleUserComponent } from './home/single-user/single-user.component';
import { PostCardComponent } from './layouts/post-card/post-card.component';
import { UserCardComponent } from './layouts/user-card/user-card.component';
import { CategoryNavbarComponent } from './layouts/category-navbar/category-navbar.component';
import { SingleCategoryComponent } from './home/single-category/single-category.component';
import { SinglePostComponent } from './home/single-post/single-post.component';
import { RatingComponent } from './rating/rating.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    CategoriesComponent,
    AllPostComponent,
    NewPostComponent,
    LoginComponent,
    RegisterComponent,
    UserAccountComponent,
    CalendarComponent,
    MeetingComponent,
    HomeComponent,
    PostsComponent,
    SingleUserComponent,
    PostCardComponent,
    UserCardComponent,
    CategoryNavbarComponent,
    SingleCategoryComponent,
    SinglePostComponent,
    RatingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    AngularEditorModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    NgMultiSelectDropDownModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
