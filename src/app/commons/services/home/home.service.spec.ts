import { TestBed } from '@angular/core/testing';

import { HomeService } from './home.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { IPhoto } from '../../interfaces';

describe('HomeService', () => {
  let homeService: HomeService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomeService]
    }).compileComponents();

    homeService = TestBed.inject(HomeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(homeService).toBeTruthy();
  });

  it('should fetch photo data and map to IPhoto array', () => {
    const mockResponse = [
      { albumId: 1, id: 1, title: 'Photo 1', url: 'http://example.com/photo1' },
      { albumId: 1, id: 2, title: 'Photo 2', url: 'http://example.com/photo2' }
    ];
    const expectedPhotos: Array<IPhoto> = [
      { albumID: 1, id: 1, title: 'Photo 1', url: 'http://example.com/photo1' },
      { albumID: 1, id: 2, title: 'Photo 2', url: 'http://example.com/photo2' }
    ];

    homeService.getDataList().subscribe(photos => {
      expect(photos).toEqual(expectedPhotos);
    });

    const req = httpMock.expectOne(`${environment.apiPhotos}/photos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
