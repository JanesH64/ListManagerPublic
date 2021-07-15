import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, Observable } from 'rxjs';
import { CategoriesListService } from 'src/app/services/categories-list.service';
import { MatDialog } from '@angular/material/dialog';
import { AddNewNameDialogComponent, AddNewNameDialogData } from '../add-new-name-dialog/add-new-name-dialog.component';
import { filter, map, mergeAll, switchMap, tap } from 'rxjs/operators';
import { merge } from 'rxjs/operators';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  constructor(private categoriesListService: CategoriesListService,
    private dialog: MatDialog) { }

  @Input()
  categoryName: string

  @Output()
  selectedList: EventEmitter<string> = new EventEmitter<string>();

  lists$: Observable<string[]>;
  reload$: BehaviorSubject<any> = new BehaviorSubject({});

  ngOnInit(): void {
    this.getLists();
    this.reload$.next({});
  }

  ngOnChanges() {
    this.reload$.next({});
  }

  getLists() {
    this.lists$ =  this.reload$.pipe(merge(interval(5000)), switchMap(() => this.categoriesListService.getLists(this.categoryName)));
  }

  selectList(listName: string) {
    this.selectedList.emit(listName)
  }

  openAddListDialog() {
    this.dialog.open(AddNewNameDialogComponent, {
      data: {
        dialogName: "List",
        forbiddenChars: /[/\\\.~"$\0]/,
        maxLength: 191
      } as AddNewNameDialogData,
      restoreFocus: false
    })
      .afterClosed()
      .pipe(
        filter(listName => listName),
        switchMap(listName => this.addList(this.categoryName, listName)
      ))
      .subscribe(() => {
        this.reload$.next({});
      });
  }

  addList(categoryName: string, listName: string) {
    return this.categoriesListService.postList(categoryName, listName);
  }

  deleteList(listName: string) {
    return this.categoriesListService.deleteList(this.categoryName, listName)
    .subscribe(()=>{
      this.reload$.next({});
    });
  }
}
