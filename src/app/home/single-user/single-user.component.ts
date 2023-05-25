import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/home/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css'],
})
export class SingleUserComponent implements OnInit {
  postData: any;
  similarPosts: Array<any>;
  userId: any;
  isLoggedIn$: Observable<boolean>;

  @ViewChild('popup') popup: ElementRef;

  openPopup() {
    this.popup.nativeElement.style.display = 'block';
  }

  closePopup() {
    this.popup.nativeElement.style.display = 'none';
  }
  constructor(
    private postService: UserService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}
  onSubmit(formValue) {
    formValue.user = this.userId;
    formValue.user2 = JSON.parse(localStorage.getItem('user')).uid;
    formValue.joined = false;
    formValue.accepted = false;
    console.log(formValue);
    this.postService.saveData(formValue);
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.auth.isLoggedIn();
    this.route.params.subscribe((val) => {
      this.userId = val['id'];
      this.postService.viewsCount(val['id']);
      this.postService.loadOnePost(val['id']).subscribe((post) => {
        this.postData = post;
        console.log(this.postData);
        this.loadSimilarPost(val['id']);
      });
    });
  }

  loadSimilarPost(catID) {
    this.postService.loadSimilarPost(catID).subscribe((val) => {
      this.similarPosts = val;
    });
  }
}
