import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-two',
  templateUrl: './two.component.html',
  styleUrl: './two.component.scss'
})
export class TwoComponent {
  @ViewChild('editor') editor!: ElementRef;
  @ViewChild('colorPickerDropdown') colorPickerDropdown!: ElementRef;

  isEnabled = true;

  constructor(private renderer: Renderer2) {
    this.renderer.listen('document', 'click', (event) => {
      this.onDocumentClick(event);
    });
  }

  changeTextColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    document.execCommand('foreColor', false, color);
  }

  changeBackgroundColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    document.execCommand('hiliteColor', false, color);
  }

  toggleColorPickers(event: Event) {
    event.stopPropagation();
    const dropdown = this.colorPickerDropdown.nativeElement;
    if (dropdown.style.display === 'none' || !dropdown.style.display) {
      dropdown.style.display = 'flex'; // Ensure flex display for side-by-side layout
    } else {
      dropdown.style.display = 'none';
    }
  }

  hideColorPickers() {
    this.colorPickerDropdown.nativeElement.style.display = 'none';
  }

  onDocumentClick(event: Event) {
    if (!this.colorPickerDropdown.nativeElement.contains(event.target as Node) &&
      !(event.target as HTMLElement).classList.contains('color-picker-toggle')) {
      this.hideColorPickers();
    }
  }
}
