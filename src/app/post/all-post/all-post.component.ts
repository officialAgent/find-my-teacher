import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css'],
})
export class AllPostComponent implements OnInit {
  postArray: Array<any>;
  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.postService
      .loadData(JSON.parse(localStorage.getItem('user')).uid)
      .subscribe((val) => {
        this.postArray = val;
      });
  }

  onDelete(postImgPath, id) {
    this.postService.deleteImg(postImgPath, id);
  }
  onFeatured(id, status) {
    const featuredData = {
      isFeatured: status,
    };
    this.postService.markFeatured(id, featuredData);
  }
}
