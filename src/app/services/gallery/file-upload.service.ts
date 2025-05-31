import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilsService} from '../core/utils.service';
import {ImageUploadResponse, ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {ImageConvertOption} from "../../interfaces/gallery/image-convert-option.interface";

const API_UPLOAD = environment.ftpBaseLink + environment.ftpPrefix + '/upload/';
const API_V2_UPLOAD = environment.ftpBaseLink + environment.ftpPrefix + '/v2/upload/';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService,
  ) {
  }


  /**
   * UPLOAD IMAGE
   */

  /**
   * UPLOAD IMAGE
   */

  uploadSingleImage(fileData: any) {
    const data = new FormData();
    data.append('folderPath', fileData.folderPath);
    data.append('image', fileData.file, fileData.fileName);
    return this.httpClient.post<ImageUploadResponse>(API_UPLOAD + 'single-image', data);

  }

  uploadSingleImageProfile(fileData: any) {
    const data = new FormData();
    data.append('folderPath', fileData.folderPath);
    data.append('image', fileData.file, fileData.fileName);
    return this.httpClient.post<{ message: string, url: string }>(API_UPLOAD + 'single-image', data);

  }


  uploadSingleConvertToMulti(fileData: any, fileName?: string) {
    const data = new FormData();
    data.append('productImage', fileData, fileName);
    return this.httpClient.post<{ images: object }>(API_UPLOAD + 'single-image-to-multi-convert', data);

  }

  uploadMultiImageOriginal(files: File[]) {
    const data = new FormData();
    files.forEach((f) => {
      const fileName =
        this.utilsService.getImageName(f.name) +
        this.utilsService.getRandomInt(100, 5000) +
        '.' +
        f.name.split('.').pop();
      data.append('imageMulti', f);
    });
    return this.httpClient.post<ImageUploadResponse[]>(
      API_UPLOAD + 'multiple-image',
      data
    );
  }

  uploadMultiImage(files: File[] | FileList, option?: ImageConvertOption) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('imageMulti', files[i], files[i].name);
    }
    if (option) {
      formData.append('convert', option.convert);
      if (option.quality) {
        formData.append('quality', option.quality);
      }
      if (option.width) {
        formData.append('width', option.width);
      }
      if (option.height) {
        formData.append('height', option.height);
      }
    }
    return this.httpClient.post<ImageUploadResponse[]>(API_UPLOAD + 'multiple-image', formData);
  }

  uploadMultiFileOriginal(files: File[], option?: ImageConvertOption) {
    const data = new FormData();
    files.forEach(f => {
      const fileName = this.utilsService.getImageName(f.name) + this.utilsService.getRandomInt(100, 5000) + '.' + f.name.split('.').pop();
      data.append('fileMulti', f);
    });
    if (option) {
      data.append('convert', option.convert);
      if (option.quality) {
        data.append('quality', option.quality);
      }
      if (option.width) {
        data.append('width', option.width);
      }
      if (option.height) {
        data.append('height', option.height);
      }
    }
    console.log('data', data)
    return this.httpClient.post<ImageUploadResponse[]>(API_UPLOAD + 'multiple-file', data);
  }

  uploadMultiImageOriginalV2(files: File[], option?: ImageConvertOption) {
    const data = new FormData();
    files.forEach(f => {
      const fileName = this.utilsService.getImageName(f.name) + this.utilsService.getRandomInt(100, 5000) + '.' + f.name.split('.').pop();
      data.append('imageMulti', f);
    });
    if (option) {
      data.append('convert', option.convert);
      if (option.quality) {
        data.append('quality', option.quality);
      }
      if (option.width) {
        data.append('width', option.width);
      }
      if (option.height) {
        data.append('height', option.height);
      }
    }
    console.log('API_V2_UPLOAD', API_V2_UPLOAD)
    return this.httpClient.post<ImageUploadResponse[]>(API_V2_UPLOAD + 'multiple-image', data);
  }


  /**
   * REMOVE IMAGE
   */

  deleteMultipleFile(data: string[]) {
    return this.httpClient.post<ResponsePayload>(API_UPLOAD + 'delete-multiple-image', {url: data});
  }

  removeSingleFile(url: string) {
    return this.httpClient.post<{
      success: boolean;
      message: string }>(API_UPLOAD + 'delete-single-image', {url});
  }

}
