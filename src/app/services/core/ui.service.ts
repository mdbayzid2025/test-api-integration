import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {
  SnackbarNotificationComponent
} from '../../shared/components/ui/snackbar-notification/snackbar-notification.component';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(
    public snackBar: MatSnackBar,
  ) {
  }


  /**
   * SNACKBAR
   * message()
   */
  message(
    msg: string,
    type: 'success' | 'warn' | 'wrong',
    duration?: number,
    horizontalPosition?: MatSnackBarHorizontalPosition,
    verticalPosition?: MatSnackBarVerticalPosition
  ) {
    this.snackBar.openFromComponent(SnackbarNotificationComponent, {
      data: msg,
      duration: duration ?? 3000,
      horizontalPosition: horizontalPosition ?? 'end',
      verticalPosition: verticalPosition ?? 'bottom',
      panelClass: ['notification', type],
    });
  }


}
