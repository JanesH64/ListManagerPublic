import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  selectedCategory: string;
  selectedList: string;
  constructor() { }

  ngOnInit(): void {
  }

  selectCategory(categoryName: string) {
    this.selectedCategory = categoryName;
    this.selectedList = "";
  }

  selectList(listName: string) {
    this.selectedList = listName;
  }

  selectNone() {
    this.selectedCategory = "";
    this.selectedList = "";
  }

}
