import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css'],
})
export class UserAccountComponent implements OnInit {
  defaultURL: any = './assets/placeholder-image.jpg';
  imgSrc: any = this.defaultURL;
  selectedImg: any;
  categories: Array<any>;
  postForm: FormGroup;
  post: any;
  formStatus: string = 'Create New';
  docId: string;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: UserInfoService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((val) => {
      this.docId = val['id'];

      if (this.docId != '') {
        this.postService.loadOneData(val['id']).subscribe((post) => {
          this.post = post;

          this.postForm = this.fb.group({
            fname: [
              this.post.fname,
              [Validators.required, Validators.minLength(5)],
            ],
            lname: [this.post.lname, Validators.required],
            excerpt: [
              this.post.excerpt,
              [Validators.required, Validators.minLength(10)],
            ],
            category: ['', Validators.required],
            postImg: [''],
            content: [this.post.content, Validators.required],
            home: [this.post.home],
            online: [this.post.online],
            group: [this.post.group],
          });
          this.imgSrc = this.post.postImgPath;
          this.formStatus = 'Edit';
        });
      } else {
        this.postForm = this.fb.group({
          fname: ['', [Validators.required, Validators.minLength(5)]],
          lname: ['', [Validators.required, Validators.minLength(5)]],
          excerpt: ['', [Validators.required, Validators.minLength(10)]],
          category: ['', Validators.required],
          postImg: ['', Validators.required],
          content: ['', Validators.required],
          home: [''],
          online: [''],
          group: [''],
        });
      }
    });
  }
  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val) => {
      this.categories = val;
      this.dropdownList = [];
      this.categories.forEach((category, index) => {
        console.log(category);
        this.dropdownList.push({
          categoryId: category.id,
          item_text: category.data.category,
        });
        if (this.formStatus == 'Edit') {
          this.selectedItems = this.post.category;
        }
      });

      console.log(this.dropdownList);

      this.dropdownSettings = {
        singleSelection: false,
        idField: 'categoryId',
        textField: 'item_text',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true,
        enableCheckAll: false,
      };
    });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  get fc() {
    return this.postForm.controls;
  }
  onSubmit() {
    console.log('on submit');

    // let splited = this.postForm.value.category.split('-');

    const postData: User = {
      fname: this.postForm.value.fname,
      lname: this.postForm.value.lname,
      category: this.postForm.value.category,
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      home: this.postForm.value.home,
      group: this.postForm.value.group,
      online: this.postForm.value.online,
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

  showPreview($event) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target.result;
    };

    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }
}
