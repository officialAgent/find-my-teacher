import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  permalink: string = '';
  defaultURL: any = './assets/placeholder-image.jpg';
  imgSrc: any = this.defaultURL;
  selectedImg: any;
  categories: Array<any>;
  postForm: FormGroup;
  post: any;
  formStatus: string = 'Add New';
  docId: string;

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((val) => {
      this.docId = val['id'];

      if (this.docId) {
        this.postService.loadOneData(val['id']).subscribe((post) => {
          this.post = post;

          this.postForm = this.fb.group({
            title: [
              this.post.title,
              [Validators.required, Validators.minLength(10)],
            ],
            permalink: [this.post.permalink, Validators.required],
            excerpt: [
              this.post.excerpt,
              [Validators.required, Validators.minLength(10)],
            ],
            category: [
              `${this.post.category.categoryId}-${this.post.category.category}`,
              Validators.required,
            ],
            postImg: ['', Validators.required],
            content: [this.post.content, Validators.required],
          });
          this.postForm.get('permalink').disable();
          this.imgSrc = this.post.postImgPath;
          this.formStatus = 'Edit';
        });
      } else {
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: ['', Validators.required],
          excerpt: ['', [Validators.required, Validators.minLength(10)]],
          category: ['', Validators.required],
          postImg: ['', Validators.required],
          content: ['', Validators.required],
        });
        this.postForm.get('permalink').disable();
      }
    });
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val) => {
      this.categories = val;
    });
  }

  get fc() {
    return this.postForm.controls;
  }

  onSubmit() {
    console.log('on submit');
    let splited = this.postForm.value.category.split('-');

    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.getRawValue().permalink,
      category: {
        categoryId: splited[0],
        category: splited[1],
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      userId: JSON.parse(localStorage.getItem('user')).uid,
      createdAt: new Date(),
    };

    this.postService.uploadImage(
      this.selectedImg,
      postData,
      this.formStatus,
      this.docId
    );
    this.postForm.reset();
    this.imgSrc = this.defaultURL;
  }

  onTitleChanged($event) {
    const title = $event.target.value;

    this.permalink = title.replace(/\s/g, '-');
  }

  showPreview($event) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target.result;
    };

    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }
}
