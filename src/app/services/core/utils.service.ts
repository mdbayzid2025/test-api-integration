import {Inject, Injectable} from '@angular/core';
import moment from 'moment';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
  }


  /**
   * UTILS
   */

  getDateString(date: Date, format?: string): string {
    const fm = format ? format : 'YYYY-MM-DD';
    return moment(date).format(fm);
  }

  getDateWithCurrentTime(date: Date): Date {
    const _ = moment();
    // const newDate = moment(date).add({hours: _.hour(), minutes:_.minute() , seconds:_.second()});
    const newDate = moment(date).add({hours: _.hour(), minutes: _.minute()});
    return newDate.toDate();
  }

  getNextDateString(date: Date, day) {
    return moment(date).add(day, 'days').toDate();
  }


  getNextDateStringForProject(date: Date, day) {
    return moment(date).add(day, 'days').format('YYYY-MM-DD');
  }

  getDateMonth(fromZero: boolean, date?: any): number {
    let d;
    if (date) {
      d = new Date(date)
    } else {
      d = new Date();
    }
    const month = d.getMonth();
    return fromZero ? month : month + 1;
  }

  /**
   * GET RANDOM NUMBER
   */
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getImageName(originalName: string): string {
    const array = originalName.split('.');
    array.pop();
    return array.join('');
  }

  mergeArrayString(array1: string[], array2: string[]): string[] {
    const c = array1.concat(array2);
    return c.filter((item, pos) => c.indexOf(item) === pos);
  }

  mergeUniqueImages (originalImages: string[], newImages: string[]) {
    const uniqueImages = new Set<string>(originalImages);
    newImages.forEach(image => {
      if (!uniqueImages.has(image)) {
        uniqueImages.add(image);
      }
    });
    return Array.from(uniqueImages);
  }

  checkObjectDeepEqual(obj1: any, obj2: any, ignoredField?: string): boolean {
    if (ignoredField) {
      if (obj1) {
        delete obj1[ignoredField];
      }
      if (obj2) {
        delete obj2[ignoredField];
      }
    }
    // If both are the same reference, they are equal
    if (obj1 === obj2) {
      return true;
    }

    // If either is null or not an object, they are not equal
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
      return false;
    }

    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // If they don't have the same number of keys, they are not equal
    if (keys1.length !== keys2.length) {
      return false;
    }

    // Compare each key recursively
    for (let key of keys1) {
      if (!keys2.includes(key) || !this.checkObjectDeepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }
  /**
   * URL
   */

  getHostnameFromUrl(url: string): string {
    try {
      if (url) {
        const urlObject = new URL(url);
        const hostname = urlObject.hostname;
        if (hostname.startsWith('www.')) {
          return hostname.substring(4);
        }
        return urlObject.hostname;
      } else {
        return null
      }

    } catch (err) {
      return null;
    }

  }

  /**
   * SEARCH
   */
  searchWithRegex = (collection: any[], term: string, opts: { caseSensitive: boolean, includedKeys: string[] }) => {
    const filterBy = () => {
      const searchTerms = (!opts.caseSensitive) ? new RegExp(term, 'i') : new RegExp(term)
      return (obj: any) => {
        for (const key of Object.keys(obj)) {
          if (searchTerms.test(obj[key]) &&
            opts.includedKeys.includes(key)) return true
        }
        return false
      }
    }
    return collection.filter(filterBy())
  }

  /**
   * String
   */
  stringToSlug(value: string): string {
    let text = value?.toLowerCase();
    if (text?.charAt(0) == " ") {
      text = text.trim();
    }
    if (text?.charAt(text.length - 1) == "-") {
      text = (text?.replace(/-/g, ""));
    }
    text = text?.replace(/ +/g, "");
    text = text?.replace(/--/g, "");
    text = text?.normalize("NFKD").replace(/[\u0300-\u036f]/g, ""); // Note: Normalize('NFKD') used to normalize special alphabets like óã to oa
    text = text?.replace(/[^a-zA-Z0-9 -]/g, "");

    return text;
  }

  extractPath(url: string): string {
    try {
      const urlObject = new URL(url);
      return urlObject.pathname;
    } catch (error) {
      if (!url.startsWith('/')) {
        url = '/' + url;
      }
      return url;
    }
  }


}
