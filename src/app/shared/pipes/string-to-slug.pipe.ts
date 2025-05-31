import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'stringToSlug',
  pure: true
})
export class StringToSlugPipe implements PipeTransform {

  transform(value: string, separator?: string): string {
    if (value) {
      return  value.toString().trim().toLowerCase()
        .replace(/\s+/g, separator ? separator : '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, separator ? separator : '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');
    } else {
      return '';
    }

  }

}
