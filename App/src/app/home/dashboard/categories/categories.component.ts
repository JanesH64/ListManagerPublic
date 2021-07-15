import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, Observable } from 'rxjs';
import { CategoriesListService } from 'src/app/services/categories-list.service';
import {MatDialog} from '@angular/material/dialog';
import { AddNewNameDialogComponent, AddNewNameDialogData } from '../add-new-name-dialog/add-new-name-dialog.component';
import { filter, map, merge, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  @Output()
  selectedCategory: EventEmitter<string> = new EventEmitter<string>();

  constructor(private categoriesListService: CategoriesListService,
    private dialog: MatDialog) { }

  categories$: Observable<string[]>;
  reload$: BehaviorSubject<any> = new BehaviorSubject({});

  ngOnInit(): void {
    this.getCategories();
    this.reload$.next({});
  }

  getCategories() {
    this.categories$ =  this.reload$.pipe(merge(interval(5000)), switchMap(() => this.categoriesListService.getCategories()));
  }

  selectCategory(categoryName: string) {
    this.selectedCategory.emit(categoryName);
  }

  openCategoryDialog() {
    this.dialog.open(AddNewNameDialogComponent, {
      data: {
        dialogName: "Category",
        forbiddenChars: /[/\\\.~"$\0]/,
        maxLength: 63
      } as AddNewNameDialogData,
      restoreFocus: false
    })
      .afterClosed()
      .pipe(
        filter(categoryName => categoryName),
        switchMap(categoryName => this.addCategory(categoryName)
      ))
      .subscribe(() => {
        this.reload$.next({});
      });
  }

  addCategory(categoryName: string) {
    return this.categoriesListService.postCategory(categoryName);
  }

  deleteCategory(categoryName: string) {
    return this.categoriesListService.deleteCategory(categoryName)
    .subscribe(()=>{
      this.reload$.next({});
    });
  }

}
