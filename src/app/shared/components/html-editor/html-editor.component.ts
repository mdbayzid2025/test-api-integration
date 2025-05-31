import {
  Component,
  ElementRef,
  forwardRef,
  inject, OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {DropdownComponent} from '../dropdown/dropdown.component';
import {Dropdown} from '../dropdown/interfaces/dropdown.interface';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {AllImagesDialogComponent} from '../../../pages/gallery/image/all-images-dialog/all-images-dialog.component';
import {Gallery} from '../../../interfaces/gallery/gallery.interface';
import {MatDialog} from '@angular/material/dialog';
import {GalleryModule} from '../../../pages/gallery/gallery.module';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-html-editor',
  standalone: true,
  imports: [
    MatButtonModule,
    DropdownComponent,
    NgForOf,
    NgIf,
    NgClass,
    GalleryModule,
  ],
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HtmlEditorComponent),
      multi: true,
    },
  ],
})
export class HtmlEditorComponent implements OnInit, ControlValueAccessor, OnDestroy {
  // Main Editor
  @ViewChild('editor', {static: true}) editor: ElementRef;

  // Color
  @ViewChild('colorPickerDropdown') colorPickerDropdown!: ElementRef;

  // link
  @ViewChild('linkMenu') linkMenu: ElementRef;
  private selectedLink: HTMLElement | null = null;


  // Image
  @ViewChild('imageController') imageController!: ElementRef;
  @ViewChild('imageControllerOtp') imageControllerOtp!: ElementRef;
  private selectedImage: HTMLImageElement | null = null;
  private resizeHandle: string | null = null;
  private initialMouseX: number = 0;
  private initialMouseY: number = 0;
  private initialImageWidth: number = 0;
  private initialImageHeight: number = 0;

  // Toggle
  currentTextStyle: string[] = [];
  currentTextColor: string = '#000000';

  // Inject
  private renderer = inject(Renderer2);
  private readonly dialog = inject(MatDialog);


  // Data
  readonly typography: Dropdown[] = [
    {value: 'p', viewValue: 'Paragraph', class: 'font-size-12'},
    {value: 'h6', viewValue: 'Heading 6', class: 'font-size-16'},
    {value: 'h5', viewValue: 'Heading 5', class: 'font-size-18'},
    {value: 'h4', viewValue: 'Heading 4', class: 'font-size-20'},
    {value: 'h3', viewValue: 'Heading 3', class: 'font-size-24'},
    {value: 'h2', viewValue: 'Heading 2', class: 'font-size-30'},
    {value: 'h1', viewValue: 'Heading 1', class: 'font-size-34'},
  ];

  readonly fontSizes: Dropdown[] = [
    {value: '14px', viewValue: '14px', class: 'font-size-14'},
    {value: '16px', viewValue: '16px', class: 'font-size-16'},
    {value: '18px', viewValue: '18px', class: 'font-size-18'},
    {value: '24px', viewValue: '24px', class: 'font-size-24'},
    {value: '32px', viewValue: '32px', class: 'font-size-32'},
    {value: '36px', viewValue: '36px', class: 'font-size-36'},
    {value: '48px', viewValue: '48px', class: 'font-size-48'},
    {value: '56px', viewValue: '56px', class: 'font-size-56'},
  ];

  readonly textAligns: Dropdown[] = [
    {value: 'left', viewValue: 'Left', class: 'font-size-14'},
    {value: 'center', viewValue: 'Center', class: 'font-size-14'},
    {value: 'right', viewValue: 'Right', class: 'font-size-14'},
  ];

  // Complex auto-detect the editor changes
  private observer: MutationObserver;
  private onChange: (value: string) => void;
  private onTouched: () => void;



