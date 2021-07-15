import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment} from '../../environments/environment';
import { Element } from 'src/app/models/element';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesListService {

  constructor(private httpClient: HttpClient) { }

  //#region UrlHelper
  private cleanSpecialChars(str: string): string {
    return str.replaceAll(" ", "~");
  }

  private getCategoriesUrl(): string {
    return `${environment.api}/categories`;
  }

  private getCategoryUrl(categoryName: string): string {
    return `${this.getCategoriesUrl()}/${this.cleanSpecialChars(categoryName)}`;
  }

  private getListUrl(categoryName: string, listName: string): string {
    return `${this.getCategoryUrl(categoryName)}/${this.cleanSpecialChars(listName)}`;
  }

  private getElementUrl(categoryName: string, listName: string, element: Element): string {
    return `${this.getListUrl(categoryName, listName)}/${element.id}`;
  }
  //#endregion

  //#region Category
  getCategories(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.getCategoriesUrl()).pipe(
      map(categories => categories.map(category => category.replaceAll("~", " ")))
      );
  }

  postCategory(categoryName: string): Observable<any> {
    var dto = {name: this.cleanSpecialChars(categoryName)};

    return this.httpClient.post(this.getCategoriesUrl(), dto);
  }

  deleteCategory(categoryName: string): Observable<any> {
    return this.httpClient.delete(this.getCategoryUrl(categoryName));
  }

  //#endregion

  //#region List
  getLists(categoryName: string): Observable<string[]> {
    return this.httpClient.get<string[]>(this.getCategoryUrl(categoryName)).pipe(
      map(lists => lists.map(list => list.replaceAll("~", " ")))
      );
  }

  postList(categoryName: string, listName: string): Observable<any> {
    var dto = {name: this.cleanSpecialChars(listName)};

    return this.httpClient.post(this.getCategoryUrl(categoryName), dto);
  }

  deleteList(categoryName: string, listName: string): Observable<any> {
    return this.httpClient.delete(this.getListUrl(categoryName, listName));
  }

  //#endregion

  //#region Element
  getElements(categoryName: string, listName: string): Observable<Element[]> {
    return this.httpClient.get<Element[]>(this.getListUrl(categoryName, listName));
  }

  getElement(categoryName: string, listName: string, element: Element): Observable<Element> {
    return this.httpClient.get<Element>(this.getElementUrl(categoryName, listName, element));
  }

  postElement(categoryName: string, listName: string, element: Element): Observable<any> {
    return this.httpClient.post(this.getListUrl(categoryName, listName), element);
  }

  putElement(categoryName: string, listName: string, element: Element): Observable<any> {
    return this.httpClient.put(this.getElementUrl(categoryName, listName, element), element);
  }

  deleteElement(categoryName: string, listName: string, element: Element): Observable<any> {
    return this.httpClient.delete(this.getElementUrl(categoryName, listName, element));
  }

  //#endregion


}
