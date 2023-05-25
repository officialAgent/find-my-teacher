import { Component } from '@angular/core';
import { PostsService } from 'src/app/services/home/posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent {
  featuredPostsArray: Array<any>;
  latestPostsArray: Array<any>;
  constructor(private postService: PostsService) {
    this.postService.loadFeatured().subscribe((val) => {
      this.featuredPostsArray = val;
    });
    this.postService.loadLatest().subscribe((val) => {
      this.latestPostsArray = val;
    });
  }
}
