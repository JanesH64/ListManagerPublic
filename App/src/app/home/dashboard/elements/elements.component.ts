import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, interval, Observable } from 'rxjs';
import { filter, merge, switchMap, tap } from 'rxjs/operators';
import { Element } from 'src/app/models/element';
import { CategoriesListService } from 'src/app/services/categories-list.service';
import { AddNewNameDialogComponent, AddNewNameDialogData } from '../add-new-name-dialog/add-new-name-dialog.component';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss']
})
export class ElementsComponent implements OnInit {

  constructor(
    private categoriesListService: CategoriesListService,
    private dialog: MatDialog
    ) { }

  @Input() category: string;
  _list: string;
  get list(): string {
    return this._list;
  }
  @Input() set list(v: string)
  {
    this._list = v;
    this.reload$.next({});
  }


  elements$: Observable<Element[]>;
  reload$: BehaviorSubject<any> = new BehaviorSubject({});

  displayedColumns = ["edit", "name", "delete"];

  ngOnInit(): void {
    this.getElements();
    this.reload$.next({});
  }

  getElements() {
    this.elements$ =  this.reload$.pipe(merge(interval(5000)), switchMap(() => this.categoriesListService.getElements(this.category, this.list)));
  }

  openElementDialog() {
    this.dialog.open(AddNewNameDialogComponent, {
      data: {
        dialogName: "Element"
      } as AddNewNameDialogData,
      restoreFocus: false
    })
      .afterClosed()
      .pipe(
        filter(elementName => elementName),
        switchMap(elementName => this.addElement({name: elementName} as Element)
      ))
      .subscribe(() => {
        this.reload$.next({});
      });
  }

  addElement(element: Element) {
    return this.categoriesListService.postElement(this.category, this.list, element);
  }

  updateElement(element: Element) {
    return this.categoriesListService.putElement(this.category, this.list, element);
  }

  onSelect(element: Element) {
    this.dialog.open(AddNewNameDialogComponent, {
      data: {
        dialogName: "Element",
        currentValue: element.name
      } as AddNewNameDialogData,
      restoreFocus: false
    })
      .afterClosed()
      .pipe(
        filter(elementName => elementName),
        switchMap(elementName => this.updateElement(
          { id: element.id,
            name: elementName,
            sortingNumber: element.sortingNumber,
            attributes: JSON.parse(JSON.stringify(element.attributes))
          } as Element)
      ))
      .subscribe(() => {
        this.reload$.next({});
      });
  }

  onDelete(element: Element) {
    this.categoriesListService.deleteElement(this.category, this.list, element).subscribe(()=>{
      this.reload$.next({});
    });
  }

}
