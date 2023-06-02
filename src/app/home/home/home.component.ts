import { Component, OnInit, NgModule } from '@angular/core';
import { UserService } from 'src/app/services/home/user.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Cities from '../../../assets/sk.json';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  cities: any = Cities;
  categories: Array<any>;
  dropdownList = [];
  selectedItems = [];
  selectedItemsCities = [];
  dropdownListCities = [];
  dropdownSettings: IDropdownSettings;
  dropdownSettingsCities: IDropdownSettings;
  featuredPostsArray: Array<any>;
  latestPostsArrayOriginal: Array<any>;
  latestPostsArray: Array<any>;
  constructor(
    private userService: UserService,
    private categoryService: CategoriesService
  ) {
    this.userService.loadFeatured().subscribe((val) => {
      this.featuredPostsArray = val;
      console.log(this.featuredPostsArray);
    });
    this.userService.loadLatest().subscribe((val) => {
      this.latestPostsArray = val;
      this.latestPostsArrayOriginal = val;
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
    console.log(this.selectedItemsCities);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  searchCity() {
    this.latestPostsArray = [];
    this.latestPostsArray = this.latestPostsArrayOriginal;
    if (this.selectedItemsCities.length !== 0) {
      this.selectedItemsCities.forEach((city, index) => {
        this.latestPostsArray = this.latestPostsArrayOriginal.filter(
          (obj) => obj.data.city.cityId === city.citiesId
        );
      });
    }
  }
  searchCategory() {
    this.latestPostsArray = [];
    this.latestPostsArray = this.latestPostsArrayOriginal;
    if (this.selectedItems.length !== 0) {
      this.selectedItems.forEach((category, index) => {
        this.latestPostsArray = this.latestPostsArrayOriginal.filter((obj) =>
          obj.data.category.some((cat, index) => {
            return cat.categoryId === category.categoryId;
          })
        );
      });
    }
  }
  searchClosestCity() {
    this.latestPostsArray = [];

    this.latestPostsArray = this.latestPostsArrayOriginal;
    if (this.selectedItemsCities.length !== 0) {
      this.selectedItemsCities.forEach((city, index) => {
        let lat1 = this.cities[city.citiesId].lat;
        let lon1 = this.cities[city.citiesId].lng;

        this.latestPostsArray.forEach((user, index) => {
          let lat2 = user.data.city.city.lat;
          let lon2 = user.data.city.city.lng;

          user.data.city.dis = this.distance(lat1, lon1, lat2, lon2, 'K');
        });
      });

      this.latestPostsArray = this.latestPostsArray.sort((a, b) =>
        a.data.city.dis < b.data.city.dis ? -1 : 1
      );
    }
  }
  distance(lat1, lon1, lat2, lon2, unit) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == 'K') {
        dist = dist * 1.609344;
      }
      if (unit == 'N') {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }
}
