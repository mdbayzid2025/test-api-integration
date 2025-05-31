import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.scss'
})
export class UploadImageComponent {
  selectedFiles: File[] = [];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  saveFiles(): void {
    // Implement your file upload logic here
    console.log(this.selectedFiles);
  }

  closeUpload(): void {
    // Implement your close logic here
    console.log('Close upload');
  }
}
