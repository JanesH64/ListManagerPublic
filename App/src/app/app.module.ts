import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DashboardComponent } from './home/dashboard/dashboard/dashboard.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { AddNewNameDialogComponent } from './home/dashboard/add-new-name-dialog/add-new-name-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './home/dashboard/categories/categories.component';
import { ListsComponent } from './home/dashboard/lists/lists.component';
import { ElementsComponent } from './home/dashboard/elements/elements.component';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ForbiddenCharsDirective } from './home/dashboard/add-new-name-dialog/forbidden-chars-validator.directive';
import { ErrorInterceptor } from './interceptors/error-interceptor/error-interceptor';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AddNewNameDialogComponent,
    CategoriesComponent,
    ListsComponent,
    ElementsComponent,
    BreadcrumbComponent,
    ForbiddenCharsDirective,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    CommonModule,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],

  entryComponents: [
    AddNewNameDialogComponent,
    ErrorDialogComponent
  ]
})
export class AppModule { }
