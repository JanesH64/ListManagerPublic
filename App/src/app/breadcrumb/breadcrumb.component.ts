import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {


  @Input()
  categoryName: string;

  @Input()
  listName: string;

  @Output()
  homeEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  categoryEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  redirectToHome() {
    this.homeEvent.emit("");
  }

  redirectToCategory() {
    this.categoryEvent.emit(this.categoryName);
  }

}