  ngOnInit() {
    // Listen for click events on the document to hide the image controller
    this.renderer.listen('document', 'click', (event) => {
      this.onDocumentClick(event);
    });

    // Listen for keydown events for Delete or Backspace
    this.renderer.listen('document', 'keydown', (event) => {
      this.onKeyDown(event);
    });

    // Listen for the keydown event to handle Enter key inside blockquote
    this.renderer.listen(this.editor.nativeElement, 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        this.handleEnterInBlockquote(event);
      }
    });

    // auto-detect the editor changes
    this.observer = new MutationObserver((mutations) => {
      this.onEditorContentChange();
    });
  }


  ngAfterViewInit() {
    if (this.editor) {
      this.observer.observe(this.editor.nativeElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      // Add click event listener to images
      this.addImageClickListener();
    }
  }


  /**
   * Text Format
   * formatText()
   * formatListText()
   * formatTextStyle()
   * alignText()
   * changeFontSize()
   */
  formatText(command: string) {
    document.execCommand('formatBlock', false, command);
  }

  formatListText(command: string) {
    document.execCommand(command, false, null);
  }

  formatTextStyle(command: string) {
    document.execCommand(command, false);

    const exists = this.currentTextStyle.includes(command);
    if (exists) {
      this.currentTextStyle = this.currentTextStyle.filter(item => item !== command);
    } else {
      this.currentTextStyle.push(command)
    }
  }

  alignText(alignment: string) {
    document.execCommand('justify' + alignment, false, null);
  }


  changeFontSize(size: string) {
    // const size = (event.target as HTMLSelectElement).value;
    document.execCommand('fontSize', false, '7'); // 7 is the maximum value for `fontSize` command
    const elements = this.editor.nativeElement.querySelectorAll('font[size="7"]');
    elements.forEach((element: HTMLElement) => {
      element.removeAttribute('size');
      element.style.fontSize = size;
    });
  }

  /**
   * Color Control
   * changeTextColor()
   * changeBackgroundColor()
   * toggleColorPickers()
   * hideColorPickers()
   */

  changeTextColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.currentTextColor = color;
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

  /**
   * Blockquote Control
   * toggleBlockquote()
   * handleEnterInBlockquote()
   * findAncestor()
   * addBlockquote()
   * removeBlockquote()
   * applyBlockquoteStyle()
   */

  toggleBlockquote() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;
    const blockquote = this.findAncestor(commonAncestor, 'blockquote');

    if (blockquote) {
      this.removeBlockquote(blockquote);
    } else {
      this.addBlockquote(range);
    }
  }


  handleEnterInBlockquote(event: KeyboardEvent) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const blockquote = this.findAncestor(range.commonAncestorContainer, 'blockquote');

    if (blockquote) {
      event.preventDefault(); // Prevent the default behavior of Enter key

      // Move the caret outside of the blockquote
      range.setStartAfter(blockquote);
      range.setEndAfter(blockquote);
      selection.removeAllRanges();
      selection.addRange(range);

      // Insert a new empty paragraph or div
      const newParagraph = document.createElement('p');
      newParagraph.innerHTML = '<br>'; // Ensures there's a space for the caret
      blockquote.parentNode?.insertBefore(newParagraph, blockquote.nextSibling);

      // Place the caret inside the new paragraph
      range.setStart(newParagraph, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  findAncestor(node: Node, tagName: string): HTMLElement | null {
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName.toLowerCase() === tagName.toLowerCase()) {
        return node as HTMLElement;
      }
      node = node.parentNode!;
    }
    return null;
  }

  addBlockquote(range: Range) {
    const blockquote = this.renderer.createElement('blockquote');
    range.surroundContents(blockquote);
    this.applyBlockquoteStyle(blockquote);
  }

  removeBlockquote(blockquote: HTMLElement) {
    const parent = blockquote.parentNode!;
    while (blockquote.firstChild) {
      parent.insertBefore(blockquote.firstChild, blockquote);
    }
    parent.removeChild(blockquote);
  }

  applyBlockquoteStyle(blockquote: HTMLElement) {
    this.renderer.setStyle(blockquote, 'border-left', '4px solid #ccc');
    this.renderer.setStyle(blockquote, 'margin', '10px 0');
    this.renderer.setStyle(blockquote, 'padding', '10px 20px');
    this.renderer.setStyle(blockquote, 'background-color', '#f9f9f9');
    this.renderer.setStyle(blockquote, 'font-style', 'italic');
    this.renderer.setStyle(blockquote, 'color', '#555');
  }

  /**
   * Url Controller
   * createLink()
   * onEditorClick()
   * showLinkMenu()
   * hideLinkMenu()
   * changeLink()
   * removeLink()
   */
  createLink() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString().trim();

    // Regular expression to check if the selected text is a URL
    const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;

    let url = '';

    if (selectedText && urlRegex.test(selectedText)) {
      url = prompt('Enter the URL', selectedText) || '';
    } else {
      url = prompt('Enter the URL');
    }

    if (url) {
      const range = selection.getRangeAt(0);

      // Create an anchor element and set its href attribute
      const link = document.createElement('a');
      link.href = url;
      link.textContent = selectedText;

      // Ensure the anchor element is inline and add the hover effect
      link.style.display = 'inline';
      link.style.textDecoration = 'none'; // No underline by default

      // Add the hover effect for underline
      link.addEventListener('mouseover', () => {
        link.style.textDecoration = 'underline';
      });
      link.addEventListener('mouseout', () => {
        link.style.textDecoration = 'none';
      });

      // Insert the link within the range without disrupting the text flow
      range.deleteContents();
      range.insertNode(link);

      // Move the caret after the inserted link
      range.setStartAfter(link);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }




  onEditorClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      this.selectedLink = target;
      this.showLinkMenu(target);
      event.preventDefault(); // Prevent default link behavior
    } else {
      this.hideLinkMenu();
    }
  }

  showLinkMenu(link: HTMLElement) {
    const rect = link.getBoundingClientRect();
    const menu = this.linkMenu.nativeElement;
    this.renderer.setStyle(menu, 'top', `${rect.bottom + window.scrollY}px`);
    this.renderer.setStyle(menu, 'left', `${rect.left + window.scrollX}px`);
    this.renderer.setStyle(menu, 'display', 'block');
  }

  hideLinkMenu() {
    this.renderer.setStyle(this.linkMenu.nativeElement, 'display', 'none');
    this.selectedLink = null;
  }

  changeLink() {
    if (this.selectedLink) {
      const url = prompt('Enter the new URL', this.selectedLink.getAttribute('href') || '');
      if (url) {
        this.selectedLink.setAttribute('href', url);
      }
      this.hideLinkMenu();
    }
  }

  removeLink() {
    if (this.selectedLink) {
      while (this.selectedLink.firstChild) {
        this.selectedLink.parentNode!.insertBefore(this.selectedLink.firstChild, this.selectedLink);
      }
      this.selectedLink.remove();
      this.hideLinkMenu();
    }
  }

  /**
   * Image Pick or Url Manage
   * onImageUpload()
   * insertImageUrl()
   */
  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = document.createElement('img');
        img.src = e.target!.result as string;
        img.style.maxWidth = '100%';
        img.style.position = 'relative';
        img.contentEditable = 'false';
        img.addEventListener('click', (ev) => {
          ev.stopPropagation(); // Prevent event from bubbling up to document
          this.selectedImage = img;
          this.showImageResizeController(img);
          this.showImageBasicController(img);
        });
        this.editor.nativeElement.appendChild(img);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }


  insertImageUrl(url: string) {
    if (url) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      // Create an img element with the provided URL
      const img = document.createElement('img');
      img.src = url;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.contentEditable = 'false';

      // Add event listener for selecting the image
      img.addEventListener('click', (ev) => {
        ev.stopPropagation(); // Prevent event from bubbling up to document
        this.selectedImage = img;
        this.showImageResizeController(img);
        this.showImageBasicController(img);
      });

      // Insert the image at the current cursor position
      range.deleteContents(); // Remove the selected text, if any
      range.insertNode(img);

      // Move the caret after the inserted image
      range.setStartAfter(img);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }


  /**
   * Image Control Methods
   * showImageBasicController()
   * showImageResizeController()
   * addImageClickListener()
   * onKeyDown()
   */
  showImageBasicController(img: HTMLElement) {
    const rect = img.getBoundingClientRect();
    const controller = this.imageControllerOtp.nativeElement;
    this.renderer.setStyle(controller, 'top', `${rect.top + window.scrollY}px`);
    this.renderer.setStyle(controller, 'left', `${rect.right + window.scrollX + 10}px`);
    this.renderer.setStyle(controller, 'display', 'block');
  }

  showImageResizeController(img: HTMLElement) {
    const rect = img.getBoundingClientRect();
    const controller = this.imageController.nativeElement;
    this.renderer.setStyle(controller, 'top', `${rect.top + window.scrollY}px`);
    this.renderer.setStyle(controller, 'left', `${rect.left + window.scrollX}px`);
    this.renderer.setStyle(controller, 'width', `${rect.width}px`);
    this.renderer.setStyle(controller, 'height', `${rect.height}px`);
    this.renderer.setStyle(controller, 'display', 'block');

  }

  addImageClickListener() {
    const images = this.editor.nativeElement.querySelectorAll('img');
    images.forEach((img: HTMLImageElement) => {
      img.addEventListener('click', (event: MouseEvent) => {
        event.stopPropagation();
        this.selectedImage = img;
        this.showImageResizeController(img);
        this.showImageBasicController(img);
      });
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedImage) {
      // Remove the selected image
      this.selectedImage.remove();
      this.selectedImage = null; // Reset the selected image after deletion

      // Hide the imageController and imageControllerOtp elements
      this.renderer.setStyle(this.imageController.nativeElement, 'display', 'none');
      this.renderer.setStyle(this.imageControllerOtp.nativeElement, 'display', 'none');

      event.preventDefault(); // Prevent the default behavior
    }
  }




  /**
   * Basic Image Control Methods
   * resizeImage()
   * alignImage()
   * deleteImage()
   */
  resizeImage() {
    if (this.selectedImage) {
      const size = prompt('Enter the new width (px or %):', '100%');
      if (size) {
        (this.selectedImage as HTMLImageElement).style.width = size;
        this.showImageBasicController(this.selectedImage); // Update the controller position
        // Trigger content change to update the form control value
        this.onEditorContentChange();
      }
    }
  }

  alignImage(alignment: string) {
    if (this.selectedImage) {
      switch (alignment) {
        case 'left':
          (this.selectedImage as HTMLImageElement).style.display = 'inline';
          (this.selectedImage as HTMLImageElement).style.float = 'left';
          break;
        case 'right':
          (this.selectedImage as HTMLImageElement).style.display = 'inline';
          (this.selectedImage as HTMLImageElement).style.float = 'right';
          break;
        case 'center':
          (this.selectedImage as HTMLImageElement).style.display = 'block';
          (this.selectedImage as HTMLImageElement).style.margin = '0 auto';
          (this.selectedImage as HTMLImageElement).style.float = 'none';
          break;
      }
      this.showImageResizeController(this.selectedImage); // Update the controller position
      this.showImageBasicController(this.selectedImage); // Update the controller position
      // Trigger content change to update the form control value
      this.onEditorContentChange();
    }
  }

  deleteImage() {
    if (this.selectedImage) {
      this.selectedImage.remove();
      this.selectedImage = null;
      this.renderer.setStyle(this.imageControllerOtp.nativeElement, 'display', 'none');
    }
  }

  /**
   * Resize like Photoshop
   * onResizeStart()
   * onResizing()
   * onResizeEnd()
   */
  onResizeStart(event: MouseEvent, handle: string) {
    if (!this.selectedImage) return;
    this.resizeHandle = handle;
    this.initialMouseX = event.clientX;
    this.initialMouseY = event.clientY;
    this.initialImageWidth = this.selectedImage.offsetWidth;
    this.initialImageHeight = this.selectedImage.offsetHeight;

    this.renderer.listen('document', 'mousemove', this.onResizing.bind(this));
    this.renderer.listen('document', 'mouseup', this.onResizeEnd.bind(this));
    event.stopPropagation();
  }

  onResizing(event: MouseEvent) {
    if (!this.selectedImage || !this.resizeHandle) return;
    let deltaX = event.clientX - this.initialMouseX;
    let deltaY = event.clientY - this.initialMouseY;

    switch (this.resizeHandle) {
      case 'top-left':
        this.selectedImage.style.width = `${this.initialImageWidth - deltaX}px`;
        this.selectedImage.style.height = `${this.initialImageHeight - deltaY}px`;
        break;
      case 'top-right':
        this.selectedImage.style.width = `${this.initialImageWidth + deltaX}px`;
        this.selectedImage.style.height = `${this.initialImageHeight - deltaY}px`;
        break;
      case 'bottom-left':
        this.selectedImage.style.width = `${this.initialImageWidth - deltaX}px`;
        this.selectedImage.style.height = `${this.initialImageHeight + deltaY}px`;
        break;
      case 'bottom-right':
        this.selectedImage.style.width = `${this.initialImageWidth + deltaX}px`;
        this.selectedImage.style.height = `${this.initialImageHeight + deltaY}px`;
        break;
    }

    this.showImageResizeController(this.selectedImage);
    this.showImageBasicController(this.selectedImage);

    // Trigger content change to update the form control value
    this.onEditorContentChange();

  }

  onResizeEnd(event: MouseEvent) {
    this.resizeHandle = null;
  }

  /**
   * On Document Control
   * onDocumentClick()
   */
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    // If the clicked target is not an image, deselect the image
    if (target.tagName !== 'IMG') {
      this.selectedImage = null;
    }

    const controller = this.imageController.nativeElement;
    if (!controller.contains(event.target as Node)) {
      this.renderer.setStyle(controller, 'display', 'none');
      this.selectedImage = null;
    }

    const controllerOpt = this.imageControllerOtp.nativeElement;
    if (!controllerOpt.contains(event.target as Node)) {
      this.renderer.setStyle(controllerOpt, 'display', 'none');
      this.selectedImage = null;
    } else {
      this.renderer.setStyle(controllerOpt, 'display', 'none');
    }

    if (!this.editor.nativeElement.contains(event.target as Node) && !this.linkMenu.nativeElement.contains(event.target as Node)) {
      this.hideLinkMenu();
    }

    if (!this.colorPickerDropdown.nativeElement.contains(event.target as Node) &&
      !(event.target as HTMLElement).classList.contains('color-picker-toggle')) {
      this.hideColorPickers();
    }
  }

  /**
   * Active Style
   * checkActiveTextStyle()
   */
  checkActiveTextStyle(command: string) {
    return this.currentTextStyle.includes(command);
  }

  /**
   * COMPONENT DIALOG
   * openGalleryDialog
   */

  public openGalleryDialog() {
    const dialogRef = this.dialog.open(AllImagesDialogComponent, {
      data: {type: 'single', count: 1},
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          const image: Gallery = dialogResult.data[0] as Gallery;
          this.insertImageUrl(image.url);
        }
      }
    });
  }

  /**
   * Adjust Auto changes with any Form Control
   * writeValue()
   * registerOnChange()
   * registerOnTouched()
   * setDisabledState()
   * onEditorContentChange()
   */


  writeValue(value: string): void {
    if (this.editor) {
      this.editor.nativeElement.innerHTML = value || '';
      // After patching the content, add event listeners to the images
      this.addImageClickListener();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.editor.nativeElement.contentEditable = !isDisabled;
  }

  private onEditorContentChange(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const content = this.editor.nativeElement.innerHTML;
    if (this.onChange) {
      this.onChange(content);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }


  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.observer.disconnect();
  }


  // onSubmit() {
  //   console.log(this.editor.nativeElement)
  // }



}
