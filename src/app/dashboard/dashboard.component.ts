import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserInfoService } from '../services/user-info.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userId: string;
  userinfo: any;
  createdUser: boolean = false;
  teacher: boolean = false;
  verify: boolean = false;

  constructor(private user: UserInfoService) {}

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('user')).emailVerified) {
      this.verify = true;
    }
    console.log(JSON.parse(localStorage.getItem('user')).uid);
    this.user
      .loadOneData(JSON.parse(localStorage.getItem('user')).uid)
      .subscribe((val) => {
        console.log(val);
        if (val == null) {
          this.userId = '';
        } else {
          if (val['role'] == 'Teacher') {
            this.teacher = true;
          }
          this.createdUser = true;
          this.userId = JSON.parse(localStorage.getItem('user')).uid;
        }
      });
  }
}
