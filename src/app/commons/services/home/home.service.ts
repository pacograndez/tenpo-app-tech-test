import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IPhoto } from '../../interfaces';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getDataList(): Observable<Array<IPhoto>> {
    return this.http.get<Array<any>>('https://jsonplaceholder.typicode.com/photos').pipe(
      map((arr) => {
        const photos: Array<IPhoto> = [];
        arr.map(r => {
          photos.push({
            albumID: r.albumId,
            id: r.id,
            title: r.title,
            url: r.url
          })
        })
        return photos;
      })
    );
  }
}
