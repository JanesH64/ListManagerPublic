import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Error } from 'src/app/models';
import { ErrorDialogComponent } from 'src/app/dialogs/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((httpError: HttpErrorResponse) => {
                let error = httpError.error as Error;
                error.detailedMessage = error.detailedMessage.replaceAll("~", " ");
              this.dialog.open(ErrorDialogComponent, {data: error});
              return throwError(error);
            })) as Observable<HttpEvent<any>>;
    }
}
