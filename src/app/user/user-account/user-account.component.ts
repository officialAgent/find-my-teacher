import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UserInfoService } from 'src/app/services/user-info.service';
import Cities from '../../../assets/sk.json';

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
  cities: any = Cities;
  dropdownList = [];
  selectedItems = [];
  selectedItemsCities = [];
  dropdownListCities = [];
  dropdownSettings: IDropdownSettings;
  dropdownSettingsCities: IDropdownSettings;
  @ViewChild('popup') popup: ElementRef;

  openPopup() {
    this.popup.nativeElement.style.display = 'block';
  }

  closePopup() {
    this.popup.nativeElement.style.display = 'none';
  }
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
              [Validators.required, Validators.minLength(3)],
            ],
            lname: [this.post.lname, Validators.required],
            excerpt: [this.post.excerpt],
            role: [this.post.role, Validators.required],
            email: [this.post.email],
            phone: [this.post.phone],
            price: [this.post.price],
            category: [''],
            views: [this.post.views],
            cities: [''],
            postImg: [''],
            content: [this.post.content],
            home: [this.post.home],
            online: [this.post.online],
            group: [this.post.group],
          });
          this.imgSrc = this.post.postImgPath;
          this.formStatus = 'Edit';

          this.selectedItemsCities.push(
            this.dropdownListCities[this.post.city.cityId]
          );
        });
      } else {
        this.postForm = this.fb.group({
          fname: ['', [Validators.required, Validators.minLength(3)]],
          lname: ['', [Validators.required, Validators.minLength(3)]],
          excerpt: [''],
          role: ['', Validators.required],
          email: [JSON.parse(localStorage.getItem('user')).email],
          phone: [''],
          price: [''],
          category: [''],
          cities: [''],
          views: [''],
          postImg: ['', Validators.required],
          content: [''],
          home: [''],
          online: [''],
          group: [''],
        });
      }
    });
  }
  ngOnInit(): void {
    this.dropdownListCities = [];
    this.dropdownSettingsCities = {
      singleSelection: true,
      idField: 'citiesId',
      textField: 'item_text',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false,
    };

    this.cities.forEach((city, index) => {
      this.dropdownListCities.push({
        citiesId: index,
        item_text: city.city,
      });
    });
    this.categoryService.loadData().subscribe((val) => {
      this.categories = val;
      this.dropdownList = [];

      this.categories.forEach((category, index) => {
        this.dropdownList.push({
          categoryId: category.id,
          item_text: category.data.category,
        });
      });

      if (this.formStatus == 'Edit') {
        this.selectedItems = this.post.category;
      }

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
    let postData: User;
    // let splited = this.postForm.value.category.split('-');
    if (this.postForm.value.role == 'User') {
      postData = {
        fname: this.postForm.value.fname,
        lname: this.postForm.value.lname,
        role: this.postForm.value.role,
        category: [],
        postImgPath: '',
        excerpt: this.postForm.value.excerpt,
        content: this.postForm.value.content,
        isFeatured: false,
        views: 0,
        price: 0,
        status: 'new',
        email: '',
        phone: '',
        home: this.postForm.value.home,
        group: this.postForm.value.group,
        online: this.postForm.value.online,
        createdAt: new Date(),
        city: {
          cityId: '',
          city: '',
        },
      };
    } else {
      postData = {
        fname: this.postForm.value.fname,
        lname: this.postForm.value.lname,
        role: this.postForm.value.role,
        category: this.postForm.value.category,
        postImgPath: '',
        excerpt: this.postForm.value.excerpt,
        content: this.postForm.value.content,
        isFeatured: false,
        views: this.postForm.value.views,
        price: this.postForm.value.price,
        status: 'new',
        email: this.postForm.value.email,
        phone: this.postForm.value.phone,
        home: this.postForm.value.home,
        group: this.postForm.value.group,
        online: this.postForm.value.online,
        createdAt: new Date(),
        city: {
          cityId: this.postForm.value.cities[0].citiesId,
          city: this.cities[this.postForm.value.cities[0].citiesId],
        },
      };
    }

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
