import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router
  ) {}

  login(email, password) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((legref) => {
        this.toastr.success('Logged in Successfully');
        this.loadUser();
        this.loggedIn.next(true);
        this.isLoggedInGuard = true;
        this.router.navigate(['/']);
      })
      .catch((e) => {
        this.toastr.warning(e);
      });
  }

  register(email, password) {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((legref) => {
        this.sendEmailVerification(email, password);
      })
      .catch((e) => {
        this.toastr.warning(e);
      });
  }
  sendEmailVerification(email, password) {
    this.afAuth.user.subscribe((user) => {
      if (user) {
        user
          .sendEmailVerification()
          .then(() => {
            this.toastr.success(
              'Registration successful. Please check your email for verification.'
            );
            // Automatically login after registration (optional)
            this.login(email, password);
          })
          .catch((error) => {
            // Handle email verification errors
            this.toastr.warning(error.message);
          });
      }
    });
  }
  loadUser() {
    this.afAuth.authState.subscribe((user) => {
      localStorage.setItem('user', JSON.stringify(user));
    });
  }

  logOut() {
    this.afAuth.signOut().then(() => {
      this.toastr.success('Logged out  Successfully');
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.isLoggedInGuard = false;
      this.router.navigate(['/']);
    });
  }
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  userLoggedin() {
    this.afAuth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.loggedIn.next(true);
        this.isLoggedInGuard = true;
      } else {
        this.loggedIn.next(false);
        this.isLoggedInGuard = false;
      }
    });
  }
}
