import {Component, inject, Inject} from '@angular/core';
import {DatePipe, NgForOf} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {Subscription} from "rxjs";
import {ShopService} from "../../../services/common/shop.service";
import {Shop} from "../../../interfaces/common/shop.interface";
import {UiService} from "../../../services/core/ui.service";
import {ReloadService} from "../../../services/core/reload.service";

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrl: './note-dialog.component.scss',
  standalone: true,
  imports: [
    NgForOf,
    MatDialogContent,
    MatFormField,
    MatDivider,
    MatIcon,
    MatIconButton,
    MatButton,
    MatInput,
    MatDialogTitle,
    FormsModule,
    DatePipe
  ],
})
export class NoteDialogComponent {

  newNote = '';
  editingIndex: number | null = null;
  id?: string;
  shop?: Shop;

  private readonly shopService = inject(ShopService);
  private readonly uiService = inject(UiService);
  private readonly reloadService = inject(ReloadService);

  private subDataGet: Subscription;
  private subDataUpdate: Subscription;

  constructor( public dialogRef: MatDialogRef<NoteDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.id = this.data;
    if (this.id) {
      this.getShopById();
    }
  }


  private getShopById() {
    this.subDataGet = this.shopService.getShopById(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.shop = res.data;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private updateShopById() {
    const mData:any = {
      clientNotes: this.shop.clientNotes
    };

    this.subDataUpdate = this.shopService.updateShopById(this.shop._id, mData).subscribe({
      next: (res) => {
        this.uiService.message(res.message || 'Note updated successfully', 'success');
        this.reloadService.needRefreshData$();
      },
      error: (error) => {
        console.error('Update Error:', error);
        this.uiService.message('Failed to update note', 'warn');
      }
    });
  }

  saveNote() {
    if (!this.newNote.trim()) return;
    // If editing, update the existing note
    if (this.editingIndex !== null) {
      this.shop.clientNotes[this.editingIndex].note = this.newNote;
      this.shop.clientNotes[this.editingIndex].updatedAt = new Date().toISOString();
      this.editingIndex = null;
    } else {
      // If adding, push new note
      this.shop.clientNotes.push({
        note: this.newNote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    this.updateShopById(); // Save to backend
    this.newNote = '';
  }



  // editNote(index: number) {
  //   this.editingIndex = index;
  //   this.newNote = this.shop.clientNotes[index].note;
  // }
  //
  //
  // deleteNote(index: number) {
  //   this.shop.clientNotes.splice(index, 1);
  //   this.updateShopById(); // Sync with backend
  // }

  closeDialog(): void {
    this.dialogRef.close();
  }

  editNote(index: number) {
    const originalIndex = this.shop.clientNotes.length - 1 - index;
    this.editingIndex = originalIndex;
    this.newNote = this.shop.clientNotes[originalIndex].note;
    this.reloadService.needRefreshData$();
  }


  deleteNote(index: number) {
    const originalIndex = this.shop.clientNotes.length - 1 - index;
    this.shop.clientNotes.splice(originalIndex, 1);
    this.updateShopById(); // Sync with backend
  }

  /**
   * ON DESTROY
   * ngOnDestroy()
   */

  ngOnDestroy() {
    if (this.subDataGet) {
      this.subDataGet.unsubscribe();
    }
    if (this.subDataUpdate) {
      this.subDataUpdate.unsubscribe();
    }
  }
}
